<script setup lang="ts">
definePageMeta({ layout: "default" });

const form = reactive({
  email: "",
  topic: "Techniczny",
  message: "",
  file: null,
});

const isSending = ref(false);
const isSuccess = ref(false);

const handleSubmit = async () => {
  if (!form.message || !form.email) return;
  isSending.value = true;

  await new Promise((r) => setTimeout(r, 1500));

  isSending.value = false;
  isSuccess.value = true;
};
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="mb-10 text-center">
        <NuxtLink
          to="/pomoc"
          class="text-sm font-bold text-blue-600 hover:underline mb-4 inline-block"
          >&larr; Wróć do Centrum Pomocy</NuxtLink
        >
        <h1 class="text-3xl font-extrabold text-slate-900">Napisz do nas</h1>
        <p class="text-slate-500 mt-2">
          Nasi eksperci odpowiadają zazwyczaj w ciągu 24h.
        </p>
      </div>

      <div
        v-if="!isSuccess"
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        v-motion-fade
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Twój adres email</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="jan@przyklad.pl"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Temat zgłoszenia</label
            >
            <select
              v-model="form.topic"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option>Problem techniczny</option>
              <option>Płatności i Faktury</option>
              <option>Zgłoszenie błędu (Bug)</option>
              <option>Pytanie o ofertę</option>
              <option>Inne</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Wiadomość</label
            >
            <textarea
              v-model="form.message"
              rows="5"
              required
              placeholder="Opisz dokładnie swój problem..."
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            ></textarea>
            <p class="text-xs text-slate-400 mt-1 text-right">
              Minimum 20 znaków
            </p>
          </div>

          <div
            class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer"
          >
            <svg
              class="mx-auto h-8 w-8 text-slate-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="mt-1 text-sm text-slate-600">
              <span class="font-medium text-blue-600 hover:text-blue-500"
                >Dodaj zrzut ekranu</span
              >
              lub upuść plik tutaj
            </p>
            <p class="mt-1 text-xs text-slate-500">PNG, JPG, PDF do 5MB</p>
          </div>

          <button
            type="submit"
            :disabled="isSending"
            class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <span
              v-if="isSending"
              class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            ></span>
            {{ isSending ? "Wysyłanie..." : "Wyślij zgłoszenie" }}
          </button>
        </form>
      </div>

      <div
        v-else
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center"
        v-motion-pop
      >
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
        <h2 class="text-2xl font-bold text-slate-900 mb-2">
          Zgłoszenie przyjęte!
        </h2>
        <p class="text-slate-500 mb-8">
          Numer Twojego zgłoszenia to <strong>#VLT-8829</strong>. <br />
          Potwierdzenie wysłaliśmy na Twój email.
        </p>
        <div class="flex justify-center gap-4">
          <NuxtLink
            to="/"
            class="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Strona główna
          </NuxtLink>
          <NuxtLink
            to="/pomoc"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Wróć do pomocy
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
