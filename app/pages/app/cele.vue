<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const goals = [
  {
    id: 1,
    title: "Wakacje w Japonii",
    saved: 8500,
    target: 15000,
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
    color: "bg-purple-600",
  },
  {
    id: 2,
    title: "Nowy MacBook",
    saved: 4200,
    target: 10000,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    color: "bg-teal-500",
  },
  {
    id: 3,
    title: "Fundusz awaryjny",
    saved: 12000,
    target: 20000,
    img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80",
    color: "bg-emerald-600",
  },
];
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Cele Oszczędnościowe 🎯</h1>
      <p class="text-slate-500">Małe kroki prowadzą do wielkich rzeczy.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        class="group border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center min-h-[300px] hover:border-blue-500 hover:bg-blue-50 transition p-6"
      >
        <div
          class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition"
        >
          <span class="text-3xl text-slate-400 group-hover:text-blue-600"
            >+</span
          >
        </div>
        <span class="font-bold text-slate-600 group-hover:text-blue-700"
          >Utwórz nowy cel</span
        >
      </button>

      <div
        v-for="(goal, index) in goals"
        :key="goal.id"
        class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-all hover:-translate-y-1"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { delay: index * 100 } }"
      >
        <div class="h-40 overflow-hidden relative">
          <img
            :src="goal.img"
            class="w-full h-full object-cover transition hover:scale-105 duration-700"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
          >
            <h3 class="text-white font-bold text-lg text-shadow">
              {{ goal.title }}
            </h3>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="flex justify-between text-sm mb-2 font-medium">
            <span class="text-slate-500">Postęp</span>
            <span class="text-slate-900"
              >{{ Math.round((goal.saved / goal.target) * 100) }}%</span
            >
          </div>

          <div class="w-full bg-slate-100 rounded-full h-3 mb-4">
            <div
              class="h-3 rounded-full transition-all duration-1000"
              :class="goal.color"
              :style="{ width: `${(goal.saved / goal.target) * 100}%` }"
            ></div>
          </div>

          <div class="flex justify-between items-end mt-auto">
            <div>
              <p class="text-xs text-slate-500 uppercase font-semibold">
                Uzbierano
              </p>
              <p class="text-xl font-bold text-slate-900">
                {{ goal.saved.toLocaleString() }} zł
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500 uppercase font-semibold">Cel</p>
              <p class="text-sm font-medium text-slate-600">
                {{ goal.target.toLocaleString() }} zł
              </p>
            </div>
          </div>

          <button
            class="w-full mt-6 py-2 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            Dopłać +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
