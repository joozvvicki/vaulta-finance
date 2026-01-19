<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const searchQuery = ref("");
const statusFilter = ref("Wszystkie");

const {
  data: transactions,
  pending,
  error,
} = await useFetch("/api/transactions");

const statusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Historia Transakcji</h1>
        <p class="text-slate-500">Przeglądaj i filtruj swoje wydatki.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
        >
          Eksportuj CSV
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Dodaj ręcznie
        </button>
      </div>
    </div>

    <div
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4"
    >
      <div class="relative flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >🔍</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Szukaj transakcji..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option>Wszystkie statusy</option>
        <option>Zakończone</option>
        <option>Oczekujące</option>
      </select>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]"
    >
      <div v-if="pending" class="p-6 space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center justify-between animate-pulse"
        >
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div class="h-4 bg-slate-200 rounded w-32"></div>
          </div>
          <div class="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      </div>

      <div v-else-if="error" class="p-12 text-center text-red-500">
        Wystąpił błąd podczas pobierania transakcji. Spróbuj odświeżyć.
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50 text-slate-500 uppercase text-xs font-semibold"
        >
          <tr>
            <th class="px-6 py-4">Nazwa</th>
            <th class="px-6 py-4">Kategoria</th>
            <th class="px-6 py-4">Data</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Kwota</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(t, index) in transactions"
            :key="t.id"
            class="hover:bg-slate-50 transition"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: index * 50 } }"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm"
                >
                  {{ t.icon }}
                </div>
                <span class="font-medium text-slate-900">{{ t.merchant }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-600 text-sm">{{ t.category }}</td>
            <td class="px-6 py-4 text-slate-500 text-sm">{{ t.date }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-bold',
                  statusColor(t.status),
                ]"
              >
                {{
                  t.status === "Completed"
                    ? "Zakończone"
                    : t.status === "Pending"
                      ? "Oczekujące"
                      : "Odrzucone"
                }}
              </span>
            </td>
            <td
              :class="[
                'px-6 py-4 text-right font-bold',
                t.amount > 0 ? 'text-green-600' : 'text-slate-900',
              ]"
            >
              {{ t.amount > 0 ? "+" : "" }}{{ t.amount.toFixed(2) }} PLN
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500"
      >
        <p>Pokazano 7 z 124 wyników</p>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Poprzednia
          </button>
          <button class="px-3 py-1 border rounded hover:bg-slate-50">
            Następna
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
