<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
          Regulamin Serwisu
        </h1>
        <p class="mt-4 text-lg text-slate-500">
          Ostatnia aktualizacja: 19 Stycznia 2026
        </p>
      </div>

      <div
        class="prose prose-slate prose-blue max-w-none text-slate-600 space-y-8"
      >
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            §1. Postanowienia ogólne
          </h2>
          <p>
            1. Niniejszy Regulamin określa zasady korzystania z aplikacji
            internetowej <strong>Vaulte</strong>, dostępnej pod adresem
            Vaulte.pro.
          </p>
          <p>
            2. Operatorem serwisu jest Vaulte Sp. z o.o. z siedzibą w Warszawie
            (00-001), wpisana do rejestru przedsiębiorców KRS pod numerem
            0000000000.
          </p>
          <p>
            3. Aplikacja służy do agregacji danych finansowych użytkownika
            (usługa AIS - Account Information Service) w oparciu o otwarte API
            bankowe zgodne z dyrektywą PSD2.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            §2. Zasady działania konta
          </h2>
          <p>
            1. Dostęp do pełnej funkcjonalności serwisu wymaga rejestracji i
            utworzenia Konta Użytkownika.
          </p>
          <p>
            2. Użytkownik zobowiązany jest do podania prawdziwych danych oraz
            chronienia hasła dostępowego przed osobami trzecimi.
          </p>
          <p>
            3. Vaulte nie przechowuje danych logowania do bankowości
            elektronicznej użytkownika. Proces logowania odbywa się bezpośrednio
            na stronach banków lub licencjonowanych integratorów (TPP).
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            §3. Płatności i Subskrypcje
          </h2>
          <p>1. Serwis oferuje plany darmowe oraz płatne (Premium).</p>
          <p>
            2. Opłaty za subskrypcje pobierane są w cyklach miesięcznych.
            Użytkownik może zrezygnować z subskrypcji w dowolnym momencie,
            zachowując dostęp do końca okresu rozliczeniowego.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            §4. Odpowiedzialność
          </h2>
          <p>
            1. Operator dokłada wszelkich starań, aby dane prezentowane w
            Aplikacji były aktualne, jednak nie ponosi odpowiedzialności za
            opóźnienia wynikające z działania API banków.
          </p>
          <p>
            2. Aplikacja ma charakter analityczny i informacyjny. Nie stanowi
            doradztwa inwestycyjnego w rozumieniu przepisów prawa.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            §5. Postępowanie reklamacyjne
          </h2>
          <p>
            1. Wszelkie reklamacje dotyczące działania Serwisu należy zgłaszać
            drogą elektroniczną na adres: pomoc@Vaulte.pro.
          </p>
          <p>
            2. Reklamacje rozpatrywane są w terminie 14 dni od daty ich
            wpłynięcia.
          </p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-200">
        <NuxtLink
          to="/"
          class="text-blue-600 font-medium hover:text-blue-800 transition flex items-center gap-2"
        >
          <span>←</span> Powrót do strony głównej
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
