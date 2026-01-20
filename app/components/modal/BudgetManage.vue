<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useBudgetStore } from "~/stores/budget";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const budgetStore = useBudgetStore();

const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  category: "",
  limit: "",
  icon: "",
  keywordsStr: "",
});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentTranslateY.value = 0;
      isEditing.value = false;
      editingId.value = null;
    }
  },
);

const startAdding = () => {
  editingId.value = null;
  form.category = "";
  form.limit = "";
  form.icon = "";
  form.keywordsStr = "";
  isEditing.value = true;
};

const startEditing = (id: string) => {
  const cat = budgetStore.categories.find((c) => c.id === id);
  if (!cat) return;

  editingId.value = id;
  form.category = cat.category;
  form.limit = cat.limit.toString();
  form.icon = cat.icon;
  form.keywordsStr = cat.keywords ? cat.keywords.join(", ") : "";
  isEditing.value = true;
};

const saveCategory = () => {
  if (!form.category || !form.limit) return;

  const payload = {
    category: form.category,
    limit: parseFloat(form.limit),
    icon: form.icon || "📁",
    keywords: form.keywordsStr
      ? form.keywordsStr
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k)
      : [],
  };

  if (editingId.value) {
    budgetStore.updateCategory(editingId.value, payload);
  } else {
    budgetStore.addCategory({
      id: Date.now().toString(),
      spent: 0,
      ...payload,
    });
  }

  isEditing.value = false;
};

const deleteCategory = (id: string) => {
  if (confirm("Czy na pewno usunąć tę kategorię?")) {
    budgetStore.removeCategory(id);
  }
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
  const currentY = e.touches[0].clientY;
  const delta = currentY - touchStartY.value;

  if (delta > 0) {
    currentTranslateY.value = delta;
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;

  if (currentTranslateY.value > 150) {
    emit("close");
  } else {
    currentTranslateY.value = 0;
  }
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
        class="modal-card relative bg-white w-full md:w-full md:max-w-lg flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-t-3xl md:rounded-2xl will-change-transform"
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
            <h3 class="font-bold text-lg text-slate-900">
              {{
                isEditing
                  ? editingId
                    ? "Edytuj kategorię"
                    : "Dodaj kategorię"
                  : "Zarządzaj budżetami"
              }}
            </h3>
            <button
              @click="$emit('close')"
              class="md:flex w-8 h-8 hidden items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="flex-1 bg-white">
          <div class="px-4 pb-2 flex- flex-col gap-4" v-if="!isEditing">
            <div
              class="pt-2 md:pb-6 max-h-[40vh] overflow-y-auto custom-scrollbar"
            >
              <div class="space-y-3">
                <div
                  v-for="cat in budgetStore.categories"
                  :key="cat.id"
                  class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">{{ cat.icon }}</span>
                    <div>
                      <p class="font-bold text-slate-900">{{ cat.category }}</p>
                      <p class="text-xs text-slate-500">
                        Limit:
                        <span class="font-medium text-slate-700"
                          >{{ cat.limit }} PLN</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="startEditing(cat.id)"
                      class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      title="Edytuj"
                    >
                      ✏️
                    </button>
                    <button
                      @click="deleteCategory(cat.id)"
                      class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      title="Usuń"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="startAdding"
              class="w-full mt-4 py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <span>+</span> Dodaj nową kategorię
            </button>
          </div>

          <div v-else class="p-6 pb-24 md:pb-6 space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Nazwa kategorii</label
              >
              <input
                v-model="form.category"
                type="text"
                placeholder="np. Edukacja"
                class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Limit (PLN)</label
                >
                <input
                  v-model="form.limit"
                  type="number"
                  class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none font-bold transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >Ikona</label
                >
                <input
                  v-model="form.icon"
                  type="text"
                  placeholder="np. 📚"
                  class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-center transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Słowa kluczowe</label
              >
              <p class="text-xs text-slate-500 mb-2">
                Automatyczne przypisywanie (oddziel przecinkami).
              </p>
              <textarea
                v-model="form.keywordsStr"
                rows="3"
                placeholder="np. udemy, kurs, książka, empik"
                class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <div
          v-if="isEditing"
          class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0"
        >
          <button
            @click="isEditing = false"
            class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition font-medium"
          >
            Anuluj
          </button>
          <button
            @click="saveCategory"
            class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
          >
            Zapisz zmiany
          </button>
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

/* === MOBILE === */
.slide-up-enter-from .modal-card {
  transform: translateY(100%);
}
.slide-up-leave-to .modal-card {
  transform: translateY(100%) !important;
}

/* === DESKTOP === */
@media (min-width: 768px) {
  .slide-up-enter-from .modal-card,
  .slide-up-leave-to .modal-card {
    transform: scale(0.95) !important;
    opacity: 0;
  }
}
</style>
