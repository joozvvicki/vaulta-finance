<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const client = useSupabaseClient();

const stripePromise = loadStripe(config.public.stripePublishableKey);

const PLANS = {
  monthly: {
    id: "price_1SrTDtPAN1TckpzfgAhJKHBQ",
    price: 19.99,
  },
  yearly: {
    id: "price_1SrTFDPAN1Tckpzf3TmLP811",
    price: 199.99,
  },
};

const selectedPlan = computed(() => {
  const cycle = route.query.cycle as string;
  if (cycle === "yearly") {
    return {
      ...PLANS.yearly,
      name: t("plans.data.pro.name") + " (" + t("plans.billing.yearly") + ")",
      period: t("checkout.summary.year"),
      desc: t("checkout.summary.yearly_desc"),
    };
  }
  return {
    ...PLANS.monthly,
    name: t("plans.data.pro.name") + " (" + t("plans.billing.monthly") + ")",
    period: t("checkout.summary.month"),
    desc: t("checkout.summary.monthly_desc"),
  };
});

const isLoading = ref(true);
const isProcessing = ref(false);
const isSuccess = ref(false);
const errorMessage = ref<string | null>(null);

let stripe: any = null;
let elements: any = null;

useHead({
  title: `${t("checkout.title")} | Vaulte`,
});

onMounted(async () => {
  try {
    stripe = await stripePromise;

    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) {
      errorMessage.value = t("checkout.errors.session");
      isLoading.value = false;
      return;
    }

    const { data, error } = await useFetch<any>("/api/create-subscription", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { priceId: selectedPlan.value.id },
    });

    if (error.value) {
      errorMessage.value =
        error.value.data?.message || t("checkout.errors.init");
      isLoading.value = false;
      return;
    }

    if (!data.value?.clientSecret) {
      isSuccess.value = true;
      isLoading.value = false;
      return;
    }

    const clientSecret = data.value.clientSecret;

    const appearance = {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#ffffff",
        colorText: "#1e293b",
        borderRadius: "12px",
        fontFamily: "Inter, system-ui, sans-serif",
      },
    };

    elements = stripe.elements({ appearance, clientSecret });
    const paymentElement = elements.create("payment", { layout: "tabs" });

    paymentElement.mount("#payment-element");
    paymentElement.on("ready", () => {
      isLoading.value = false;
    });
  } catch (e: any) {
    errorMessage.value = t("checkout.errors.unexpected");
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  if (!stripe || !elements) return;

  isProcessing.value = true;
  errorMessage.value = null;

  const result = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + "/app/platnosc-sukces",
    },
    redirect: "if_required",
  });

  if (result.error) {
    errorMessage.value = result.error.message || t("checkout.errors.payment");
    isProcessing.value = false;
  } else if (
    result.paymentIntent &&
    result.paymentIntent.status === "succeeded"
  ) {
    isSuccess.value = true;
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
        class="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4 transition-colors font-medium"
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
        {{ $t("checkout.back") }}
      </button>
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
        {{ $t("checkout.title") }}
      </h1>
      <p class="text-slate-500 mt-1">{{ $t("checkout.subtitle") }}</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[400px] relative overflow-hidden"
        >
          <div
            v-if="isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10"
          >
            <div
              class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"
            ></div>
            <p
              class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4"
            >
              {{ $t("checkout.preparing") }}
            </p>
          </div>

          <div id="payment-element" :class="{ 'opacity-0': isLoading }"></div>

          <div
            v-if="errorMessage"
            class="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-100 animate-shake"
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
          class="flex items-center justify-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4"
        >
          <span class="flex items-center gap-1.5">
            <span
              class="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
            ></span>
            {{ $t("checkout.security") }}
          </span>
          <span class="opacity-30">|</span>
          <span>Powered by Stripe</span>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div
          class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sticky top-24"
        >
          <h3
            class="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6 border-b border-slate-50 pb-4"
          >
            {{ $t("checkout.summary.title") }}
          </h3>

          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="font-bold text-slate-900">{{ selectedPlan.name }}</p>
              <p
                class="text-[10px] font-bold text-blue-600 uppercase tracking-tight"
              >
                {{ selectedPlan.desc }}
              </p>
            </div>
            <p class="font-black text-slate-900 text-lg">
              {{ selectedPlan.price }} zł
            </p>
          </div>

          <div
            class="flex justify-between items-center text-xs font-medium text-slate-500 mb-8 bg-slate-50 p-3 rounded-xl"
          >
            <p>{{ $t("checkout.summary.period_label") }}</p>
            <p class="text-slate-900">{{ selectedPlan.period }}</p>
          </div>

          <div
            class="border-t-2 border-dashed border-slate-100 py-6 flex justify-between items-center mb-8"
          >
            <p class="font-bold text-slate-900">
              {{ $t("checkout.summary.total") }}
            </p>
            <p class="font-black text-3xl text-blue-600 tracking-tighter">
              {{ selectedPlan.price }} zł
            </p>
          </div>

          <button
            @click="handleSubmit"
            :disabled="isLoading || isProcessing || isSuccess"
            class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center group active:scale-95"
          >
            <span v-if="!isProcessing && !isSuccess">{{
              $t("checkout.cta.submit")
            }}</span>
            <div v-if="isProcessing" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
              {{ $t("checkout.cta.processing") }}
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
              {{ $t("checkout.cta.success") }}
            </div>
          </button>

          <p
            class="text-[10px] text-center text-slate-400 mt-6 leading-relaxed font-medium"
          >
            {{ $t("checkout.disclaimer", { amount: selectedPlan.price }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
