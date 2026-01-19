<template>
  <div
    class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
      <NuxtLink to="/" class="inline-flex items-center gap-2 justify-center">
        <div
          class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl"
        >
          V
        </div>
        <span class="text-2xl font-bold tracking-tight">Vaulta</span>
      </NuxtLink>
      <h2 class="mt-6 text-3xl font-extrabold text-slate-900">Zaloguj się</h2>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
