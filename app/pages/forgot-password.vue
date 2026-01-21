<script setup lang="ts">
import { ref } from "vue";

definePageMeta({ layout: "auth" });

const { t } = useI18n();

const email = ref("");
const isLoading = ref(false);
const isSent = ref(false);

useHead({
  title: `${t("auth.reset.title")} | Vaulte`,
});

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
    <div v-if="!isSent" class="animate-fade-in">
      <div class="mb-6 text-center">
        <h3 class="text-lg font-bold text-slate-900">
          {{ $t("auth.reset.title") }}
        </h3>
        <p class="text-sm text-slate-500">
          {{ $t("auth.reset.description") }}
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleResetRequest">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700">
            {{ $t("auth.reset.emailLabel") }}
          </label>
          <div class="mt-1">
            <input
              v-model="email"
              id="email"
              type="email"
              required
              :placeholder="$t('auth.reset.emailPlaceholder')"
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all shadow-lg shadow-blue-500/20"
        >
          <span v-if="isLoading">{{ $t("auth.reset.sending") }}</span>
          <span v-else>{{ $t("auth.reset.submit") }}</span>
        </button>
      </form>
    </div>

    <div v-else class="text-center py-4 animate-scale-up">
      <div
        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 shadow-inner"
      >
        <svg
          class="h-8 w-8 text-green-600"
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
      <h3 class="text-xl font-bold text-slate-900">
        {{ $t("auth.reset.success.title") }}
      </h3>
      <p class="text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
        {{ $t("auth.reset.success.message") }} <br />
        <strong class="text-slate-900">{{ email }}</strong
        >.
      </p>
      <button
        @click="isSent = false"
        class="text-sm font-bold text-blue-600 hover:text-blue-700 transition underline underline-offset-4"
      >
        {{ $t("auth.reset.success.retry") }}
      </button>
    </div>

    <div class="mt-8 text-center text-sm border-t border-slate-100 pt-6">
      <NuxtLink
        to="/login"
        class="font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 transition group"
      >
        <span class="group-hover:-translate-x-1 transition-transform">←</span>
        {{ $t("auth.reset.backToLogin") }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-scale-up {
  animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
