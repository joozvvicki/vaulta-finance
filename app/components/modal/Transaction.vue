<script setup lang="ts">
import { isValid, parse, parseISO, format } from "date-fns";
import { reactive, watch, ref } from "vue";
import { useTransactionStore } from "~/stores/transactions";

const props = defineProps<{
  isOpen: boolean;
  editId?: string | number | null;
  initialCategory?: string;
}>();

const emit = defineEmits(["close", "saved"]);

const store = useTransactionStore();

const categories = [
  "Jedzenie",
  "Transport",
  "Rozrywka",
  "Zakupy",
  "Rachunki",
  "Zdrowie",
  "Wynagrodzenie",
  "Inne",
  "Edukacja",
  "Podróże",
  "Przelew",
];

const form = reactive({
  merchant: "",
  amount: "",
  date: format(new Date(), "yyyy-MM-dd"),
  category: "Inne",
  status: "Completed",
  type: "expense",
  description: "",
});

const parseDateSafe = (dateStr: Date | string) => {
  if (dateStr instanceof Date) return dateStr;
  let date = parseISO(dateStr);
  if (isValid(date)) return date;
  date = parse(dateStr, "dd.MM.yyyy", new Date());
  if (isValid(date)) return date;
  return new Date();
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      // Reset pozycji przy każdym otwarciu
      currentTranslateY.value = 0;

      if (props.editId) {
        const t = store.transactions.find((t) => t.id === props.editId);
        if (t) {
          form.merchant = t.merchant;
          form.amount = Math.abs(t.amount).toString();
          const dateObj = parseDateSafe(t.date);
          form.date = format(dateObj, "yyyy-MM-dd");
          form.category = t.category;
          form.status = t.status;
          form.type = t.amount >= 0 ? "income" : "expense";
          form.description = t.description || "";
        }
      } else {
        form.merchant = "";
        form.amount = "";
        form.date = format(new Date(), "yyyy-MM-dd");
        form.category = props.initialCategory || "Inne";
        form.status = "Completed";
        form.type = "expense";
        form.description = "";
      }
    }
  },
);

const inferCategory = () => {
  const name = form.merchant.toLowerCase();
  if (name.includes("biedronka") || name.includes("lidl"))
    form.category = "Jedzenie";
  else if (
    name.includes("uber") ||
    name.includes("bolt") ||
    name.includes("orlen")
  )
    form.category = "Transport";
  else if (name.includes("netflix") || name.includes("spotify"))
    form.category = "Rozrywka";
  else if (name.includes("apteka")) form.category = "Zdrowie";
};

const getIconByCategory = (cat: string) => {
  const icons: Record<string, string> = {
    Jedzenie: "🍔",
    Transport: "🚗",
    Rozrywka: "🍿",
    Zdrowie: "💊",
    Rachunki: "💡",
    Wynagrodzenie: "💰",
    Przelew: "💸",
  };
  return icons[cat] || "🛒";
};

const handleSave = () => {
  if (!form.merchant || !form.amount) return;
  const finalAmount = parseFloat(form.amount);
  const signedAmount =
    form.type === "expense" ? -Math.abs(finalAmount) : Math.abs(finalAmount);

  const payload: any = {
    merchant: form.merchant,
    amount: signedAmount,
    date: form.date,
    category: form.category,
    status: form.status,
    currency: "PLN",
    description: form.description,
    icon: getIconByCategory(form.category),
  };

  if (props.editId) {
    store.updateTransaction(props.editId, payload);
  } else {
    store.addTransaction({ id: Date.now().toString(), ...payload });
  }
  emit("saved");
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

  // Pozwalamy ciągnąć tylko w dół
  if (delta > 0) {
    currentTranslateY.value = delta;
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;

  // Próg zamknięcia: 150px
  if (currentTranslateY.value > 150) {
    emit("close");
    // WAŻNE: Nie resetujemy tu currentTranslateY do 0!
    // Pozwalamy CSS-owi przejąć kontrolę i dokończyć ruch w dół.
  } else {
    // Sprężynowanie z powrotem
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
          class="touch-none bg-white cursor-grab active:cursor-grabbing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="md:hidden w-full flex justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div class="px-6 pt-2 pb-2">
            <h3 class="font-bold text-xl text-slate-900">
              {{ editId ? "Edytuj transakcję" : "Nowa transakcja" }}
            </h3>
          </div>
        </div>

        <div class="p-6 pt-0 overflow-y-auto custom-scrollbar">
          <div class="space-y-4 mt-4">
            <div class="flex p-1 bg-slate-100 rounded-lg">
              <button
                @click="form.type = 'expense'"
                class="flex-1 py-2 text-sm font-bold rounded-md transition"
                :class="
                  form.type === 'expense'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                "
              >
                Wydatek
              </button>
              <button
                @click="form.type = 'income'"
                class="flex-1 py-2 text-sm font-bold rounded-md transition"
                :class="
                  form.type === 'income'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                "
              >
                Przychód
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Nazwa / Odbiorca</label
              >
              <input
                v-model="form.merchant"
                @blur="inferCategory"
                type="text"
                class="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Kwota</label
                >
                <input
                  v-model="form.amount"
                  type="number"
                  step="0.01"
                  class="w-full border border-slate-300 rounded-lg p-2.5 outline-none font-bold"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Data</label
                >
                <input
                  v-model="form.date"
                  type="date"
                  class="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Kategoria</label
              >
              <select
                v-model="form.category"
                class="w-full border border-slate-300 rounded-lg p-2.5 outline-none bg-white"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="statusCheck"
                :checked="form.status === 'Completed'"
                @change="
                  form.status = ($event.target as HTMLInputElement).checked
                    ? 'Completed'
                    : 'Pending'
                "
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label
                for="statusCheck"
                class="text-sm text-slate-700 select-none cursor-pointer"
                >Transakcja zakończona (zaksięgowana)</label
              >
            </div>
          </div>

          <div
            class="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 pb-6 md:pb-0"
          >
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              Anuluj
            </button>
            <button
              @click="handleSave"
              class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* === ANIMACJE WEJŚCIA/WYJŚCIA === */

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

/* Animacja tła */
.slide-up-enter-active .backdrop,
.slide-up-leave-active .backdrop {
  transition: opacity 0.3s ease;
}

/* Animacja karty */
.slide-up-enter-active .modal-card,
.slide-up-leave-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Stan początkowy (niewidoczne tło) */
.slide-up-enter-from .backdrop,
.slide-up-leave-to .backdrop {
  opacity: 0;
}

/* === MOBILE: Wjazd z dołu === */

/* Start: Karta pod ekranem */
.slide-up-enter-from .modal-card {
  transform: translateY(100%);
}

/* Koniec: Karta zjeżdża w dół */
/* !important jest kluczowy! Nadpisuje styl inline ustawiony przez JavaScript podczas przesuwania palcem */
.slide-up-leave-to .modal-card {
  transform: translateY(100%) !important;
}

/* === DESKTOP: Fade + Scale === */
@media (min-width: 768px) {
  /* Resetujemy transformacje mobilne */
  .slide-up-enter-from .modal-card,
  .slide-up-leave-to .modal-card {
    transform: scale(0.95) !important;
    opacity: 0;
  }
}
</style>
