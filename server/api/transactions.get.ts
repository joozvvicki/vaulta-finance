import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: 1,
      merchant: "Spotify AB",
      date: "2026-01-18",
      category: "Rozrywka",
      amount: -29.99,
      status: "Completed",
      icon: "🎧",
    },
    {
      id: 2,
      merchant: "Żabka Polska",
      date: "2026-01-18",
      category: "Zakupy",
      amount: -45.5,
      status: "Completed",
      icon: "🐸",
    },
    {
      id: 3,
      merchant: "Pracodawca sp. z o.o.",
      date: "2026-01-15",
      category: "Wypłata",
      amount: 8500.0,
      status: "Completed",
      icon: "💼",
    },
    {
      id: 4,
      merchant: "Uber Trip",
      date: "2026-01-14",
      category: "Transport",
      amount: -35.2,
      status: "Pending",
      icon: "u",
    },
    {
      id: 5,
      merchant: "Netflix",
      date: "2026-01-12",
      category: "Rozrywka",
      amount: -52.0,
      status: "Completed",
      icon: "🎬",
    },
    {
      id: 6,
      merchant: "Orlen",
      date: "2026-01-10",
      category: "Paliwo",
      amount: -240.0,
      status: "Completed",
      icon: "⛽",
    },
    {
      id: 7,
      merchant: "Bankomat Euronet",
      date: "2026-01-09",
      category: "Gotówka",
      amount: -100.0,
      status: "Failed",
      icon: "🏧",
    },
  ];
});
