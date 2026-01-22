<script setup lang="ts">
import { IconPlus, IconUpload } from "@tabler/icons-vue";
import { ref, computed, onMounted } from "vue";
import { useTransactionStore, type Transaction } from "~/stores/transactions";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
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
const statusFilter = ref("All"); // Używamy stałej wartości do logiki

const filteredTransactions = computed(() => {
  return store.sortedTransactions.filter((t) => {
    const statusMatch =
      statusFilter.value === "All" ||
      (statusFilter.value === "Completed" && t.status === "Completed") ||
      (statusFilter.value === "Pending" && t.status === "Pending");

    const searchMatch =
      !searchQuery.value ||
      t.merchant.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.amount.toString().includes(searchQuery.value);

    return statusMatch && searchMatch;
  });
});

const isImportModalOpen = ref(false);

const handleDelete = (id: string) => {
  if (confirm(t("transactions.table.delete_confirm"))) {
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
  const icons: Record<string, string> = {
    Jedzenie: "🍔",
    Transport: "🚗",
    Rozrywka: "🍿",
    Zdrowie: "💊",
    Rachunki: "💡",
    Wynagrodzenie: "💰",
  };
  return icons[cat] || "💸";
};

onMounted(() => {
  store.fetchTransactions();
});
</script>

<template>
  <div>
    <div
      class="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          {{ $t("transactions.title") }}
        </h1>
        <p class="text-slate-500">{{ $t("transactions.subtitle") }}</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="isImportModalOpen = true"
          :disabled="store.isLoading"
          class="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
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
          {{ $t("transactions.actions.import") }}
        </button>

        <button
          @click="openAddModal"
          :disabled="store.isLoading"
          class="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50"
        >
          <span>+</span> {{ $t("transactions.actions.add") }}
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
          :placeholder="$t('transactions.filters.search')"
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium"
      >
        <option value="All">{{ $t("transactions.filters.status.all") }}</option>
        <option value="Completed">
          {{ $t("transactions.filters.status.completed") }}
        </option>
        <option value="Pending">
          {{ $t("transactions.filters.status.pending") }}
        </option>
      </select>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]"
    >
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead
            class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider"
          >
            <tr>
              <th class="px-6 py-4">{{ $t("transactions.table.name") }}</th>
              <th class="px-6 py-4">{{ $t("transactions.table.category") }}</th>
              <th class="px-6 py-4">{{ $t("transactions.table.date") }}</th>
              <th class="px-6 py-4">{{ $t("transactions.table.status") }}</th>
              <th class="px-6 py-4 text-right">
                {{ $t("transactions.table.amount") }}
              </th>
              <th class="px-6 py-4 w-10"></th>
            </tr>
          </thead>

          <tbody v-if="store.isLoading" class="divide-y divide-slate-100">
            <tr v-for="i in 6" :key="i" class="animate-pulse">
              <td colspan="6" class="px-6 py-4">
                <div class="h-4 bg-slate-100 rounded w-full"></div>
              </td>
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
                    class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shadow-inner"
                  >
                    {{ t.icon || getIconByCategory(t.category) }}
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block text-sm">{{
                      t.merchant
                    }}</span>
                    <span
                      v-if="t.description"
                      class="text-[10px] text-slate-400 truncate max-w-[200px] block font-medium"
                      >{{ t.description }}</span
                    >
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 text-xs whitespace-nowrap">
                <span
                  class="px-2 py-1 bg-slate-100 rounded font-bold uppercase tracking-tighter"
                  >{{ t.category }}</span
                >
              </td>
              <td
                class="px-6 py-4 text-slate-500 text-xs whitespace-nowrap font-medium"
              >
                {{ t.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide',
                    statusColor(t.status),
                  ]"
                >
                  {{
                    t.status === "Completed"
                      ? $t("transactions.filters.status.completed")
                      : $t("transactions.filters.status.pending")
                  }}
                </span>
              </td>
              <td
                :class="[
                  'px-6 py-4 text-right font-black whitespace-nowrap text-sm tracking-tight',
                  t.amount > 0 ? 'text-green-600' : 'text-slate-900',
                ]"
              >
                {{ t.amount > 0 ? "+" : "" }}{{ t.amount.toFixed(2) }} PLN
              </td>
              <td class="px-4 py-4 text-right">
                <button
                  @click.stop="handleDelete(t.id.toString())"
                  class="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  :title="$t('transactions.table.delete_tooltip')"
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
        class="flex flex-col items-center justify-center py-24 flex-1"
      >
        <div class="text-4xl mb-4">🏜️</div>
        <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">
          {{ $t("transactions.empty") }}
        </p>
      </div>

      <div
        class="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-auto bg-slate-50/50"
      >
        <p v-if="store.isLoading">{{ $t("transactions.footer.loading") }}</p>
        <p v-else>
          {{
            $t("transactions.footer.showing", {
              filtered: filteredTransactions.length,
              total: store.transactions.length,
            })
          }}
        </p>
      </div>
    </div>

    <button
      @click="isImportModalOpen = true"
      class="fixed bottom-24 right-20 text-sm flex flex-col gap-3 md:hidden bg-white text-slate-700 p-2 rounded-full shadow-lg border border-slate-200"
    >
      <IconUpload />
    </button>
    <button
      @click="openAddModal()"
      class="fixed bottom-24 right-4 flex flex-col gap-3 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30"
    >
      <IconPlus />
    </button>

    <ModalImport
      :is-open="isImportModalOpen"
      @close="isImportModalOpen = false"
    />
    <ModalTransaction
      :is-open="isTransactionModalOpen"
      :edit-id="editingId"
      @close="isTransactionModalOpen = false"
    />
  </div>
</template>

<style scoped>
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
