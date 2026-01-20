<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({ layout: "dashboard" });

const client = useSupabaseClient();
const router = useRouter();

const billingCycle = ref<"monthly" | "yearly">("monthly");
const discount = "17%";
const isLoading = ref<string | null>(null);

const currentPlanId = ref("free");
const isCheckingPlan = ref(true);

onMounted(async () => {
  await fetchCurrentPlan();
});

const fetchCurrentPlan = async () => {
  try {
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) {
      isCheckingPlan.value = false;
      return;
    }

    const { data, error } = await useFetch("/api/check-subscription", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (data.value?.plan) {
      currentPlanId.value = data.value.plan;
      console.log("Aktualny plan użytkownika:", currentPlanId.value);
    }
  } catch (e) {
    console.error("Nie udało się pobrać planu:", e);
  } finally {
    isCheckingPlan.value = false;
  }
};
// -----------------------------------------------------

const plans = computed(() => [
  {
    id: "free",
    name: "Start",
    priceMonthly: 0,
    priceYearly: 0,
    desc: "Dla początkujących, by uporządkować podstawy.",
    features: [
      "Podłączenie 1 banku",
      "Historia transakcji: 30 dni",
      "Podstawowe wykresy",
      "Ręczne dodawanie gotówki",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19.99,
    priceYearly: 199.99,
    desc: "Pełna automatyzacja i sztuczna inteligencja.",
    features: [
      "Nielimitowana liczba banków",
      "Pełna historia transakcji",
      "Eksport do Excela/CSV",
      "Kategorie wspierane przez AI",
      "Priorytetowe wsparcie",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    desc: "Dla firm potrzebujących dedykowanych rozwiązań.",
    features: [
      "Dostęp do API",
      "Dedykowany opiekun",
      "Wdrożenie On-Premise",
      "SLA 99.9%",
      "Umowa B2B",
    ],
    highlight: false,
  },
]);

const handleUpgrade = async (planId: string) => {
  if (planId === currentPlanId.value) return;

  if (planId === "enterprise") {
    router.push("/enterprise");
    return;
  }

  router.push({
    path: "/app/platnosc",
    query: {
      plan: planId,
      cycle: billingCycle.value,
    },
  });
};
</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <div
      class="text-center mb-12"
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
        Zarządzaj swoim planem
      </h1>
      <p class="text-slate-500 mt-3 text-lg max-w-xl mx-auto">
        Wybierz opcję dopasowaną do Twoich celów finansowych. Zmień w dowolnym
        momencie.
      </p>
    </div>

    <div
      class="flex justify-center mb-16"
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: { duration: 500, delay: 100 },
      }"
    >
      <div
        class="bg-slate-100 p-1.5 rounded-2xl inline-flex relative shadow-inner"
      >
        <div
          class="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
          :class="
            billingCycle === 'monthly'
              ? 'left-1.5 w-[130px]'
              : 'left-[140px] w-[180px]'
          "
        ></div>

        <button
          @click="billingCycle = 'monthly'"
          class="px-8 py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10 w-[135px]"
          :class="
            billingCycle === 'monthly'
              ? 'text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          Miesięcznie
        </button>
        <button
          @click="billingCycle = 'yearly'"
          class="px-8 py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10 w-[185px] flex items-center justify-center gap-2"
          :class="
            billingCycle === 'yearly'
              ? 'text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          Rocznie
          <span
            class="text-[10px] font-extrabold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide"
          >
            -{{ discount }}
          </span>
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 items-start">
      <div
        v-for="(plan, index) in plans"
        :key="plan.id"
        class="relative h-full"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 500, delay: 200 + index * 100 },
        }"
      >
        <div
          v-if="currentPlanId === plan.id"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-2 uppercase tracking-wide border border-slate-700"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
            ></span>
          </span>
          Twój obecny plan
        </div>

        <div
          v-else-if="plan.highlight"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 z-20 uppercase tracking-wide"
        >
          Polecany wybór
        </div>

        <div
          :class="[
            'bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col h-full relative overflow-hidden',
            currentPlanId === plan.id
              ? 'border-slate-300 ring-1 ring-slate-100'
              : plan.highlight
                ? 'border-blue-200 shadow-xl shadow-blue-900/5 scale-105 z-10'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-lg',
          ]"
        >
          <div
            v-if="plan.highlight"
            class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100px] -z-10 opacity-50"
          ></div>

          <div class="mb-6">
            <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
            <p class="text-sm text-slate-500 mt-2 leading-relaxed h-10">
              {{ plan.desc }}
            </p>
          </div>

          <div class="mb-8">
            <div v-if="plan.priceMonthly !== null">
              <div class="flex items-baseline gap-1">
                <span
                  class="text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  {{
                    billingCycle === "monthly"
                      ? plan.priceMonthly
                      : Math.round(plan.priceYearly! / 12)
                  }}
                  <span class="text-2xl">zł</span>
                </span>
                <span class="text-slate-500 font-medium text-sm">/ mies</span>
              </div>

              <div class="mt-2 h-5">
                <p
                  v-if="billingCycle === 'yearly'"
                  class="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded"
                >
                  Oszczędzasz
                  {{ (plan.priceMonthly * 12 - plan.priceYearly!).toFixed(2) }}
                  zł rocznie
                </p>
                <p v-else class="text-xs text-slate-400">
                  Płatność odnawialna co miesiąc
                </p>
              </div>
            </div>
            <div v-else>
              <span class="text-3xl font-extrabold text-slate-900"
                >Indywidualna</span
              >
              <p class="text-xs text-slate-400 mt-2">
                Skontaktuj się z działem sprzedaży
              </p>
            </div>
          </div>

          <div class="border-t border-slate-100 mb-6"></div>

          <ul class="space-y-4 mb-8 flex-grow">
            <li
              v-for="feat in plan.features"
              :key="feat"
              class="flex items-start text-sm text-slate-600 group"
            >
              <div
                class="mr-3 mt-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <span class="group-hover:text-slate-900 transition-colors">{{
                feat
              }}</span>
            </li>
          </ul>

          <button
            @click="handleUpgrade(plan.id)"
            :disabled="currentPlanId === plan.id || isLoading !== null"
            :class="[
              'w-full py-3.5 rounded-xl font-bold transition flex justify-center items-center text-sm',
              currentPlanId === plan.id
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transform'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
            ]"
          >
            <svg
              v-if="isLoading === plan.id"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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

            <span v-if="isLoading === plan.id">Przetwarzanie...</span>
            <span v-else-if="currentPlanId === plan.id">Twój obecny plan</span>
            <span v-else-if="plan.priceMonthly === null">Zapytaj o ofertę</span>
            <span v-else>Wybierz {{ plan.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-24 max-w-4xl mx-auto border-t border-slate-200 pt-12">
      <h3 class="text-xl font-bold text-slate-900 mb-8 text-center">
        Pytania dotyczące płatności
      </h3>
      <div class="grid md:grid-cols-2 gap-10">
        <div class="flex gap-4">
          <div
            class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0"
          >
            🔄
          </div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2 text-sm">
              Czy mogę zmienić plan w trakcie miesiąca?
            </h4>
            <p class="text-sm text-slate-500 leading-relaxed">
              Tak. Jeśli ulepszasz plan (upgrade), różnicę w cenie doliczymy
              proporcjonalnie. Zmiana działa natychmiast i zyskujesz dostęp do
              nowych funkcji od razu.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <div
            class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0"
          >
            🔒
          </div>
          <div>
            <h4 class="font-bold text-slate-900 mb-2 text-sm">
              Jak działają płatności?
            </h4>
            <p class="text-sm text-slate-500 leading-relaxed">
              Obsługujemy bezpieczne płatności kartą (Visa, Mastercard) oraz
              Apple Pay / Google Pay. Fakturę VAT otrzymasz automatycznie na
              maila po każdej transakcji.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
