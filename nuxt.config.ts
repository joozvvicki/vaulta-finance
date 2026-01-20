// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/motion/nuxt",
    "@nuxtjs/supabase",
  ],
  build: {
    transpile: ["vue3-apexcharts"],
  },
  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    supabaseServiceKey: process.env.SUPABASE_SECRET_KEY,

    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,

      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
      },
    },
  },
  app: {
    head: {
      title: "Vaulte - Twoje finanse w jednym miejscu",
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
