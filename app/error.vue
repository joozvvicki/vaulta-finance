<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const handleError = () => clearError({ redirect: "/" });

const goBack = () => useRouter().back();
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <div
      class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10"
    ></div>

    <div class="max-w-lg w-full text-center">
      <div
        class="relative mb-8"
        v-motion
        :initial="{ opacity: 0, scale: 0.5 }"
        :enter="{
          opacity: 1,
          scale: 1,
          transition: { type: 'spring', stiffness: 100, damping: 10 },
        }"
      >
        <h1
          class="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 select-none"
        >
          404
        </h1>

        <div
          class="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100"
          v-motion
          :initial="{ y: 0 }"
          :enter="{
            y: -10,
            transition: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1500,
            },
          }"
        >
          <span class="text-4xl">💸</span>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
      >
        <h2 class="text-3xl font-bold text-slate-900 mb-4">
          Ups! Ta strona nie istnieje.
        </h2>
        <p class="text-slate-500 text-lg mb-8">
          Wygląda na to, że link, w który kliknąłeś, jest uszkodzony lub strona
          została przeniesiona do innego sejfu.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="handleError"
            class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            Wróć na stronę główną
          </button>

          <button
            @click="goBack"
            class="px-8 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <span>←</span> Cofnij się
          </button>
        </div>
      </div>

      <div class="mt-12 text-xs text-slate-400">
        Kod błędu: {{ error.statusCode }} •
        <NuxtLink to="/pomoc" class="hover:underline hover:text-blue-500"
          >Zgłoś problem</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
