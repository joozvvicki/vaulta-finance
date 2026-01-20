import { GoogleGenAI } from "@google/genai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.geminiApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Brak klucza API Gemini w konfiguracji serwera.",
    });
  }

  const body = await readBody(event);
  const { message, contextData } = body;

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Wiadomość jest pusta",
    });
  }

  const genAI = new GoogleGenAI({
    apiKey,
  });

  const systemInstruction = `
    Jesteś inteligentnym asystentem finansowym w aplikacji "Vaulte".
    Twoim celem jest pomaganie użytkownikowi w zarządzaniu budżetem.
    
    Oto dane finansowe użytkownika (jeśli dostępne):
    ${JSON.stringify(contextData || {})}

    Zasady:
    1. Odpowiadaj krótko, konkretnie i w języku polskim.
    2. Analizuj wydatki, sugeruj oszczędności, ale nie bądź oceniejący.
    3. Jeśli użytkownik pyta o coś niezwiązanego z finansami, grzecznie przekieruj rozmowę na finanse.
    4. Formatuj odpowiedź używając Markdown (pogrubienia, listy).
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [systemInstruction, `Pytanie użytkownika: ${message}`],
    });

    return { answer: response.text };
  } catch (error: any) {
    console.error("Błąd Gemini:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Błąd komunikacji z AI",
    });
  }
});
