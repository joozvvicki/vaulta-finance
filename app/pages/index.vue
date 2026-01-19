<script setup lang="ts">
const features = [
  {
    title: "Saldo w czasie rzeczywistym",
    desc: "Sprawdzaj stan konta w Pekao, PKO, mBanku i innych w jednej aplikacji.",
    icon: "💰",
  },
  {
    title: "Historia transakcji",
    desc: "Pobieraj i analizuj historię przelewów z ostatnich 12 miesięcy.",
    icon: "📊",
  },
  {
    title: "Budget Tracker",
    desc: "Ustaw limity wydatków i otrzymuj powiadomienia, gdy zbliżysz się do granicy.",
    icon: "📉",
  },
];

const pricing = [
  {
    name: "Start",
    price: "0 zł",
    period: "/ mies",
    features: ["Podłączenie 1 banku", "Historia 30 dni", "Podstawowe wykresy"],
    cta: "Załóż konto",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19 zł",
    period: "/ mies",
    features: [
      "Nielimitowane banki",
      "Historia 3 lata",
      "Eksport do Excela/CSV",
      "Kategorie AI",
    ],
    cta: "Wybieram Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Indywidualna",
    period: "",
    features: [
      "Dostęp do API",
      "Dedykowane wsparcie",
      "Wdrożenie On-Premise",
      "SLA 99.9%",
    ],
    cta: "Kontakt",
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
          class="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full"
        >
          Nowa integracja: Bank Pekao API 🚀
        </div>
        <h1
          class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
        >
          Twoje finanse.<br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
            >W jednym miejscu.</span
          >
        </h1>
        <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Połącz konta bankowe, śledź wydatki i kontroluj budżet domowy za
          pomocą bezpiecznego API. Bez ręcznego wpisywania danych.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button
            class="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
          >
            Zacznij za darmo
          </button>
          <button
            class="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition"
          >
            Zobacz demo
          </button>
        </div>
      </div>

      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10 opacity-50"
      ></div>
    </section>

    <section id="funkcje" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            Co potrafi Vaulta?
          </h2>
          <p class="text-slate-600">
            Technologia Open Banking pracuje dla Ciebie.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition duration-300"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-slate-600">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="cennik" class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900">
            Wybierz plan dla siebie
          </h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8 items-center">
          <div
            v-for="plan in pricing"
            :key="plan.name"
            :class="[
              'p-8 rounded-2xl border transition relative',
              plan.highlight
                ? 'bg-white border-blue-200 shadow-2xl scale-105 z-10'
                : 'bg-slate-100 border-slate-200',
            ]"
          >
            <div
              v-if="plan.highlight"
              class="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg"
            >
              POLECANY
            </div>
            <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
            <div class="my-4">
              <span class="text-4xl font-extrabold text-slate-900">{{
                plan.price
              }}</span>
              <span class="text-slate-500 text-sm">{{ plan.period }}</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li
                v-for="feat in plan.features"
                :key="feat"
                class="flex items-center text-slate-600 text-sm"
              >
                <span class="mr-2 text-green-500">✓</span> {{ feat }}
              </li>
            </ul>
            <button
              :class="[
                'w-full py-3 rounded-lg font-bold transition',
                plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
              ]"
            >
              {{ plan.cta }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="opinie" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-slate-900 mb-12">
          Zaufali nam
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(item, i) in testimonials"
            :key="i"
            class="p-6 bg-slate-50 rounded-xl border border-slate-100"
          >
            <p class="text-slate-700 italic mb-4">"{{ item.text }}"</p>
            <p class="font-bold text-slate-900">– {{ item.author }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-slate-50 relative overflow-hidden">
      <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
      ></div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="text-center mb-12">
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
        >
          <h3 class="font-bold text-slate-900 mb-2">Nadal masz pytania?</h3>
          <p class="text-slate-600 mb-6 text-sm">
            Nie możesz znaleźć odpowiedzi, której szukasz? Porozmawiaj z naszym
            zespołem.
          </p>
          <div class="flex justify-center gap-4">
            <button
              class="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
            >
              Centrum Pomocy
            </button>
            <button
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm shadow-sm"
            >
              Napisz do nas
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
