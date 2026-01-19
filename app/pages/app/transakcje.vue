<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useTransactionStore, type Transaction } from "~/stores/transactions";
import { format } from "date-fns";

definePageMeta({ layout: "dashboard" });

const store = useTransactionStore();

const isTransactionModalOpen = ref(false);
const editingId = ref<string | number | null>(null);

// Otwieranie modala dodawania
const openAddModal = () => {
  editingId.value = null;
  isTransactionModalOpen.value = true;
};

// Otwieranie modala edycji
const openEditModal = (t: Transaction) => {
  editingId.value = t.id;
  isTransactionModalOpen.value = true;
};

// --- FILTROWANIE I WYSZUKIWANIE ---
const searchQuery = ref("");
const statusFilter = ref("Wszystkie");

// Pobieramy posortowane transakcje ze Store i filtrujemy lokalnie
const filteredTransactions = computed(() => {
  return store.sortedTransactions.filter((t) => {
    // 1. Filtr Statusu
    const statusMatch =
      statusFilter.value === "Wszystkie" ||
      (statusFilter.value === "Zakończone" && t.status === "Completed") ||
      (statusFilter.value === "Oczekujące" && t.status === "Pending");

    // 2. Wyszukiwarka (case insensitive)
    const searchMatch =
      !searchQuery.value ||
      t.merchant.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.amount.toString().includes(searchQuery.value);

    return statusMatch && searchMatch;
  });
});

// --- IMPORT ---
const isImportModalOpen = ref(false);
const handleImportedData = (newTransactions: any[]) => {
  store.importTransactions(newTransactions);
  isImportModalOpen.value = false;
  alert(`Pomyślnie zaimportowano ${newTransactions.length} transakcji!`);
};

const handleDelete = (id: string | number) => {
  if (confirm("Czy na pewno usunąć tę transakcję?")) {
    store.removeTransaction(id);
  }
};

// --- UI HELPERS ---
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

const getIconByCategory = (cat: string) => {
  switch (cat) {
    case "Jedzenie":
      return "🍔";
    case "Transport":
      return "🚗";
    case "Rozrywka":
      return "🍿";
    case "Zdrowie":
      return "💊";
    case "Rachunki":
      return "💡";
    case "Wynagrodzenie":
      return "💰";
    default:
      return "💸";
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
          @click="isImportModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Import CSV
        </button>

        <button
          @click="openAddModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <span>+</span> Dodaj ręcznie
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
          placeholder="Szukaj transakcji (sklep, kwota, kategoria)..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option>Wszystkie</option>
        <option>Zakończone</option>
        <option>Oczekujące</option>
      </select>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]"
    >
      <table class="w-full text-left border-collapse">
        <thead
          class="bg-slate-50 text-slate-500 uppercase text-xs font-semibold"
        >
          <tr>
            <th class="px-6 py-4">Nazwa</th>
            <th class="px-6 py-4">Kategoria</th>
            <th class="px-6 py-4">Data</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Kwota</th>
            <th class="px-6 py-4 w-10"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(t, index) in filteredTransactions"
            :key="t.id"
            class="hover:bg-slate-50 transition group cursor-pointer"
            @click="openEditModal(t)"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm"
                >
                  {{ t.icon || getIconByCategory(t.category) }}
                </div>
                <div>
                  <span class="font-medium text-slate-900 block">{{
                    t.merchant
                  }}</span>
                  <span
                    v-if="t.description"
                    class="text-xs text-slate-400 truncate max-w-[200px] block"
                    >{{ t.description }}</span
                  >
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-600 text-sm">
              <span class="px-2 py-1 bg-slate-100 rounded text-xs">{{
                t.category
              }}</span>
            </td>
            <td class="px-6 py-4 text-slate-500 text-sm">{{ t.date }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-bold',
                  statusColor(t.status),
                ]"
              >
                {{ t.status === "Completed" ? "Zakończone" : "Oczekujące" }}
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
            <td class="px-4 py-4 text-right">
              <button
                @click.stop="handleDelete(t.id)"
                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Usuń"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredTransactions.length === 0"
        class="p-12 text-center text-slate-500"
      >
        Brak transakcji spełniających kryteria.
      </div>

      <div
        class="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500"
      >
        <p>
          Pokazano {{ filteredTransactions.length }} z
          {{ store.transactions.length }}
        </p>
      </div>
    </div>

    <div
      v-if="isImportModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        v-motion-pop
      >
        <div
          class="p-6 border-b border-slate-100 flex justify-between items-center"
        >
          <h3 class="font-bold text-lg text-slate-900">Importuj historię</h3>
          <button
            @click="isImportModalOpen = false"
            class="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-slate-500 mb-6">
            Pobierz plik CSV ze strony swojego banku i wgraj go tutaj.
          </p>
          <TransactionImport @imported="handleImportedData" />
        </div>
      </div>
    </div>

    <ModalTransaction
      :is-open="isTransactionModalOpen"
      :edit-id="editingId"
      @close="isTransactionModalOpen = false"
    />
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
