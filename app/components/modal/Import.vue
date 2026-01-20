<script setup lang="ts">
import { ref, watch } from "vue";
import { useTransactionStore } from "~/stores/transactions";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const client = useSupabaseClient();
const store = useTransactionStore();
const isImporting = ref(false);

// Reset stanu przy otwarciu
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentTranslateY.value = 0;
      isImporting.value = false;
    }
  },
);

// --- LOGIKA IMPORTU (Z twojego kodu) ---

const handleImportedData = async (newTransactions: any[]) => {
  if (newTransactions.length === 0) return;

  isImporting.value = true;

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
    alert(`Sukces! Zaimportowano ${newTransactions.length} transakcji.`);
    emit("close");
  } catch (e: any) {
    console.error("Błąd RLS/Bazy:", e.message);
    alert("Błąd uprawnień: " + e.message);
  } finally {
    isImporting.value = false;
  }
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
        class="modal-card relative bg-white w-full md:w-full md:max-w-lg flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl will-change-transform"
        :style="{
          transform:
            isDragging || currentTranslateY > 0
              ? `translateY(${currentTranslateY}px)`
              : '',
        }"
        :class="{ 'transition-transform duration-300': !isDragging }"
      >
        <div
          class="touch-none bg-white cursor-grab active:cursor-grabbing border-b border-slate-100 flex-shrink-0"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="md:hidden w-full flex justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div
            class="px-6 py-4 flex justify-between items-center bg-slate-50/50"
          >
            <div>
              <h3 class="font-bold text-lg text-slate-900">
                Importuj historię
              </h3>
              <p class="text-xs text-slate-500">
                Obsługa formatów: Pekao, PKO BP, mBank
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="p-8 overflow-y-auto custom-scrollbar bg-white">
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
  </Transition>
</template>

<style scoped>
/* Te same style animacji co w reszcie aplikacji */
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
