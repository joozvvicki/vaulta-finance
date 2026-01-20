<script setup lang="ts">
import { useTransactionStore } from "~/stores/transactions";
import { ref, watch, computed, reactive } from "vue";
import { IconBasketPlus, IconPlus } from "@tabler/icons-vue";

definePageMeta({ layout: "dashboard" });

const store = useTransactionStore();
const { profile, isLoading: isProfileLoading } = useProfile();

const isLoading = computed(() => store.isLoading || isProfileLoading.value);

const isTransactionModalOpen = ref(false);
const initialCategory = ref("Inne");
const isEditBalanceOpen = ref(false);
const isTransferModalOpen = ref(false);
const isFastTransferModalOpen = ref(false);
const period = ref<"7d" | "30d">("7d");

const CountUp = defineComponent({
  props: {
    to: { type: Number, required: true },
    duration: { type: Number, default: 600 },
  },
  setup(props) {
    const current = ref(0);

    watch(
      () => props.to,
      (newVal) => {
        animateValue(0, newVal, props.duration);
      },
      { immediate: true },
    );

    function animateValue(start: number, end: number, duration: number) {
      if (start === end) return;
      const range = end - start;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Easing function (easeOutExpo) dla płynniejszego efektu
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        current.value = start + range * ease;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          current.value = end; // Upewnij się, że kończymy na dokładnej liczbie
        }
      };
      window.requestAnimationFrame(step);
    }

    return () =>
      h(
        "span",
        current.value.toLocaleString("pl-PL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
  },
});

// --- AKCJE ---
const openNewTransaction = (category = "Inne") => {
  initialCategory.value = category;
  isTransactionModalOpen.value = true;
};

// Edycja Balansu
const newBalanceInput = ref("");
const editingTarget = ref<"main" | "savings">("main");

const openEditBalance = (target: "main" | "savings") => {
  editingTarget.value = target;
  if (target === "main") {
    newBalanceInput.value = store.totalWealth.toFixed(2);
  } else {
    newBalanceInput.value = (profile.value.saved_balance || 0).toFixed(2);
  }
  isEditBalanceOpen.value = true;
};

const saveBalance = async () => {
  const val = parseFloat(newBalanceInput.value.replace(",", "."));
  if (isNaN(val)) return;

  if (editingTarget.value === "main") {
    await store.setTotalBalance(val);
  } else {
    await store.setSavedBalance(val);
  }
  isEditBalanceOpen.value = false;
};

const stats = computed(() => [
  {
    name: "Całkowite środki",
    rawValue: Number(store.totalWealth),
    currency: "PLN",
    change: "Suma",
    icon: "💰",
    isEditable: true,
    editTarget: "main",
  },
  {
    name: "Wydatki (Miesiąc)",
    rawValue: Number(store.monthlyExpenses),
    currency: "PLN",
    change: "Bieżące",
    icon: "📉",
    isEditable: false,
  },
  {
    name: "Oszczędności",
    rawValue: Number(profile.value.saved_balance || 0),
    currency: "PLN",
    change: "Skarbonka",
    icon: "🐷",
    isEditable: true,
    editTarget: "savings",
  },
]);
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <div v-if="isLoading" class="space-y-2">
          <div class="h-10 w-64 bg-slate-200 animate-pulse rounded-xl"></div>
          <div class="h-5 w-48 bg-slate-100 animate-pulse rounded-lg"></div>
        </div>
        <div v-else>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
            Cześć, {{ profile.full_name?.split(" ")[0] || "Użytkowniku" }}! 👋
          </h1>
          <p class="text-slate-500 mt-1">Oto podsumowanie Twoich finansów.</p>
        </div>
      </div>

      <div class="gap-3 hidden md:flex">
        <button
          @click="isTransferModalOpen = true"
          :disabled="isLoading"
          class="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
        >
          Szybki przelew
        </button>
        <button
          @click="openNewTransaction()"
          :disabled="isLoading"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition disabled:opacity-50"
        >
          <span>+</span> Nowa transakcja
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <template v-if="isLoading">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[140px] flex flex-col justify-between"
        >
          <div class="flex justify-between">
            <div class="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div class="w-16 h-6 bg-slate-100 rounded-lg animate-pulse"></div>
          </div>
          <div>
            <div class="w-24 h-4 bg-slate-100 rounded animate-pulse mb-2"></div>
            <div class="w-40 h-8 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group transition-all hover:shadow-md"
        >
          <div class="flex justify-between items-start mb-4">
            <div
              class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-inner"
            >
              {{ stat.icon }}
            </div>
            <span
              class="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500 uppercase tracking-wider"
            >
              {{ stat.change }}
            </span>
          </div>

          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {{ stat.name }}
          </p>
          <div class="mt-1 flex items-baseline gap-1">
            <span class="text-3xl font-black text-slate-900 tracking-tighter">
              <CountUp :to="stat.rawValue" />
            </span>
            <span class="text-xs text-slate-400 font-bold uppercase">{{
              stat.currency
            }}</span>

            <button
              v-if="stat.isEditable"
              @click="openEditBalance(stat.editTarget as 'main' | 'savings')"
              class="text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all ml-2 p-1"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="isEditBalanceOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 border border-slate-100"
      >
        <h3 class="font-bold text-xl text-slate-900 mb-2">
          {{
            editingTarget === "main"
              ? "Skoryguj stan konta"
              : "Edytuj oszczędności"
          }}
        </h3>
        <p class="text-sm text-slate-500 mb-6 leading-relaxed">
          Zaktualizuj kwotę ręcznie. System wyliczy różnicę i zapisze ją w Twoim
          profilu Supabase.
        </p>

        <div class="relative mb-8">
          <input
            v-model="newBalanceInput"
            type="text"
            class="w-full text-4xl font-black text-slate-900 border-b-2 border-slate-100 focus:border-blue-600 outline-none py-3 text-center transition"
            autofocus
          />
          <span
            class="absolute right-0 bottom-4 text-slate-400 font-bold text-xs uppercase"
            >PLN</span
          >
        </div>

        <div class="flex flex-col gap-2">
          <button
            @click="saveBalance"
            class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
          >
            Zapisz zmiany
          </button>
          <button
            @click="isEditBalanceOpen = false"
            class="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8"
      >
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-lg text-slate-900 uppercase tracking-tight">
            Analiza Salda
          </h3>
          <select
            :disabled="isLoading"
            class="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-xl px-4 py-2 focus:ring-0 cursor-pointer hover:bg-slate-100 uppercase"
            v-model="period"
          >
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatni miesiąc</option>
          </select>
        </div>

        <div
          v-if="isLoading"
          class="h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-end p-8 gap-4"
        >
          <div class="w-full bg-slate-200 h-[20%] rounded-t-lg"></div>
          <div class="w-full bg-slate-200 h-[40%] rounded-t-lg"></div>
          <div class="w-full bg-slate-200 h-[30%] rounded-t-lg"></div>
          <div class="w-full bg-slate-200 h-[60%] rounded-t-lg"></div>
          <div class="w-full bg-slate-200 h-[50%] rounded-t-lg"></div>
          <div class="w-full bg-slate-200 h-[70%] rounded-t-lg"></div>
          <div class="w-full bg-slate-200 h-[80%] rounded-t-lg"></div>
        </div>

        <BalanceChart v-else :period="period" />
      </div>

      <div
        class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
      >
        <div
          class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30"
        >
          <h3 class="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Ostatnie operacje
          </h3>
        </div>

        <div class="flex-1 overflow-y-auto max-h-[450px]">
          <template v-if="isLoading">
            <div
              v-for="j in 5"
              :key="j"
              class="px-6 py-4 flex items-center justify-between border-b border-slate-50"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"
                ></div>
                <div class="space-y-2">
                  <div
                    class="w-24 h-3 bg-slate-100 rounded animate-pulse"
                  ></div>
                  <div class="w-16 h-2 bg-slate-50 rounded animate-pulse"></div>
                </div>
              </div>
              <div class="w-16 h-4 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </template>

          <template v-else>
            <div
              v-if="store.recentTransactions.length === 0"
              class="p-12 text-center text-slate-400 text-sm"
            >
              Brak ostatnich transakcji.
            </div>
            <div
              v-for="t in store.recentTransactions"
              :key="t.id"
              class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm"
                >
                  {{ t.icon || "🧾" }}
                </div>
                <div class="overflow-hidden">
                  <p
                    class="text-sm font-bold text-slate-900 truncate max-w-[140px]"
                  >
                    {{ t.merchant }}
                  </p>
                  <p
                    class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
                  >
                    {{ t.category }}
                  </p>
                </div>
              </div>
              <span
                :class="[
                  'font-bold text-sm tracking-tight',
                  t.amount > 0 ? 'text-green-600' : 'text-slate-900',
                ]"
              >
                {{ t.amount > 0 ? "+" : "" }}{{ Number(t.amount).toFixed(2) }}
              </span>
            </div>
          </template>
        </div>

        <div class="p-4 bg-slate-50/50">
          <NuxtLink
            to="/app/transakcje"
            class="block w-full text-center py-3 text-xs font-bold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 transition shadow-sm"
          >
            PEŁNA HISTORIA
          </NuxtLink>
        </div>
      </div>
    </div>

    <button
      @click="openNewTransaction()"
      :disabled="isLoading"
      class="fixed bottom-24 right-4 active:scale-90 duration-300 md:hidden bg-blue-600 text-white px-4 py-4 rounded-full text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition disabled:opacity-50"
    >
      <IconPlus />
    </button>

    <button
      @click="isFastTransferModalOpen = true"
      :disabled="isLoading"
      class="fixed md:hidden bg-white text-slate-700 bottom-24 right-20 border border-slate-200 px-2 py-2 rounded-full text-sm font-bold hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
    >
      <IconBasketPlus />
    </button>

    <ModalFastTransaction
      :is-open="isFastTransferModalOpen"
      @close="isFastTransferModalOpen = false"
    />

    <ModalTransaction
      :is-open="isTransactionModalOpen"
      :initial-category="initialCategory"
      @close="isTransactionModalOpen = false"
    />
  </div>
</template>
