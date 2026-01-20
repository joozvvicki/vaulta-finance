import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.geminiApiKey;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" },
  });

  const body = await readBody(event);
  const { message, contextData } = body;

  const systemInstruction = `
    Jesteś zaawansowanym zarządcą finansów w aplikacji Vaulte.
    Masz dostęp do aktualnych danych użytkownika (Context).
    
    Twoim zadaniem jest klasyfikacja intencji i zwrócenie obiektu JSON.
    Masz dwa główne typy odpowiedzi: "MESSAGE" (rozmowa) i "ACTION" (operacja na danych).

    DOSTĘPNE AKCJE (pole "action"):
    
    1. ZARZĄDZANIE TRANSAKCJAMI:
       - "ADD_TRANSACTION": Nowy wydatek/przychód.
       - "UPDATE_TRANSACTION": Edycja istniejącej. Musisz znaleźć ID w kontekście!
       - "DELETE_TRANSACTION": Usunięcie. Musisz znaleźć ID w kontekście!
    
    2. ZARZĄDZANIE CELAMI (GOALS):
       - "ADD_GOAL",
        "UPDATE_GOAL",
        "DELETE_GOAL"
    
    3. ZARZĄDZANIE BUDŻETEM (CATEGORIES):
       - "ADD_CATEGORY", "UPDATE_CATEGORY", "DELETE_CATEGORY"

    STRUKTURA ODPOWIEDZI JSON:
    {
      "type": "ACTION" | "MESSAGE",
      "text": "Krótki komentarz dla użytkownika (np. 'Zrobione', 'Nie znalazłem takiej transakcji')",
      "operation": {
        "domain": "TRANSACTION" | "GOAL" | "BUDGET",
        "action": "CREATE" | "UPDATE" | "DELETE",
        "id": "string (UUID znaleziony w kontekście - TYLKO dla UPDATE/DELETE)",
        "payload": {
          // Tutaj pola do zmiany/dodania, np. amount, merchant, title, target itp.
          // Dla UPDATE wysyłaj tylko te pola, które się zmieniają.
          // Dla merchant (STRING), jeśli nie ma dajemy "Nieznany"
        }
      }
    }

    ZASADY:
    1. Jeśli użytkownik mówi "Usuń Netflixa", przeszukaj podane w kontekście transakcje, znajdź tę z opisem "Netflix" i użyj jej ID. Jeśli jest ich kilka, wybierz najnowszą, chyba że użytkownik sprecyzował.
    2. Jeśli nie możesz znaleźć obiektu do edycji/usunięcia w kontekście, zwróć type: "MESSAGE" z prośbą o szczegóły.
    3. Kwoty wydatków w payload zawsze ujemne, przychodów dodatnie.

    Kontekst danych: ${JSON.stringify(contextData)}
    Dzisiejsza data: ${new Date().toISOString().split("T")[0]}
  `;

  try {
    const result = await model.generateContent(
      `${systemInstruction}\n\nKomenda użytkownika: ${message}`,
    );
    return { response: result.response.text() };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
