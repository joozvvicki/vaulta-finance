<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const sessionId = route.query.session_id as string;
const showContent = ref(false);

useHead({
  title: `${t("checkout.success.title")} | Vaulte`,
});

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 100);
});
</script>

<template>
  <div
    class="max-w-3xl mx-auto py-12 px-4 min-h-[80vh] flex items-center justify-center"
  >
    <div
      class="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 w-full text-center transition-all duration-700 transform"
      :class="
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      "
    >
      <div class="mb-8 flex justify-center">
        <div
          class="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center relative"
        >
          <div
            class="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"
          ></div>
          <svg
            class="h-12 w-12 text-green-500 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
        {{ $t("checkout.success.title") }}
      </h1>

      <p class="text-slate-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        {{ $t("checkout.success.description") }}
      </p>

      <div
        class="bg-slate-50 rounded-2xl p-5 mb-10 border border-slate-100 max-w-md mx-auto shadow-inner"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center text-sm gap-2"
        >
          <span class="text-slate-500 font-medium">{{
            $t("checkout.success.status_label")
          }}</span>
          <span
            class="flex items-center gap-1.5 font-bold text-green-600 bg-white px-3 py-1 rounded-full border border-green-100 shadow-sm uppercase text-[10px] tracking-wider"
          >
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            {{ $t("checkout.success.status_paid") }}
          </span>
        </div>

        <div
          v-if="sessionId"
          class="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] gap-2"
        >
          <span class="text-slate-400 font-bold uppercase tracking-widest">{{
            $t("checkout.success.session_id")
          }}</span>
          <span
            class="font-mono text-slate-600 break-all select-all bg-slate-100 px-2 py-0.5 rounded"
          >
            {{ sessionId.slice(-15) }}...
          </span>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
      >
        <button
          @click="router.push('/app/dashboard')"
          class="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform active:scale-95 flex justify-center items-center gap-2"
        >
          {{ $t("checkout.success.cta_dashboard") }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        <button
          @click="router.push('/app/konto')"
          class="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
        >
          {{ $t("checkout.success.cta_manage") }}
        </button>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-100">
        <p class="text-[11px] text-slate-400 leading-relaxed font-medium">
          {{ $t("checkout.success.footer_note") }}
        </p>
      </div>
    </div>
  </div>
</template>
