<script setup lang="ts">
const route = useRoute();

const title = computed(() => {
  if (route.path.includes("register")) return "Utwórz konto";
  if (route.path.includes("forgot")) return "Reset hasła";
  return "Zaloguj się";
});
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 justify-center hover:opacity-90 transition"
      >
        <div
          class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30"
        >
          V
        </div>
        <span class="text-2xl font-bold tracking-tight text-slate-900"
          >Vaulta</span
        >
      </NuxtLink>
      <h2 class="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
        {{ title }}
      </h2>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white py-8 px-4 shadow-xl shadow-slate-200/60 sm:rounded-2xl sm:px-10 border border-slate-100"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
