<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const benefits = [
  {
    title: "Praca Zdalna",
    desc: "Pracuj skąd chcesz. Biuro w Warszawie jest opcjonalne.",
    icon: "🏠",
  },
  {
    title: "Nowoczesny Stack",
    desc: "Nuxt 3, TypeScript, Tailwind. Zero legacy code.",
    icon: "💻",
  },
  {
    title: "Budżet Edukacyjny",
    desc: "3000 PLN rocznie na konferencje, kursy i książki.",
    icon: "📚",
  },
  {
    title: "Prywatna Opieka",
    desc: "Pakiet VIP w LuxMed dla Ciebie i Twojej rodziny.",
    icon: "❤️",
  },
];

const offers = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    salary: "20k - 28k PLN netto + VAT",
    type: "B2B",
    tags: ["Vue 3", "Nuxt", "TypeScript"],
    new: true,
  },
  {
    id: 2,
    title: "Mid Backend Developer (Node.js)",
    salary: "14k - 20k PLN netto + VAT",
    type: "B2B",
    tags: ["NestJS", "PostgreSQL", "Redis"],
    new: false,
  },
  {
    id: 3,
    title: "Product Designer (UX/UI)",
    salary: "12k - 18k PLN brutto",
    type: "UoP",
    tags: ["Figma", "Design System", "User Research"],
    new: false,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    salary: "22k - 30k PLN netto + VAT",
    type: "B2B",
    tags: ["AWS", "Terraform", "Kubernetes"],
    new: true,
  },
];

const openMail = (role: string) => {
  window.location.href = `mailto:rekrutacja@Vaulte.pl?subject=Aplikacja na stanowisko: ${role}`;
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
          class="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold tracking-wider mb-6"
        >
          DOŁĄCZ DO NAS
        </span>
        <h1
          class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
        >
          Budujemy przyszłość <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"
            >polskich finansów.</span
          >
        </h1>
        <p class="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
          Tworzymy Vaulte, aby każdy miał kontrolę nad swoimi pieniędzmi.
          Szukamy pasjonatów, którzy nie boją się wyzwań i trudnych problemów
          technicznych.
        </p>
        <button
          @click="
            $el.querySelector('#oferty').scrollIntoView({ behavior: 'smooth' })
          "
          class="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
        >
          Zobacz oferty pracy
        </button>
      </div>
    </section>

    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900">Dlaczego Vaulte?</h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(benefit, index) in benefits"
            :key="benefit.title"
            class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
          >
            <div class="text-4xl mb-4">{{ benefit.icon }}</div>
            <h3 class="font-bold text-lg text-slate-900 mb-2">
              {{ benefit.title }}
            </h3>
            <p class="text-sm text-slate-500">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="oferty" class="py-20 bg-white border-t border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Aktualne oferty</h2>
            <p class="text-slate-500 mt-2">Dołącz do zespołu inżynierskiego.</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(offer, index) in offers"
            :key="offer.id"
            class="group bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: index * 100 } }"
            @click="openMail(offer.title)"
          >
            <div
              v-if="offer.new"
              class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg"
            >
              NEW
            </div>

            <div class="flex-1">
              <h3
                class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition"
              >
                {{ offer.title }}
              </h3>
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in offer.tags"
                  :key="tag"
                  class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div
              class="mt-4 md:mt-0 md:text-right md:pl-8 flex flex-col items-start md:items-end gap-1"
            >
              <span
                class="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-sm"
                >{{ offer.salary }}</span
              >
              <span
                class="text-slate-400 text-xs font-medium uppercase tracking-wide"
                >{{ offer.type }} • Zdalnie</span
              >
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
            Nie widzisz oferty dla siebie?
          </h3>
          <p class="text-slate-500 mt-2 mb-6">
            Ciągle rośniemy. Wyślij nam swoje CV, a odezwiemy się, gdy otworzymy
            nową rekrutację.
          </p>
          <a
            href="/pomoc/kontakt"
            class="text-blue-600 font-bold hover:underline"
            >Napisz do nas &rarr;</a
          >
        </div>
      </div>
    </section>
  </div>
</template>
