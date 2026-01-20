<script setup lang="ts">
const team = [
  {
    name: "Adam Kowalski",
    role: "CEO & Founder",
    bio: "Wcześniej Senior Dev w banku Pekao. Pasjonat fintech.",
    img: "https://i.pravatar.cc/150?u=adam",
  },
  {
    name: "Ewa Nowak",
    role: "CTO",
    bio: "Ekspertka od cyberbezpieczeństwa i PSD2.",
    img: "https://i.pravatar.cc/150?u=ewa",
  },
  {
    name: "Piotr Wiśniewski",
    role: "Head of Product",
    bio: "Tworzył aplikacje dla największych startupów w PL.",
    img: "https://i.pravatar.cc/150?u=piotr",
  },
];

const stats = [
  { label: "Podłączonych banków", value: "15+" },
  { label: "Przeanalizowanych transakcji", value: "2M+" },
  { label: "Zadowolonych użytkowników", value: "10k" },
];
</script>

<template>
  <div class="bg-white">
    <div class="relative bg-slate-900 py-24 sm:py-32 overflow-hidden">
      <div
        class="absolute inset-0 overflow-hidden"
        v-motion
        :initial="{ opacity: 0.5, scale: 1 }"
        :enter="{
          opacity: 1,
          scale: 1.1,
          transition: {
            duration: 5000,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/90 mix-blend-multiply"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          v-motion
          :initial="{ opacity: 0, y: -30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        >
          Misja Vaulte
        </h1>
        <p
          class="mt-6 text-xl text-blue-100 max-w-3xl mx-auto"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 800, delay: 200 },
          }"
        >
          Chcemy, aby każdy miał pełną kontrolę nad swoimi finansami. Wierzymy,
          że otwarte dane bankowe (Open Banking) to przyszłość, która należy do
          użytkownika, a nie do instytucji.
        </p>
      </div>
    </div>

    <section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        class="text-3xl font-bold text-slate-900 mb-6"
        v-motion-slide-visible-once-bottom
      >
        Nasza historia
      </h2>

      <div
        class="prose prose-lg text-slate-600"
        v-motion
        :initial="{ opacity: 0 }"
        :visibleOnce="{ opacity: 1, transition: { duration: 800, delay: 200 } }"
      >
        <p>
          Projekt Vaulte narodził się w 2024 roku, kiedy zauważyliśmy, jak
          trudne jest zarządzanie budżetem, posiadając konta w trzech różnych
          bankach. Logowanie się do każdego z nich, spisywanie wydatków w
          Excelu... to była strata czasu.
        </p>
        <p class="mt-4">
          Postanowiliśmy wykorzystać dyrektywę <strong>PSD2</strong>, aby
          stworzyć jedno bezpieczne miejsce, które agreguje te dane. Dziś
          jesteśmy dumni, że pomagamy tysiącom Polaków oszczędzać mądrzej.
        </p>
      </div>

      <dl class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="flex flex-col border-l-4 border-blue-600 pl-4"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { duration: 500, delay: index * 200 },
          }"
        >
          <dt class="text-sm font-medium text-slate-500">{{ stat.label }}</dt>
          <dd class="text-3xl font-extrabold text-slate-900">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </section>

    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl font-bold text-slate-900">Poznaj zespół</h2>
          <p class="text-slate-600 mt-2">
            Ludzie, którzy dbają o bezpieczeństwo Twoich danych.
          </p>
        </div>

        <ul role="list" class="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(person, index) in team"
            :key="person.name"
            class="group"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: index * 150 },
            }"
          >
            <div
              class="flex items-center gap-x-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <img
                class="h-16 w-16 rounded-full bg-slate-200"
                :src="person.img"
                alt=""
              />
              <div>
                <h3
                  class="text-base font-semibold leading-7 tracking-tight text-slate-900"
                >
                  {{ person.name }}
                </h3>
                <p class="text-sm font-semibold leading-6 text-blue-600">
                  {{ person.role }}
                </p>
                <p class="text-xs text-slate-500 mt-1">{{ person.bio }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
