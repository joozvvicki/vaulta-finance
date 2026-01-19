<script setup lang="ts">
import { ref } from "vue";

const features = [
  {
    title: "Agregacja Kont",
    desc: "Połącz rachunki z PKO, Pekao, mBanku, Revoluta i innych w jeden przejrzysty widok.",
    icon: "🏦",
  },
  {
    title: "Inteligentna Analityka",
    desc: "Algorytmy AI automatycznie kategoryzują Twoje wydatki, wykrywając subskrypcje i trendy.",
    icon: "🧠",
  },
  {
    title: "Kontrola Budżetu",
    desc: "Ustaw limity dla kategorii (np. 'Jedzenie na mieście') i otrzymuj powiadomienia push przed ich przekroczeniem.",
    icon: "📉",
  },
];

const pricing = [
  {
    name: "Basic",
    price: "0 zł",
    period: "na zawsze",
    description: "Idealny na start, by zapanować nad chaosem w portfelu.",
    features: [
      "Podłączenie do 2 banków",
      "Historia transakcji: 3 miesiące",
      "Podstawowe kategorie wydatków",
      "Ręczne dodawanie gotówki",
    ],
    cta: "Załóż darmowe konto",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19,99 zł",
    period: "/ mies",
    description:
      "Pełna automatyzacja i sztuczna inteligencja dla Twoich finansów.",
    features: [
      "Nielimitowana liczba banków",
      "Pełna historia transakcji",
      "Inteligentna kategoryzacja (AI)",
      "Alerty budżetowe i powiadomienia",
      "Eksport do Excel (XLSX/CSV)",
      "Śledzenie celów oszczędnościowych",
    ],
    cta: "Rozpocznij okres próbny",
    highlight: true,
    tag: "Najczęściej wybierany",
  },
  {
    name: "Business",
    price: "Wycena",
    period: "indywidualna",
    description: "Dla biur rachunkowych, doradców i firm potrzebujących API.",
    features: [
      "Dostęp do API Vaulta",
      "Panel dla wielu użytkowników",
      "Raporty White-Label",
      "Dedykowany opiekun konta",
      "Wdrożenie On-Premise",
    ],
    cta: "Skontaktuj się z nami",
    highlight: false,
  },
];

const testimonials = [
  {
    text: "W końcu widzę wszystkie wydatki w jednym miejscu. Integracja z Pekao działa błyskawicznie.",
    author: "Marek K., Freelancer",
  },
  {
    text: "Budget Tracker uratował moje finanse przed wakacjami. Polecam wersję Pro!",
    author: "Anna N., Graficzka",
  },
];

const faqs = [
  {
    q: "Czy Vaulta jest bezpieczna?",
    a: "Bezpieczeństwo to nasz priorytet. Korzystamy z szyfrowania AES-256 oraz połączeń SSL. Współpracujemy wyłącznie z licencjonowanymi dostawcami Open Banking (zgodnymi z dyrektywą PSD2), co oznacza, że nigdy nie widzimy Twoich haseł do bankowości – logowanie odbywa się bezpośrednio na stronie banku.",
  },
  {
    q: "Jakie banki obsługujecie?",
    a: "Obsługujemy ponad 20 instytucji w Polsce, w tym największe banki: PKO BP, Pekao SA, mBank, ING, Santander, Millennium, Alior Bank, BNP Paribas oraz Revolut. Lista jest stale poszerzana.",
  },
  {
    q: "Czy mogę wykonywać przelewy przez aplikację?",
    a: "W obecnej wersji Vaulta skupia się na agregacji danych (usługa AIS), co pozwala na analizę finansów. Moduł płatności (PIS), pozwalający na zlecanie przelewów, jest w fazie testów i zostanie udostępniony użytkownikom wersji Pro w Q4 2026.",
  },
  {
    q: "Czy mogę zrezygnować w dowolnym momencie?",
    a: "Tak. Subskrypcja jest miesięczna i możesz ją anulować jednym kliknięciem w panelu użytkownika. Zachowasz dostęp do funkcji Pro do końca opłaconego okresu.",
  },
];

const activeFaqIndex = ref<number | null>(0);

const toggleFaq = (index: number) => {
  if (activeFaqIndex.value === index) {
    activeFaqIndex.value = null;
  } else {
    activeFaqIndex.value = index;
  }
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
          Nowa integracja: Bank Pekao API 🚀
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
          Twoje finanse.<br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            W jednym miejscu.
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
          Połącz konta bankowe, śledź wydatki i kontroluj budżet domowy za
          pomocą bezpiecznego API. Bez ręcznego wpisywania danych.
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
            Zacznij za darmo
          </NuxtLink>

          <NuxtLink
            to="/login?demo=true"
            class="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition inline-flex justify-center"
          >
            Zobacz demo
          </NuxtLink>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{ opacity: 0.5, scale: 1, transition: { duration: 1500 } }"
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-3xl -z-10 mix-blend-multiply"
      ></div>
    </section>

    <section id="funkcje" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            Co potrafi Vaulta?
          </h2>
          <p class="text-slate-600 max-w-2xl mx-auto">
            Wykorzystujemy technologię Open Banking, aby dać Ci pełną kontrolę
            nad pieniędzmi.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition duration-300 group"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: index * 150 },
            }"
          >
            <div
              class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300"
            >
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-slate-600 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="cennik" class="py-24 bg-slate-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            Proste plany cenowe
          </h2>
          <p class="text-slate-600">
            Bez ukrytych opłat. Zrezygnuj w dowolnym momencie.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 items-start">
          <div
            v-for="(plan, index) in pricing"
            :key="plan.name"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: index * 150 },
            }"
            class="h-full"
          >
            <div
              :class="[
                'p-8 rounded-3xl border transition-all duration-300 relative h-full flex flex-col',
                plan.highlight
                  ? 'bg-white border-blue-200 shadow-2xl shadow-blue-900/10 scale-105 z-10'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg',
              ]"
            >
              <div
                v-if="plan.highlight"
                class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
              >
                {{ plan.tag }}
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-900 mb-2">
                  {{ plan.name }}
                </h3>
                <p class="text-sm text-slate-500 h-10">
                  {{ plan.description }}
                </p>
              </div>

              <div class="mb-8 flex items-baseline">
                <span class="text-4xl font-extrabold text-slate-900">{{
                  plan.price
                }}</span>
                <span class="text-slate-500 text-sm ml-2 font-medium">{{
                  plan.period
                }}</span>
              </div>

              <div class="border-t border-slate-100 my-6"></div>

              <ul class="space-y-4 mb-8 flex-grow">
                <li
                  v-for="feat in plan.features"
                  :key="feat"
                  class="flex items-start text-slate-600 text-sm group"
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="group-hover:text-slate-900 transition-colors">{{
                    feat
                  }}</span>
                </li>
              </ul>

              <button
                :class="[
                  'w-full py-3.5 rounded-xl font-bold transition text-sm',
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300',
                ]"
                @click="
                  plan.name === 'Business'
                    ? $router.push('/kontakt')
                    : $router.push('/register')
                "
              >
                {{ plan.cta }}
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
          Zaufali nam
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(item, i) in testimonials"
            :key="i"
            class="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative"
            v-motion
            :initial="{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }"
            :visibleOnce="{
              opacity: 1,
              x: 0,
              transition: { duration: 600, delay: 100 },
            }"
          >
            <div
              class="absolute top-6 left-6 text-4xl text-slate-200 font-serif leading-none"
            >
              "
            </div>
            <p class="text-slate-700 italic mb-6 relative z-10 pt-4 pl-2">
              {{ item.text }}
            </p>
            <div class="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm"
              >
                {{ item.author.charAt(0) }}
              </div>
              <p class="font-bold text-slate-900 text-sm">{{ item.author }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-slate-50 relative overflow-hidden">
      <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
      ></div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="text-center mb-12" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Częste pytania
          </h2>
          <p class="text-slate-500 text-lg">
            Wszystko, co musisz wiedzieć o bezpieczeństwie i funkcjach Vaulta.
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="bg-white rounded-2xl border border-slate-200 transition-all duration-300 overflow-hidden"
            :class="{
              'shadow-md border-blue-200 ring-1 ring-blue-100':
                activeFaqIndex === i,
            }"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 400, delay: i * 100 },
            }"
          >
            <button
              @click="toggleFaq(i)"
              class="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
            >
              <span
                class="font-bold text-lg transition-colors duration-300"
                :class="
                  activeFaqIndex === i ? 'text-blue-600' : 'text-slate-900'
                "
              >
                {{ faq.q }}
              </span>

              <span
                class="relative ml-4 flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                <span
                  class="absolute w-4 h-0.5 bg-current rounded-full transition-colors"
                  :class="activeFaqIndex === i ? 'bg-blue-600' : 'bg-slate-400'"
                ></span>
                <span
                  class="absolute w-0.5 h-4 bg-current rounded-full transition-all duration-300"
                  :class="[
                    activeFaqIndex === i
                      ? 'rotate-90 opacity-0 bg-blue-600'
                      : 'rotate-0 opacity-100 bg-slate-400',
                  ]"
                ></span>
              </span>
            </button>

            <div
              class="grid transition-[grid-template-rows] duration-300 ease-out"
              :class="
                activeFaqIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              "
            >
              <div class="overflow-hidden">
                <div
                  class="px-6 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-transparent"
                  :class="{ 'border-slate-100 pt-2': activeFaqIndex === i }"
                >
                  {{ faq.a }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-12 text-center bg-blue-50/50 border border-blue-100 rounded-2xl p-8"
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{
            opacity: 1,
            scale: 1,
            transition: { duration: 500, delay: 400 },
          }"
        >
          <h3 class="font-bold text-slate-900 mb-2">Nadal masz pytania?</h3>
          <p class="text-slate-600 mb-6 text-sm">
            Nie możesz znaleźć odpowiedzi, której szukasz? Porozmawiaj z naszym
            zespołem.
          </p>
          <div class="flex justify-center gap-4">
            <button
              class="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
              @click="$router.push('/pomoc')"
            >
              Centrum Pomocy
            </button>
            <button
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm shadow-sm"
              @click="$router.push('/pomoc/kontakt')"
            >
              Napisz do nas
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
