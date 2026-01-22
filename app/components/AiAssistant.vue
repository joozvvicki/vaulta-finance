<script setup lang="ts">
import { ref, nextTick, computed, watch } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { useGoalsStore } from "~/stores/goals";
import { useBudgetStore } from "~/stores/budget";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ breaks: true, linkify: true, html: false });
const { t, locale } = useI18n();

// --- STAN UI ---
const isOpen = ref(false);
const userQuestion = ref("");
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const messages = ref([
  {
    role: "ai",
    text: t("assistant.initial_message"),
  },
]);

// --- FUNKCJA RESETOWANIA ---
const resetChat = () => {
  messages.value = [{ role: "ai", text: t("assistant.initial_message") }];
  pendingAction.value = null;
  userQuestion.value = "";
  isLoading.value = false;
  if (isListening.value && recognition) {
    isListening.value = false;
    recognition.stop();
  }
};

// --- SPEECH RECOGNITION (Dynamic Language) ---
const isListening = ref(false);
let recognition: any = null;

const initSpeech = () => {
  if (!import.meta.client) return;
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    // Ustawienie języka na podstawie aktualnego locale
    recognition.lang = locale.value === "pl" ? "pl-PL" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal)
          finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript)
        userQuestion.value = (
          userQuestion.value +
          " " +
          finalTranscript
        ).trim();
    };
    // ... reszta logiki onend i onerror (bezzmian, używamy tłumaczeń dla alertów)
    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") alert(t("assistant.listening_error"));
    };
  }
};

// Re-inicjalizacja mowy przy zmianie języka
watch(locale, () => {
  if (recognition) recognition.lang = locale.value === "pl" ? "pl-PL" : "en-US";
});

onMounted(() => initSpeech());

const toggleListening = () => {
  if (!recognition) {
    alert(t("assistant.browser_error"));
    return;
  }
  isListening.value ? recognition.stop() : recognition.start();
  isListening.value = !isListening.value;
};

// --- STORE & PROFILE ---
const transactionStore = useTransactionStore();
const goalsStore = useGoalsStore();
const budgetStore = useBudgetStore();

// --- SYSTEM POTWIERDZANIA AKCJI ---
const pendingAction = ref<any>(null);

const getActionDescription = computed(() => {
  if (!pendingAction.value) return "";
  const { domain, action, payload } = pendingAction.value;

  const actionText = t(`assistant.confirmation.actions.${action}`);
  const domainText = t(`assistant.confirmation.domains.${domain}`);

  let desc = `${actionText} ${domainText}`;
  if (payload?.amount) desc += ` (${payload.amount} PLN)`;
  if (payload?.merchant || payload?.title)
    desc += ` - ${payload.merchant || payload.title}`;

  return desc;
});

const handleAiAction = async (operation: any) => {
  const { domain, action, id, payload } = operation;

  if (domain === "TRANSACTION") {
    if (action === "CREATE") {
      await transactionStore.addTransaction({
        date: new Date().toISOString().split("T")[0],
        status: "Completed",
        currency: "PLN",
        icon: "🤖",
        ...payload,
        merchant: payload.merchant || "Nieznany",
      });
    } else if (action === "UPDATE" && id) {
      await transactionStore.updateTransaction(id, payload);
    } else if (action === "DELETE" && id) {
      await transactionStore.removeTransaction(id);
    }
  } else if (domain === "GOAL") {
    if (action === "CREATE") {
      await goalsStore.addGoal({ saved: 0, color: "bg-blue-500", ...payload });
    } else if (action === "UPDATE" && id) {
      await goalsStore.updateGoal(id, payload);
    } else if (action === "DELETE" && id) {
      await goalsStore.removeGoal(id);
    }
  } else if (domain === "BUDGET") {
    if (action === "CREATE") {
      await budgetStore.addCategory(payload);
    } else if (action === "UPDATE" && id) {
      await budgetStore.updateCategory(id, payload);
    } else if (action === "DELETE" && id) {
      await budgetStore.deleteCategory(id);
    }
  }
};

const confirmAction = async () => {
  if (!pendingAction.value) return;
  isLoading.value = true;
  try {
    await handleAiAction(pendingAction.value);
    messages.value.push({
      role: "ai",
      text: t("assistant.confirmation.success"),
    });
  } catch (e) {
    messages.value.push({
      role: "ai",
      text: t("assistant.confirmation.error"),
    });
  } finally {
    pendingAction.value = null;
    isLoading.value = false;
    await scrollToBottom();
  }
};

const cancelAction = () => {
  pendingAction.value = null;
  messages.value.push({ role: "ai", text: t("assistant.confirmation.denied") });
};

const askGemini = async () => {
  if (!userQuestion.value.trim() || isLoading.value || pendingAction.value)
    return;

  const question = userQuestion.value;
  userQuestion.value = "";
  messages.value.push({ role: "user", text: question });

  if (isListening.value) {
    isListening.value = false;
    recognition.stop();
  }

  await scrollToBottom();
  isLoading.value = true;

  try {
    const context = {
      transactions: transactionStore.transactions.slice(0, 50),
      goals: goalsStore.goals,
      budget: budgetStore.categories,
      language: locale.value,
    };

    const { data, error } = await useFetch("/api/chat", {
      method: "POST",
      body: { message: question, contextData: context },
    });

    if (error.value) throw new Error("API Error");

    if (data.value?.response) {
      let result;
      try {
        result = JSON.parse(data.value.response);
      } catch (err) {
        result = { type: "MESSAGE", text: data.value.response };
      }

      if (result.text) messages.value.push({ role: "ai", text: result.text });
      if (result.type === "ACTION") pendingAction.value = result.operation;
    }
  } catch (e) {
    messages.value.push({ role: "ai", text: t("assistant.api_error") });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value)
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
};
</script>

<template>
  <button
    v-if="!isOpen"
    @click="isOpen = true"
    class="fixed bottom-24 left-4 md:!left-[auto] md:bottom-4 md:right-4 z-100 w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
  >
    <span class="text-2xl">✨</span>
  </button>

  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed bottom-24 left-4 md:!left-[auto] md:bottom-4 md:right-4 z-50 w-[90vw] md:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
    >
      <div
        class="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">✨</span>
          <h3 class="font-bold">{{ $t("assistant.title") }}</h3>
        </div>
        <div class="flex items-center gap-1">
          <button
            @click="resetChat"
            class="hover:bg-white/20 p-1.5 rounded-lg transition"
            :title="$t('assistant.reset_title')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <button
            @click="isOpen = false"
            class="hover:bg-white/20 p-1.5 rounded-lg transition"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        ref="chatContainer"
        class="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4"
      >
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed"
            :class="
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
            "
          >
            <span v-if="msg.role === 'user'">{{ msg.text }}</span>
            <div v-else class="prose-chat" v-html="md.render(msg.text)"></div>
          </div>
        </div>

        <div
          v-if="pendingAction"
          class="flex justify-start w-full animate-fade-in"
        >
          <div
            class="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl rounded-tl-none shadow-sm w-[95%]"
          >
            <p
              class="text-[10px] font-bold text-indigo-500 uppercase mb-1 tracking-wider"
            >
              {{ $t("assistant.confirmation.required") }}
            </p>
            <p class="text-sm text-slate-700 mb-4 font-medium">
              {{ getActionDescription }}
            </p>
            <div class="flex gap-2">
              <button
                @click="confirmAction"
                class="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-200"
              >
                {{ $t("assistant.confirmation.yes") }}
              </button>
              <button
                @click="cancelAction"
                class="flex-1 bg-white border border-slate-300 text-slate-600 py-2 rounded-lg text-sm font-bold"
              >
                {{ $t("assistant.confirmation.cancel") }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-start">
          <div
            class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1"
          >
            <span
              class="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
            ></span>
            <span
              class="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"
            ></span>
            <span
              class="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"
            ></span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 bg-white">
        <div
          class="px-4 pt-2 pb-1 text-[9px] text-slate-400 uppercase font-bold text-center leading-tight tracking-tight"
        >
          {{ $t("assistant.disclaimer") }}
        </div>

        <div class="p-3 pt-1 flex items-center gap-2">
          <div class="relative flex-1">
            <input
              v-model="userQuestion"
              :disabled="isLoading || pendingAction !== null"
              @keyup.enter="askGemini"
              type="text"
              :placeholder="$t('assistant.placeholder')"
              class="w-full bg-slate-100 border-none rounded-xl pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              @click="toggleListening"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all"
              :class="
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-slate-400 hover:bg-slate-200'
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            </button>
          </div>
          <button
            @click="askGemini"
            :disabled="isLoading || !userQuestion || pendingAction !== null"
            class="bg-indigo-600 text-white p-2.5 px-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
