import { defineStore } from "pinia";

export interface Goal {
  id: string; // Zmiana na string (UUID z Supabase)
  user_id?: string;
  title: string;
  saved: number;
  target: number;
  img: string;
  color: string;
}

export const useGoalsStore = defineStore("goals", () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const goals = ref<Goal[]>([]);
  const isLoading = ref(false);
  const isLoaded = ref(false);

  // --- AKCJE ---

  async function fetchGoals(force = false) {
    if (isLoaded.value && !force) return;
    if (!user.value) return;

    isLoading.value = true;
    try {
      const { data, error } = await client
        .from("goals")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      goals.value = (data as any) || [];
      isLoaded.value = true;
    } catch (e: any) {
      console.error("Błąd pobierania celów:", e.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function addGoal(goal: Omit<Goal, "id">) {
    try {
      const { data, error } = await client
        .from("goals")
        .insert([{ ...goal, user_id: user.value?.id }])
        .select()
        .single();

      if (error) throw error;
      goals.value.push(data);
    } catch (e: any) {
      alert("Błąd dodawania celu: " + e.message);
    }
  }

  async function updateGoal(id: string, updated: Partial<Goal>) {
    try {
      const { error } = await client.from("goals").update(updated).eq("id", id);

      if (error) throw error;

      const index = goals.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        goals.value[index] = { ...goals.value[index], ...updated };
      }
    } catch (e: any) {
      alert("Błąd aktualizacji: " + e.message);
    }
  }

  async function deposit(id: string, amount: number) {
    const goal = goals.value.find((g) => g.id === id);
    if (!goal) return;

    const newSaved = Number(goal.saved) + Number(amount);
    await updateGoal(id, { saved: newSaved });
  }

  async function removeGoal(id: string) {
    try {
      const { error } = await client.from("goals").delete().eq("id", id);
      if (error) throw error;
      goals.value = goals.value.filter((g) => g.id !== id);
    } catch (e: any) {
      alert("Błąd usuwania celu: " + e.message);
    }
  }

  function clearStore() {
    goals.value = [];
    isLoaded.value = false;
  }

  return {
    goals,
    isLoading,
    isLoaded,
    fetchGoals,
    addGoal,
    updateGoal,
    removeGoal,
    deposit,
    clearStore,
  };
});
