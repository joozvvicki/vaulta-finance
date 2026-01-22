<script setup lang="ts">
import { reactive, ref, computed } from "vue";

definePageMeta({ layout: "default" });

const { t, tm, rt } = useI18n();

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

useHead({
  title: `${t("enterprise.hero.badge")} | Vaulte Enterprise`,
});

const handleEnterpriseSubmit = async () => {
  isLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isLoading.value = false;
  isSent.value = true;
};

const benefits = computed(() => tm("enterprise.benefits") as any);
</script>

<template>
  <div class="bg-white">
    <div class="relative flex flex-col lg:flex-row min-h-screen">
      <div
        class="lg:w-5/12 bg-slate-900 text-white flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24 relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 z-0"
        ></div>
        <div
          class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl z-0"
        ></div>

        <div class="relative z-10">
          <span
            class="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-bold tracking-widest uppercase mb-6"
          >
            {{ $t("enterprise.hero.badge") }}
          </span>

          <h1
            class="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            {{ $t("enterprise.hero.title") }}
            <span class="text-blue-500">{{
              $t("enterprise.hero.subtitle")
            }}</span>
          </h1>

          <p class="text-slate-400 text-lg mb-12 leading-relaxed">
            {{ $t("enterprise.hero.description") }}
          </p>

          <div class="space-y-8">
            <div
              v-for="(benefit, index) in benefits"
              :key="index"
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
                  {{ rt(benefit.title) }}
                </h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  {{ rt(benefit.desc) }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-16 pt-8 border-t border-slate-800">
            <p
              class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4"
            >
              {{ $t("enterprise.hero.certs") }}
            </p>
            <div class="flex gap-6 opacity-40 grayscale">
              <div class="h-8 bg-white/20 w-20 rounded"></div>
              <div class="h-8 bg-white/20 w-20 rounded"></div>
              <div class="h-8 bg-white/20 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="lg:w-7/12 bg-white flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24"
      >
        <div v-if="!isSent" class="max-w-xl mx-auto w-full" v-motion-fade>
          <h2 class="text-3xl font-black text-slate-900 mb-2">
            {{ $t("enterprise.form.title") }}
          </h2>
          <p class="text-slate-500 mb-10 text-lg">
            {{ $t("enterprise.form.subtitle") }}
          </p>

          <form @submit.prevent="handleEnterpriseSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">{{
                  $t("enterprise.form.labels.name")
                }}</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  :placeholder="$t('enterprise.form.placeholders.name')"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">{{
                  $t("enterprise.form.labels.email")
                }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  :placeholder="$t('enterprise.form.placeholders.email')"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">{{
                  $t("enterprise.form.labels.company")
                }}</label>
                <input
                  v-model="form.company"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  :placeholder="$t('enterprise.form.placeholders.company')"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">{{
                  $t("enterprise.form.labels.role")
                }}</label>
                <input
                  v-model="form.role"
                  type="text"
                  class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  :placeholder="$t('enterprise.form.placeholders.role')"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{
                $t("enterprise.form.labels.size")
              }}</label>
              <select
                v-model="form.size"
                class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
              >
                <option value="1-50">1 - 50</option>
                <option value="51-200">51 - 200</option>
                <option value="201-500">201 - 500</option>
                <option value="500+">500+</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{
                $t("enterprise.form.labels.message")
              }}</label>
              <textarea
                v-model="form.message"
                rows="4"
                class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                :placeholder="$t('enterprise.form.placeholders.message')"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-xl flex justify-center items-center gap-3"
            >
              <span
                v-if="isLoading"
                class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              ></span>
              {{
                isLoading
                  ? $t("enterprise.form.sending")
                  : $t("enterprise.form.submit")
              }}
            </button>

            <p class="text-[11px] text-slate-400 text-center mt-4">
              {{
                $t("enterprise.form.privacy", {
                  link: t("layout.footer.privacy"),
                })
              }}
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
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-black text-slate-900 mb-4">
            {{ $t("enterprise.success.title") }}
          </h2>
          <p class="text-slate-600 text-lg mb-10 leading-relaxed">
            {{ $t("enterprise.success.description", { email: form.email }) }}
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition"
          >
            &larr; {{ $t("enterprise.success.back") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
