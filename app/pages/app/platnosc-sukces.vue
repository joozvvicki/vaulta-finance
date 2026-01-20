<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// Używamy tego samego layoutu co w checkoucie
definePageMeta({ layout: "dashboard" });

const route = useRoute();
const router = useRouter();

// Pobieramy ID sesji z URL (Stripe dokleja ?session_id=...)
const sessionId = route.query.session_id as string;
const showContent = ref(false);

onMounted(() => {
  // Krótkie opóźnienie dla płynniejszego wejścia animacji
  setTimeout(() => {
    showContent.value = true;
  }, 100);
});
</script>

<template>
  <div
    class="max-w-3xl mx-auto py-12 px-4 min-h-[80vh] flex items-center justify-center"
  >
    <div
      class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 w-full text-center transition-all duration-700 transform"
      :class="
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      "
    >
      <div class="mb-8 flex justify-center">
        <div
          class="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center relative"
        >
          <div
            class="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"
          ></div>
          <svg
            class="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-slate-900 mb-4">
        Płatność zakończona sukcesem!
      </h1>

      <p class="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
        Dziękujemy za subskrypcję Vaulte Pro. Twoje konto zostało zaktualizowane
        i masz teraz pełny dostęp do wszystkich funkcji premium.
      </p>

      <div
        class="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100 max-w-md mx-auto"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center text-sm gap-2"
        >
          <span class="text-slate-500">Status transakcji:</span>
          <span
            class="flex items-center gap-1.5 font-medium text-green-600 bg-white px-2 py-1 rounded border border-green-100 shadow-sm"
          >
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Opłacono
          </span>
        </div>

        <div
          v-if="sessionId"
          class="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs gap-2"
        >
          <span class="text-slate-400">ID Sesji:</span>
          <span class="font-mono text-slate-600 break-all select-all"
            >{{ sessionId.slice(-15) }}...</span
          >
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
      >
        <button
          @click="router.push('/app/dashboard')"
          class="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform active:scale-95 flex justify-center items-center gap-2"
        >
          Przejdź do Dashboardu
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        <button
          @click="router.push('/app/konto')"
          class="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-900 transition"
        >
          Zarządzaj subskrypcją
        </button>
      </div>

      <div class="mt-8 pt-8 border-t border-slate-100">
        <p class="text-xs text-slate-400">
          Potwierdzenie płatności zostało wysłane na Twój adres email.
          <br />W razie pytań skontaktuj się z nami przez support.
        </p>
      </div>
    </div>
  </div>
</template>
