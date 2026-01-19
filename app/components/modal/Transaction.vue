<script setup lang="ts">
import { isValid, parse, parseISO, format } from "date-fns"; // Dodano 'format'
import { ref, reactive, watch } from "vue";
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
  switch (cat) {
    case "Jedzenie":
      return "🍔";
    case "Transport":
      return "🚗";
    case "Rozrywka":
      return "🍿";
    case "Zdrowie":
      return "💊";
    case "Rachunki":
      return "💡";
    case "Wynagrodzenie":
      return "💰";
    case "Przelew":
      return "💸";
    default:
      return "🛒";
  }
};

const handleSave = () => {
  if (!form.merchant || !form.amount) return;

  const finalAmount = parseFloat(form.amount.replace(",", "."));
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
    store.addTransaction({
      id: Date.now().toString(),
      ...payload,
    });
  }

  emit("saved");
  emit("close");
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden flex flex-col max-h-[90vh]"
        v-motion-pop
      >
        <h3 class="font-bold text-xl text-slate-900 mb-6">
          {{ editId ? "Edytuj transakcję" : "Nowa transakcja" }}
        </h3>

        <div class="space-y-4 overflow-y-auto pr-1">
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
              placeholder="np. Biedronka, Netflix"
              class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              autofocus
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Kwota (PLN)</label
              >
              <input
                v-model="form.amount"
                type="number"
                step="0.01"
                class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Data</label
              >
              <input
                v-model="form.date"
                type="date"
                class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Kategoria</label
            >
            <select
              v-model="form.category"
              class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Opis (opcjonalnie)</label
            >
            <input
              v-model="form.description"
              type="text"
              placeholder="np. za zakupy na imprezę"
              class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
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

        <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            Anuluj
          </button>
          <button
            @click="handleSave"
            class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
