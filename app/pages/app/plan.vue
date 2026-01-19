<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({ layout: "dashboard" });

const billingCycle = ref<"monthly" | "yearly">("monthly");
const currentPlanId = ref("free");
const isLoading = ref<string | null>(null);

const plans = [
  {
    id: "free",
    name: "Start",
    priceMonthly: 0,
    priceYearly: 0,
    desc: "Dla początkujących",
    features: ["Podłączenie 1 banku", "Historia 30 dni", "Podstawowe wykresy"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 190,
    desc: "Dla świadomych finansowo",
    features: [
      "Nielimitowane banki",
      "Historia 3 lata",
      "Eksport do Excela/CSV",
      "Kategorie AI",
      "Wsparcie priorytetowe",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    desc: "Dla firm i korporacji",
    features: [
      "Dostęp do API",
      "Dedykowane wsparcie",
      "Wdrożenie On-Premise",
      "SLA 99.9%",
    ],
    highlight: false,
  },
];

const router = useRouter();
const discount = "17%";

const handleUpgrade = (planId: string) => {
  if (planId === "enterprise") {
    router.push("/enterprise");
    return;
  }

  isLoading.value = planId;

  setTimeout(() => {
    isLoading.value = null;
    currentPlanId.value = planId;
    alert(`Gratulacje! Twój plan został zmieniony na ${planId.toUpperCase()}.`);
  }, 1500);
};
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div
      class="text-center mb-10"
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <h1 class="text-3xl font-bold text-slate-900">Zarządzaj swoim planem</h1>
      <p class="text-slate-500 mt-2">
        Wybierz plan dopasowany do Twoich potrzeb finansowych.
      </p>
    </div>

    <div
      class="flex justify-center mb-12"
      v-motion
      :initial="{ opacity: 0, scale: 0.9 }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: { duration: 500, delay: 100 },
      }"
    >
      <div
        class="bg-white p-1 rounded-xl border border-slate-200 inline-flex relative shadow-sm"
      >
        <button
          @click="billingCycle = 'monthly'"
          class="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative z-10"
          :class="
            billingCycle === 'monthly'
              ? 'text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          Miesięcznie
        </button>
        <button
          @click="billingCycle = 'yearly'"
          class="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 flex items-center gap-2"
          :class="
            billingCycle === 'yearly'
              ? 'text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          Rocznie
          <span
            class="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide"
          >
            -{{ discount }}
          </span>
        </button>

        <div
          class="absolute top-1 bottom-1 bg-slate-100 rounded-lg transition-all duration-300 ease-in-out"
          :class="
            billingCycle === 'monthly'
              ? 'left-1 w-[105px]'
              : 'left-[110px] w-[155px]'
          "
        ></div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 items-start">
      <div
        v-for="(plan, index) in plans"
        :key="plan.id"
        class="relative"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 500, delay: 200 + index * 100 },
        }"
      >
        <div
          v-if="currentPlanId === plan.id"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1"
        >
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Twój obecny plan
        </div>

        <div
          v-else-if="plan.highlight"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20"
        >
          POLECANY
        </div>

        <div
          :class="[
            'bg-white rounded-2xl p-8 border transition-all duration-300 flex flex-col h-full relative overflow-hidden',
            currentPlanId === plan.id
              ? 'border-slate-300 ring-4 ring-slate-100'
              : plan.highlight
                ? 'border-blue-200 shadow-xl scale-105 z-10'
                : 'border-slate-200 hover:border-blue-300 hover:shadow-lg',
          ]"
        >
          <div
            v-if="plan.highlight"
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100px] -z-10"
          ></div>

          <div class="mb-6">
            <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
            <p class="text-sm text-slate-500 mt-1">{{ plan.desc }}</p>
          </div>

          <div class="mb-6">
            <div v-if="plan.priceMonthly !== null">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-extrabold text-slate-900">
                  {{
                    billingCycle === "monthly"
                      ? plan.priceMonthly
                      : Math.round(plan.priceYearly! / 12)
                  }}
                  zł
                </span>
                <span class="text-slate-500 font-medium">/ mies</span>
              </div>
              <p
                v-if="billingCycle === 'yearly'"
                class="text-xs text-green-600 font-bold mt-1"
              >
                Płacisz {{ plan.priceYearly }} zł raz na rok
              </p>
            </div>
            <div v-else>
              <span class="text-3xl font-extrabold text-slate-900">Wycena</span>
            </div>
          </div>

          <div class="border-t border-slate-100 my-6"></div>

          <ul class="space-y-4 mb-8 flex-grow">
            <li
              v-for="feat in plan.features"
              :key="feat"
              class="flex items-start text-sm text-slate-600"
            >
              <span
                class="mr-3 text-blue-600 bg-blue-50 rounded-full p-0.5 mt-0.5"
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
              </span>
              {{ feat }}
            </li>
          </ul>

          <button
            @click="handleUpgrade(plan.id)"
            :disabled="currentPlanId === plan.id || isLoading !== null"
            :class="[
              'w-full py-3 rounded-xl font-bold transition flex justify-center items-center',
              currentPlanId === plan.id
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
            ]"
          >
            <span v-if="isLoading === plan.id" class="mr-2">
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
            </span>

            <span v-if="isLoading === plan.id">Przetwarzanie...</span>
            <span v-else-if="currentPlanId === plan.id">Obecny plan</span>
            <span v-else-if="plan.priceMonthly === null">Skontaktuj się</span>
            <span v-else>Wybierz {{ plan.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-20 max-w-3xl mx-auto border-t border-slate-200 pt-10">
      <h3 class="text-xl font-bold text-slate-900 mb-6 text-center">
        Pytania dotyczące płatności
      </h3>
      <div class="grid md:grid-cols-2 gap-8 text-sm">
        <div>
          <h4 class="font-bold text-slate-900 mb-2">
            Czy mogę zmienić plan w trakcie miesiąca?
          </h4>
          <p class="text-slate-500">
            Tak. Jeśli ulepszasz plan (upgrade), różnicę w cenie doliczymy
            proporcjonalnie. Zmiana działa natychmiast.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 mb-2">Jak działają płatności?</h4>
          <p class="text-slate-500">
            Obsługujemy bezpieczne płatności kartą oraz BLIK przez naszego
            operatora (Stripe). Fakturę otrzymasz na maila.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
