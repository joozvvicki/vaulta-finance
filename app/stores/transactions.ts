import { defineStore } from "pinia";
import { parseISO, compareDesc, startOfMonth, isAfter } from "date-fns";

export interface Transaction {
  id: string;
  user_id?: string;
  date: string;
  merchant: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  status: "Completed" | "Pending" | "Failed";
  icon?: string;
}

export const useTransactionStore = defineStore("transactions", () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { profile, updateProfileBalance } = useProfile();

  const transactions = ref<Transaction[]>([]);
  const isLoading = ref(false);

  // --- AKCJE API ---

  async function fetchTransactions() {
    isLoading.value = true;
    try {
      // Pobieramy ID bezpośrednio z sesji dla pewności
      const {
        data: { session },
      } = await client.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

      const { data, error } = await client
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      transactions.value = (data as any) || [];
    } catch (e: any) {
      console.error("Błąd pobierania transakcji:", e.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function addTransaction(t: Omit<Transaction, "id">) {
    try {
      const { data, error } = await client
        .from("transactions")
        .insert([{ ...t, user_id: user.value?.id }])
        .select()
        .single();

      if (error) throw error;
      transactions.value.unshift(data as any);
    } catch (e: any) {
      alert("Błąd dodawania: " + e.message);
    }
  }

  async function updateTransaction(
    id: string,
    updatedFields: Partial<Transaction>,
  ) {
    try {
      const { error } = await client
        .from("transactions")
        .update(updatedFields)
        .eq("id", id);

      if (error) throw error;

      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = {
          ...transactions.value[index],
          ...updatedFields,
        };
      }
    } catch (e: any) {
      alert("Błąd aktualizacji: " + e.message);
    }
  }

  async function removeTransaction(id: string) {
    try {
      const { error } = await client.from("transactions").delete().eq("id", id);
      if (error) throw error;
      transactions.value = transactions.value.filter((t) => t.id !== id);
    } catch (e: any) {
      alert("Błąd usuwania: " + e.message);
    }
  }

  // --- GETTERY (Obliczenia oparte na profilu z Supabase) ---

  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) =>
      compareDesc(parseISO(a.date), parseISO(b.date)),
    );
  });

  const currentBalance = computed(() => {
    const totalSum = transactions.value.reduce(
      (acc, t) => acc + Number(t.amount),
      0,
    );
    // initial_balance pochodzi teraz z tabeli profiles
    return Number(profile.value.initial_balance || 0) + totalSum;
  });

  const totalWealth = computed(() => {
    // saved_balance pochodzi teraz z tabeli profiles
    return currentBalance.value + Number(profile.value.saved_balance || 0);
  });

  const monthlyExpenses = computed(() => {
    const firstDayOfMonth = startOfMonth(new Date());
    return transactions.value
      .filter((t) => {
        if (Number(t.amount) >= 0) return false;
        const tDate = parseISO(t.date);
        return (
          isAfter(tDate, firstDayOfMonth) ||
          tDate.getTime() === firstDayOfMonth.getTime()
        );
      })
      .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
  });

  const recentTransactions = computed(() =>
    sortedTransactions.value.slice(0, 5),
  );

  // --- SYNCHRONIZACJA MAJĄTKU Z BAZĄ ---

  async function setTotalBalance(targetBalance: number) {
    const totalSumFromTransactions = transactions.value.reduce(
      (acc, t) => acc + Number(t.amount),
      0,
    );
    const newInitial = targetBalance - totalSumFromTransactions;

    await updateProfileBalance({ initial_balance: newInitial });
  }

  async function setSavedBalance(val: number) {
    await updateProfileBalance({ saved_balance: val });
  }

  return {
    transactions,
    isLoading,
    currentBalance,
    totalWealth,
    monthlyExpenses,
    recentTransactions,
    sortedTransactions,
    fetchTransactions,
    setTotalBalance,
    setSavedBalance,
    addTransaction,
    removeTransaction,
    updateTransaction,
  };
});
