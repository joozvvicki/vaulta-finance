<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({ layout: "default" });

const { t, tm, rt } = useI18n();
const searchQuery = ref("");

useHead({
  title: `${t("help.hero.badge")} | Vaulte`,
});

const categories = computed(() => tm("help.categories") as any);
const popularArticles = computed(() => tm("help.popular.articles") as any);
</script>

<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="bg-slate-900 py-20 px-4 text-center relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 z-0"
      ></div>
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl z-0"
      ></div>

      <div class="relative z-10 max-w-2xl mx-auto" v-motion-fade>
        <span
          class="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4 block"
        >
          {{ $t("help.hero.badge") }}
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-8">
          {{ $t("help.hero.title") }}
        </h1>

        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('help.hero.searchPlaceholder')"
            class="w-full px-6 py-4 rounded-xl shadow-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition pl-12"
          />
          <svg
            class="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-10 relative z-20 pb-20">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(cat, index) in categories"
          :key="index"
          class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 500, delay: parseInt(`${index}`) * 100 },
          }"
        >
          <div
            class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
          >
            {{ rt(cat.icon) }}
          </div>
          <h3
            class="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors"
          >
            {{ rt(cat.title) }}
          </h3>
          <p class="text-sm text-slate-500">{{ rt(cat.desc) }}</p>
        </div>
      </div>

      <div
        class="mt-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
      >
        <h2 class="text-2xl font-bold text-slate-900 mb-6">
          {{ $t("help.popular.title") }}
        </h2>
        <ul class="space-y-4">
          <li v-for="(article, idx) in popularArticles" :key="idx">
            <a
              href="#"
              class="flex items-center text-slate-600 hover:text-blue-600 transition group"
            >
              <span
                class="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-100"
              >
                <svg
                  class="w-4 h-4 text-slate-400 group-hover:text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
              {{ rt(article) }}
            </a>
          </li>
        </ul>
      </div>

      <div class="mt-12 text-center" v-motion-slide-visible-once-bottom>
        <p class="text-slate-500 mb-4">{{ $t("help.footer.text") }}</p>
        <NuxtLink
          to="/pomoc/kontakt"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
        >
          {{ $t("help.footer.cta") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
