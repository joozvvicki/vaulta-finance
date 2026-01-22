<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";

// Inicjalizacja i18n
const { t } = useI18n();

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const closePrompt = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-24 left-4 right-4 md:bottom-6 md:left-auto md:right-6 z-[200] p-4 bg-slate-800 text-white rounded-xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300"
    role="alert"
  >
    <div class="text-sm font-medium">
      <span v-if="offlineReady">
        {{ $t("pwa.offline_ready") }}
      </span>
      <span v-else>
        {{ $t("pwa.update_available") }}
      </span>
    </div>

    <div class="flex gap-2">
      <button
        v-if="needRefresh"
        @click="updateServiceWorker()"
        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition active:scale-95"
      >
        {{ $t("pwa.refresh") }}
      </button>

      <button
        @click="closePrompt"
        class="p-1.5 text-slate-400 hover:text-white transition rounded-md hover:bg-white/10"
        :aria-label="$t('pwa.close')"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Dodatkowa animacja wejścia dla lepszego UX */
.animate-in {
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
