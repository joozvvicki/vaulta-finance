import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Inicjalizacja
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as any,
  });

  const supabase = createClient(
    config.public.supabase.url,
    config.supabaseServiceKey,
  );

  // 2. Sprawdź Usera
  const authHeader = getRequestHeader(event, "Authorization");
  if (!authHeader)
    throw createError({ statusCode: 401, message: "Brak tokenu" });

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user)
    throw createError({ statusCode: 401, message: "Błąd autoryzacji" });

  // 3. Pobierz ID klienta Stripe z bazy
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, plan")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return { plan: "free" }; // Nie ma ID w Stripe = Free
  }

  // 4. Zapytaj Stripe o AKTYWNE subskrypcje tego klienta
  const subscriptions = await stripe.subscriptions.list({
    customer: profile.stripe_customer_id,
    status: "active",
    limit: 1,
  });

  // 5. Ustal aktualny plan
  let currentPlan = "free";

  if (subscriptions.data.length > 0) {
    const sub = subscriptions.data[0];
    const priceId = sub.items.data[0].price.id;

    // Tutaj zmapuj swoje Price ID na nazwy planów w bazie
    // UWAGA: Użyj swoich ID z dashboardu Stripe!
    if (
      priceId === "price_1SrTDtPAN1TckpzfgAhJKHBQ" ||
      priceId === "price_1SrTFDPAN1Tckpzf3TmLP811"
    ) {
      currentPlan = "pro";
    }
  }

  // 6. Jeśli plan w bazie jest inny niż w Stripe -> Zaktualizuj bazę
  if (profile.plan !== currentPlan) {
    console.log(
      `🔄 Aktualizacja planu użytkownika ${user.email}: ${profile.plan} -> ${currentPlan}`,
    );
    await supabase
      .from("profiles")
      .update({ plan: currentPlan, updated_at: new Date() })
      .eq("id", user.id);
  }

  return { plan: currentPlan };
});
