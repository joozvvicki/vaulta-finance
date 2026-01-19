<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px); /* Lekkie przesunięcie w górę przy wejściu */
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Lekkie przesunięcie w górę przy wyjściu */
}
</style>
