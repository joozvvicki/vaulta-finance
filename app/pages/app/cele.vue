<script setup lang="ts">
import { ref, reactive } from "vue";
import { useGoalsStore, type Goal } from "~/stores/goals";

definePageMeta({ layout: "dashboard" });

const store = useGoalsStore();

const isGoalModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const goalForm = reactive({
  title: "",
  target: "",
  saved: "",
  img: "",
  color: "bg-blue-600",
});

const availableColors = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-teal-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-indigo-600",
  "bg-slate-800",
];

const openAddModal = () => {
  isEditing.value = false;
  goalForm.title = "";
  goalForm.target = "";
  goalForm.saved = "0";
  goalForm.img =
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80";
  goalForm.color = "bg-blue-600";
  isGoalModalOpen.value = true;
};

const openEditModal = (goal: Goal) => {
  isEditing.value = true;
  editingId.value = goal.id;
  goalForm.title = goal.title;
  goalForm.target = goal.target.toString();
  goalForm.saved = goal.saved.toString();
  goalForm.img = goal.img;
  goalForm.color = goal.color;
  isGoalModalOpen.value = true;
};

const handleSaveGoal = () => {
  if (!goalForm.title || !goalForm.target) return;

  const payload = {
    title: goalForm.title,
    target: Number(goalForm.target),
    saved: Number(goalForm.saved),
    img: goalForm.img || "https://placehold.co/600x400?text=Cel",
    color: goalForm.color,
  };

  if (isEditing.value && editingId.value) {
    store.updateGoal(editingId.value, payload);
  } else {
    store.addGoal(payload);
  }
  isGoalModalOpen.value = false;
};

const isDepositModalOpen = ref(false);
const depositAmount = ref("");
const activeGoalId = ref<number | null>(null);
const activeGoalTitle = ref("");

const openDepositModal = (goal: Goal) => {
  activeGoalId.value = goal.id;
  activeGoalTitle.value = goal.title;
  depositAmount.value = "";
  isDepositModalOpen.value = true;
};

const handleDeposit = () => {
  if (activeGoalId.value && depositAmount.value) {
    store.deposit(activeGoalId.value, Number(depositAmount.value));
    isDepositModalOpen.value = false;
  }
};

const handleDelete = (id: number) => {
  if (
    confirm(
      "Czy na pewno chcesz usunąć ten cel? Środki nie zostaną zwrócone na saldo.",
    )
  ) {
    store.removeGoal(id);
  }
};

onMounted(() => {
  store.fetchGoals();
});
</script>

<template>
  <div>
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          Cele Oszczędnościowe 🎯
        </h1>
        <p class="text-slate-500">Małe kroki prowadzą do wielkich rzeczy.</p>
      </div>
      <div class="text-sm text-slate-400">
        Aktywne cele: {{ store.goals.length }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        @click="openAddModal"
        class="group border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center min-h-[300px] hover:border-blue-500 hover:bg-blue-50 transition p-6"
      >
        <div
          class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition"
        >
          <span class="text-3xl text-slate-400 group-hover:text-blue-600"
            >+</span
          >
        </div>
        <span class="font-bold text-slate-600 group-hover:text-blue-700"
          >Utwórz nowy cel</span
        >
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
          title="Usuń cel"
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
          @click="openEditModal(goal)"
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
            Edytuj
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="flex justify-between text-sm mb-2 font-medium">
            <span class="text-slate-500">Postęp</span>
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
              <div
                class="absolute top-0 left-0 bottom-0 right-0 bg-white/20 w-full h-full animate-pulse"
              ></div>
            </div>
          </div>

          <div class="flex justify-between items-end mt-auto">
            <div>
              <p class="text-xs text-slate-500 uppercase font-semibold">
                Uzbierano
              </p>
              <p class="text-xl font-bold text-slate-900">
                {{ goal.saved.toLocaleString() }} zł
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500 uppercase font-semibold">Cel</p>
              <p class="text-sm font-medium text-slate-600">
                {{ goal.target.toLocaleString() }} zł
              </p>
            </div>
          </div>

          <button
            @click="openDepositModal(goal)"
            class="w-full mt-6 py-2 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50 transition active:scale-95"
          >
            Dopłać +
          </button>
        </div>
      </div>
    </div>

    <Transition name="modal">
      <div
        v-if="isGoalModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="isGoalModalOpen = false"
        ></div>
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        >
          <h3 class="font-bold text-xl text-slate-900 mb-6">
            {{ isEditing ? "Edytuj cel" : "Nowy cel finansowy" }}
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Nazwa celu</label
              >
              <input
                v-model="goalForm.title"
                type="text"
                placeholder="np. Dom na Mazurach"
                class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Kwota docelowa</label
                >
                <input
                  v-model="goalForm.target"
                  type="number"
                  class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Już uzbierano</label
                >
                <input
                  v-model="goalForm.saved"
                  type="number"
                  class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Link do zdjęcia (URL)</label
              >
              <input
                v-model="goalForm.img"
                type="text"
                placeholder="https://..."
                class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              />
              <div
                v-if="goalForm.img"
                class="mt-2 h-32 rounded-lg overflow-hidden border border-slate-200"
              >
                <img :src="goalForm.img" class="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2"
                >Kolor paska</label
              >
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="goalForm.color = color"
                  :class="[
                    color,
                    goalForm.color === color
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      : '',
                  ]"
                  class="w-8 h-8 rounded-full transition-all"
                ></button>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button
              @click="isGoalModalOpen = false"
              class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              Anuluj
            </button>
            <button
              @click="handleSaveGoal"
              class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Zapisz cel
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div
        v-if="isDepositModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="isDepositModalOpen = false"
        ></div>
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        >
          <div
            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
          >
            💸
          </div>
          <h3 class="font-bold text-xl text-slate-900 mb-1">Dopłać do celu</h3>
          <p class="text-sm text-slate-500 mb-6">{{ activeGoalTitle }}</p>

          <div class="relative mb-6">
            <input
              v-model="depositAmount"
              type="number"
              placeholder="0"
              autofocus
              class="w-full text-4xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-green-500 outline-none py-2 text-center"
            />
            <span class="absolute right-4 bottom-4 text-slate-400 font-medium"
              >PLN</span
            >
          </div>

          <button
            @click="handleDeposit"
            class="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-500/30"
          >
            Zaksięguj wpłatę
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
