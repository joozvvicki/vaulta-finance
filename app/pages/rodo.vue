<script setup lang="ts">
definePageMeta({
  layout: "default",
  title: "RODO - Obowiązek Informacyjny",
});
</script>

<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12" v-motion-fade>
        <span
          class="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block"
          >Ochrona Danych Osobowych</span
        >
        <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
          Obowiązek Informacyjny RODO
        </h1>
        <p class="mt-4 text-lg text-slate-500">
          Dowiedz się, jak przetwarzamy Twoje dane zgodnie z europejskim
          rozporządzeniem.
        </p>
      </div>

      <div
        class="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10"
        v-motion-slide-visible-once-bottom
      >
        <h3 class="font-bold text-slate-900 flex items-center gap-2 mb-3">
          <svg
            class="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Najważniejsze informacje w skrócie:
        </h3>
        <ul class="space-y-2 text-sm text-slate-600 list-disc list-inside">
          <li>
            Twoje dane są u nas bezpieczne (szyfrowanie, standardy bankowe).
          </li>
          <li>
            Przetwarzamy je głównie po to, by świadczyć usługę (agregacja kont,
            analiza).
          </li>
          <li>
            Masz prawo w każdej chwili zażądać ich usunięcia ("prawo do bycia
            zapomnianym").
          </li>
          <li>
            Kontakt do naszego Inspektora Ochrony Danych:
            <strong>iod@Vaulte.pl</strong>.
          </li>
        </ul>
      </div>

      <div
        class="prose prose-slate prose-blue max-w-none text-slate-600 space-y-8"
      >
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            1. Administrator Danych Osobowych
          </h2>
          <p>
            Administratorem Twoich danych osobowych jest
            <strong>Vaulte Sp. z o.o.</strong> z siedzibą w Warszawie (00-001),
            przy ul. Fintechowej 12, wpisana do rejestru przedsiębiorców KRS pod
            numerem 0000123456, NIP: 5250000000.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            2. Inspektor Ochrony Danych (IOD)
          </h2>
          <p>
            Wyznaczyliśmy Inspektora Ochrony Danych, z którym możesz się
            skontaktować we wszystkich sprawach dotyczących przetwarzania danych
            osobowych oraz korzystania z praw związanych z tym przetwarzaniem.
          </p>
          <p class="mt-2">
            📧 Kontakt:
            <a
              href="mailto:iod@Vaulte.pl"
              class="text-blue-600 font-medium hover:underline"
              >iod@Vaulte.pl</a
            >
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            3. Cele i podstawy prawne przetwarzania
          </h2>
          <p>Przetwarzamy Twoje dane w następujących celach:</p>
          <ul class="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>Świadczenie usług drogą elektroniczną</strong> (Art. 6
              ust. 1 lit. b RODO) – niezbędne do wykonania umowy (założenie
              konta, agregacja danych bankowych).
            </li>
            <li>
              <strong>Wypełnienie obowiązków prawnych</strong> (Art. 6 ust. 1
              lit. c RODO) – np. przepisy o rachunkowości, przepisy podatkowe,
              przeciwdziałanie praniu pieniędzy (AML).
            </li>
            <li>
              <strong>Cele analityczne i statystyczne</strong> (Art. 6 ust. 1
              lit. f RODO) – nasz uzasadniony interes polegający na ulepszaniu
              aplikacji.
            </li>
            <li>
              <strong>Marketing bezpośredni</strong> (Art. 6 ust. 1 lit. f RODO)
              – informowanie o nowych funkcjach Vaulte.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            4. Odbiorcy danych
          </h2>
          <p>
            Twoje dane mogą być przekazywane podmiotom przetwarzającym je na
            nasze zlecenie, m.in.:
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-2">
            <li>Dostawcom usług IT i chmurowych (np. AWS, Google Cloud).</li>
            <li>Licencjonowanym dostawcom usług Open Banking (TPP).</li>
            <li>Biurem księgowym i prawnym.</li>
            <li>
              Organom państwowym (np. KNF, Urząd Skarbowy) – tylko gdy wymagają
              tego przepisy prawa.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">5. Twoje prawa</h2>
          <p>Zgodnie z RODO przysługuje Ci:</p>
          <ul class="grid sm:grid-cols-2 gap-4 mt-4">
            <li
              class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
            >
              Prawo dostępu do danych
            </li>
            <li
              class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
            >
              Prawo do sprostowania danych
            </li>
            <li
              class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
            >
              Prawo do usunięcia danych ("bycia zapomnianym")
            </li>
            <li
              class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
            >
              Prawo do ograniczenia przetwarzania
            </li>
            <li
              class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
            >
              Prawo do przenoszenia danych
            </li>
            <li
              class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
            >
              Prawo wniesienia sprzeciwu
            </li>
          </ul>
          <p class="mt-4">
            Masz również prawo wniesienia skargi do organu nadzorczego – Prezesa
            Urzędu Ochrony Danych Osobowych (PUODO).
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            6. Okres przechowywania danych
          </h2>
          <p>
            Dane przechowujemy przez okres posiadania konta w serwisie Vaulte.
            Po jego usunięciu, dane mogą być przechowywane przez okres
            przedawnienia roszczeń (zazwyczaj 3 lub 6 lat) oraz okres wynikający
            z przepisów podatkowych (5 lat).
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">7. Profilowanie</h2>
          <p>
            W ramach usługi "Budget Tracker" możemy stosować zautomatyzowaną
            analizę Twoich wydatków (profilowanie), aby proponować Ci kategorie
            budżetowe. Nie podejmujemy jednak na tej podstawie decyzji
            wywołujących skutki prawne (np. odmowa kredytu).
          </p>
        </section>
      </div>

      <div
        class="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center"
      >
        <NuxtLink
          to="/"
          class="text-blue-600 font-medium hover:text-blue-800 transition flex items-center gap-2"
        >
          <span>←</span> Powrót do strony głównej
        </NuxtLink>
        <span class="text-sm text-slate-400">Aktualizacja: Styczeń 2026</span>
      </div>
    </div>
  </div>
</template>
