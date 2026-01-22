<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useGoalsStore } from "~/stores/goals";

const props = defineProps<{
  isOpen: boolean;
  editId?: string | null;
}>();

const emit = defineEmits(["close"]);

const store = useGoalsStore();
const isEditing = ref(false);

const availableColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-indigo-500",
];

const form = reactive({
  title: "",
  target: "",
  saved: "",
  img: "",
  color: "bg-blue-500",
});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentTranslateY.value = 0;
      if (props.editId) {
        const goal = store.goals.find((g) => g.id === props.editId);
        if (goal) {
          isEditing.value = true;
          form.title = goal.title;
          form.target = goal.target.toString();
          form.saved = goal.saved.toString();
          form.img = goal.img || "";
          form.color = goal.color || "bg-blue-500";
        }
      } else {
        isEditing.value = false;
        form.title = "";
        form.target = "";
        form.saved = "0";
        form.img = "";
        form.color = "bg-blue-500";
      }
    }
  },
);

const handleSave = () => {
  if (!form.title || !form.target) return;

  const payload = {
    title: form.title,
    target: parseFloat(form.target),
    saved: parseFloat(form.saved) || 0,
    img: form.img,
    color: form.color,
  };

  if (isEditing.value && props.editId) {
    store.updateGoal(props.editId, payload);
  } else {
    store.addGoal({ ...payload });
  }

  emit("close");
};

// --- LOGIKA SWIPE-TO-CLOSE ---
const touchStartY = ref(0);
const currentTranslateY = ref(0);
const isDragging = ref(false);

const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY;
  isDragging.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const delta = e.touches[0].clientY - touchStartY.value;
  if (delta > 0) currentTranslateY.value = delta;
};

const handleTouchEnd = () => {
  isDragging.value = false;
  if (currentTranslateY.value > 150) emit("close");
  else currentTranslateY.value = 0;
};
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex justify-center p-0 md:p-4 items-end md:items-center"
    >
      <div
        class="backdrop absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <div
        class="modal-card relative bg-white w-full md:max-w-md flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl will-change-transform"
        :style="{
          transform:
            isDragging || currentTranslateY > 0
              ? `translateY(${currentTranslateY}px)`
              : '',
        }"
        :class="{ 'transition-transform duration-300': !isDragging }"
      >
        <div
          class="touch-none bg-white cursor-grab active:cursor-grabbing border-b border-slate-100 flex-shrink-0"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="md:hidden w-full flex justify-center pt-3 pb-1">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>
          <div class="px-6 py-4 flex justify-between items-center">
            <h3 class="font-bold text-xl text-slate-900">
              {{
                isEditing
                  ? $t("goals_manage.title_edit")
                  : $t("goals_manage.title_add")
              }}
            </h3>
            <button
              @click="$emit('close')"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar bg-white flex-1">
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{
                $t("goals_manage.form.name_label")
              }}</label>
              <input
                v-model="form.title"
                type="text"
                :placeholder="$t('goals_manage.form.name_placeholder')"
                class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">{{
                  $t("goals_manage.form.target_label")
                }}</label>
                <input
                  v-model="form.target"
                  type="number"
                  class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">{{
                  $t("goals_manage.form.saved_label")
                }}</label>
                <input
                  v-model="form.saved"
                  type="number"
                  class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{
                $t("goals_manage.form.img_label")
              }}</label>
              <input
                v-model="form.img"
                type="text"
                :placeholder="$t('goals_manage.form.img_placeholder')"
                class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-xs mb-3"
              />
              <div
                v-if="form.img"
                class="h-32 rounded-xl overflow-hidden border border-slate-200 relative group shadow-inner"
              >
                <img :src="form.img" class="w-full h-full object-cover" />
                <div
                  class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"
                ></div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-3">{{
                $t("goals_manage.form.color_label")
              }}</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="form.color = color"
                  :class="[
                    color,
                    form.color === color
                      ? 'ring-4 ring-offset-2 ring-slate-200 scale-110'
                      : 'opacity-70 hover:opacity-100',
                  ]"
                  class="w-8 h-8 rounded-full transition-all duration-300 shadow-sm"
                ></button>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4 flex justify-end gap-3 pb-6 md:pb-0">
            <button
              @click="$emit('close')"
              class="px-5 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition font-bold text-sm"
            >
              {{ $t("goals_manage.actions.cancel") }}
            </button>
            <button
              @click="handleSave"
              class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-sm"
            >
              {{ $t("goals_manage.actions.save") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-active .backdrop,
.slide-up-leave-active .backdrop {
  transition: opacity 0.3s ease;
}
.slide-up-enter-active .modal-card,
.slide-up-leave-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from .backdrop,
.slide-up-leave-to .backdrop {
  opacity: 0;
}
.slide-up-enter-from .modal-card {
  transform: translateY(100%);
}
.slide-up-leave-to .modal-card {
  transform: translateY(100%) !important;
}

@media (min-width: 768px) {
  .slide-up-enter-from .modal-card,
  .slide-up-leave-to .modal-card {
    transform: scale(0.95) !important;
    opacity: 0;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
