<script setup lang="ts">
definePageMeta({ layout: "auth" });

const email = ref("");
const isLoading = ref(false);
const isSent = ref(false);

const handleResetRequest = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    isSent.value = true;
  }, 1000);
};
</script>

<template>
  <div>
    <div v-if="!isSent">
      <div class="mb-6 text-center">
        <h3 class="text-lg font-medium text-slate-900">Zresetuj hasło</h3>
        <p class="text-sm text-slate-500">
          Podaj adres email powiązany z Twoim kontem.
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleResetRequest">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700"
            >Adres Email</label
          >
          <div class="mt-1">
            <input
              v-model="email"
              id="email"
              type="email"
              required
              placeholder="np. marek@firma.pl"
              class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition"
        >
          <span v-if="isLoading">Wysyłanie...</span>
          <span v-else>Wyślij link resetujący</span>
        </button>
      </form>
    </div>

    <div v-else class="text-center py-4" v-motion-fade>
      <div
        class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"
      >
        <svg
          class="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900">Sprawdź skrzynkę</h3>
      <p class="text-sm text-slate-500 mt-2 mb-6">
        Wysłaliśmy instrukcję resetowania hasła na adres
        <strong>{{ email }}</strong
        >.
      </p>
      <button
        @click="isSent = false"
        class="text-sm font-medium text-blue-600 hover:text-blue-500 transition"
      >
        Wpisz inny adres email
      </button>
    </div>

    <div class="mt-6 text-center text-sm border-t border-slate-100 pt-4">
      <NuxtLink
        to="/app/login"
        class="font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 transition"
      >
        <span>←</span> Wróć do logowania
      </NuxtLink>
    </div>
  </div>
</template>
