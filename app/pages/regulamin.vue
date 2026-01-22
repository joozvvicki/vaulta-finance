<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { t } = useI18n();

useHead({
  title: `${t("regulamin.hero.title")} | Vaulte`,
});
</script>

<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h1
          class="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight"
        >
          {{ $t("regulamin.hero.title") }}
        </h1>
        <p class="mt-4 text-lg text-slate-500 font-medium">
          {{ $t("regulamin.hero.updated") }}
        </p>
      </div>

      <div
        class="prose prose-slate prose-blue max-w-none text-slate-600 space-y-12 leading-relaxed"
      >
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("regulamin.sections.s1.title") }}
          </h2>
          <div class="space-y-3">
            <p v-html="$t('regulamin.sections.s1.p1')"></p>
            <p>{{ $t("regulamin.sections.s1.p2") }}</p>
            <p>{{ $t("regulamin.sections.s1.p3") }}</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("regulamin.sections.s2.title") }}
          </h2>
          <div class="space-y-3">
            <p>{{ $t("regulamin.sections.s2.p1") }}</p>
            <p>{{ $t("regulamin.sections.s2.p2") }}</p>
            <p>{{ $t("regulamin.sections.s2.p3") }}</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("regulamin.sections.s3.title") }}
          </h2>
          <div class="space-y-3">
            <p>{{ $t("regulamin.sections.s3.p1") }}</p>
            <p>{{ $t("regulamin.sections.s3.p2") }}</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("regulamin.sections.s4.title") }}
          </h2>
          <div class="space-y-3">
            <p>{{ $t("regulamin.sections.s4.p1") }}</p>
            <p>{{ $t("regulamin.sections.s4.p2") }}</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            {{ $t("regulamin.sections.s5.title") }}
          </h2>
          <div class="space-y-3">
            <p>{{ $t("regulamin.sections.s5.p1") }}</p>
            <p>{{ $t("regulamin.sections.s5.p2") }}</p>
          </div>
        </section>
      </div>

      <div class="mt-16 pt-8 border-t border-slate-200">
        <NuxtLink
          to="/"
          class="text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-2 group"
        >
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          {{ $t("regulamin.back") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
