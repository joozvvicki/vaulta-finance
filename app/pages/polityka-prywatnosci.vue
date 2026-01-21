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
          Polityka Prywatności
        </h1>
        <p class="mt-4 text-lg text-slate-500">
          Dbamy o bezpieczeństwo Twoich finansów.
        </p>
      </div>

      <div class="text-slate-600 space-y-8 leading-relaxed">
        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
          <p class="font-bold text-blue-900">W skrócie:</p>
          <p class="text-sm text-blue-800 mt-1">
            Nie sprzedajemy Twoich danych. Nie widzimy Twoich haseł do banku.
            Dane są szyfrowane (AES-256). Służą wyłącznie do wyświetlania Twoich
            statystyk.
          </p>
        </div>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            1. Administrator Danych
          </h2>
          <p>
            Administratorem Twoich danych osobowych jest Vaulte Sp. z o.o. z
            siedzibą w Warszawie. Możesz skontaktować się z Inspektorem Ochrony
            Danych pod adresem: iod@Vaulte.pro.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            2. Jakie dane przetwarzamy?
          </h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <strong>Dane konta:</strong> adres email, imię i nazwisko
              (niezbędne do logowania).
            </li>
            <li>
              <strong>Dane finansowe (AIS):</strong> historia transakcji, saldo,
              numer konta IBAN. Dane te pobierane są wyłącznie na Twoje wyraźne
              żądanie za pośrednictwem bezpiecznego API.
            </li>
            <li>
              <strong>Dane techniczne:</strong> adres IP, typ przeglądarki,
              pliki cookies.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            3. Bezpieczeństwo (Open Banking)
          </h2>
          <p>
            Korzystamy z usług licencjonowanych dostawców (TPP) działających
            zgodnie z unijną dyrektywą PSD2. Kiedy łączysz konto bankowe:
          </p>
          <ol class="list-decimal pl-5 space-y-2 mt-2">
            <li>Zostajesz przekierowany na szyfrowaną stronę swojego banku.</li>
            <li>Logujesz się w banku (my nie widzimy tych danych).</li>
            <li>
              Bank wysyła nam bezpieczny, czasowy "token", który pozwala nam
              pobrać historię transakcji.
            </li>
          </ol>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            4. Komu udostępniamy dane?
          </h2>
          <p>
            Twoje dane mogą być przetwarzane przez podmioty techniczne
            wspierające naszą infrastrukturę (np. dostawcy chmury obliczeniowej,
            dostawcy API bankowego). Podmioty te przetwarzają dane wyłącznie na
            nasze polecenie i są zobowiązane do zachowania poufności.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">
            5. Twoje prawa (RODO)
          </h2>
          <p>
            Masz prawo do: dostępu do swoich danych, ich sprostowania, usunięcia
            ("prawo do bycia zapomnianym"), ograniczenia przetwarzania oraz
            przenoszenia danych.
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
