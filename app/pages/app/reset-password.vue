<script setup lang="ts">
definePageMeta({ layout: "auth" });

const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const router = useRouter();

const handleNewPassword = () => {
  if (password.value !== confirmPassword.value) {
    alert("Hasła nie są identyczne!");
    return;
  }

  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    alert("Hasło zostało zmienione. Zaloguj się.");
    router.push("/login");
  }, 1000);
};
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h3 class="text-lg font-medium text-slate-900">Ustaw nowe hasło</h3>
      <p class="text-sm text-slate-500">Wprowadź nowe, bezpieczne hasło.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleNewPassword">
      <div>
        <label for="password" class="block text-sm font-medium text-slate-700"
          >Nowe hasło</label
        >
        <div class="mt-1">
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
      </div>

      <div>
        <label
          for="confirmPassword"
          class="block text-sm font-medium text-slate-700"
          >Powtórz hasło</label
        >
        <div class="mt-1">
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            required
            class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition"
      >
        <span v-if="isLoading">Zmienianie...</span>
        <span v-else>Zmień hasło</span>
      </button>
    </form>

    <div class="mt-6 text-center text-sm">
      <NuxtLink
        to="/app/login"
        class="font-medium text-slate-600 hover:text-slate-900 transition"
      >
        Anuluj
      </NuxtLink>
    </div>
  </div>
</template>
