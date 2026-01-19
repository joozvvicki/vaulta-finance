<script setup lang="ts">
import { computed } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { subDays, isSameDay, parseISO, parse, isValid, format } from "date-fns";
import { pl } from "date-fns/locale";

const props = defineProps<{
  period: "7d" | "30d";
}>();

const store = useTransactionStore();

const parseDateSafe = (dateStr: string) => {
  let date = parseISO(dateStr);
  if (isValid(date)) return date;
  date = parse(dateStr, "dd.MM.yyyy", new Date());
  if (isValid(date)) return date;
  return new Date();
};

const formatMoney = (amount: number) => {
  return amount.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + " PLN";
};

const chartData = computed(() => {
  const daysCount = props.period === "7d" ? 7 : 30;

  // 1. Pobieramy aktualny stan oszczędności
  const currentSavings = Number(store.savedBalance);

  // 2. Obliczamy startowe saldo BIEŻĄCE (ROR)
  // (Initial + Suma transakcji)
  const currentCheckingBalance =
    Number(store.initialBalance) +
    store.transactions.reduce((acc, t) => acc + Number(t.amount), 0);

  let runningCheckingBalance = currentCheckingBalance;
  const history = [];

  // 3. Cofamy się w czasie
  for (let i = 0; i < daysCount; i++) {
    const dateCursor = subDays(new Date(), i);

    // Filtrujemy transakcje z danego dnia
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

    // Zapisujemy stan na koniec dnia
    history.push({
      date: dateCursor,
      checking: runningCheckingBalance, // Tylko bieżące
      savings: currentSavings, // Oszczędności (zakładamy stałe dla historii)
      total: runningCheckingBalance + currentSavings, // SUMA (To rysujemy)
      income: dailyIncome,
      expense: dailyExpense,
    });

    // Cofamy saldo bieżące
    runningCheckingBalance -= dailyNetChange;
  }

  return history.reverse();
});

const series = computed(() => [
  {
    name: "Całkowite środki",
    // Rysujemy SUMĘ (Total Wealth)
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
  colors: ["#2563eb"], // Niebieski wykres
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories: chartData.value.map((d) => {
      if (props.period === "7d") {
        return format(d.date, "eee", { locale: pl });
      } else {
        return format(d.date, "d MMM", { locale: pl });
      }
    }),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: "#64748b" },
      rotate: props.period === "30d" ? -45 : 0,
    },
    tickAmount: props.period === "7d" ? 7 : 10,
  },
  yaxis: { show: false },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
  },
  // --- ROZBUDOWANY TOOLTIP ---
  tooltip: {
    theme: "light",
    custom: function ({ dataPointIndex }: any) {
      const data: any = chartData.value[dataPointIndex];
      const dateStr = format(data.date, "d MMMM yyyy", { locale: pl });

      return `
        <div class="px-3 py-2 bg-white border border-slate-200 rounded shadow-xl text-sm font-sans z-50">
          <div class="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">${dateStr}</div>
          
          <div class="space-y-1 mb-3">
             <div class="flex items-center justify-between gap-6">
                <span class="text-slate-500 text-xs">Oszczędności:</span>
                <span class="font-medium text-slate-600 text-xs">${formatMoney(data.savings)}</span>
             </div>
             <div class="flex items-center justify-between gap-6">
                <span class="text-slate-500 text-xs">Bieżące:</span>
                <span class="font-medium text-slate-600 text-xs">${formatMoney(data.checking)}</span>
             </div>
             <div class="flex items-center justify-between gap-6 pt-1 border-t border-slate-100">
                <span class="text-slate-800 font-bold">Razem:</span>
                <span class="font-bold text-blue-600">${formatMoney(data.total)}</span>
             </div>
          </div>
          
          ${
            data.income > 0 || data.expense < 0
              ? `<div class="pt-2 border-t border-slate-100">`
              : ""
          }
          
          ${
            data.income > 0
              ? `
          <div class="flex items-center justify-between gap-6">
            <span class="text-slate-400 text-[10px] uppercase tracking-wide">Wpływy</span>
            <span class="font-bold text-green-600 text-xs">+${formatMoney(data.income)}</span>
          </div>`
              : ""
          }
          
          ${
            data.expense < 0
              ? `
          <div class="flex items-center justify-between gap-6">
             <span class="text-slate-400 text-[10px] uppercase tracking-wide">Wydatki</span>
            <span class="font-bold text-red-500 text-xs">${formatMoney(data.expense)}</span>
          </div>`
              : ""
          }
          
          ${data.income > 0 || data.expense < 0 ? `</div>` : ""}
        </div>
      `;
    },
  },
}));
</script>

<template>
  <div class="w-full h-full min-h-[300px]">
    <ClientOnly>
      <apexchart
        type="area"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </div>
</template>
