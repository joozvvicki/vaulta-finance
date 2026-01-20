// server/api/stripe/create-portal.post.ts
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Walidacja kluczy
  if (
    !config.stripeSecretKey ||
    !config.public.supabase.url ||
    !config.supabaseServiceKey
  ) {
    throw createError({
      statusCode: 500,
      message: "Błąd konfiguracji serwera",
    });
  }

  // 2. Inicjalizacja
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as any,
  });

  const supabase = createClient(
    config.public.supabase.url,
    config.supabaseServiceKey,
  );

  // 3. Pobierz usera z sesji
  const authHeader = getRequestHeader(event, "Authorization");
  if (!authHeader)
    throw createError({ statusCode: 401, message: "Brak tokenu" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (error || !user)
    throw createError({ statusCode: 401, message: "Nieautoryzowany" });

  // 4. Pobierz stripe_customer_id z bazy
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    throw createError({
      statusCode: 400,
      message: "Nie znaleziono ID klienta Stripe (brak subskrypcji?).",
    });
  }

  const origin = getRequestURL(event).origin;

  try {
    // 6. Wygeneruj link do portalu
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/app/konto`, // Gdzie user ma wrócić po kliknięciu "Wróć" w Stripe
    });

    return { url: session.url };
  } catch (e: any) {
    console.error("Stripe Portal Error:", e);
    throw createError({
      statusCode: 500,
      message: "Nie udało się otworzyć portalu płatności.",
    });
  }
});
