<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useTransactionStore } from "~/stores/transactions";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "sent"]);

const { t } = useI18n();
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

  // Symulacja opóźnienia bankowego
  await new Promise((resolve) => setTimeout(resolve, 800));

  const amountValue = parseFloat(form.amount.replace(",", "."));

  store.addTransaction({
    merchant: form.recipient,
    amount: -Math.abs(amountValue),
    date: new Date().toISOString().split("T")[0],
    category: t("quick_transfer.transaction.category"),
    status: "Completed",
    currency: "PLN",
    description: form.title,
    icon: "💸",
  });

  isSending.value = false;
  emit("sent");
  emit("close");
};

// --- LOGIKA SWIPE-TO-CLOSE ---
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
  if (delta > 0) currentTranslateY.value = delta;
};

const handleTouchEnd = () => {
  isDragging.value = false;
  if (currentTranslateY.value > 150) emit("close");
  else currentTranslateY.value = 0;
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
        class="modal-card relative bg-white w-full md:max-w-md flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl will-change-transform"
        :style="{
          transform:
            isDragging || currentTranslateY > 0
              ? `translateY(${currentTranslateY}px)`
              : '',
        }"
        :class="{ 'transition-transform duration-300': !isDragging }"
      >
        <div
          class="touch-none bg-white cursor-grab active:cursor-grabbing border-b border-slate-50 flex-shrink-0"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="md:hidden w-full flex justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div class="px-8 pt-4 pb-4 flex justify-between items-center">
            <h3 class="font-bold text-xl text-slate-900">
              {{ $t("quick_transfer.title") }}
            </h3>
            <button
              @click="$emit('close')"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition"
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
                {{ $t("quick_transfer.form.recipient_label") }}
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >👤</span
                >
                <input
                  v-model="form.recipient"
                  :placeholder="$t('quick_transfer.form.recipient_placeholder')"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider"
              >
                {{ $t("quick_transfer.form.title_label") }}
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >✏️</span
                >
                <input
                  v-model="form.title"
                  :placeholder="$t('quick_transfer.form.title_placeholder')"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wider"
              >
                {{ $t("quick_transfer.form.amount_label") }}
              </label>
              <div class="relative">
                <input
                  v-model="form.amount"
                  type="number"
                  :placeholder="$t('quick_transfer.form.amount_placeholder')"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-2xl font-bold text-slate-900 placeholder:text-slate-200"
                />
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4">
            <button
              @click="handleTransfer"
              :disabled="isSending || !form.amount || !form.recipient"
              class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span
                v-if="isSending"
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
              ></span>
              {{
                isSending
                  ? $t("quick_transfer.actions.processing")
                  : $t("quick_transfer.actions.send")
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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
.slide-up-enter-from .modal-card {
  transform: translateY(100%);
}
.slide-up-leave-to .modal-card {
  transform: translateY(100%) !important;
}

@media (min-width: 768px) {
  .slide-up-enter-from .modal-card,
  .slide-up-leave-to .modal-card {
    transform: scale(0.95) !important;
    opacity: 0;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
