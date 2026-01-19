<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const budgets = [
  { category: "Jedzenie i dom", spent: 1250, limit: 1500, icon: "🏠" },
  { category: "Transport", spent: 450, limit: 400, icon: "🚗" }, // Over budget
  { category: "Rozrywka", spent: 120, limit: 500, icon: "🍿" },
  { category: "Zakupy", spent: 890, limit: 1000, icon: "🛍️" },
  { category: "Zdrowie", spent: 0, limit: 300, icon: "💊" },
];

const getPercentage = (spent: number, limit: number) =>
  Math.min((spent / limit) * 100, 100);

const getProgressColor = (spent: number, limit: number) => {
  const p = (spent / limit) * 100;
  if (p > 100) return "bg-red-500";
  if (p > 80) return "bg-yellow-500";
  return "bg-blue-600";
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-2">Twój Budżet</h1>
    <p class="text-slate-500 mb-8">
      Planuj mądrze. Pozostało 12 dni do końca miesiąca.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div
        class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg"
      >
        <p class="text-blue-200 text-sm font-medium mb-1">Całkowity budżet</p>
        <h2 class="text-3xl font-bold">3 700,00 PLN</h2>
        <div class="mt-4 w-full bg-blue-900/30 rounded-full h-2">
          <div class="bg-white h-2 rounded-full" style="width: 72%"></div>
        </div>
        <p class="mt-2 text-xs text-blue-100">Wydano 72% planu</p>
      </div>
    </div>

    <div class="grid gap-6">
      <div
        v-for="(b, index) in budgets"
        :key="b.category"
        class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
      >
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xl border border-slate-100"
            >
              {{ b.icon }}
            </div>
            <div>
              <h3 class="font-bold text-slate-900">{{ b.category }}</h3>
              <p
                v-if="b.spent > b.limit"
                class="text-xs text-red-500 font-bold"
              >
                Przekroczono o {{ b.spent - b.limit }} PLN!
              </p>
              <p v-else class="text-xs text-slate-500">
                Zostało {{ b.limit - b.spent }} PLN
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-slate-900">
              {{ b.spent }}
              <span class="text-sm font-normal text-slate-500"
                >/ {{ b.limit }} PLN</span
              >
            </p>
          </div>
        </div>

        <div
          class="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden"
        >
          <div
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :class="getProgressColor(b.spent, b.limit)"
            :style="{ width: `${getPercentage(b.spent, b.limit)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
