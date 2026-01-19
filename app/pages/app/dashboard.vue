<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const stats = [
  {
    name: "Dostępne środki",
    value: "12 450,00",
    currency: "PLN",
    change: "+2.5%",
    type: "good",
    icon: "💰",
    delay: 100,
  },
  {
    name: "Wydatki (Ten mies.)",
    value: "3 200,50",
    currency: "PLN",
    change: "+12%",
    type: "bad",
    icon: "📉",
    delay: 200,
  },
  {
    name: "Oszczędności",
    value: "45 000,00",
    currency: "PLN",
    change: "+1.0%",
    type: "good",
    icon: "🐷",
    delay: 300,
  },
];

const recentTransactions = [
  {
    id: 1,
    to: "Biedronka",
    date: "Dzisiaj, 14:30",
    amount: "-145,20 PLN",
    category: "Zakupy",
    icon: "🛒",
  },
  {
    id: 2,
    to: "Netflix",
    date: "Wczoraj",
    amount: "-43,00 PLN",
    category: "Subskrypcje",
    icon: "🎬",
  },
  {
    id: 3,
    to: "Przelew przychodzący",
    date: "12 Sty",
    amount: "+5 400,00 PLN",
    category: "Wynagrodzenie",
    icon: "💼",
  },
  {
    id: 4,
    to: "Orlen",
    date: "10 Sty",
    amount: "-250,00 PLN",
    category: "Transport",
    icon: "⛽",
  },
];
</script>

<template>
  <div>
    <div
      class="mb-8 flex justify-between items-end"
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
          Dzień dobry, Marek! 👋
        </h1>
        <p class="text-slate-500 mt-1">Oto Twój finansowy przegląd dnia.</p>
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
      >
        + Nowy przelew
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        v-for="(stat, index) in stats"
        :key="stat.name"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { delay: stat.delay, duration: 400 },
        }"
        class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default group"
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
          >
            {{ stat.icon }}
          </div>
          <span
            :class="[
              'text-xs font-bold px-2 py-1 rounded-full',
              stat.type === 'good'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700',
            ]"
          >
            {{ stat.change }}
          </span>
        </div>
        <p class="text-sm font-medium text-slate-500">{{ stat.name }}</p>
        <div class="mt-1 flex items-baseline gap-1">
          <span class="text-3xl font-bold text-slate-900">{{
            stat.value
          }}</span>
          <span class="text-sm text-slate-400 font-medium">{{
            stat.currency
          }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        v-motion-slide-visible-once-bottom
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg text-slate-900">Analiza Salda</h3>
          <select
            class="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg p-2 focus:ring-0 cursor-pointer hover:bg-slate-100"
          >
            <option>Ostatnie 7 dni</option>
            <option>Ostatni miesiąc</option>
          </select>
        </div>
        <BalanceChart />
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
        v-motion-slide-visible-once-right
      >
        <div
          class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="font-bold text-slate-900">Ostatnie transakcje</h3>
        </div>

        <div class="flex-1 overflow-y-auto max-h-[400px]">
          <div
            v-for="(t, i) in recentTransactions"
            :key="t.id"
            class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-50 last:border-0 cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg"
              >
                {{ t.icon }}
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">{{ t.to }}</p>
                <p class="text-xs text-slate-500">
                  {{ t.date }} • {{ t.category }}
                </p>
              </div>
            </div>
            <span
              :class="[
                'font-bold text-sm',
                t.amount.includes('+') ? 'text-green-600' : 'text-slate-900',
              ]"
            >
              {{ t.amount }}
            </span>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100">
          <button
            class="w-full py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            Zobacz pełną historię
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
