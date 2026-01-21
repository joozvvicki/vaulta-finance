<script setup lang="ts">
import { ref, computed } from "vue";

const { t, tm, rt } = useI18n();

const features = computed(() => tm("landing.features.items") as any);
const testimonials = computed(() => tm("landing.testimonials.items") as any);
const faqs = computed(() => tm("landing.faqs.items") as any);

const pricing = computed(() => {
  const p = tm("landing.pricing.plans") as any;
  return [
    { ...p.basic, highlight: false, id: "basic" },
    { ...p.pro, highlight: true, id: "pro" },
    { ...p.business, highlight: false, id: "business" },
  ];
});

// --- LOGIKA FAQ ---
const activeFaqIndex = ref<number | null>(0);
const toggleFaq = (index: number) => {
  activeFaqIndex.value = activeFaqIndex.value === index ? null : index;
};
</script>

<template>
  <div class="flex-grow">
    <section class="relative pt-20 pb-32 overflow-hidden">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <div
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100"
        >
          {{ $t("landing.hero.badge") }}
        </div>

        <h1
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 800, delay: 100 },
          }"
          class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
        >
          {{ $t("landing.hero.title") }}<br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {{ $t("landing.hero.subtitle") }}
          </span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 800, delay: 200 },
          }"
          class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {{ $t("landing.hero.description") }}
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{
            opacity: 1,
            scale: 1,
            transition: { duration: 600, delay: 300 },
          }"
          class="flex flex-col sm:flex-row justify-center gap-4"
        >
          <NuxtLink
            to="/register"
            class="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition transform hover:-translate-y-1 inline-flex justify-center"
          >
            {{ $t("landing.hero.cta_start") }}
          </NuxtLink>

          <NuxtLink
            to="/login?demo=true"
            class="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition inline-flex justify-center"
          >
            {{ $t("landing.hero.cta_demo") }}
          </NuxtLink>
        </div>
      </div>

      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply"
      ></div>
    </section>

    <section id="funkcje" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            {{ $t("landing.features.title") }}
          </h2>
          <p class="text-slate-600 max-w-2xl mx-auto">
            {{ $t("landing.features.subtitle") }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition duration-300 group"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: parseInt(`${index}`) * 150 },
            }"
          >
            <div
              class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform"
            >
              {{ rt(feature.icon) }}
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">
              {{ rt(feature.title) }}
            </h3>
            <p class="text-slate-600 leading-relaxed">{{ rt(feature.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="cennik" class="py-24 bg-slate-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            {{ $t("landing.pricing.title") }}
          </h2>
          <p class="text-slate-600">{{ $t("landing.pricing.subtitle") }}</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 items-start">
          <div v-for="(plan, index) in pricing" :key="index" class="h-full">
            <div
              :class="[
                'p-8 rounded-3xl border transition-all duration-300 relative h-full flex flex-col bg-white',
                plan.highlight
                  ? 'border-blue-200 shadow-2xl scale-105 z-10'
                  : 'border-slate-200 hover:shadow-lg',
              ]"
            >
              <div
                v-if="plan.highlight"
                class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
              >
                {{ rt(plan.tag) }}
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-900 mb-2">
                  {{ rt(plan.name) }}
                </h3>
                <p class="text-sm text-slate-500 h-10">{{ rt(plan.desc) }}</p>
              </div>

              <div class="mb-8 flex items-baseline">
                <span class="text-4xl font-extrabold text-slate-900">{{
                  rt(plan.price)
                }}</span>
                <span class="text-slate-500 text-sm ml-2 font-medium">{{
                  rt(plan.period)
                }}</span>
              </div>

              <ul class="space-y-4 mb-8 flex-grow">
                <li
                  v-for="feat in plan.features"
                  :key="feat"
                  class="flex items-start text-slate-600 text-sm"
                >
                  <div
                    class="mr-3 mt-0.5 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <span>{{ rt(feat) }}</span>
                </li>
              </ul>

              <button
                :class="[
                  'w-full py-3.5 rounded-xl font-bold transition text-sm',
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100',
                ]"
                @click="
                  plan.id === 'business'
                    ? $router.push('/kontakt')
                    : $router.push('/app/plan')
                "
              >
                {{ rt(plan.cta) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="opinie" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          class="text-3xl font-bold text-center text-slate-900 mb-12"
          v-motion-slide-visible-once-bottom
        >
          {{ $t("landing.testimonials.title") }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(item, i) in testimonials"
            :key="i"
            class="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative"
            v-motion
            :initial="{ opacity: 0, x: parseInt(`${i}`) % 2 === 0 ? -50 : 50 }"
            :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          >
            <p class="text-slate-700 italic mb-6 relative z-10 pt-4">
              {{ rt(item.text) }}
            </p>
            <div class="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm"
              >
                {{ rt(item.author).charAt(0) }}
              </div>
              <p class="font-bold text-slate-900 text-sm">
                {{ rt(item.author) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-slate-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            {{ $t("landing.faqs.title") }}
          </h2>
          <p class="text-slate-500 text-lg">
            {{ $t("landing.faqs.subtitle") }}
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            :class="{ 'shadow-md border-blue-200': activeFaqIndex === i }"
          >
            <button
              @click="toggleFaq(parseInt(`${i}`))"
              class="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
            >
              <span
                class="font-bold text-lg"
                :class="
                  activeFaqIndex === i ? 'text-blue-600' : 'text-slate-900'
                "
                >{{ rt(faq.q) }}</span
              >
              <span
                class="text-slate-400 transform transition-transform"
                :class="{ 'rotate-180': activeFaqIndex === i }"
                >▼</span
              >
            </button>
            <div
              v-show="activeFaqIndex === i"
              class="px-6 pb-6 text-slate-600 leading-relaxed animate-fade-in"
            >
              {{ rt(faq.a) }}
            </div>
          </div>
        </div>

        <div
          class="mt-12 text-center bg-blue-50/50 border border-blue-100 rounded-2xl p-8"
        >
          <h3 class="font-bold text-slate-900 mb-2">
            {{ $t("landing.faqs.footer_title") }}
          </h3>
          <p class="text-slate-600 mb-6 text-sm">
            {{ $t("landing.faqs.footer_desc") }}
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="$router.push('/pomoc')"
              class="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
            >
              {{ $t("landing.faqs.cta_help") }}
            </button>
            <button
              @click="$router.push('/pomoc/kontakt')"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm"
            >
              {{ $t("landing.faqs.cta_contact") }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
