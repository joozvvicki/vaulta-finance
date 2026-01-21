<script setup lang="ts">
import { computed } from "vue";

const { t, tm, rt } = useI18n();

useHead({
  title: `${t("careers.hero.badge")} | Vaulte Careers`,
  meta: [{ name: "description", content: t("careers.hero.description") }],
});

const benefits = computed(() => tm("careers.benefits.items") as any);
const offers = computed(() => tm("careers.offers.items") as any);

const openMail = (role: string) => {
  const subject = t("careers.offers.apply_subject");
  window.location.href = `mailto:rekrutacja@vaulte.pro?subject=${subject}${role}`;
};

const scrollToOffers = () => {
  const el = document.getElementById("oferty");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
  <div>
    <section
      class="relative bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -z-10"
      ></div>

      <div
        class="max-w-3xl mx-auto relative z-10"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      >
        <span
          class="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold tracking-wider mb-6 uppercase"
        >
          {{ $t("careers.hero.badge") }}
        </span>
        <h1
          class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
        >
          {{ $t("careers.hero.title") }} <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"
          >
            {{ $t("careers.hero.subtitle") }}
          </span>
        </h1>
        <p class="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          {{ $t("careers.hero.description") }}
        </p>
        <button
          @click="scrollToOffers"
          class="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
        >
          {{ $t("careers.hero.cta") }}
        </button>
      </div>
    </section>

    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900">
            {{ $t("careers.benefits.title") }}
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { delay: parseInt(`${index}`) * 100 },
            }"
          >
            <div class="text-4xl mb-4">{{ rt(benefit.icon) }}</div>
            <h3 class="font-bold text-lg text-slate-900 mb-2">
              {{ rt(benefit.title) }}
            </h3>
            <p class="text-sm text-slate-500">{{ rt(benefit.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="oferty" class="py-20 bg-white border-t border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold text-slate-900">
              {{ $t("careers.offers.title") }}
            </h2>
            <p class="text-slate-500 mt-2">
              {{ $t("careers.offers.subtitle") }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(offer, index) in offers"
            :key="rt(offer.id)"
            class="group bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { delay: parseInt(`${index}`) * 100 },
            }"
            @click="openMail(rt(offer.title))"
          >
            <div
              v-if="offer.new"
              class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase"
            >
              {{ $t("careers.offers.new") }}
            </div>

            <div class="flex-1">
              <h3
                class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition"
              >
                {{ rt(offer.title) }}
              </h3>
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in offer.tags"
                  :key="rt(tag)"
                  class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200"
                >
                  {{ rt(tag) }}
                </span>
              </div>
            </div>

            <div
              class="mt-4 md:mt-0 md:text-right md:pl-8 flex flex-col items-start md:items-end gap-1"
            >
              <span
                class="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-sm"
              >
                {{ rt(offer.salary) }}
              </span>
              <span
                class="text-slate-400 text-xs font-medium uppercase tracking-wide"
              >
                {{ rt(offer.type) }} • {{ $t("careers.offers.remote") }}
              </span>
            </div>

            <div
              class="hidden md:flex absolute right-4 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="mt-12 text-center bg-slate-50 rounded-2xl p-8 border border-slate-200"
        >
          <h3 class="font-bold text-slate-900 text-lg">
            {{ $t("careers.footer.title") }}
          </h3>
          <p class="text-slate-500 mt-2 mb-6">
            {{ $t("careers.footer.desc") }}
          </p>
          <NuxtLink
            to="/pomoc/kontakt"
            class="text-blue-600 font-bold hover:underline"
          >
            {{ $t("careers.footer.cta") }} &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
