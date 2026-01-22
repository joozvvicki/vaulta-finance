<script setup lang="ts">
import { computed } from "vue";

definePageMeta({
  layout: "default",
});

const { t, tm, rt } = useI18n();

useHead({
  title: `${t("rodo.hero.title")} | Vaulte`,
});

const recipients = computed(() => tm("rodo.sections.s4.items") as any);
const rights = computed(() => tm("rodo.sections.s5.rights") as any);
</script>

<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12" v-motion-fade>
        <span
          class="text-blue-600 font-bold tracking-widest text-[10px] uppercase mb-2 block"
        >
          {{ $t("rodo.hero.badge") }}
        </span>
        <h1
          class="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight"
        >
          {{ $t("rodo.hero.title") }}
        </h1>
        <p class="mt-4 text-lg text-slate-500 font-medium">
          {{ $t("rodo.hero.subtitle") }}
        </p>
      </div>

      <div
        class="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10 shadow-inner"
        v-motion-slide-visible-once-bottom
      >
        <h3
          class="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide"
        >
          <svg
            class="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ $t("rodo.summary.title") }}
        </h3>
        <ul class="space-y-3 text-sm text-slate-600 font-medium">
          <li class="flex items-start gap-3">
            <span
              class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"
            ></span>
            {{ $t("rodo.summary.item1") }}
          </li>
          <li class="flex items-start gap-3">
            <span
              class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"
            ></span>
            {{ $t("rodo.summary.item2") }}
          </li>
          <li class="flex items-start gap-3">
            <span
              class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"
            ></span>
            {{ $t("rodo.summary.item3") }}
          </li>
          <li class="flex items-start gap-3">
            <span
              class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"
            ></span>
            <span v-html="$t('rodo.summary.item4')"></span>
          </li>
        </ul>
      </div>

      <div
        class="prose prose-slate prose-blue max-w-none text-slate-600 space-y-10 leading-relaxed"
      >
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s1.title") }}
          </h2>
          <p v-html="$t('rodo.sections.s1.text')"></p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s2.title") }}
          </h2>
          <p>{{ $t("rodo.sections.s2.text") }}</p>
          <p class="mt-4 font-bold text-blue-600">
            {{ $t("rodo.sections.s2.contact") }}
            <a href="mailto:iod@Vaulte.pro" class="hover:underline"
              >iod{'@'}Vaulte.pro</a
            >
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s3.title") }}
          </h2>
          <p class="mb-4">{{ $t("rodo.sections.s3.intro") }}</p>
          <ul class="list-disc pl-5 space-y-4">
            <li v-html="$t('rodo.sections.s3.p1')"></li>
            <li v-html="$t('rodo.sections.s3.p2')"></li>
            <li v-html="$t('rodo.sections.s3.p3')"></li>
            <li v-html="$t('rodo.sections.s3.p4')"></li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s4.title") }}
          </h2>
          <p class="mb-4">{{ $t("rodo.sections.s4.intro") }}</p>
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="(item, index) in recipients" :key="index">
              {{ rt(item) }}
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s5.title") }}
          </h2>
          <p>{{ $t("rodo.sections.s5.intro") }}</p>
          <ul class="grid sm:grid-cols-2 gap-3 mt-6">
            <li
              v-for="(right, index) in rights"
              :key="index"
              class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700 shadow-sm"
            >
              {{ rt(right) }}
            </li>
          </ul>
          <p class="mt-6 italic text-sm">{{ $t("rodo.sections.s5.outro") }}</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s6.title") }}
          </h2>
          <p>{{ $t("rodo.sections.s6.text") }}</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("rodo.sections.s7.title") }}
          </h2>
          <p>{{ $t("rodo.sections.s7.text") }}</p>
        </section>
      </div>

      <div
        class="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <NuxtLink
          to="/"
          class="text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-2 group"
        >
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          {{ $t("rodo.footer.back") }}
        </NuxtLink>
        <span
          class="text-xs font-bold text-slate-400 uppercase tracking-widest"
        >
          {{ $t("rodo.footer.updated") }}
        </span>
      </div>
    </div>
  </div>
</template>
