<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
    <header
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <NuxtLink to="/" class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"
          >
            V
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-900"
            >Vaulta</span
          >
        </NuxtLink>
        <nav class="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <NuxtLink to="/" class="hover:text-blue-600 transition"
            >Strona główna</NuxtLink
          >
          <NuxtLink to="/o-nas" class="hover:text-blue-600 transition"
            >O nas</NuxtLink
          >
          <NuxtLink to="/#cennik" class="hover:text-blue-600 transition"
            >Cennik</NuxtLink
          >
        </nav>
        <button
          class="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition"
          @click="$router.push({ path: '/app/login' })"
        >
          Zaloguj się
        </button>
      </div>
    </header>

    <slot />

    <footer class="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8"
      >
        <div>
          <div class="text-white font-bold text-xl mb-4">Vaulta</div>
          <p class="text-sm">Twoje centrum dowodzenia finansami.</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">Firma</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/o-nas" class="hover:text-white">O nas</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/kariera" class="hover:text-white"
                >Kariera</NuxtLink
              >
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">Prawne</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/app/regulamin" class="hover:text-white transition"
                >Regulamin</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/app/polityka-prywatnosci"
                class="hover:text-white transition"
                >Polityka Prywatności</NuxtLink
              >
            </li>
            <li>
              <a href="#" class="hover:text-white transition">RODO</a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs"
      >
        &copy; 2026 Vaulta Sp. z o.o.
      </div>
    </footer>
  </div>
</template>
