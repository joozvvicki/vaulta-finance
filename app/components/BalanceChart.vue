<script setup lang="ts">
import { computed } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { subDays, isSameDay, parseISO, isValid, format } from "date-fns";
import { pl, enUS } from "date-fns/locale";

const props = defineProps<{
  period: "7d" | "30d";
}>();

const { t, locale } = useI18n();
const store = useTransactionStore();
const { profile } = useProfile();

const dateLocale = computed(() => (locale.value === "pl" ? pl : enUS));

const parseDateSafe = (dateStr: string) => {
  if (!dateStr) return new Date();
  const date = parseISO(dateStr);
  return isValid(date) ? date : new Date();
};

const formatMoney = (amount: number) => {
  const code = locale.value === "pl" ? "pl-PL" : "en-US";
  return (
    amount.toLocaleString(code, { minimumFractionDigits: 2 }) +
    ` ${t("chart.currency")}`
  );
};

const chartData = computed(() => {
  const daysCount = props.period === "7d" ? 7 : 30;
  const currentSavings = Number(profile.value.saved_balance || 0);
  const initialBalanceFromDB = Number(profile.value.initial_balance || 0);

  const currentCheckingBalance =
    initialBalanceFromDB +
    store.transactions.reduce((acc, t) => acc + Number(t.amount), 0);

  let runningCheckingBalance = currentCheckingBalance;
  const history = [];

  for (let i = 0; i < daysCount; i++) {
    const dateCursor = subDays(new Date(), i);
    const dailyTransactions = store.transactions.filter((t) =>
      isSameDay(parseDateSafe(t.date), dateCursor),
    );

    const dailyIncome = dailyTransactions
      .filter((t) => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const dailyExpense = dailyTransactions
      .filter((t) => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const dailyNetChange = dailyIncome + dailyExpense;

    history.push({
      date: dateCursor,
      checking: runningCheckingBalance,
      savings: currentSavings,
      total: runningCheckingBalance + currentSavings,
      income: dailyIncome,
      expense: dailyExpense,
    });

    runningCheckingBalance -= dailyNetChange;
  }

  return history.reverse();
});

const series = computed(() => [
  {
    name: t("chart.total_funds"),
    data: chartData.value.map((d) => parseFloat(d.total.toFixed(2))),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "area",
    height: 350,
    toolbar: { show: false },
    fontFamily: "inherit",
    animations: { enabled: true },
  },
  colors: ["#2563eb"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100],
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  markers: {
    size: 4,
    colors: ["#fff"],
    strokeColors: "#2563eb",
    strokeWidth: 2,
    hover: { size: 6 },
  },
  xaxis: {
    categories: chartData.value.map((d) => {
      // Dynamiczne formatowanie osi X
      return format(d.date, props.period === "7d" ? "eee" : "d MMM", {
        locale: dateLocale.value,
      });
    }),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: "#64748b", fontSize: "10px", fontWeight: 600 },
    },
  },
  yaxis: { show: false },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
    padding: { left: 0, right: 0 },
  },
  tooltip: {
    theme: "light",
    x: { show: false },
    custom: function ({ dataPointIndex }: any) {
      const data: any = chartData.value[dataPointIndex];
      // Format daty w tooltipie
      const dateStr = format(data.date, "d MMMM yyyy", {
        locale: dateLocale.value,
      });

      return `
        <div class="px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-2xl text-sm font-sans z-50 min-w-[200px]">
          <div class="font-bold text-slate-900 mb-2 border-b border-slate-50 pb-2 text-[10px] uppercase tracking-wider">${dateStr}</div>
          
          <div class="space-y-1.5 mb-3">
             <div class="flex items-center justify-between">
                <span class="text-slate-400 text-[10px] font-bold uppercase">${t("chart.savings")}</span>
                <span class="font-bold text-slate-700 text-xs">${formatMoney(data.savings)}</span>
             </div>
             <div class="flex items-center justify-between">
                <span class="text-slate-400 text-[10px] font-bold uppercase">${t("chart.checking")}</span>
                <span class="font-bold text-slate-700 text-xs">${formatMoney(data.checking)}</span>
             </div>
             <div class="flex items-center justify-between pt-2 border-t border-slate-50">
                <span class="text-slate-900 font-black text-xs uppercase">${t("chart.total")}</span>
                <span class="font-black text-blue-600 text-sm">${formatMoney(data.total)}</span>
             </div>
          </div>
          
          ${
            data.income > 0 || data.expense < 0
              ? `
            <div class="pt-2 border-t border-slate-50 grid grid-cols-2 gap-2">
              ${
                data.income > 0
                  ? `
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase block">${t("chart.income")}</span>
                  <span class="font-bold text-green-600 text-[11px]">+${data.income.toFixed(2)}</span>
                </div>
              `
                  : "<div></div>"
              }
              ${
                data.expense < 0
                  ? `
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase block">${t("chart.expenses")}</span>
                  <span class="font-bold text-red-500 text-[11px]">${data.expense.toFixed(2)}</span>
                </div>
              `
                  : "<div></div>"
              }
            </div>
          `
              : ""
          }
        </div>
      `;
    },
  },
}));
</script>

<template>
  <div class="w-full h-full min-h-[300px]">
    <div
      v-if="store.isLoading"
      class="h-[300px] flex items-center justify-center"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>
    <ClientOnly v-else>
      <apexchart
        type="area"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </div>
</template>
