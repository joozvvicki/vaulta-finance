<script setup lang="ts">
import { ref, watch } from "vue";
import { useGoalsStore } from "~/stores/goals";

const props = defineProps<{
  isOpen: boolean;
  goalId?: string | number | null;
  goalTitle?: string;
}>();

const emit = defineEmits(["close"]);
const store = useGoalsStore();
const depositAmount = ref("");

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentTranslateY.value = 0;
      depositAmount.value = "";
    }
  },
);

const handleDeposit = () => {
  if (!depositAmount.value || !props.goalId) return;

  store.deposit(props.goalId, parseFloat(depositAmount.value));

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
  const delta = e.touches[0].clientY - touchStartY.value;
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
        class="modal-card relative bg-white w-full md:w-full md:max-w-sm flex flex-col shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl will-change-transform"
        :style="{
          transform:
            isDragging || currentTranslateY > 0
              ? `translateY(${currentTranslateY}px)`
              : '',
        }"
        :class="{ 'transition-transform duration-300': !isDragging }"
      >
        <div
          class="touch-none bg-white cursor-grab active:cursor-grabbing flex-shrink-0 pt-3 pb-1"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            class="md:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2"
          ></div>
          <div class="flex justify-end px-4 md:hidden"></div>
        </div>

        <div class="p-8 pt-2 pb-10 md:pb-8 text-center bg-white">
          <div
            class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/20 text-3xl"
          >
            💸
          </div>

          <h3 class="font-bold text-2xl text-slate-900 mb-1">Dopłać do celu</h3>
          <p class="text-sm font-medium text-slate-500 mb-8 truncate px-4">
            {{ goalTitle || "Wybrany cel" }}
          </p>

          <div class="relative mb-8 group">
            <input
              v-model="depositAmount"
              type="number"
              placeholder="0"
              class="w-full text-5xl font-extrabold text-slate-900 border-b-2 border-slate-100 focus:border-green-500 outline-none py-4 text-center transition-colors placeholder:text-slate-200 bg-transparent"
              autofocus
            />
            <span
              class="absolute right-4 bottom-6 text-slate-400 font-bold text-lg pointer-events-none group-focus-within:text-green-500 transition-colors"
              >PLN</span
            >
          </div>

          <button
            @click="handleDeposit"
            class="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/30 text-lg"
          >
            Zaksięguj wpłatę
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Te same style co wszędzie */
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
</style>
