// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/motion/nuxt",
    "@nuxtjs/supabase",
    "@vite-pwa/nuxt",
    "@nuxtjs/i18n",
  ],
  build: {
    transpile: ["vue3-apexcharts"],
  },
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "pl",
    langDir: "locales",
    locales: [
      {
        code: "pl",
        iso: "pl-PL",
        file: "pl.json",
      },
      {
        code: "en",
        iso: "en-US",
        file: "en.json",
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
    },
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
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY,

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
  pwa: {
    manifest: {
      name: "Vaulte Finance",
      short_name: "Vaulte",
      description: "Twoje finanse pod kontrolą",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      lang: "pl",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
    },
  },
});
