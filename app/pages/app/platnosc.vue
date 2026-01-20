<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";

definePageMeta({ layout: "dashboard" });

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const client = useSupabaseClient();

// Inicjalizacja Stripe (Public Key)
const stripePromise = loadStripe(config.public.stripePublishableKey);

// KONFIGURACJA PLANÓW
// Upewnij się, że te ID (price_...) są z TRYBU TESTOWEGO jeśli testujesz!
const PLANS = {
  monthly: {
    id: "price_1SrTDtPAN1TckpzfgAhJKHBQ",
    price: 19.99,
    name: "Plan Pro (Miesięczny)",
  },
  yearly: {
    id: "price_1SrTFDPAN1Tckpzf3TmLP811",
    price: 199.99,
    name: "Plan Pro (Roczny)",
  },
};

const selectedPlan = computed(() => {
  const cycle = route.query.cycle as string;
  if (cycle === "yearly") {
    return { ...PLANS.yearly, period: "rok", desc: "Oszczędzasz 17%" };
  }
  return { ...PLANS.monthly, period: "miesiąc", desc: "Płatność co miesiąc" };
});

// Stany UI
const isLoading = ref(true);
const isProcessing = ref(false);
const isSuccess = ref(false);
const errorMessage = ref<string | null>(null);

// Zmienne Stripe (nie muszą być reaktywne w sensie Vue)
let stripe: any = null;
let elements: any = null;

onMounted(async () => {
  try {
    stripe = await stripePromise;

    // 1. Sprawdź sesję Supabase
    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session) {
      errorMessage.value = "Sesja wygasła. Zaloguj się ponownie.";
      isLoading.value = false;
      return;
    }

    // 2. Utwórz subskrypcję na backendzie (pobierz Client Secret)
    const { data, error } = await useFetch<any>("/api/create-subscription", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: {
        priceId: selectedPlan.value.id,
      },
    });

    if (error.value) {
      console.error("Błąd API Subskrypcji:", error.value);
      errorMessage.value =
        error.value.data?.message || "Nie udało się zainicjować płatności.";
      isLoading.value = false;
      return;
    }

    // Jeśli backend zwrócił sukces ale bez secretu (np. darmowy trial), obsłuż to:
    if (!data.value?.clientSecret) {
      console.log("Subskrypcja aktywna bez płatności (Trial/Free).");
      isSuccess.value = true;
      isLoading.value = false;
      return;
    }

    const clientSecret = data.value.clientSecret;

    // 3. Skonfiguruj wygląd formularza Stripe
    const appearance = {
      theme: "stripe",
      variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#ffffff",
        colorText: "#1e293b",
        borderRadius: "12px",
        fontFamily: "Inter, system-ui, sans-serif",
      },
    };

    // 4. Zamontuj element płatności
    elements = stripe.elements({ appearance, clientSecret });
    const paymentElement = elements.create("payment", {
      layout: "tabs",
    });

    paymentElement.mount("#payment-element");

    paymentElement.on("ready", () => {
      isLoading.value = false;
    });
  } catch (e: any) {
    console.error("Błąd krytyczny w onMounted:", e);
    errorMessage.value = "Wystąpił nieoczekiwany błąd.";
    isLoading.value = false;
  }
});

// --- TUTAJ BYŁ BŁĄD, OTO POPRAWIONA WERSJA ---
const handleSubmit = async () => {
  if (!stripe || !elements) return;

  isProcessing.value = true;
  errorMessage.value = null;

  // Stripe zwraca obiekt { error, paymentIntent }, NIE Refa!
  // Używamy "redirect: if_required", żeby nie przeładowywać strony jeśli nie trzeba
  const result = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + "/app/platnosc-sukces",
    },
    redirect: "if_required",
  });

  // 1. Obsługa błędu (np. karta odrzucona)
  if (result.error) {
    console.error("Stripe Error:", result.error);
    errorMessage.value = result.error.message || "Wystąpił błąd płatności.";
    isProcessing.value = false;
  }
  // 2. Obsługa sukcesu (gdy redirect nie nastąpił)
  else if (
    result.paymentIntent &&
    result.paymentIntent.status === "succeeded"
  ) {
    console.log("Płatność zakończona sukcesem:", result.paymentIntent);
    isSuccess.value = true;

    // Przekierowanie po chwili
    setTimeout(() => {
      router.push("/app/platnosc-sukces");
    }, 1500);
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div class="mb-10 text-center sm:text-left">
      <button
        @click="router.back()"
        class="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Wróć do wyboru planu
      </button>
      <h1 class="text-3xl font-bold text-slate-900">Sfinalizuj płatność</h1>
      <p class="text-slate-500 mt-1">
        Bezpieczna subskrypcja SSL obsługiwana przez Stripe.
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative"
        >
          <div
            v-if="isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-2xl"
          >
            <div
              class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"
            ></div>
            <p class="text-slate-500 text-sm font-medium mt-2">
              Przygotowywanie płatności...
            </p>
          </div>

          <div id="payment-element" :class="{ 'opacity-0': isLoading }"></div>

          <div
            v-if="errorMessage"
            class="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errorMessage }}
          </div>
        </div>

        <div
          class="flex items-center justify-center gap-2 text-slate-400 text-xs mt-4"
        >
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            Szyfrowanie 256-bit
          </span>
          <span>•</span>
          <span>Powered by Stripe</span>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div
          class="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24"
        >
          <h3
            class="font-bold text-lg text-slate-900 mb-6 border-b border-slate-100 pb-4"
          >
            Podsumowanie
          </h3>

          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="font-bold text-slate-900">{{ selectedPlan.name }}</p>
              <p class="text-xs text-slate-500">{{ selectedPlan.desc }}</p>
            </div>
            <p class="font-bold text-slate-900">{{ selectedPlan.price }} zł</p>
          </div>

          <div
            class="flex justify-between items-center text-sm text-slate-500 mb-6"
          >
            <p>Okres rozliczeniowy</p>
            <p>1 {{ selectedPlan.period }}</p>
          </div>

          <div
            class="border-t border-slate-100 py-4 flex justify-between items-center mb-6"
          >
            <p class="font-bold text-lg text-slate-900">Do zapłaty</p>
            <p class="font-extrabold text-2xl text-blue-600">
              {{ selectedPlan.price }} zł
            </p>
          </div>

          <button
            @click="handleSubmit"
            :disabled="isLoading || isProcessing || isSuccess"
            class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center relative overflow-hidden group"
          >
            <span v-if="!isProcessing && !isSuccess">Zapłać i aktywuj</span>

            <div v-if="isProcessing" class="flex items-center gap-2">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Przetwarzanie...
            </div>

            <div v-if="isSuccess" class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Gotowe!
            </div>
          </button>

          <p
            class="text-[10px] text-center text-slate-400 mt-4 leading-relaxed"
          >
            Klikając przycisk, akceptujesz regulamin i zgadzasz się na cykliczne
            obciążanie karty kwotą {{ selectedPlan.price }} zł. Możesz anulować
            w dowolnym momencie.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
