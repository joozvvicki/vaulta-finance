<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({ layout: "dashboard" });

const { t, tm, rt } = useI18n();
const client = useSupabaseClient();
const router = useRouter();

const billingCycle = ref<"monthly" | "yearly">("monthly");
const discount = "17%";
const isLoading = ref<string | null>(null);
const currentPlanId = ref("free");
const isCheckingPlan = ref(true);

useHead({
  title: `${t("plans.title")} | Vaulte`,
});

onMounted(async () => {
  await fetchCurrentPlan();
});

const fetchCurrentPlan = async () => {
  try {
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) return;
    const { data } = await useFetch("/api/check-subscription", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (data.value?.plan) currentPlanId.value = data.value.plan;
  } catch (e) {
    console.error("Plan fetch error:", e);
  } finally {
    isCheckingPlan.value = false;
  }
};

const plans = computed(() => {
  const data = tm("plans.data") as any;
  return [
    {
      id: "free",
      name: rt(data.free.name),
      priceMonthly: 0,
      priceYearly: 0,
      desc: rt(data.free.desc),
      features: data.free.features,
      highlight: false,
    },
    {
      id: "pro",
      name: rt(data.pro.name),
      priceMonthly: 19.99,
      priceYearly: 199.99,
      desc: rt(data.pro.desc),
      features: data.pro.features,
      highlight: true,
    },
    {
      id: "enterprise",
      name: rt(data.enterprise.name),
      priceMonthly: null,
      priceYearly: null,
      desc: rt(data.enterprise.desc),
      features: data.enterprise.features,
      highlight: false,
    },
  ];
});

const handleUpgrade = async (planId: string) => {
  if (planId === currentPlanId.value) return;
  if (planId === "enterprise") {
    router.push("/enterprise");
    return;
  }
  router.push({
    path: "/app/platnosc",
    query: { plan: planId, cycle: billingCycle.value },
  });
};
</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="text-center mb-12" v-motion-fade>
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
        {{ $t("plans.title") }}
      </h1>
      <p class="text-slate-500 mt-3 text-lg max-w-xl mx-auto">
        {{ $t("plans.subtitle") }}
      </p>
    </div>

    <div class="flex justify-center mb-16">
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
            billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'
          "
        >
          {{ $t("plans.billing.monthly") }}
        </button>
        <button
          @click="billingCycle = 'yearly'"
          class="px-8 py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10 w-[185px] flex items-center justify-center gap-2"
          :class="
            billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'
          "
        >
          {{ $t("plans.billing.yearly") }}
          <span
            class="text-[10px] font-extrabold bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
            >{{ $t("plans.billing.discount", { amount: discount }) }}</span
          >
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 items-start">
      <div
        v-for="(plan, index) in plans"
        :key="plan.id"
        class="relative h-full"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
      >
        <div
          v-if="currentPlanId === plan.id"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-20 flex items-center gap-2 uppercase tracking-wide"
        >
          <span class="relative flex h-2 w-2"
            ><span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span
            ><span
              class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
            ></span
          ></span>
          {{ $t("plans.badges.current") }}
        </div>
        <div
          v-else-if="plan.highlight"
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg z-20 uppercase tracking-wide"
        >
          {{ $t("plans.badges.recommended") }}
        </div>

        <div
          :class="[
            'bg-white rounded-3xl p-8 border transition-all flex flex-col h-full relative overflow-hidden',
            currentPlanId === plan.id
              ? 'border-slate-300 ring-1 ring-slate-100'
              : plan.highlight
                ? 'border-blue-200 shadow-xl scale-105 z-10'
                : 'border-slate-200 hover:border-slate-300',
          ]"
        >
          <div class="mb-6">
            <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
            <p class="text-sm text-slate-500 mt-2 h-10 leading-relaxed">
              {{ plan.desc }}
            </p>
          </div>

          <div class="mb-8 h-20">
            <div v-if="plan.priceMonthly !== null">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-extrabold text-slate-900"
                  >{{
                    billingCycle === "monthly"
                      ? plan.priceMonthly
                      : Math.round(plan.priceYearly! / 12)
                  }}
                  <span class="text-2xl">zł</span></span
                >
                <span class="text-slate-500 font-medium text-sm">{{
                  $t("plans.labels.per_month")
                }}</span>
              </div>
              <div class="mt-2 h-5">
                <p
                  v-if="billingCycle === 'yearly'"
                  class="text-[11px] text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded"
                >
                  {{
                    $t("plans.labels.save_yearly", {
                      amount: (
                        plan.priceMonthly * 12 -
                        plan.priceYearly!
                      ).toFixed(0),
                    })
                  }}
                </p>
                <p v-else class="text-[11px] text-slate-400">
                  {{ $t("plans.labels.recurring") }}
                </p>
              </div>
            </div>
            <div v-else>
              <span class="text-2xl font-extrabold text-slate-900">{{
                $t("plans.labels.individual")
              }}</span>
              <p class="text-xs text-slate-400 mt-2">
                {{ $t("plans.labels.contact_sales") }}
              </p>
            </div>
          </div>

          <div class="border-t border-slate-100 mb-6"></div>

          <ul class="space-y-4 mb-8 flex-grow">
            <li
              v-for="feat in plan.features"
              :key="rt(feat)"
              class="flex items-start text-sm text-slate-600"
            >
              <div
                class="mr-3 mt-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"
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
                  />
                </svg>
              </div>
              <span>{{ rt(feat) }}</span>
            </li>
          </ul>

          <button
            @click="handleUpgrade(plan.id)"
            :disabled="currentPlanId === plan.id || isLoading !== null"
            :class="[
              'w-full py-3.5 rounded-xl font-bold transition flex justify-center items-center text-sm',
              currentPlanId === plan.id
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50',
            ]"
          >
            <span v-if="isLoading === plan.id">{{
              $t("plans.buttons.processing")
            }}</span>
            <span v-else-if="currentPlanId === plan.id">{{
              $t("plans.buttons.current")
            }}</span>
            <span v-else-if="plan.priceMonthly === null">{{
              $t("plans.buttons.contact")
            }}</span>
            <span v-else>{{
              $t("plans.buttons.choose", { name: plan.name })
            }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-24 max-w-4xl mx-auto border-t border-slate-200 pt-12">
      <h3 class="text-xl font-bold text-slate-900 mb-8 text-center">
        {{ $t("plans.faq.title") }}
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
              {{ $t("plans.faq.q1.title") }}
            </h4>
            <p class="text-sm text-slate-500 leading-relaxed">
              {{ $t("plans.faq.q1.answer") }}
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
              {{ $t("plans.faq.q2.title") }}
            </h4>
            <p class="text-sm text-slate-500 leading-relaxed">
              {{ $t("plans.faq.q2.answer") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
