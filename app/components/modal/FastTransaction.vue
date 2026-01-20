<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useTransactionStore } from "~/stores/transactions";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "sent"]);

const store = useTransactionStore();
const isSending = ref(false);

const form = reactive({
  recipient: "",
  title: "",
  amount: "",
});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentTranslateY.value = 0;
      form.recipient = "";
      form.title = "";
      form.amount = "";
      isSending.value = false;
    }
  },
);

const handleTransfer = async () => {
  if (!form.recipient || !form.amount || !form.title) return;

  isSending.value = true;

  await new Promise((resolve) => setTimeout(resolve, 800));

  const amountValue = parseFloat(form.amount.replace(",", "."));

  store.addTransaction({
    id: Date.now().toString(),
    merchant: form.recipient,
    amount: -Math.abs(amountValue),
    date: new Date().toISOString().split("T")[0],
    category: "Przelew",
    status: "Completed",
    currency: "PLN",
    description: form.title,
    icon: "💸",
  });

  isSending.value = false;
  emit("sent");
  emit("close");
};

const touchStartY = ref(0);
const currentTranslateY = ref(0);
const isDragging = ref(false);

const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY;
  isDragging.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const currentY = e.touches[0].clientY;
  const delta = currentY - touchStartY.value;

  if (delta > 0) {
    currentTranslateY.value = delta;
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;

  if (currentTranslateY.value > 150) {
    emit("close");
  } else {
    currentTranslateY.value = 0;
  }
};
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex justify-center p-0 md:p-4 items-end md:items-center"
    >
      <div
        class="backdrop absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <div
        class="modal-card relative bg-white w-full md:w-full md:max-w-md flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl will-change-transform"
        :style="{
          transform:
            isDragging || currentTranslateY > 0
              ? `translateY(${currentTranslateY}px)`
              : '',
        }"
        :class="{ 'transition-transform duration-300': !isDragging }"
      >
        <div
          class="touch-none bg-white cursor-grab active:cursor-grabbing border-b border-slate-50"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="md:hidden w-full flex justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div class="px-8 pt-4 pb-4 flex justify-between items-center">
            <h3 class="font-bold text-xl text-slate-900">Szybki przelew</h3>
            <button
              @click="$emit('close')"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="p-8 pt-6 overflow-y-auto custom-scrollbar">
          <div class="space-y-5">
            <div>
              <label
                class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider"
              >
                Odbiorca
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >👤</span
                >
                <input
                  v-model="form.recipient"
                  placeholder="Np. Jan Kowalski"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider"
              >
                Tytuł przelewu
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >✏️</span
                >
                <input
                  v-model="form.title"
                  placeholder="Np. Rozliczenie za pizzę"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider"
              >
                Kwota (PLN)
              </label>
              <div class="relative">
                <input
                  v-model="form.amount"
                  type="number"
                  placeholder="0.00"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-2xl font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4">
            <button
              @click="handleTransfer"
              :disabled="isSending || !form.amount || !form.recipient"
              class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span
                v-if="isSending"
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
              ></span>
              {{ isSending ? "Przetwarzanie..." : "Wyślij środki" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Te same style animacji co w poprzednim modalu - dla spójności */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-active .backdrop,
.slide-up-leave-active .backdrop {
  transition: opacity 0.3s ease;
}

.slide-up-enter-active .modal-card,
.slide-up-leave-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from .backdrop,
.slide-up-leave-to .backdrop {
  opacity: 0;
}

/* === MOBILE === */
.slide-up-enter-from .modal-card {
  transform: translateY(100%);
}
.slide-up-leave-to .modal-card {
  transform: translateY(100%) !important;
}

/* === DESKTOP === */
@media (min-width: 768px) {
  .slide-up-enter-from .modal-card,
  .slide-up-leave-to .modal-card {
    transform: scale(0.95) !important;
    opacity: 0;
  }
}
</style>
