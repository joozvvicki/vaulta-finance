<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const form = reactive({
  name: "",
  email: "",
  company: "",
  role: "",
  size: "1-50",
  message: "",
});

const isLoading = ref(false);
const isSent = ref(false);

const handleEnterpriseSubmit = async () => {
  isLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  isLoading.value = false;
  isSent.value = true;
};

const benefits = [
  {
    title: "Dedykowany Opiekun",
    desc: "Twój osobisty Account Manager dostępny 24/7.",
  },
  {
    title: "Wdrożenie On-Premise",
    desc: "Możliwość instalacji Vaulte na Twojej infrastrukturze.",
  },
  { title: "Custom SLA", desc: "Gwarancja dostępności usług do 99.99%." },
  {
    title: "White-Label",
    desc: "Pełny branding aplikacji Twoim logo i kolorami.",
  },
];
</script>

<template>
  <div class="bg-white">
    <div class="relative flex flex-col lg:flex-row min-h-screen">
      <div
        class="lg:w-5/12 bg-slate-900 text-white flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-slate-900 z-0"
        ></div>
        <div
          class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl z-0"
        ></div>

        <div class="relative z-10">
          <span
            class="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider mb-6"
          >
            DLA FIRM I INSTYTUCJI
          </span>

          <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Przenieś finanse firmy na
            <span class="text-blue-500">wyższy poziom.</span>
          </h1>

          <p class="text-slate-400 text-lg mb-12 leading-relaxed">
            Vaulte Enterprise to rozwiązanie szyte na miarę. Porozmawiajmy o
            tym, jak możemy zautomatyzować procesy finansowe w Twojej
            organizacji.
          </p>

          <div class="space-y-8">
            <div
              v-for="benefit in benefits"
              :key="benefit.title"
              class="flex gap-4"
            >
              <div
                class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 flex-shrink-0"
              >
                <svg
                  class="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg text-white">
                  {{ benefit.title }}
                </h3>
                <p class="text-slate-400 text-sm">{{ benefit.desc }}</p>
              </div>
            </div>
          </div>

          <div class="mt-16 pt-8 border-t border-slate-800">
            <p
              class="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4"
            >
              Certyfikaty bezpieczeństwa
            </p>
            <div
              class="flex gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div class="h-8 bg-white/20 w-24 rounded"></div>
              <div class="h-8 bg-white/20 w-24 rounded"></div>
              <div class="h-8 bg-white/20 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="lg:w-7/12 bg-white flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24"
      >
        <div v-if="!isSent" class="max-w-xl mx-auto w-full" v-motion-fade>
          <h2 class="text-3xl font-bold text-slate-900 mb-2">
            Skontaktuj się z działem sprzedaży
          </h2>
          <p class="text-slate-500 mb-10">
            Wypełnij formularz, a nasz konsultant odezwie się do Ciebie w ciągu
            2 godzin.
          </p>

          <form @submit.prevent="handleEnterpriseSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Imię i Nazwisko</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Jan Kowalski"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Służbowy adres email</label
                >
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="jan@firma.pl"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Nazwa firmy</label
                >
                <input
                  v-model="form.company"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Twoja Firma S.A."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Stanowisko</label
                >
                <input
                  v-model="form.role"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="np. CTO / Dyrektor Finansowy"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Wielkość firmy (liczba pracowników)</label
              >
              <select
                v-model="form.size"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="1-50">1 - 50</option>
                <option value="51-200">51 - 200</option>
                <option value="201-500">201 - 500</option>
                <option value="500+">500+</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Wiadomość / Potrzeby</label
              >
              <textarea
                v-model="form.message"
                rows="4"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Opisz krótko, czego szukasz..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex justify-center items-center gap-2"
            >
              <span
                v-if="isLoading"
                class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              ></span>
              {{ isLoading ? "Wysyłanie..." : "Wyślij zapytanie" }}
            </button>

            <p class="text-xs text-slate-500 text-center mt-4">
              Klikając wyślij, akceptujesz naszą
              <NuxtLink
                to="/polityka-prywatnosci"
                class="text-blue-600 hover:underline"
                >Politykę Prywatności</NuxtLink
              >.
            </p>
          </form>
        </div>

        <div v-else class="max-w-md mx-auto text-center" v-motion-pop>
          <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">
            Dziękujemy za kontakt!
          </h2>
          <p class="text-slate-600 text-lg mb-8">
            Twoje zgłoszenie trafiło do naszego zespołu sprzedaży Enterprise.
            <br />
            Nasz konsultant skontaktuje się z Tobą pod adresem
            <strong>{{ form.email }}</strong> w ciągu najbliższych 2 godzin.
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center font-bold text-blue-600 hover:text-blue-800"
          >
            &larr; Wróć na stronę główną
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
