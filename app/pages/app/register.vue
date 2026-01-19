<script setup lang="ts">
definePageMeta({ layout: "auth" });

const form = ref({
  name: "",
  email: "",
  password: "",
  terms: false,
});
const isLoading = ref(false);
const router = useRouter();

const handleRegister = () => {
  if (!form.value.terms) return alert("Musisz zaakceptować regulamin!");

  isLoading.value = true;
  // Symulacja API
  setTimeout(() => {
    isLoading.value = false;
    router.push("/app");
  }, 1500);
};
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h3 class="text-lg font-medium text-slate-900">Załóż nowe konto</h3>
      <p class="text-sm text-slate-500">
        Dołącz do 10,000 użytkowników Vaulta.
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleRegister">
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700"
          >Imię i Nazwisko</label
        >
        <div class="mt-1">
          <input
            v-model="form.name"
            id="name"
            type="text"
            required
            class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700"
          >Adres Email</label
        >
        <div class="mt-1">
          <input
            v-model="form.email"
            id="email"
            type="email"
            required
            class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700"
          >Hasło</label
        >
        <div class="mt-1">
          <input
            v-model="form.password"
            id="password"
            type="password"
            required
            class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
        <p class="mt-1 text-xs text-slate-500">
          Minimum 8 znaków, jedna duża litera.
        </p>
      </div>

      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            v-model="form.terms"
            id="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition"
          />
        </div>
        <div class="ml-2 text-sm">
          <label for="terms" class="font-medium text-slate-700"
            >Akceptuję
            <a href="#" class="text-blue-600 hover:text-blue-500">Regulamin</a>
            i
            <a href="#" class="text-blue-600 hover:text-blue-500"
              >Politykę Prywatności</a
            ></label
          >
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-95"
      >
        <span v-if="isLoading">Tworzenie konta...</span>
        <span v-else>Zarejestruj się</span>
      </button>
    </form>

    <div class="mt-6 text-center text-sm">
      <span class="text-slate-500">Masz już konto? </span>
      <NuxtLink
        to="/app/login"
        class="font-medium text-blue-600 hover:text-blue-500 transition"
      >
        Zaloguj się
      </NuxtLink>
    </div>
  </div>
</template>
