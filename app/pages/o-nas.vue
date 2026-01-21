<script setup lang="ts">
import { computed } from "vue";

const { t, tm, rt } = useI18n();

const team = computed(() => tm("about.team.members") as any);
const stats = computed(() => tm("about.stats") as any);
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
          {{ $t("about.hero.title") }}
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
          {{ $t("about.hero.description") }}
        </p>
      </div>
    </div>

    <section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        class="text-3xl font-bold text-slate-900 mb-6"
        v-motion-slide-visible-once-bottom
      >
        {{ $t("about.history.title") }}
      </h2>

      <div
        class="prose prose-lg text-slate-600"
        v-motion
        :initial="{ opacity: 0 }"
        :visibleOnce="{ opacity: 1, transition: { duration: 800, delay: 200 } }"
      >
        <p>{{ $t("about.history.p1") }}</p>
        <p class="mt-4">
          {{ $t("about.history.p2_start") }} <strong>PSD2</strong>
          {{ $t("about.history.p2_end") }}
        </p>
      </div>

      <dl class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="flex flex-col border-l-4 border-blue-600 pl-4"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { duration: 500, delay: parseInt(`${index}`) * 200 },
          }"
        >
          <dt class="text-sm font-medium text-slate-500">
            {{ rt(stat.label) }}
          </dt>
          <dd class="text-3xl font-extrabold text-slate-900">
            {{ rt(stat.value) }}
          </dd>
        </div>
      </dl>
    </section>

    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
          <h2 class="text-3xl font-bold text-slate-900">
            {{ $t("about.team.title") }}
          </h2>
          <p class="text-slate-600 mt-2">{{ $t("about.team.subtitle") }}</p>
        </div>

        <ul role="list" class="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(person, index) in team"
            :key="index"
            class="group"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: parseInt(`${index}`) * 150 },
            }"
          >
            <div
              class="flex items-center gap-x-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <img
                class="h-16 w-16 rounded-full bg-slate-200 object-cover"
                :src="rt(person.img)"
                :alt="rt(person.name)"
              />
              <div>
                <h3
                  class="text-base font-semibold leading-7 tracking-tight text-slate-900"
                >
                  {{ rt(person.name) }}
                </h3>
                <p class="text-sm font-semibold leading-6 text-blue-600">
                  {{ rt(person.role) }}
                </p>
                <p class="text-xs text-slate-500 mt-1">{{ rt(person.bio) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
