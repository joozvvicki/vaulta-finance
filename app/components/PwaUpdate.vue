<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const closePrompt = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-24 left-4 right-4 md:bottom-6 md:left-auto md:right-6 z-[200] p-4 bg-slate-800 text-white rounded-xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700"
    role="alert"
  >
    <div class="text-sm font-medium">
      <span v-if="offlineReady">Aplikacja gotowa do pracy offline.</span>
      <span v-else>Dostępna nowa wersja aplikacji! 🚀</span>
    </div>

    <div class="flex gap-2">
      <button
        v-if="needRefresh"
        @click="updateServiceWorker()"
        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition"
      >
        Odśwież
      </button>
      <button
        @click="closePrompt"
        class="p-1.5 text-slate-400 hover:text-white transition"
      >
        ✕
      </button>
    </div>
  </div>
</template>
