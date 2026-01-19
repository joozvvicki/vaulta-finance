import { defineStore } from "pinia";

export interface BudgetCategory {
  id: string;
  category: string;
  limit: number;
  icon: string;
  keywords: string[];
}

export const useBudgetStore = defineStore("budget", () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const categories = ref<BudgetCategory[]>([]);
  const isLoading = ref(false);
  const isLoaded = ref(false);

  const defaultCategories = [
    {
      category: "Jedzenie",
      limit: 1500,
      icon: "🍔",
      keywords: ["jedzenie", "sklep", "biedronka", "lidl", "żabka"],
    },
    {
      category: "Transport",
      limit: 400,
      icon: "🚗",
      keywords: ["paliwo", "uber", "bilet", "orlen"],
    },
    {
      category: "Rozrywka",
      limit: 500,
      icon: "🍿",
      keywords: ["kino", "netflix", "steam"],
    },
    {
      category: "Rachunki",
      limit: 1000,
      icon: "💡",
      keywords: ["prąd", "czynsz", "internet"],
    },
  ];

  async function fetchCategories() {
    if (isLoaded.value) return;
    isLoading.value = true;

    const {
      data: { session },
    } = await client.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    try {
      const { data, error } = await client
        .from("budget_categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        categories.value = data as any[];
      } else {
        await seedDefaults(userId);
      }
      isLoaded.value = true;
    } catch (e) {
      console.error("Błąd budżetu:", e);
    } finally {
      isLoading.value = false;
    }
  }

  async function seedDefaults(userId: string) {
    const toInsert = defaultCategories.map((c) => ({ ...c, user_id: userId }));
    const { data, error } = await client
      .from("budget_categories")
      .insert(toInsert)
      .select();
    if (!error && data) categories.value = data as any[];
  }

  async function addCategory(cat: Omit<BudgetCategory, "id">) {
    try {
      const { data, error } = await client
        .from("budget_categories")
        .insert([{ ...cat, user_id: user.value?.id }])
        .select()
        .single();

      if (error) throw error;
      categories.value.push(data as any);
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function updateCategory(id: string, updates: Partial<BudgetCategory>) {
    try {
      const { error } = await client
        .from("budget_categories")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      const idx = categories.value.findIndex((c) => c.id === id);
      if (idx !== -1 && categories.value[idx])
        categories.value[idx] = { ...categories.value[idx], ...updates };
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function deleteCategory(id: string) {
    try {
      const { error } = await client
        .from("budget_categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
      categories.value = categories.value.filter((c) => c.id !== id);
    } catch (e: any) {
      alert(e.message);
    }
  }

  return {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
