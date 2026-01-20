<template>
  <NuxtLayout>
    <VitePwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
  overscroll-behavior-y: none;
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

<script setup lang="ts">
useHead({
  title: "Vaulte",
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    },
    { name: "theme-color", content: "#ffffff" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
  ],
  link: [{ rel: "apple-touch-icon", href: "/pwa-192x192.png" }],
});
</script>
