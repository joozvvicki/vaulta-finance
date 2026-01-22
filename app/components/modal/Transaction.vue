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
    store.addTransaction({ ...payload });
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
          class="touch-none bg-white cursor-grab active:cursor-grabbing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="md:hidden w-full flex justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>
          <div class="px-6 pt-6 pb-2">
            <h3 class="font-bold text-xl text-slate-900">
              {{
                editId
                  ? $t("transactions_modal.title_edit")
                  : $t("transactions_modal.title_add")
              }}
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
                    : 'text-slate-500'
                "
              >
                {{ $t("transactions_modal.types.expense") }}
              </button>
              <button
                @click="form.type = 'income'"
                class="flex-1 py-2 text-sm font-bold rounded-md transition"
                :class="
                  form.type === 'income'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-slate-500'
                "
              >
                {{ $t("transactions_modal.types.income") }}
              </button>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">{{
                $t("transactions_modal.labels.merchant")
              }}</label>
              <input
                v-model="form.merchant"
                @blur="inferCategory"
                type="text"
                class="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">{{
                  $t("transactions_modal.labels.amount")
                }}</label>
                <input
                  v-model="form.amount"
                  type="number"
                  step="0.01"
                  class="w-full border border-slate-200 rounded-xl p-3 outline-none font-black text-lg focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">{{
                  $t("transactions_modal.labels.date")
                }}</label>
                <input
                  v-model="form.date"
                  type="date"
                  class="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">{{
                $t("transactions_modal.labels.category")
              }}</label>
              <select
                v-model="form.category"
                class="w-full border border-slate-200 rounded-xl p-3 outline-none bg-white cursor-pointer focus:ring-2 focus:ring-blue-100 transition"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ $t("transactions_modal.categories." + cat) }}
                </option>
              </select>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="statusCheck"
                :checked="form.status === 'Completed'"
                @change="
                  form.status = ($event.target as HTMLInputElement).checked
                    ? 'Completed'
                    : 'Pending'
                "
                class="w-5 h-5 text-blue-600 rounded-lg border-slate-300 focus:ring-blue-500"
              />
              <label
                for="statusCheck"
                class="text-sm text-slate-600 font-medium cursor-pointer select-none"
              >
                {{ $t("transactions_modal.labels.status") }}
              </label>
            </div>
          </div>

          <div
            class="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-50 pb-6 md:pb-0"
          >
            <button
              @click="$emit('close')"
              class="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition text-sm"
            >
              {{ $t("transactions_modal.actions.cancel") }}
            </button>
            <button
              @click="handleSave"
              class="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-sm"
            >
              {{ $t("transactions_modal.actions.save") }}
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
