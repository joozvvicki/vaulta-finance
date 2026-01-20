<script setup lang="ts">
import { ref, computed } from "vue";
import { useTransactionStore, type Transaction } from "~/stores/transactions";

definePageMeta({ layout: "dashboard" });

const store = useTransactionStore();

const isTransactionModalOpen = ref(false);
const editingId = ref<string | number | null>(null);

const openAddModal = () => {
  editingId.value = null;
  isTransactionModalOpen.value = true;
};

const openEditModal = (t: Transaction) => {
  editingId.value = t.id;
  isTransactionModalOpen.value = true;
};

const searchQuery = ref("");
const statusFilter = ref("Wszystkie");

const filteredTransactions = computed(() => {
  return store.sortedTransactions.filter((t) => {
    const statusMatch =
      statusFilter.value === "Wszystkie" ||
      (statusFilter.value === "Zakończone" && t.status === "Completed") ||
      (statusFilter.value === "Oczekujące" && t.status === "Pending");

    const searchMatch =
      !searchQuery.value ||
      t.merchant.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.amount.toString().includes(searchQuery.value);

    return statusMatch && searchMatch;
  });
});

const isImportModalOpen = ref(false);
const isImporting = ref(false);

const handleImportedData = async (newTransactions: any[]) => {
  if (newTransactions.length === 0) return;

  isImporting.value = true;
  const client = useSupabaseClient();

  const {
    data: { user },
  } = await client.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    alert("Błąd: Nie znaleziono sesji użytkownika. Zaloguj się ponownie.");
    isImporting.value = false;
    return;
  }

  const formatDateForDb = (dateStr: string) => {
    if (!dateStr) return new Date().toISOString().split("T")[0];
    if (dateStr.includes(".")) {
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  try {
    const toInsert = newTransactions.map((t) => ({
      user_id: userId,
      date: formatDateForDb(t.date),
      merchant: t.merchant,
      amount: t.amount,
      category: t.category,
      description: t.description || "",
      status: t.status || "Completed",
      currency: t.currency || "PLN",
      icon: t.icon,
    }));

    const { error } = await client.from("transactions").insert(toInsert);

    if (error) throw error;

    await store.fetchTransactions();
    isImportModalOpen.value = false;
    alert(`Sukces! Zaimportowano ${newTransactions.length} transakcji.`);
  } catch (e: any) {
    console.error("Błąd RLS/Bazy:", e.message);
    alert("Błąd uprawnień: " + e.message);
  } finally {
    isImporting.value = false;
  }
};

const handleDelete = (id: string) => {
  if (confirm("Czy na pewno usunąć tę transakcję?")) {
    store.removeTransaction(id);
  }
};

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
    <div
      class="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Historia Transakcji</h1>
        <p class="text-slate-500">Przeglądaj i filtruj swoje wydatki.</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="isImportModalOpen = true"
          :disabled="store.isLoading"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
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
          :disabled="store.isLoading"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50"
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
      class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]"
    >
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead
            class="bg-slate-50 text-slate-500 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-6 py-4 whitespace-nowrap">Nazwa</th>
              <th class="px-6 py-4 whitespace-nowrap">Kategoria</th>
              <th class="px-6 py-4 whitespace-nowrap">Data</th>
              <th class="px-6 py-4 whitespace-nowrap">Status</th>
              <th class="px-6 py-4 whitespace-nowrap text-right">Kwota</th>
              <th class="px-6 py-4 w-10"></th>
            </tr>
          </thead>

          <tbody v-if="store.isLoading" class="divide-y divide-slate-100">
            <tr v-for="i in 6" :key="i" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="h-3 w-24 bg-slate-200 rounded"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-3 w-20 bg-slate-100 rounded"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-3 w-20 bg-slate-200 rounded"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-5 w-16 bg-slate-200 rounded-full"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 w-24 bg-slate-200 rounded ml-auto"></div>
              </td>
              <td class="px-6 py-4"></td>
            </tr>
          </tbody>

          <TransitionGroup
            v-else
            name="list"
            tag="tbody"
            class="divide-y divide-slate-100"
          >
            <tr
              v-for="t in filteredTransactions"
              :key="t.id"
              class="hover:bg-slate-50 transition-colors group cursor-pointer"
              @click="openEditModal(t)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
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
              <td class="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                <span class="px-2 py-1 bg-slate-100 rounded text-xs">{{
                  t.category
                }}</span>
              </td>
              <td class="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                {{ t.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
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
                  'px-6 py-4 text-right font-bold whitespace-nowrap',
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
          </TransitionGroup>
        </table>
      </div>
      <div
        v-if="!store.isLoading && filteredTransactions.length === 0"
        class="flex flex-col items-center justify-center py-24"
      >
        <div class="text-4xl mb-4">🏜️</div>
        <p class="text-slate-500 font-medium">
          Brak transakcji spełniających kryteria.
        </p>
      </div>

      <div
        class="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 mt-auto"
      >
        <p v-if="store.isLoading">Odświeżanie...</p>
        <p v-else>
          Pokazano {{ filteredTransactions.length }} z
          {{ store.transactions.length }}
        </p>
      </div>
    </div>

    <div
      v-if="isImportModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
        v-motion-pop
      >
        <div
          class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <div>
            <h3 class="font-bold text-lg text-slate-900">Importuj historię</h3>
            <p class="text-xs text-slate-500">
              Obsługa formatów: Pekao, PKO BP
            </p>
          </div>
          <button
            @click="isImportModalOpen = false"
            class="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div class="p-8">
          <div v-if="isImporting" class="py-12 text-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
            ></div>
            <p class="text-sm font-bold text-slate-900">
              Zapisywanie w chmurze...
            </p>
            <p class="text-xs text-slate-500 mt-1">
              To może potrwać chwilę przy dużej ilości danych.
            </p>
          </div>

          <TransactionImport v-else @imported="handleImportedData" />
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
/* Animacje dla listy transakcji */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
</style>
