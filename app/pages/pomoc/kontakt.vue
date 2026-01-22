<script setup lang="ts">
import { reactive, ref, computed } from "vue";

definePageMeta({ layout: "default" });

const { t, tm, rt } = useI18n();

const topics = computed(() => tm("help.contact.topics") as any);

const form = reactive({
  email: "",
  topic: "",
  message: "",
  file: null,
});

onMounted(() => {
  if (topics.value.length > 0) {
    form.topic = rt(topics.value[0]);
  }
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

useHead({
  title: `${t("help.contact.title")} | Vaulte Support`,
});
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="mb-10 text-center">
        <NuxtLink
          to="/pomoc"
          class="text-sm font-bold text-blue-600 hover:underline mb-4 inline-block flex items-center justify-center gap-1"
        >
          &larr; {{ $t("help.contact.back") }}
        </NuxtLink>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ $t("help.contact.title") }}
        </h1>
        <p class="text-slate-500 mt-2">
          {{ $t("help.contact.subtitle") }}
        </p>
      </div>

      <div
        v-if="!isSuccess"
        class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
        v-motion-fade
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">
              {{ $t("help.contact.email_label") }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              :placeholder="$t('help.contact.email_placeholder')"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">
              {{ $t("help.contact.topic_label") }}
            </label>
            <select
              v-model="form.topic"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
            >
              <option
                v-for="topic in topics"
                :key="rt(topic)"
                :value="rt(topic)"
              >
                {{ rt(topic) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">
              {{ $t("help.contact.message_label") }}
            </label>
            <textarea
              v-model="form.message"
              rows="5"
              required
              :placeholder="$t('help.contact.message_placeholder')"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            ></textarea>
            <p
              class="text-[10px] font-bold text-slate-400 mt-2 text-right uppercase tracking-wider"
            >
              {{ $t("help.contact.message_hint") }}
            </p>
          </div>

          <div
            class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition cursor-pointer group"
          >
            <svg
              class="mx-auto h-10 w-10 text-slate-300 group-hover:text-blue-500 transition-colors"
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
            <p class="mt-3 text-sm text-slate-600">
              <span class="font-bold text-blue-600">{{
                $t("help.contact.upload.label")
              }}</span>
              {{ $t("help.contact.upload.or") }}
            </p>
            <p class="mt-1 text-xs text-slate-400">
              {{ $t("help.contact.upload.hint") }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isSending"
            class="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 disabled:opacity-70"
          >
            <span
              v-if="isSending"
              class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            ></span>
            {{
              isSending ? $t("help.contact.sending") : $t("help.contact.submit")
            }}
          </button>
        </form>
      </div>

      <div
        v-else
        class="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center"
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
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-slate-900 mb-2">
          {{ $t("help.contact.success.title") }}
        </h2>
        <p class="text-slate-500 mb-10 leading-relaxed">
          {{ $t("help.contact.success.desc", { ticket: "#VLT-8829" }) }}
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink
            to="/"
            class="px-8 py-3 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
          >
            {{ $t("help.contact.success.home") }}
          </NuxtLink>
          <NuxtLink
            to="/pomoc"
            class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            {{ $t("help.contact.success.back_help") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
