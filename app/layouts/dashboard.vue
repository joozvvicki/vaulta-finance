<script setup lang="ts">
import en from "~/assets/img/GB.svg";
import pl from "~/assets/img/PL.svg";

import {
  IconChartBar,
  IconHome,
  IconListDetails,
  IconTarget,
} from "@tabler/icons-vue";

const toggleLocale = () => {
  setLocale(locale.value === "pl" ? "en" : "pl");
};

const { profile, fetchProfile } = useProfile();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const route = useRoute();
const store = useTransactionStore();
const goalsStore = useGoalsStore();
const budgetStore = useBudgetStore();

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
const { t, locale, setLocale } = useI18n();

const mainItems = computed(() => [
  { name: t("nav.dashboard"), icon: "📊", to: "/app/dashboard" },
  { name: t("nav.transactions"), icon: "💳", to: "/app/transakcje" },
  { name: t("nav.budget"), icon: "📉", to: "/app/budzet" },
  { name: t("nav.goals"), icon: "🎯", to: "/app/cele" },
]);

const settingsItems = computed(() => [
  { name: t("nav.plan"), icon: "💎", to: "/app/plan", highlight: true },
  { name: t("nav.account"), icon: "⚙️", to: "/app/konto" },
]);

const mobileNavItems = computed(() => [
  { name: t("nav.transactions"), icon: IconListDetails, to: "/app/transakcje" },
  { name: t("nav.budget"), icon: IconChartBar, to: "/app/budzet" },
  { name: t("nav.dashboard"), icon: IconHome, to: "/app/dashboard" },
  { name: t("nav.goals"), icon: IconTarget, to: "/app/cele" },
  { name: t("nav.account"), icon: "image", to: "/app/konto" },
]);

const toggleLanguage = () => {
  setLocale(locale.value === "pl" ? "en" : "pl");
};

const activeIndex = computed(() => {
  const index = mobileNavItems.value.findIndex((item) =>
    route.path.startsWith(item.to),
  );
  return index === -1 ? 2 : index;
});

const initAppData = async () => {
  await Promise.all([
    fetchProfile(),
    store.fetchTransactions(),
    goalsStore.fetchGoals(),
    budgetStore.fetchCategories(),
  ]);
};

onMounted(async () => {
  await initAppData();
});
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row relative"
  >
    <aside
      class="hidden md:flex fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex-col shadow-2xl transition-transform duration-300"
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
            >Vaulte</span
          >
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <p
            class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4"
          >
            {{ $t("nav.app") }}
          </p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in mainItems"
              :key="item.name"
              :to="item.to"
              active-class="bg-blue-600/10 text-blue-400 border-blue-600"
              class="flex items-center px-4 py-3 rounded-xl border-l-4 border-transparent hover:bg-slate-800 transition-all duration-300 group relative overflow-hidden"
            >
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
                >PRO</span
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
            {{ profile.full_name || "Użytkownik" }}
          </p>
        </div>
        <button @click="toggleLocale">
          <img :src="pl" v-if="locale === 'pl'" class="w-6 h-4" />
          <img :src="en" v-if="locale === 'en'" class="w-6 h-4" />
        </button>
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

    <main
      class="flex-1 md:ml-72 flex flex-col h-screen overflow-hidden relative"
    >
      <div class="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 pb-28 md:pb-8">
        <slot />
      </div>
    </main>

    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 h-20 px-2 rounded-t-3xl"
    >
      <div class="relative flex w-full h-full">
        <div
          class="absolute top-[1.05rem] left-0 w-1/5 h-full pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
          :style="{ transform: `translateX(${activeIndex * 100}%)` }"
        >
          <div
            class="w-12 h-12 mx-auto bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full shadow-lg shadow-indigo-500/40 -mt-6 flex items-center justify-center"
          ></div>
        </div>

        <NuxtLink
          v-for="(item, index) in mobileNavItems"
          :key="item.name"
          :to="item.to"
          class="flex-1 flex flex-col items-center justify-center relative z-10 group"
          :class="{
            'text-white': activeIndex === index,
            'text-slate-400': activeIndex !== index,
          }"
        >
          <div
            class="flex flex-col items-center justify-center transition-all duration-300"
            :class="activeIndex === index ? '-translate-y-6' : 'translate-y-0'"
          >
            <span
              class="text-2xl transition-colors duration-300"
              :class="
                activeIndex === index
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-600'
              "
            >
              <img
                v-if="item.icon === 'image'"
                :src="profile.avatar_url"
                class="w-6 h-6 rounded-full"
              />
              <component v-else :is="item.icon" />
            </span>
          </div>

          <span
            class="absolute bottom-3 text-[10px] font-bold tracking-wide transition-all duration-300"
            :class="
              activeIndex === index
                ? 'text-indigo-600 opacity-100 translate-y-0 delay-100'
                : 'opacity-0 translate-y-4'
            "
          >
            {{ item.name }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <AiAssistant />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
</style>
