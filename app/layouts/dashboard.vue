<script setup lang="ts">
const menuItems = [
  { name: "Pulpit", icon: "📊", to: "/app/dashboard" },
  { name: "Transakcje", icon: "💳", to: "/app/transakcje" },
  { name: "Budżet", icon: "📉", to: "/app/budzet" },
  { name: "Cele", icon: "🎯", to: "/app/cele" },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
    <aside
      class="hidden md:flex w-72 flex-col bg-slate-900 border-r border-slate-800 text-slate-300 fixed inset-y-0 z-50 shadow-2xl"
      v-motion-slide-left
    >
      <div
        class="h-20 flex items-center px-8 border-b border-slate-800/50 bg-gradient-to-r from-slate-900 to-slate-800"
      >
        <div
          class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 mr-3"
        >
          V
        </div>
        <span class="text-white font-bold text-xl tracking-tight">Vaulta</span>
      </div>

      <nav class="flex-1 px-4 py-8 space-y-2">
        <p
          class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4"
        >
          Menu Główne
        </p>

        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          active-class="bg-blue-600/10 text-blue-400 border-blue-600"
          class="flex items-center px-4 py-3 rounded-xl border-l-4 border-transparent hover:bg-slate-800 transition-all duration-300 group relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <span
            class="mr-3 text-xl group-hover:scale-110 transition-transform duration-300 block"
            >{{ item.icon }}</span
          >
          <span class="font-medium">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div
        class="p-4 m-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3 hover:bg-slate-800 transition cursor-pointer"
      >
        <img
          src="https://i.pravatar.cc/150?u=marek"
          alt="Avatar"
          class="w-10 h-10 rounded-full border-2 border-slate-600"
        />
        <div class="overflow-hidden">
          <p class="text-sm font-bold text-white truncate">Marek Nowak</p>
          <p class="text-xs text-slate-500 truncate">marek@example.com</p>
        </div>
        <button class="ml-auto text-slate-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    </aside>

    <main class="flex-1 md:ml-72 p-8 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
