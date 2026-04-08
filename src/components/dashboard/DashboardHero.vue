<template>
  <div class="bg-[var(--color-accent)] rounded-[20px] md:rounded-[24px] p-5 md:p-8 text-white relative overflow-hidden shadow-[var(--shadow-sm)] flex flex-col md:flex-row md:items-center justify-between min-h-[180px] md:min-h-[200px] gap-8 md:gap-0 anim-hero">
    
    <!-- Left: Current Month focus -->
    <div class="relative z-10 flex flex-col justify-center">
      <h2 class="text-[11px] md:text-[14px] font-bold mb-1 opacity-80 uppercase tracking-widest">Saldo Disponível (Real)</h2>
      <div v-if="store.loading" class="my-2">
        <SkeletonLoader width="w-48" height="h-10" radius="rounded-lg" class="opacity-30 bg-white!" />
      </div>
      <div v-else class="flex items-baseline gap-2 mb-1">
        <span class="text-3xl md:text-[42px] leading-tight font-black tracking-tighter">{{ fmt(availableBalance) }}</span>
      </div>
      <p v-if="!store.loading" class="text-[11px] md:text-[12px] font-medium opacity-70 mb-4">
        {{ fmt(totalIncome - totalExpense) }} total na conta <span class="opacity-50">(-{{ fmt(Math.abs(cardExpense)) }} fatura)</span>
      </p>
      <div class="flex items-center gap-2">
        <span class="bg-white/20 text-white text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {{ monthLabel }} {{ currentYear }}
        </span>
      </div>
    </div>

    <!-- Right: Key Metrics -->
    <div class="relative z-10 grid grid-cols-2 md:flex md:gap-8 gap-4 w-full md:w-auto">
      <div class="flex flex-col items-start md:items-end p-3 md:p-0 bg-white/5 md:bg-transparent rounded-xl">
        <span class="text-[9px] md:text-[11px] font-bold opacity-70 uppercase tracking-widest mb-1">Gasto Total</span>
        <span class="text-lg md:text-[20px] font-bold">{{ fmt(totalExpense + cardExpense) }}</span>
      </div>
      <router-link to="/cartoes" class="flex flex-col items-start md:items-end p-3 md:p-0 bg-white/5 md:bg-transparent rounded-xl cursor-pointer hover:bg-white/10 transition-colors no-underline text-white">
        <span class="text-[9px] md:text-[11px] font-bold opacity-70 uppercase tracking-widest mb-1">Fatura</span>
        <span class="text-lg md:text-[20px] font-bold">{{ fmt(cardExpense) }}</span>
        <span v-if="!store.loading" class="text-[9px] font-medium opacity-70">Vence dia {{ store.settings.credit_card_due_day || 10 }}</span>
      </router-link>
      <div class="flex flex-col items-start md:items-end p-3 md:p-0 bg-white/5 md:bg-transparent rounded-xl col-span-2 md:col-span-1">
        <span class="text-[9px] md:text-[11px] font-bold opacity-70 uppercase tracking-widest mb-1">Receita Mensal</span>
        <span class="text-lg md:text-[20px] font-bold">{{ fmt(totalIncome) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../../stores/finance.js';
import { useFinanceUtils } from '../../composables/useFinanceUtils.js';
import SkeletonLoader from '../SkeletonLoader.vue';

const store = useFinanceStore();
const { fmt, availableBalance, totalIncome, totalExpense, cardExpense, monthLabel, currentYear } = useFinanceUtils();
</script>
