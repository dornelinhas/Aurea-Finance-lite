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
    type: 'doughnut',
    data: {
      labels: props.data.map(d => d.name),
      datasets: [{
        data: props.data.map(d => d.value),
        backgroundColor: props.data.map(d => d.color),
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: R$ ${ctx.parsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        }
      },
      cutout: '72%'
    }
  })
}

onMounted(create)
watch(() => props.data, create, { deep: true })
onUnmounted(() => { if (chartInstance) chartInstance.destroy() })
</script>
