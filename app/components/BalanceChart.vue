<script setup lang="ts">
// Konfiguracja wykresu ApexCharts
const series = [
  {
    name: "Saldo",
    data: [10200, 11500, 10800, 12400, 11900, 13200, 12450],
  },
];

const chartOptions = {
  chart: {
    type: "area",
    height: 350,
    toolbar: { show: false }, // Ukryj menu pobierania wykresu
    fontFamily: "inherit",
  },
  colors: ["#2563eb"], // Niebieski kolor (Tailwind blue-600)
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories: ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#64748b" } },
  },
  yaxis: { show: false }, // Ukryj oś Y dla czystszego wyglądu
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
  },
  tooltip: {
    theme: "light",
    y: {
      formatter: function (val: number) {
        return val + " PLN";
      },
    },
  },
};
</script>

<template>
  <div class="w-full h-full min-h-[300px]">
    <ClientOnly>
      <apexchart
        type="area"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </div>
</template>
