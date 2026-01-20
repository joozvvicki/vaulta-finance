<script setup lang="ts">
import { computed, ref, reactive, onMounted } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { useBudgetStore } from "~/stores/budget";
import { startOfMonth, isAfter, parseISO, parse, isValid } from "date-fns";
import { IconSettings } from "@tabler/icons-vue";

definePageMeta({ layout: "dashboard" });

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();

onMounted(() => {
  budgetStore.fetchCategories();
  transactionStore.fetchTransactions();
});

const isLoading = computed(
  () => budgetStore.isLoading || transactionStore.isLoading,
);

const isManageModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  category: "",
  limit: 0,
  icon: "",
  keywordsStr: "",
});

const openManageModal = () => {
  isManageModalOpen.value = true;
  isEditing.value = false;
};

const startAdding = () => {
  form.category = "";
  form.limit = 500;
  form.icon = "💰";
  form.keywordsStr = "";
  isEditing.value = true;
  editingId.value = null;
};

const startEditing = (id: string) => {
  const item = budgetStore.categories.find((c) => c.id === id);
  if (!item) return;

  form.category = item.category;
  form.limit = item.limit;
  form.icon = item.icon;
  form.keywordsStr = item.keywords ? item.keywords.join(", ") : "";
  isEditing.value = true;
  editingId.value = id;
};

const saveCategory = async () => {
  if (!form.category) return;

  const keywordsArray = form.keywordsStr
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  const payload = {
    category: form.category,
    limit: Number(form.limit),
    icon: form.icon || "📦",
    keywords: keywordsArray,
  };

  if (editingId.value) {
    await budgetStore.updateCategory(editingId.value, payload);
  } else {
    await budgetStore.addCategory(payload);
  }

  isEditing.value = false;
};

const deleteCategory = async (id: string) => {
  if (confirm("Czy na pewno chcesz usunąć tę kategorię budżetową?")) {
    await budgetStore.deleteCategory(id);
  }
};

// --- LOGIKA OBLICZEŃ ---

const parseDateSafe = (dateStr: string) => {
  if (!dateStr) return new Date();
  let date = parseISO(dateStr);
  if (isValid(date)) return date;
  date = parse(dateStr, "dd.MM.yyyy", new Date());
  if (isValid(date)) return date;
  return new Date();
};

// Główna logika łączenia budżetów z transakcjami
const budgets = computed(() => {
  const firstDayOfMonth = startOfMonth(new Date());

  return budgetStore.categories.map((b) => {
    const spentInThisCategory = transactionStore.transactions
      .filter((t) => {
        // Ignorujemy przychody
        if (Number(t.amount) >= 0) return false;

        // Sprawdzamy datę (tylko bieżący miesiąc)
        const tDate = parseDateSafe(t.date);
        const isCurrentMonth =
          isAfter(tDate, firstDayOfMonth) ||
          tDate.getTime() === firstDayOfMonth.getTime();
        if (!isCurrentMonth) return false;

        const cat = t.category.toLowerCase();
        const merch = t.merchant.toLowerCase();

        const keywords = b.keywords || [];

        const matches =
          keywords.some(
            (k) =>
              cat.includes(k.toLowerCase()) || merch.includes(k.toLowerCase()),
          ) || cat === b.category.toLowerCase();

        return matches;
      })
      .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

    return {
      ...b,
      spent: spentInThisCategory,
    };
  });
});

const totalStats = computed(() => {
  const totalLimit = budgets.value.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.value.reduce((acc, b) => acc + b.spent, 0);
  const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return {
    limit: totalLimit,
    spent: totalSpent,
    percentage: Math.min(percentage, 100),
    remaining: totalLimit - totalSpent,
  };
});

const getPercentage = (spent: number, limit: number) =>
  Math.min((spent / limit) * 100, 100);

const getProgressColor = (spent: number, limit: number) => {
  const p = (spent / limit) * 100;
  if (p > 100) return "bg-red-500";
  if (p > 80) return "bg-orange-400";
  return "bg-white";
};

const getBarColor = (spent: number, limit: number) => {
  const p = (spent / limit) * 100;
  if (p > 100) return "bg-red-500";
  if (p > 80) return "bg-yellow-500";
  return "bg-blue-600";
};
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Twój Budżet</h1>
        <p class="text-slate-500">Monitoruj wydatki w bieżącym miesiącu.</p>
      </div>

      <button
        @click="openManageModal"
        :disabled="isLoading"
        class="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Zarządzaj
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div
        v-if="isLoading"
        class="rounded-2xl p-6 bg-slate-200 h-48 animate-pulse relative overflow-hidden"
      >
        <div class="h-4 w-32 bg-slate-300 rounded mb-4"></div>
        <div class="h-8 w-48 bg-slate-300 rounded mb-8"></div>
        <div class="h-3 w-full bg-slate-300 rounded-full mb-4"></div>
        <div class="flex justify-between">
          <div class="h-3 w-24 bg-slate-300 rounded"></div>
          <div class="h-3 w-24 bg-slate-300 rounded"></div>
        </div>
      </div>

      <div
        v-else
        class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"
        ></div>

        <p class="text-blue-200 text-sm font-medium mb-1 relative z-10">
          Całkowity budżet
        </p>
        <div class="flex items-baseline gap-2 relative z-10">
          <h2 class="text-3xl font-bold">
            {{ totalStats.limit.toLocaleString("pl-PL") }} PLN
          </h2>
          <span class="text-blue-200 text-sm">planowane</span>
        </div>

        <div
          class="mt-6 w-full bg-black/20 rounded-full h-3 relative z-10 backdrop-blur-sm"
        >
          <div
            class="h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
            :class="getProgressColor(totalStats.spent, totalStats.limit)"
            :style="{ width: `${totalStats.percentage}%` }"
          ></div>
        </div>

        <div
          class="flex justify-between mt-3 text-xs text-blue-100 relative z-10 font-medium"
        >
          <span>Wydano: {{ totalStats.spent.toLocaleString("pl-PL") }} zł</span>
          <span
            >Pozostało:
            {{ totalStats.remaining.toLocaleString("pl-PL") }} zł</span
          >
        </div>
      </div>
    </div>

    <div class="grid gap-6">
      <template v-if="isLoading">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-200"></div>
              <div>
                <div class="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                <div class="h-3 w-24 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div class="text-right">
              <div class="h-5 w-24 bg-slate-200 rounded mb-1 ml-auto"></div>
              <div class="h-3 w-16 bg-slate-100 rounded ml-auto"></div>
            </div>
          </div>
          <div class="w-full h-3 bg-slate-100 rounded-full"></div>
        </div>
      </template>

      <TransitionGroup name="list" tag="div" class="grid gap-6">
        <div
          v-for="b in budgets"
          :key="b.id"
          class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shadow-sm"
              >
                {{ b.icon }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-lg">
                  {{ b.category }}
                </h3>
                <p
                  v-if="b.spent > b.limit"
                  class="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1"
                >
                  ⚠️ Przekroczono o {{ (b.spent - b.limit).toFixed(2) }} PLN
                </p>
                <p
                  v-else-if="b.spent === 0"
                  class="text-xs text-slate-400 mt-1"
                >
                  Brak wydatków w tym miesiącu
                </p>
                <p v-else class="text-xs text-green-600 font-medium mt-1">
                  W normie ({{ ((b.spent / b.limit) * 100).toFixed(0) }}%)
                </p>
              </div>
            </div>

            <div class="text-right">
              <p class="text-xl font-bold text-slate-900">
                {{
                  b.spent.toLocaleString("pl-PL", { minimumFractionDigits: 2 })
                }}
              </p>
              <p class="text-xs text-slate-500 font-medium">
                z {{ b.limit.toLocaleString("pl-PL") }} PLN
              </p>
            </div>
          </div>

          <div
            class="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :class="getBarColor(b.spent, b.limit)"
              :style="{ width: `${getPercentage(b.spent, b.limit)}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div
      v-if="!isLoading && transactionStore.transactions.length === 0"
      class="text-center py-12 text-slate-400"
    >
      <p>
        Zaimportuj transakcje w zakładce "Transakcje", aby zobaczyć realizację
        budżetu.
      </p>
      <NuxtLink
        to="/app/transakcje"
        class="text-blue-600 font-bold hover:underline mt-2 inline-block"
        >Przejdź do transakcji</NuxtLink
      >
    </div>

    <button
      @click="openManageModal()"
      :disabled="isLoading"
      class="fixed bottom-24 right-4 active:scale-90 duration-300 md:hidden bg-blue-600 text-white px-4 py-4 rounded-full text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition disabled:opacity-50"
    >
      <IconSettings />
    </button>

    <ModalBudgetManage
      :is-open="isManageModalOpen"
      @close="isManageModalOpen = false"
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

/* Animacje listy */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
