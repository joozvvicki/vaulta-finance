<script setup lang="ts">
import { computed, onMounted } from "vue";
import en from "~/assets/img/GB.svg";
import pl from "~/assets/img/PL.svg";

const user = useSupabaseUser();
const { profile, fetchProfile } = useProfile();
const { t, locale, setLocale } = useI18n();

const userInitial = computed(() => {
  const name = profile.value?.full_name || user.value?.email;
  return name ? name.charAt(0).toUpperCase() : "U";
});

const displayName = computed(() => {
  return profile.value?.full_name?.split(" ")[0] || t("common.user");
});

const toggleLocale = () => {
  setLocale(locale.value === "pl" ? "en" : "pl");
};

onMounted(async () => {
  await fetchProfile();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
    <header
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative"
      >
        <div class="flex-1 flex items-center justify-start">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform"
            >
              V
            </div>
            <span class="text-xl font-bold tracking-tight text-slate-900"
              >Vaulte</span
            >
          </NuxtLink>
        </div>

        <nav
          class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 text-sm font-medium text-slate-600"
        >
          <NuxtLink to="/" class="hover:text-blue-600 transition">{{
            $t("layout.nav.home")
          }}</NuxtLink>
          <NuxtLink to="/o-nas" class="hover:text-blue-600 transition">{{
            $t("layout.nav.about")
          }}</NuxtLink>
          <NuxtLink to="/#cennik" class="hover:text-blue-600 transition">{{
            $t("layout.nav.pricing")
          }}</NuxtLink>
          <NuxtLink to="/kariera" class="hover:text-blue-600 transition">{{
            $t("layout.nav.careers")
          }}</NuxtLink>
        </nav>

        <div class="flex-1 flex items-center justify-end gap-4">
          <div v-if="user" class="flex items-center gap-3">
            <div class="hidden sm:flex flex-col items-end mr-1">
              <span
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >
                {{ $t("layout.auth.loggedInAs") }}
              </span>
              <span class="text-sm font-bold text-slate-900 leading-tight">{{
                displayName
              }}</span>
            </div>

            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              class="w-8 h-8 rounded-full border border-blue-200 object-cover"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200"
            >
              {{ userInitial }}
            </div>

            <NuxtLink
              to="/app/dashboard"
              class="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg flex items-center gap-2"
            >
              {{ $t("layout.auth.dashboard") }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </NuxtLink>
          </div>

          <div v-else class="flex gap-2">
            <button
              class="text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 transition"
              @click="$router.push('/login')"
            >
              {{ $t("layout.auth.login") }}
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg"
              @click="$router.push('/register')"
            >
              {{ $t("layout.auth.register") }}
            </button>
          </div>
          <button @click="toggleLocale">
            <img :src="pl" v-if="locale === 'pl'" class="w-6 h-4" />
            <img :src="en" v-if="locale === 'en'" class="w-6 h-4" />
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow w-full relative z-0">
      <slot />
    </main>

    <footer class="bg-slate-900 text-slate-400 py-12 relative z-10">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8"
      >
        <div>
          <div
            class="text-white font-bold text-xl mb-4 flex items-center gap-2"
          >
            <div
              class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs"
            >
              V
            </div>
            Vaulte
          </div>
          <p class="text-sm">{{ $t("layout.footer.tagline") }}</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">
            {{ $t("layout.footer.company") }}
          </h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/o-nas" class="hover:text-white transition">{{
                $t("layout.nav.about")
              }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/kariera" class="hover:text-white transition">{{
                $t("layout.nav.careers")
              }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">
            {{ $t("layout.footer.legal") }}
          </h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/regulamin" class="hover:text-white transition">{{
                $t("layout.footer.terms")
              }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/polityka-prywatnosci"
                class="hover:text-white transition"
                >{{ $t("layout.footer.privacy") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/rodo" class="hover:text-white transition">{{
                $t("layout.footer.gdpr")
              }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-widest font-bold"
      >
        &copy; 2026 Vaulte Sp. z o.o.
      </div>
    </footer>
  </div>
</template>
