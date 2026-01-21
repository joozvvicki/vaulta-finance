<script setup lang="ts">
import { ref } from "vue";

definePageMeta({ layout: "auth" });

const { t } = useI18n();
const client = useSupabaseClient();

const fullName = ref("");
const email = ref("");
const password = ref("");

const isLoading = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

const handleRegister = async () => {
  isLoading.value = true;
  errorMsg.value = "";

  const { error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
      },
    },
  });

  if (error) {
    errorMsg.value = error.message;
    isLoading.value = false;
  } else {
    successMsg.value = t("auth.register.success.message");
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <div
      v-if="successMsg"
      class="bg-green-50 p-6 rounded-xl text-center border border-green-100 animate-fade-in"
    >
      <div class="text-4xl mb-3">📧</div>
      <h3 class="text-green-800 font-bold mb-2 text-lg">
        {{ $t("auth.register.success.title") }}
      </h3>
      <p class="text-green-700 text-sm mb-4">{{ successMsg }}</p>
      <NuxtLink
        to="/login"
        class="inline-block px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md"
      >
        {{ $t("auth.register.success.backToLogin") }}
      </NuxtLink>
    </div>

    <form v-else class="space-y-6" @submit.prevent="handleRegister">
      <div
        v-if="errorMsg"
        class="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-100 animate-shake"
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

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700">
            {{ $t("auth.register.nameLabel") }}
          </label>
          <div class="mt-1">
            <input
              v-model="fullName"
              type="text"
              required
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              :placeholder="$t('auth.register.namePlaceholder')"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">
            {{ $t("auth.register.emailLabel") }}
          </label>
          <div class="mt-1">
            <input
              v-model="email"
              type="email"
              required
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              :placeholder="$t('auth.register.emailPlaceholder')"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">
            {{ $t("auth.register.passwordLabel") }}
          </label>
          <div class="mt-1">
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              :placeholder="$t('auth.register.passwordPlaceholder')"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
          {{ $t("auth.register.submitting") }}
        </span>
        <span v-else>{{ $t("auth.register.submit") }}</span>
      </button>

      <div class="mt-6 text-center text-sm">
        <span class="text-slate-500"
          >{{ $t("auth.register.haveAccount") }}
        </span>
        <NuxtLink
          to="/login"
          class="font-bold text-blue-600 hover:text-blue-500 transition ml-1"
        >
          {{ $t("auth.register.loginNow") }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
