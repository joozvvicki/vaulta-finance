<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();

const handleLogin = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push("/app/dashboard");
  }, 1000);
};
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleLogin">
    <div>
      <label for="email" class="block text-sm font-medium text-slate-700"
        >Adres Email</label
      >
      <div class="mt-1">
        <input
          v-model="email"
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-slate-700"
        >Hasło</label
      >
      <div class="mt-1">
        <input
          v-model="password"
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
        />
        <label for="remember-me" class="ml-2 block text-sm text-slate-900"
          >Zapamiętaj mnie</label
        >
      </div>

      <div class="text-sm">
        <a
          href="/app/forgot-password"
          class="font-medium text-blue-600 hover:text-blue-500"
          >Zapomniałeś hasła?</a
        >
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
      >
        <span v-if="isLoading">Logowanie...</span>
        <span v-else>Zaloguj się</span>
      </button>
    </div>

    <div class="mt-6 relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-slate-500">Lub zaloguj przez</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mt-6">
      <button
        type="button"
        class="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
      >
        Google
      </button>
      <button
        type="button"
        class="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
      >
        PekaoID
      </button>
    </div>

    <div class="mt-6 text-center text-sm">
      <span class="text-slate-500">Nie masz jeszcze konta? </span>
      <NuxtLink
        to="/app/register"
        class="font-medium text-blue-600 hover:text-blue-500 transition"
      >
        Zarejestruj się za darmo
      </NuxtLink>
    </div>
  </form>
</template>
