<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { useGoalsStore } from "~/stores/goals";
import { useBudgetStore } from "~/stores/budget";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  html: false,
});

const isOpen = ref(false);
const messages = ref<{ role: "user" | "ai"; text: string }[]>([
  {
    role: "ai",
    text: "Cześć! Jestem Twoim asystentem Vaulte. **Jak mogę Ci pomóc w finansach?**",
  },
]);
const userQuestion = ref("");
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const transactionStore = useTransactionStore();
const goalsStore = useGoalsStore();
const budgetStore = useBudgetStore();

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const askGemini = async () => {
  if (!userQuestion.value.trim() || isLoading.value) return;

  const question = userQuestion.value;
  userQuestion.value = "";

  messages.value.push({ role: "user", text: question });
  await scrollToBottom();
  isLoading.value = true;

  try {
    const context = {
      transactions: transactionStore.transactions.slice(0, 50),
      balance: transactionStore.transactions.reduce(
        (acc, t) => acc + t.amount,
        0,
      ),
      goals: goalsStore.goals,
      budget: budgetStore.categories,
    };

    const { data, error } = await useFetch("/api/chat", {
      method: "POST",
      body: {
        message: question,
        contextData: context,
      },
    });

    if (error.value) throw new Error("Błąd API");

    if (data.value?.answer) {
      messages.value.push({ role: "ai", text: data.value.answer });
    }
  } catch (e) {
    messages.value.push({
      role: "ai",
      text: "Przepraszam, mam chwilowe problemy z połączeniem. Spróbuj później.",
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};
</script>

<template>
  <button
    v-if="!isOpen"
    @click="isOpen = true"
    class="fixed bottom-24 left-4 md:bottom-24 md:right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-full shadow-xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-transform"
  >
    <span class="text-2xl">✨</span>
  </button>

  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed bottom-24 right-6 md:bottom-24 md:right-8 z-50 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
    >
      <div
        class="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">✨</span>
          <h3 class="font-bold">Asystent Vaulte</h3>
        </div>
        <button
          @click="isOpen = false"
          class="hover:bg-white/20 p-1 rounded transition"
        >
          ✕
        </button>
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

        <div v-if="isLoading" class="flex justify-start">
          <div
            class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1"
          >
            <span
              class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            ></span>
            <span
              class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"
            ></span>
            <span
              class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"
            ></span>
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input
          v-model="userQuestion"
          @keyup.enter="askGemini"
          type="text"
          placeholder="Zapytaj o swoje finanse..."
          class="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          @click="askGemini"
          :disabled="isLoading || !userQuestion"
          class="bg-indigo-600 text-white p-2 px-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          ➤
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

:deep(.prose-chat strong) {
  font-weight: 700;
  color: #1e293b;
}

:deep(.prose-chat ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

:deep(.prose-chat ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

:deep(.prose-chat li) {
  margin-bottom: 0.25rem;
}

:deep(.prose-chat p) {
  margin-bottom: 0.5rem;
}

:deep(.prose-chat p:last-child) {
  margin-bottom: 0;
}

:deep(.prose-chat a) {
  color: #2563eb;
  text-decoration: underline;
}
</style>
