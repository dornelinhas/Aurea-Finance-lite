<template>
  <canvas ref="canvasRef" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  data: { type: Array, required: true }
})

const canvasRef = ref(null)
let chartInstance = null

function create() {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null }
  if (!canvasRef.value || !props.data.length) return

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.data.map(d => d.label),
      datasets: [
        {
          label: 'Receitas',
          data: props.data.map(d => d.income),
          backgroundColor: 'rgba(52, 199, 89, 0.7)',
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Despesas',
          data: props.data.map(d => d.expense),
          backgroundColor: 'rgba(255, 59, 48, 0.7)',
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#86868B',
            font: { size: 11, family: 'Inter' },
            boxWidth: 12,
            padding: 14
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: R$ ${ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#86868B', font: { size: 11, family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(128, 128, 128, 0.08)' },
          ticks: {
            color: '#86868B',
            font: { size: 11, family: 'Inter' },
            callback: v => 'R$' + (v / 1000).toFixed(1) + 'k'
          }
        }
      }
    }
  })
}

onMounted(create)
watch(() => props.data, create, { deep: true })
onUnmounted(() => { if (chartInstance) chartInstance.destroy() })
</script>
