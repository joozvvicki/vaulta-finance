import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Walidacja kluczy
  if (
    !config.public.supabase.url ||
    !config.supabaseServiceKey ||
    !config.stripeSecretKey
  ) {
    throw createError({
      statusCode: 500,
      message: "Brak kluczy API w konfiguracji.",
    });
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as any, // Użyj aktualnej wersji
  });

  const supabase = createClient(
    config.public.supabase.url,
    config.supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );

  // 2. Auth
  const authHeader = getRequestHeader(event, "Authorization");
  if (!authHeader)
    throw createError({ statusCode: 401, message: "Brak tokenu" });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (authError || !user)
    throw createError({ statusCode: 401, message: "Błąd sesji" });

  try {
    // 3. Obsługa Klienta Stripe
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      stripeCustomerId = newCustomer.id;
      await supabase.from("profiles").upsert({
        id: user.id,
        stripe_customer_id: stripeCustomerId,
        email: user.email,
      });
    }

    const body = await readBody(event);

    // 4. TWORZENIE SUBSKRYPCJI (FIX)
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: body.priceId }],
      payment_behavior: "default_incomplete",

      // 👇 WAŻNE: Wymuszamy płatność kartą, a nie wysyłkę faktury mailem
      collection_method: "charge_automatically",

      payment_settings: { save_default_payment_method: "on_subscription" },
      // Rozwijamy oba intenty: płatności i ustawienia karty
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
      metadata: { supabase_user_id: user.id },
    });

    // 5. OBSŁUGA BRAKU SEKRETU (LOGIKA RATUNKOWA)

    // Scenariusz A: Mamy Payment Intent w fakturze (Standardowa płatność)
    let clientSecret = null;
    const invoice = subscription.latest_invoice as any;

    if (typeof invoice === "object" && invoice?.payment_intent) {
      // Czasem payment_intent jest obiektem, czasem ID (zależy od expand)
      clientSecret =
        invoice.payment_intent.client_secret || invoice.payment_intent;

      // Jeśli dostaliśmy tylko ID (string), musimy dopytać (rzadkie przy dobrym expand, ale możliwe)
      if (typeof clientSecret === "string" && !clientSecret.startsWith("pi_")) {
        // To jest secret, wszystko ok.
      } else if (typeof invoice.payment_intent === "string") {
        const pi = await stripe.paymentIntents.retrieve(invoice.payment_intent);
        clientSecret = pi.client_secret;
      }
    }

    // Scenariusz B: Nie ma Payment Intent, ale jest Setup Intent (np. Trial lub weryfikacja karty)
    if (!clientSecret && subscription.pending_setup_intent) {
      const setupIntent = subscription.pending_setup_intent as any;
      clientSecret = setupIntent.client_secret;
    }

    // Scenariusz C: Nadal pusto? Dopytujemy fakturę ręcznie (Ostatnia deska ratunku)
    if (!clientSecret && subscription.status === "incomplete") {
      const invoiceId =
        typeof subscription.latest_invoice === "string"
          ? subscription.latest_invoice
          : subscription.latest_invoice?.id;

      if (invoiceId) {
        const fullInvoice = await stripe.invoices.retrieve(invoiceId, {
          expand: ["payment_intent"],
        });
        const pi = fullInvoice.payment_intent as any;
        clientSecret = pi?.client_secret;
      }
    }

    // Finał: Jeśli nadal brak, a status wymaga płatności -> Błąd
    if (!clientSecret && subscription.status === "incomplete") {
      console.error("DEBUG SUB:", JSON.stringify(subscription, null, 2));
      throw new Error(
        "Nie udało się wygenerować client_secret dla tej płatności.",
      );
    }

    return {
      subscriptionId: subscription.id,
      clientSecret: clientSecret,
    };
  } catch (error: any) {
    console.error("🔥 Stripe Error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Błąd płatności",
    });
  }
});
