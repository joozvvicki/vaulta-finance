import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export interface Goal {
  id: number;
  title: string;
  saved: number;
  target: number;
  img: string;
  color: string;
}

export const useGoalsStore = defineStore("goals", () => {
  // Przykładowe dane startowe
  const goals = useLocalStorage<Goal[]>("user-goals", [
    {
      id: 1,
      title: "Wakacje w Japonii",
      saved: 8500,
      target: 15000,
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
      color: "bg-purple-600",
    },
    {
      id: 2,
      title: "Nowy MacBook",
      saved: 4200,
      target: 10000,
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
      color: "bg-teal-500",
    },
  ]);

  function addGoal(goal: Omit<Goal, "id">) {
    goals.value.push({
      ...goal,
      id: Date.now(),
    });
  }

  function updateGoal(id: number, updated: Partial<Goal>) {
    const index = goals.value.findIndex((g) => g.id === id);
    if (index !== -1) {
      goals.value[index] = { ...goals.value[index], ...updated };
    }
  }

  function removeGoal(id: number) {
    goals.value = goals.value.filter((g) => g.id !== id);
  }

  function deposit(id: number, amount: number) {
    const goal = goals.value.find((g) => g.id === id);
    if (goal) {
      goal.saved += Number(amount);
    }
  }

  return {
    goals,
    addGoal,
    updateGoal,
    removeGoal,
    deposit,
  };
});
