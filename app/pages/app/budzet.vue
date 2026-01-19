<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { useLocalStorage } from "@vueuse/core";
import { startOfMonth, isAfter, parseISO, parse, isValid } from "date-fns";

definePageMeta({ layout: "dashboard" });

const store = useTransactionStore();

const budgetConfig = useLocalStorage("user-budget-config", [
  {
    category: "Jedzenie",
    limit: 1500,
    icon: "🍔",
    keywords: [
      "jedzenie",
      "restauracja",
      "sklep",
      "zakupy",
      "żabka",
      "biedronka",
      "lidl",
    ],
  },
  {
    category: "Transport",
    limit: 400,
    icon: "🚗",
    keywords: ["paliwo", "uber", "bolt", "bilet", "orlen", "transport", "mpk"],
  },
  {
    category: "Rozrywka",
    limit: 500,
    icon: "🍿",
    keywords: ["kino", "netflix", "spotify", "gra", "rozrywka", "steam"],
  },
  {
    category: "Rachunki",
    limit: 1000,
    icon: "💡",
    keywords: ["prąd", "czynsz", "internet", "telefon", "gaz", "energia"],
  },
]);

const isManageModalOpen = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);

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
  editingIndex.value = -1;
};

const startEditing = (index: number) => {
  const item: any = budgetConfig.value[index];
  form.category = item.category;
  form.limit = item.limit;
  form.icon = item.icon;
  form.keywordsStr = item.keywords.join(", ");
  isEditing.value = true;
  editingIndex.value = index;
};

const saveCategory = () => {
  if (!form.category) return;

  const newEntry = {
    category: form.category,
    limit: Number(form.limit),
    icon: form.icon || "📦",
    keywords: form.keywordsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s),
  };

  if (editingIndex.value === -1) {
    budgetConfig.value.push(newEntry);
  } else {
    budgetConfig.value[editingIndex.value] = newEntry;
  }

  isEditing.value = false;
};

const deleteCategory = (index: number) => {
  if (confirm("Czy na pewno chcesz usunąć tę kategorię budżetową?")) {
    budgetConfig.value.splice(index, 1);
  }
};

const parseDateSafe = (dateStr: string) => {
  let date = parseISO(dateStr);
  if (isValid(date)) return date;
  date = parse(dateStr, "dd.MM.yyyy", new Date());
  if (isValid(date)) return date;
  return new Date();
};

const budgets = computed(() => {
  const firstDayOfMonth = startOfMonth(new Date());

  return budgetConfig.value.map((b) => {
    const spentInThisCategory = store.transactions
      .filter((t) => {
        if (Number(t.amount) >= 0) return false;

        const tDate = parseDateSafe(t.date);
        const isCurrentMonth =
          isAfter(tDate, firstDayOfMonth) ||
          tDate.getTime() === firstDayOfMonth.getTime();
        if (!isCurrentMonth) return false;

        const cat = t.category.toLowerCase();
        const merch = t.merchant.toLowerCase();

        const matches =
          b.keywords.some(
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
        class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
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
      <div
        v-for="(b, index) in budgets"
        :key="b.category"
        class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
      >
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shadow-sm"
            >
              {{ b.icon }}
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-lg">{{ b.category }}</h3>
              <p
                v-if="b.spent > b.limit"
                class="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1"
              >
                ⚠️ Przekroczono o {{ (b.spent - b.limit).toFixed(2) }} PLN
              </p>
              <p v-else-if="b.spent === 0" class="text-xs text-slate-400 mt-1">
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
    </div>

    <div
      v-if="store.transactions.length === 0"
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

    <Transition name="modal">
      <div
        v-if="isManageModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="isManageModalOpen = false"
        ></div>

        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
          >
            <h3 class="font-bold text-lg text-slate-900">
              {{
                isEditing
                  ? editingIndex === -1
                    ? "Dodaj kategorię"
                    : "Edytuj kategorię"
                  : "Zarządzaj budżetami"
              }}
            </h3>
            <button
              @click="isManageModalOpen = false"
              class="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div v-if="!isEditing" class="p-6 overflow-y-auto flex-1">
            <div class="space-y-3 mb-6">
              <div
                v-for="(cat, idx) in budgetConfig"
                :key="cat.category"
                class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ cat.icon }}</span>
                  <div>
                    <p class="font-bold text-slate-900">{{ cat.category }}</p>
                    <p class="text-xs text-slate-500">
                      Limit: {{ cat.limit }} PLN
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="startEditing(idx)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edytuj"
                  >
                    ✏️
                  </button>
                  <button
                    @click="deleteCategory(idx)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Usuń"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="startAdding"
              class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <span>+</span> Dodaj nową kategorię
            </button>
          </div>

          <div v-else class="p-6 overflow-y-auto flex-1 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Nazwa kategorii</label
              >
              <input
                v-model="form.category"
                type="text"
                placeholder="np. Edukacja"
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Limit (PLN)</label
                >
                <input
                  v-model="form.limit"
                  type="number"
                  class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Ikona (Emoji)</label
                >
                <input
                  v-model="form.icon"
                  type="text"
                  placeholder="np. 📚"
                  class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Słowa kluczowe (oddziel przecinkami)</label
              >
              <p class="text-xs text-slate-500 mb-2">
                Służą do automatycznego przypisywania wydatków do tej kategorii.
              </p>
              <textarea
                v-model="form.keywordsStr"
                rows="3"
                placeholder="np. udemy, kurs, książka, empik"
                class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>
          </div>

          <div
            v-if="isEditing"
            class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2"
          >
            <button
              @click="isEditing = false"
              class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              Wróć
            </button>
            <button
              @click="saveCategory"
              class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
