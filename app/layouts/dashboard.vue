<script setup lang="ts">
const { profile, fetchProfile } = useProfile();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const store = useTransactionStore();

// Jedyny watch, który inicjuje pobieranie danych dla całej aplikacji
watch(
  () => user.value?.id,
  (id) => {
    if (id) fetchProfile(id);
  },
  { immediate: true },
);

const handleLogout = async () => {
  await client.auth.signOut();
  router.push("/login");
};

const mainItems = [
  { name: "Pulpit", icon: "📊", to: "/app/dashboard" },
  { name: "Transakcje", icon: "💳", to: "/app/transakcje" },
  { name: "Budżet", icon: "📉", to: "/app/budzet" },
  { name: "Cele", icon: "🎯", to: "/app/cele" },
];

const settingsItems = [
  { name: "Mój Plan", icon: "💎", to: "/app/plan", highlight: true },
  { name: "Konto", icon: "⚙️", to: "/app/konto" },
];

const goalsStore = useGoalsStore();

const initAppData = async () => {
  await Promise.all([
    fetchProfile(),
    store.fetchTransactions(),
    goalsStore.fetchGoals(),
  ]);
};

onMounted(async () => {
  await initAppData();
});
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
        <NuxtLink to="/app/dashboard" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform"
          >
            V
          </div>
          <span class="text-white font-bold text-xl tracking-tight"
            >Vaulta</span
          >
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <p
            class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4"
          >
            Aplikacja
          </p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in mainItems"
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
          </div>
        </div>

        <div>
          <p
            class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4"
          >
            Konto
          </p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in settingsItems"
              :key="item.name"
              :to="item.to"
              active-class="bg-blue-600/10 text-blue-400 border-blue-600"
              class="flex items-center justify-between px-4 py-3 rounded-xl border-l-4 border-transparent hover:bg-slate-800 transition-all group relative overflow-hidden"
            >
              <div class="flex items-center">
                <span
                  class="mr-3 text-xl group-hover:scale-110 transition-transform block"
                  >{{ item.icon }}</span
                >
                <span class="font-medium">{{ item.name }}</span>
              </div>
              <span
                v-if="item.highlight"
                class="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/40"
                >UPGRADE</span
              >
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div
        class="p-4 m-4 mt-auto rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3 hover:bg-slate-800 transition group"
      >
        <img
          v-if="profile.avatar_url"
          :src="profile.avatar_url"
          class="w-10 h-10 rounded-full border-2 border-slate-600 group-hover:border-blue-500 object-cover"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border-2 border-slate-600"
        >
          {{ profile.email?.charAt(0).toUpperCase() }}
        </div>

        <div class="overflow-hidden flex-1">
          <p class="text-sm font-bold text-white truncate">
            {{ profile.full_name }}
          </p>
          <p class="text-xs text-slate-500 truncate group-hover:text-blue-400">
            {{ profile.email }}
          </p>
        </div>

        <button
          @click="handleLogout"
          class="ml-auto text-slate-400 hover:text-red-400 transition-transform hover:scale-110"
        >
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

    <main class="flex-1 md:ml-72 flex flex-col h-screen overflow-hidden">
      <div
        class="bg-indigo-600 text-white px-4 py-2 text-sm font-medium text-center shadow-md z-40 relative"
      >
        👋 Cześć {{ profile.full_name }}! Zarządzasz swoim portfelem.
      </div>
      <div class="flex-1 overflow-y-auto p-8 bg-slate-50">
        <slot />
      </div>
    </main>
  </div>
</template>
