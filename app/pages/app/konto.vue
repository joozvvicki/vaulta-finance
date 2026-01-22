<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const { profile, isLoading } = useProfile();
const client = useSupabaseClient();
const router = useRouter();

const isUploading = ref(false);
const isSaving = ref(false);
const isPortalLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

useHead({
  title: `${t("account.title")} | Vaulte`,
});

const planDetails = computed(() => {
  const p = profile.value.plan || "free";
  switch (p) {
    case "pro":
      return {
        label: t("account.plans.pro"),
        color: "bg-blue-600 text-white",
        icon: "🚀",
        active: true,
      };
    case "enterprise":
      return {
        label: t("account.plans.enterprise"),
        color: "bg-indigo-900 text-white",
        icon: "🏢",
        active: true,
      };
    default:
      return {
        label: t("account.plans.start"),
        color: "bg-slate-200 text-slate-600",
        icon: "🌱",
        active: false,
      };
  }
});

const manageSubscription = async () => {
  if (!planDetails.value.active) {
    router.push("/app/plan");
    return;
  }

  isPortalLoading.value = true;
  try {
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) {
      alert(t("account.actions.error_login_required"));
      return;
    }

    const { data, error } = await useFetch("/api/stripe/create-portal", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error.value) throw error.value;
    if (data.value?.url) window.location.href = data.value.url;
  } catch (e: any) {
    alert(
      t("account.actions.error_save") + (e.data?.message || "Stripe Error"),
    );
  } finally {
    isPortalLoading.value = false;
  }
};

const updateProfile = async () => {
  const {
    data: { session },
  } = await client.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    alert(t("account.actions.error_session"));
    return;
  }

  isSaving.value = true;
  try {
    const { error } = await client.from("profiles").upsert({
      id: userId,
      full_name: profile.value.full_name,
      updated_at: new Date(),
    });

    if (error) throw error;
    alert(t("account.actions.saved_success"));
  } catch (e: any) {
    alert(t("account.actions.error_save") + e.message);
  } finally {
    isSaving.value = false;
  }
};

const uploadAvatar = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  const {
    data: { session },
  } = await client.auth.getSession();
  const userId = session?.user?.id;

  if (!file || !userId) return;

  try {
    isUploading.value = true;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await client.storage
      .from("avatars")
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = client.storage.from("avatars").getPublicUrl(filePath);

    const { error: dbError } = await client
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);
    if (dbError) throw dbError;

    profile.value.avatar_url = `${publicUrl}?t=${Date.now()}`;
  } catch (e: any) {
    alert(t("account.actions.error_upload") + e.message);
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

onMounted(async () => {
  await checkSubscriptionStatus();
});

const checkSubscriptionStatus = async () => {
  try {
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) return;
    const { data } = await useFetch("/api/check-subscription", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (data.value?.plan) profile.value.plan = data.value.plan;
  } catch (e) {
    console.error("Plan sync error:", e);
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto pb-12">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-900">
        {{ $t("account.title") }}
      </h1>
      <button
        @click="updateProfile"
        :disabled="isSaving || isLoading"
        class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
      >
        {{
          isSaving ? $t("account.actions.saving") : $t("account.actions.save")
        }}
      </button>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
      ></div>
    </div>

    <div
      v-else
      class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div
        class="bg-slate-50 p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
      >
        <div
          class="relative group cursor-pointer flex-shrink-0"
          @click="fileInput?.click()"
        >
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            class="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl transition-all group-hover:brightness-90"
          />
          <div
            v-else
            class="w-28 h-28 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl"
          >
            {{ profile.email?.charAt(0).toUpperCase() }}
          </div>

          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-3xl transition-opacity"
          >
            <div
              class="bg-white/90 p-2.5 rounded-2xl shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
            >
              <svg
                class="h-6 w-6 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2 2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          <div
            v-if="isUploading"
            class="absolute inset-0 bg-white/70 rounded-3xl flex items-center justify-center z-10"
          >
            <div
              class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="uploadAvatar"
          />
        </div>

        <div class="flex-1 text-center sm:text-left w-full">
          <p
            class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1"
          >
            {{ $t("account.profile.owner_label") }}
          </p>
          <p class="font-bold text-slate-900 text-2xl tracking-tight">
            {{ profile.full_name || $t("account.profile.fallback_name") }}
          </p>
          <div class="flex gap-3 justify-center sm:justify-start mt-3">
            <span
              class="text-[10px] uppercase tracking-widest bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-bold"
            >
              {{ $t("account.profile.status_active") }}
            </span>
            <span
              :class="[
                'text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg font-bold shadow-sm',
                planDetails.color,
              ]"
            >
              {{ planDetails.icon }} {{ planDetails.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1"
            >
              {{ $t("account.form.name_label") }}
            </label>
            <input
              v-model="profile.full_name"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              :placeholder="$t('account.form.name_placeholder')"
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1"
            >
              {{ $t("account.form.email_label") }}
            </label>
            <input
              disabled
              :value="profile.email"
              class="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-slate-400 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        <div class="border-t border-slate-100 pt-8">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-slate-900">
              {{ $t("account.subscription.title") }}
            </h3>
            <p class="text-sm text-slate-500 mt-1">
              {{ $t("account.subscription.desc") }}
            </p>
          </div>

          <div
            class="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-sm bg-white"
              >
                {{ planDetails.icon }}
              </div>
              <div>
                <p class="font-bold text-slate-900">{{ planDetails.label }}</p>
                <p class="text-xs text-slate-500">
                  {{
                    planDetails.active
                      ? $t("account.plans.active_desc")
                      : $t("account.plans.free_desc")
                  }}
                </p>
              </div>
            </div>

            <button
              @click="manageSubscription"
              :disabled="isPortalLoading"
              class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              :class="
                planDetails.active
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
              "
            >
              <svg
                v-if="isPortalLoading"
                class="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{
                planDetails.active
                  ? $t("account.subscription.manage_stripe")
                  : $t("account.subscription.upgrade_pro")
              }}</span>
            </button>
          </div>

          <p
            class="mt-4 text-[11px] text-slate-400 text-center sm:text-left leading-relaxed"
          >
            {{ $t("account.subscription.disclaimer") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
