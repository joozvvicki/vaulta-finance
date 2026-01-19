// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@vueuse/motion/nuxt"],
  build: {
    transpile: ["vue3-apexcharts"],
  },

  app: {
    head: {
      title: "Vaulta - Twoje finanse w jednym miejscu",
      meta: [
        {
          name: "description",
          content:
            "Agregacja kont bankowych, budżet domowy i analiza wydatków.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo.png",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  ssr: false,
});
