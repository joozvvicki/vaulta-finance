import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import {
  subDays,
  isAfter,
  parse,
  isValid,
  parseISO,
  compareDesc,
  startOfMonth,
} from "date-fns";

export interface Transaction {
  id: string | number;
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
  const transactions = useLocalStorage<Transaction[]>("transactions", []);

  const initialBalance = useLocalStorage<number>("initialBalance", 0);
  const savedBalance = useLocalStorage<number>("savedBalance", 0);

  const parseDateSafe = (dateStr: string) => {
    let date = parseISO(dateStr);
    if (isValid(date)) return date;
    date = parse(dateStr, "dd.MM.yyyy", new Date());
    if (isValid(date)) return date;
    return new Date();
  };

  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) =>
      compareDesc(parseDateSafe(a.date), parseDateSafe(b.date)),
    );
  });

  const currentBalance = computed(() => {
    const totalSum = transactions.value.reduce(
      (acc, t) => acc + Number(t.amount),
      0,
    );
    return Number(initialBalance.value) + totalSum;
  });

  const totalWealth = computed(() => {
    return currentBalance.value + savedBalance.value;
  });

  const monthlyExpenses = computed(() => {
    const firstDayOfMonth = startOfMonth(new Date());

    return transactions.value
      .filter((t) => {
        // Tylko wydatki
        if (Number(t.amount) >= 0) return false;
        const tDate = parseDateSafe(t.date);
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

  function setTotalBalance(targetBalance: number) {
    const totalSumFromTransactions = transactions.value.reduce(
      (acc, t) => acc + Number(t.amount),
      0,
    );

    initialBalance.value = targetBalance - totalSumFromTransactions;
  }

  function addTransaction(transaction: Transaction) {
    transactions.value.unshift(transaction);
  }

  function importTransactions(newTransactions: Transaction[]) {
    transactions.value = [...newTransactions, ...transactions.value];
  }

  function removeTransaction(id: string | number) {
    transactions.value = transactions.value.filter((t) => t.id !== id);
  }

  function setSavedBalance(val: number) {
    savedBalance.value = val;
  }

  function updateTransaction(
    id: string | number,
    updatedFields: Partial<Transaction>,
  ) {
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1 && transactions.value[index]) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...updatedFields,
      };
    }
  }

  return {
    transactions,
    initialBalance,
    currentBalance,
    savedBalance,
    totalWealth,
    monthlyExpenses,
    recentTransactions,
    sortedTransactions,
    setTotalBalance,
    setSavedBalance,
    addTransaction,
    importTransactions,
    removeTransaction,
    updateTransaction,
  };
});
