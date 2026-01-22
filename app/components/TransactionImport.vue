<script setup lang="ts">
import Papa from "papaparse";

const emit = defineEmits(["imported"]);
const { t } = useI18n();

const isProcessing = ref(false);
const dragActive = ref(false);

const parseAmount = (amountStr: string) => {
  if (!amountStr) return 0;
  const clean = amountStr.toString().replace(/\s/g, "").replace(",", ".");
  return parseFloat(clean);
};

const handleFile = (file: File) => {
  isProcessing.value = true;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: "UTF-8",
    complete: (results) => {
      const transactions = results.data
        .map((row: any) => {
          const amount = parseAmount(row["Kwota operacji"]);
          const date = row["Data księgowania"] || row["Data waluty"];

          let merchant =
            row["Nadawca / Odbiorca"] || row["Nazwa nadawcy/odbiorcy"];
          if (!merchant || merchant.trim() === "") {
            merchant =
              row["Tytułem"] ||
              row["Typ operacji"] ||
              t("transaction_import.default_merchant");
          }

          const category =
            row["Kategoria"] || t("transaction_import.default_category");

          return {
            id:
              row["Numer referencyjny"] ||
              Math.random().toString(36).substr(2, 9),
            date: date,
            merchant: merchant.substring(0, 40),
            description: row["Tytułem"],
            amount: amount,
            currency: row["Waluta"] || "PLN",
            category: category,
            status: "Completed",
            icon: getIconByCategory(category),
          };
        })
        .filter((t) => t.date && !isNaN(t.amount));

      setTimeout(() => {
        emit("imported", transactions);
        isProcessing.value = false;
      }, 800);
    },
    error: (err) => {
      console.error(err);
      isProcessing.value = false;
      alert(t("transaction_import.error_read")); // Tłumaczony błąd
    },
  });
};

const getIconByCategory = (cat: string) => {
  const c = cat.toLowerCase();
  // Te słowa zostawiamy po polsku, bo pochodzą z polskiego pliku CSV banku
  if (c.includes("zakupy") || c.includes("sklep")) return "🛒";
  if (c.includes("paliwo") || c.includes("transport")) return "⛽";
  if (c.includes("jedzenie") || c.includes("restauracja")) return "🍔";
  if (c.includes("wynagrodzenie") || c.includes("wypłata")) return "💰";
  if (c.includes("zdrowie")) return "❤️";
  return "💸";
};

const onDrop = (e: DragEvent) => {
  dragActive.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) handleFile(file);
};

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) handleFile(file);
};
</script>

<template>
  <div class="w-full">
    <label
      for="csv-upload"
      @dragenter.prevent="dragActive = true"
      @dragleave.prevent="dragActive = false"
      @dragover.prevent
      @drop.prevent="onDrop"
      class="group relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden bg-slate-50"
      :class="
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:bg-slate-100'
      "
    >
      <div
        v-if="!isProcessing"
        class="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4"
      >
        <div
          class="mb-3 p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform"
        >
          <svg
            class="w-8 h-8 text-slate-500 group-hover:text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p class="mb-2 text-sm text-slate-500">
          <span class="font-bold text-slate-900">{{
            $t("transaction_import.click")
          }}</span>
          {{ $t("transaction_import.upload_main") }}
        </p>
        <p
          class="text-[10px] uppercase font-bold text-slate-400 tracking-widest"
        >
          {{ $t("transaction_import.supported") }}
        </p>
      </div>

      <div v-else class="flex flex-col items-center animate-pulse">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"
        ></div>
        <p class="text-sm font-bold text-slate-600 uppercase tracking-tight">
          {{ $t("transaction_import.processing") }}
        </p>
      </div>

      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        class="hidden"
        @change="onFileSelect"
      />
    </label>
  </div>
</template>
