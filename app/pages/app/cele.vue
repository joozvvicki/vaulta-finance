<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";
import { ref } from "vue";
import { useGoalsStore } from "~/stores/goals";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const store = useGoalsStore();

const isGoalModalOpen = ref(false);
const isDepositModalOpen = ref(false);
const editId = ref<any>();
const goalId = ref<any>();

const openEditModal = (id: any) => {
  editId.value = id;
  isGoalModalOpen.value = true;
};

const openDepsitModal = (id: any) => {
  goalId.value = id;
  isDepositModalOpen.value = true;
};

const closeGoalModal = () => {
  editId.value = null;
  isGoalModalOpen.value = false;
};

const closeDepositModal = () => {
  goalId.value = null;
  isDepositModalOpen.value = false;
};

const handleDelete = (id: string) => {
  if (confirm(t("goals.delete_confirm"))) {
    store.removeGoal(id);
  }
};
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          {{ $t("goals.title") }}
        </h1>
        <p class="text-slate-500">{{ $t("goals.subtitle") }}</p>
      </div>
      <div class="text-sm text-slate-400">
        {{ $t("goals.active_count", { count: store.goals.length }) }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        @click="isGoalModalOpen = true"
        class="hidden md:flex group border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center min-h-[300px] hover:border-blue-500 hover:bg-blue-50 transition p-6"
      >
        <div
          class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition"
        >
          <span class="text-3xl text-slate-400 group-hover:text-blue-600"
            >+</span
          >
        </div>
        <span class="font-bold text-slate-600 group-hover:text-blue-700">
          {{ $t("goals.create_new") }}
        </span>
      </button>

      <div
        v-for="(goal, index) in store.goals"
        :key="goal.id"
        class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-all group relative"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { delay: index * 100 } }"
      >
        <button
          @click.stop="handleDelete(goal.id)"
          class="absolute top-2 right-2 z-20 bg-white/80 p-2 rounded-full text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          :title="$t('goals.delete_tooltip')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        <div
          class="h-40 overflow-hidden relative cursor-pointer"
          @click="openEditModal(goal.id)"
        >
          <img
            :src="goal.img"
            class="w-full h-full object-cover transition hover:scale-105 duration-700"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
          >
            <h3 class="text-white font-bold text-lg text-shadow">
              {{ goal.title }}
            </h3>
          </div>
          <div
            class="absolute top-2 left-2 bg-black/40 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm"
          >
            {{ $t("goals.edit") }}
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="flex justify-between text-sm mb-2 font-medium">
            <span class="text-slate-500">{{ $t("goals.progress") }}</span>
            <span class="text-slate-900"
              >{{ Math.round((goal.saved / goal.target) * 100) }}%</span
            >
          </div>

          <div
            class="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden"
          >
            <div
              class="h-3 rounded-full transition-all duration-1000 relative"
              :class="goal.color"
              :style="{
                width: `${Math.min((goal.saved / goal.target) * 100, 100)}%`,
              }"
            >
              <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          <div class="flex justify-between items-end mt-auto">
            <div>
              <p
                class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
              >
                {{ $t("goals.saved") }}
              </p>
              <p class="text-xl font-bold text-slate-900">
                {{ goal.saved.toLocaleString() }} zł
              </p>
            </div>
            <div class="text-right">
              <p
                class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
              >
                {{ $t("goals.target") }}
              </p>
              <p class="text-sm font-medium text-slate-600">
                {{ goal.target.toLocaleString() }} zł
              </p>
            </div>
          </div>

          <button
            @click="openDepsitModal(goal.id)"
            class="w-full mt-6 py-2.5 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50 transition active:scale-95 flex items-center justify-center gap-1"
          >
            {{ $t("goals.add_funds") }}
          </button>
        </div>
      </div>
    </div>

    <button
      @click="isGoalModalOpen = true"
      class="fixed bottom-24 right-4 active:scale-90 duration-300 md:hidden bg-blue-600 text-white px-4 py-4 rounded-full shadow-lg shadow-blue-500/30 transition flex items-center gap-2"
    >
      <IconPlus />
    </button>

    <ModalDeposit
      :is-open="isDepositModalOpen"
      :goal-id="goalId"
      @close="closeDepositModal"
    />
    <ModalGoal
      :is-open="isGoalModalOpen"
      :edit-id="editId"
      @close="closeGoalModal"
    />
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
