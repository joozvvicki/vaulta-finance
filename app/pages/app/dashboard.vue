<script setup lang="ts">
import { useTransactionStore } from "~/stores/transactions";

definePageMeta({ layout: "dashboard" });

const isTransactionModalOpen = ref(false);
const initialCategory = ref("Inne");

const openNewTransaction = (category = "Inne") => {
  initialCategory.value = category;
  isTransactionModalOpen.value = true;
};

const store = useTransactionStore();

const isEditBalanceOpen = ref(false);
const newBalanceInput = ref("");
const editingTarget = ref<"main" | "savings">("main");

const openEditBalance = (target: "main" | "savings") => {
  editingTarget.value = target;

  if (target === "main") {
    newBalanceInput.value = store.totalWealth.toFixed(2);
  } else {
    newBalanceInput.value = store.savedBalance.toFixed(2);
  }

  isEditBalanceOpen.value = true;
};

const saveBalance = () => {
  const val = parseFloat(newBalanceInput.value.replace(",", "."));

  if (!isNaN(val)) {
    if (editingTarget.value === "main") {
      store.setTotalBalance(val - store.savedBalance);
    } else {
      store.setSavedBalance(val);
    }

    isEditBalanceOpen.value = false;
  }
};

const stats = computed(() => [
  {
    name: "Całkowite środki",
    value: store.totalWealth.toLocaleString("pl-PL", {
      minimumFractionDigits: 2,
    }),
    currency: "PLN",
    change: "+0%",
    type: "good",
    icon: "💰",
    isEditable: true,
    editTarget: "main",
  },
  {
    name: "Wydatki (Od wypłaty)",
    value: store.monthlyExpenses.toLocaleString("pl-PL", {
      minimumFractionDigits: 2,
    }),
    currency: "PLN",
    change: "Bieżące",
    type: "bad",
    icon: "📉",
    isEditable: false,
  },
  {
    name: "Oszczędności",
    value: store.savedBalance.toLocaleString("pl-PL", {
      minimumFractionDigits: 2,
    }),
    currency: "PLN",
    change: "+1.0%",
    type: "good",
    icon: "🐷",
    isEditable: true,
    editTarget: "savings",
  },
]);

const isTransferModalOpen = ref(false);
const isSending = ref(false);
const transferForm = reactive({ recipient: "", title: "", amount: "" });

const handleTransfer = async () => {
  if (!transferForm.amount) return;
  isSending.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const amountValue = parseFloat(transferForm.amount.replace(",", "."));

  store.addTransaction({
    id: Date.now(),
    merchant: transferForm.recipient || "Przelew własny",
    date: new Date().toISOString(),
    category: "Przelew",
    amount: -amountValue,
    currency: "PLN",
    status: "Completed",
    icon: "💸",
    description: transferForm.title,
  });

  isSending.value = false;
  isTransferModalOpen.value = false;
  transferForm.recipient = "";
  transferForm.title = "";
  transferForm.amount = "";
};

const period = ref<"7d" | "30d">("7d");
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
          Dzień dobry! 👋
        </h1>
        <p class="text-slate-500 mt-1">Stan Twojego portfela.</p>
      </div>
      <button
        @click="openNewTransaction('Przelew')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2"
      >
        <span>+</span> Nowa transakcja
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        v-for="(stat, index) in stats"
        :key="stat.name"
        class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group"
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl"
          >
            {{ stat.icon }}
          </div>
          <span
            class="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600"
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

          <button
            v-if="stat.isEditable"
            @click="openEditBalance(stat.editTarget as 'main' | 'savings')"
            class="text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all ml-2 p-1"
            :title="
              stat.editTarget === 'main'
                ? 'Koryguj całkowite saldo'
                : 'Koryguj oszczędności'
            "
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
    </div>

    <div
      v-if="isEditBalanceOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        v-motion-pop
      >
        <h3 class="font-bold text-lg text-slate-900 mb-2">
          {{
            editingTarget === "main"
              ? "Skoryguj całkowite środki"
              : "Edytuj oszczędności"
          }}
        </h3>
        <p class="text-sm text-slate-500 mb-4">
          {{
            editingTarget === "main"
              ? "Wpisz łączną kwotę (ROR + Oszczędności), którą posiadasz."
              : "Zaktualizuj stan swojej skarbonki / konta oszczędnościowego."
          }}
        </p>

        <div class="relative mb-6">
          <input
            v-model="newBalanceInput"
            type="text"
            class="w-full text-3xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-blue-600 outline-none py-2 text-center"
            autofocus
          />
          <span class="absolute right-0 bottom-3 text-slate-400 font-medium"
            >PLN</span
          >
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="isEditBalanceOpen = false"
            class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            Anuluj
          </button>
          <button
            @click="saveBalance"
            class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg text-slate-900">Analiza Salda</h3>
          <select
            class="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg p-2 focus:ring-0 cursor-pointer hover:bg-slate-100"
            v-model="period"
          >
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatni miesiąc</option>
          </select>
        </div>
        <BalanceChart :period="period" />
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
      >
        <div
          class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="font-bold text-slate-900">Ostatnie transakcje</h3>
        </div>

        <div class="flex-1 overflow-y-auto max-h-[400px]">
          <TransitionGroup name="list" tag="div">
            <div
              v-for="t in store.recentTransactions"
              :key="t.id"
              class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-50 last:border-0 cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg"
                >
                  {{ t.icon || "🧾" }}
                </div>
                <div>
                  <p
                    class="text-sm font-bold text-slate-900 truncate max-w-[120px]"
                  >
                    {{ t.merchant }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{ t.date.substring(0, 10) }} • {{ t.category }}
                  </p>
                </div>
              </div>
              <span
                :class="[
                  'font-bold text-sm',
                  t.amount > 0 ? 'text-green-600' : 'text-slate-900',
                ]"
              >
                {{ t.amount > 0 ? "+" : "" }}{{ t.amount.toFixed(2) }}
              </span>
            </div>
          </TransitionGroup>
        </div>

        <div class="p-4 border-t border-slate-100">
          <NuxtLink
            to="/app/transakcje"
            class="block w-full text-center py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            Zobacz pełną historię
          </NuxtLink>
        </div>
      </div>
    </div>
    <Transition name="modal">
      <div
        v-if="isTransferModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
        >
          <h3 class="font-bold text-lg">Szybki przelew</h3>
          <input
            v-model="transferForm.recipient"
            placeholder="Odbiorca"
            class="w-full border p-2 rounded"
          />
          <input
            v-model="transferForm.amount"
            placeholder="Kwota"
            type="number"
            class="w-full border p-2 rounded"
          />
          <div class="flex justify-end gap-2">
            <button
              @click="isTransferModalOpen = false"
              class="px-4 py-2 bg-slate-100 rounded"
            >
              Anuluj
            </button>
            <button
              @click="handleTransfer"
              class="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {{ isSending ? "..." : "Wyślij" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <ModalTransaction
      :is-open="isTransactionModalOpen"
      :initial-category="initialCategory"
      @close="isTransactionModalOpen = false"
    />
  </div>
</template>
