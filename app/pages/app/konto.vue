<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const { profile, isLoading } = useProfile();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const isUploading = ref(false);
const isSaving = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// 1. Aktualizacja danych tekstowych (Imię i Nazwisko)
const updateProfile = async () => {
  // Pobieramy ID bezpośrednio z sesji na wypadek opóźnień w useSupabaseUser
  const {
    data: { session },
  } = await client.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    alert("Błąd: Sesja użytkownika wygasła.");
    return;
  }

  isSaving.value = true;
  try {
    const { error } = await client.from("profiles").upsert({
      id: userId,
      full_name: profile.value.full_name,
      email: profile.value.email,
      updated_at: new Date(),
    });

    if (error) throw error;
    alert("Zmiany zostały zapisane!");
  } catch (e: any) {
    alert("Błąd zapisu: " + e.message);
  } finally {
    isSaving.value = false;
  }
};

// 2. Upload awatara z obsługą Hovera i Cache-Bustera
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

    // Tworzymy unikalną ścieżkę dla pliku
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload do Supabase Storage
    const { error: uploadError } = await client.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Pobranie publicznego adresu URL
    const {
      data: { publicUrl },
    } = client.storage.from("avatars").getPublicUrl(filePath);

    // Aktualizacja rekordu w bazie danych
    const { error: dbError } = await client
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (dbError) throw dbError;

    // Aktualizacja wspólnego stanu z "cache busterem" (?t=...),
    // aby obrazek odświeżył się natychmiast w całej aplikacji
    profile.value.avatar_url = `${publicUrl}?t=${Date.now()}`;
  } catch (e: any) {
    alert("Błąd przesyłania: " + e.message);
  } finally {
    isUploading.value = false;
    // Reset inputa, by móc wybrać ten sam plik ponownie
    if (fileInput.value) fileInput.value.value = "";
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Moje Konto</h1>
      <button
        @click="updateProfile"
        :disabled="isSaving || isLoading"
        class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
      >
        {{ isSaving ? "Zapisywanie..." : "Zapisz profil" }}
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
        class="bg-slate-50 p-8 border-b border-slate-100 flex items-center gap-8"
      >
        <div class="relative group cursor-pointer" @click="fileInput?.click()">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            class="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl transition-all duration-300 group-hover:brightness-90"
          />
          <div
            v-else
            class="w-28 h-28 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl transition-all duration-300 group-hover:bg-blue-700"
          >
            {{ profile.email?.charAt(0).toUpperCase() }}
          </div>

          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-3xl"
          >
            <div
              class="bg-white/90 p-2.5 rounded-2xl shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
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

        <div class="flex-1">
          <p
            class="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1"
          >
            Status konta
          </p>
          <p class="font-bold text-slate-900 text-2xl tracking-tight mb-2">
            {{ profile.full_name || "Użytkownik Vaulta" }}
          </p>
          <div class="flex gap-2">
            <span
              class="text-[10px] uppercase tracking-widest bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-bold"
              >Aktywne</span
            >
          </div>
        </div>
      </div>

      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label
              class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >Imię i Nazwisko</label
            >
            <input
              v-model="profile.full_name"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              placeholder="np. Jan Kowalski"
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >Adres Email</label
            >
            <input
              disabled
              :value="profile.email"
              class="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-slate-400 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        <div
          class="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-start text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-xs leading-relaxed">
            Adres email jest powiązany z Twoim kontem i nie może być zmieniony
            samodzielnie. Jeśli potrzebujesz zmiany maila, skontaktuj się z
            supportem.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
