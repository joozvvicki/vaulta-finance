<script setup lang="ts">
definePageMeta({ layout: "auth" });

const client = useSupabaseClient();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = "";

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      if (error.message.includes("Invalid login")) {
        errorMsg.value = "Nieprawidłowy email lub hasło.";
      } else {
        errorMsg.value = "Wystąpił błąd logowania.";
      }
      isLoading.value = false;
    } else {
      router.push("/app/dashboard");
    }
  } catch (e) {
    errorMsg.value = "Wystąpił nieoczekiwany błąd.";
    isLoading.value = false;
  }
};

const handlePekaoLogin = () => {
  router.push("/mock/pekao-login");
};

onMounted(async () => {
  if (route.query.demo === "true") {
    await new Promise((r) => setTimeout(r, 500));
    email.value = "demo@vaulta.app";
    password.value = "demo123";
    handleLogin();
  }
});
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleLogin">
    <div
      v-if="errorMsg"
      class="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-pulse border border-red-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ errorMsg }}
    </div>

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
          required
          class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
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
          required
          class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
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
        <a href="#" class="font-medium text-blue-600 hover:text-blue-500"
          >Zapomniałeś hasła?</a
        >
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logowanie...
        </span>
        <span v-else>Zaloguj się</span>
      </button>
    </div>

    <div class="mt-6 relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-200"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-slate-500">Lub zaloguj przez</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mt-6">
      <button
        type="button"
        class="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Google
      </button>
      <button
        type="button"
        @click="handlePekaoLogin"
        class="w-full inline-flex justify-center items-center py-2 px-4 border border-red-200 rounded-lg shadow-sm bg-white text-sm font-medium text-red-700 hover:bg-red-50 transition"
      >
        <span class="mr-2 text-lg">🐂</span> Apple
      </button>
    </div>

    <div class="mt-6 text-center text-sm">
      <span class="text-slate-500">Nie masz jeszcze konta? </span>
      <NuxtLink
        to="/register"
        class="font-bold text-blue-600 hover:text-blue-500 transition"
      >
        Zarejestruj się za darmo
      </NuxtLink>
    </div>
  </form>
</template>
