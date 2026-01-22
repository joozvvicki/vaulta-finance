<script setup lang="ts">
import { computed } from "vue";

definePageMeta({
  layout: "default",
});

const { t, tm, rt } = useI18n();

useHead({
  title: `${t("privacy.hero.title")} | Vaulte`,
});

const openBankingSteps = computed(() => tm("privacy.sections.s3.steps") as any);
</script>

<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h1
          class="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight"
        >
          {{ $t("privacy.hero.title") }}
        </h1>
        <p class="mt-4 text-lg text-slate-500 font-medium">
          {{ $t("privacy.hero.subtitle") }}
        </p>
      </div>

      <div
        class="text-slate-600 space-y-10 leading-relaxed text-sm sm:text-base"
      >
        <div
          class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl shadow-sm"
        >
          <p
            class="font-bold text-blue-900 uppercase tracking-widest text-xs mb-2"
          >
            {{ $t("privacy.summary.title") }}
          </p>
          <p class="text-blue-800 font-medium">
            {{ $t("privacy.summary.text") }}
          </p>
        </div>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("privacy.sections.s1.title") }}
          </h2>
          <p>{{ $t("privacy.sections.s1.text") }}</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("privacy.sections.s2.title") }}
          </h2>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <span
                class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"
              ></span>
              <span v-html="$t('privacy.sections.s2.items.account')"></span>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"
              ></span>
              <span v-html="$t('privacy.sections.s2.items.financial')"></span>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"
              ></span>
              <span v-html="$t('privacy.sections.s2.items.technical')"></span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("privacy.sections.s3.title") }}
          </h2>
          <p class="mb-4">{{ $t("privacy.sections.s3.text") }}</p>
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <ol class="space-y-4">
              <li
                v-for="(step, index) in openBankingSteps"
                :key="index"
                class="flex gap-4"
              >
                <span
                  class="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm"
                >
                  {{ parseInt(`${index}`) + 1 }}
                </span>
                <span class="text-slate-600 font-medium">{{ rt(step) }}</span>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("privacy.sections.s4.title") }}
          </h2>
          <p>{{ $t("privacy.sections.s4.text") }}</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("privacy.sections.s5.title") }}
          </h2>
          <p>{{ $t("privacy.sections.s5.text") }}</p>
        </section>
      </div>

      <div class="mt-16 pt-8 border-t border-slate-100">
        <NuxtLink
          to="/"
          class="text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-2 group"
        >
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          {{ $t("privacy.back") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
