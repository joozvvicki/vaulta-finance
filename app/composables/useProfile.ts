export const useProfile = () => {
  const profile = useState<any>("user-profile", () => ({
    email: "",
    full_name: "",
    avatar_url: "",
    currency: "PLN",
    initial_balance: 0,
    saved_balance: 0,
    plan: "free",
  }));

  const isLoading = useState("profile-loading", () => true);

  const fetchProfile = async (userId?: string) => {
    const client = useSupabaseClient();

    // 1. Próba uzyskania ID: najpierw z parametru, potem bezpośrednio z sesji
    let finalId = userId;
    if (!finalId) {
      const {
        data: { session },
      } = await client.auth.getSession();
      finalId = session?.user?.id;
    }

    if (!finalId) {
      console.warn("⚠️ fetchProfile: Brak ID użytkownika.");
      isLoading.value = false;
      return;
    }

    try {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", finalId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        // Łączymy dane z bazy z mailem z sesji (dla pewności)
        const {
          data: { user },
        } = await client.auth.getUser();
        profile.value = {
          ...profile.value,
          ...data,
          email: user?.email || data.email,
        };
      }
    } catch (e) {
      console.error("❌ Błąd profilu:", e);
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfileBalance = async (fields: {
    initial_balance?: number;
    saved_balance?: number;
  }) => {
    const client = useSupabaseClient();

    // Pobieramy ID bezpośrednio przed updatem
    const {
      data: { session },
    } = await client.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.error("❌ updateProfileBalance: Nie znaleziono ID sesji.");
      return;
    }

    try {
      const { error } = await client
        .from("profiles")
        .update(fields)
        .eq("id", userId);

      if (error) throw error;

      // Reaktywna aktualizacja lokalnego stanu
      profile.value = { ...profile.value, ...fields };
    } catch (e) {
      console.error("❌ Błąd aktualizacji balansu:", e);
    }
  };

  return { profile, isLoading, fetchProfile, updateProfileBalance };
};
