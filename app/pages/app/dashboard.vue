<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const stats = ref([
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
]);

const recentTransactions = ref([
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
]);

const isTransferModalOpen = ref(false);
const isSending = ref(false);

const transferForm = reactive({
  recipient: "",
  title: "",
  amount: "",
});

const openTransferModal = () => {
  isTransferModalOpen.value = true;
  // Reset formularza
  transferForm.recipient = "";
  transferForm.title = "";
  transferForm.amount = "";
};

const handleTransfer = async () => {
  if (!transferForm.recipient || !transferForm.amount) return;

  isSending.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const amountValue = parseFloat(transferForm.amount);
  const formattedAmount = `-${amountValue.toFixed(2)} PLN`;

  recentTransactions.value.unshift({
    id: Date.now(),
    to: transferForm.recipient,
    date: "Przed chwilą",
    amount: formattedAmount,
    category: "Przelew",
    icon: "💸",
  });

  let currentBalance = parseFloat(stats.value[0].value);
  currentBalance -= amountValue;
  stats.value[0].value = currentBalance;

  isSending.value = false;
  isTransferModalOpen.value = false;
};
</script>

<template>
  <div class="relative">
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
        @click="openTransferModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
      >
        <span>+</span> Nowy przelew
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
          <TransitionGroup name="list" tag="div">
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
          </TransitionGroup>
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

    <Transition name="modal">
      <div
        v-if="isTransferModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="isTransferModalOpen = false"
        ></div>

        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center"
          >
            <h3 class="font-bold text-lg text-slate-900">Nowy przelew</h3>
            <button
              @click="isTransferModalOpen = false"
              class="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Odbiorca</label
              >
              <input
                v-model="transferForm.recipient"
                type="text"
                placeholder="Np. Jan Kowalski"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Tytuł przelewu</label
              >
              <input
                v-model="transferForm.title"
                type="text"
                placeholder="Np. Rozliczenie za obiad"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Kwota (PLN)</label
              >
              <div class="relative">
                <input
                  v-model="transferForm.amount"
                  type="number"
                  placeholder="0.00"
                  class="w-full pl-4 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono font-bold text-slate-900"
                />
                <span
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium"
                  >PLN</span
                >
              </div>
            </div>

            <div class="text-xs text-slate-500 text-right">
              Dostępne środki:
              <span class="font-bold text-slate-700"
                >{{ stats[0].value }} PLN</span
              >
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 flex gap-3 justify-end">
            <button
              @click="isTransferModalOpen = false"
              class="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
            >
              Anuluj
            </button>
            <button
              @click="handleTransfer"
              :disabled="isSending"
              class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="isSending" class="animate-spin mr-2">⚪</span>
              {{ isSending ? "Wysyłanie..." : "Wyślij przelew" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Animacje Modala */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  scale: 0.95;
  transform: translateY(10px);
}

/* Animacja listy (Vue TransitionGroup) */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
