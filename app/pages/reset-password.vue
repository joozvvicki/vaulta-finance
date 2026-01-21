<script setup lang="ts">
import { ref } from "vue";

definePageMeta({ layout: "auth" });

const { t } = useI18n();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const errorMsg = ref("");

useHead({
  title: `${t("auth.updatePassword.title")} | Vaulte`,
});

const handleNewPassword = async () => {
  errorMsg.value = "";

  if (password.value !== confirmPassword.value) {
    errorMsg.value = t("auth.updatePassword.errorMismatch");
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    router.push({
      path: "/login",
      query: { resetSuccess: "true" },
    });
  }, 1000);
};
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-6 text-center">
      <h3 class="text-xl font-bold text-slate-900">
        {{ $t("auth.updatePassword.title") }}
      </h3>
      <p class="text-sm text-slate-500">
        {{ $t("auth.updatePassword.description") }}
      </p>
    </div>

    <div
      v-if="errorMsg"
      class="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 border border-red-100 animate-shake"
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

    <form class="space-y-5" @submit.prevent="handleNewPassword">
      <div>
        <label for="password" class="block text-sm font-medium text-slate-700">
          {{ $t("auth.updatePassword.passwordLabel") }}
        </label>
        <div class="mt-1">
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
      </div>

      <div>
        <label
          for="confirmPassword"
          class="block text-sm font-medium text-slate-700"
        >
          {{ $t("auth.updatePassword.confirmPasswordLabel") }}
        </label>
        <div class="mt-1">
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            required
            class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all shadow-lg shadow-blue-500/20"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
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
          {{ $t("auth.updatePassword.submitting") }}
        </span>
        <span v-else>{{ $t("auth.updatePassword.submit") }}</span>
      </button>
    </form>

    <div class="mt-8 text-center text-sm border-t border-slate-100 pt-6">
      <NuxtLink
        to="/login"
        class="font-bold text-slate-500 hover:text-slate-900 transition"
      >
        {{ $t("auth.updatePassword.cancel") }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
