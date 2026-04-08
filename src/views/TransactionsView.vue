<template>
  <div>
    <div class="px-8 pt-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-[28px] font-extrabold tracking-tight">Transações</h1>
        <p class="text-[13px] text-[var(--color-text-secondary)] mt-1 font-medium">{{ filtered.length }} registros</p>
      </div>
      <div class="flex gap-2 flex-nowrap">
        <div class="flex bg-[var(--color-surface-secondary)]/50 p-1 rounded-xl border border-[var(--color-border)] mr-2">
          <button 
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none"
            :class="viewTab === 'geral' ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
            @click="viewTab = 'geral'"
          >Geral</button>
          <button 
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none"
            :class="viewTab === 'debts' ? 'bg-[var(--color-surface)] text-[var(--color-expense)] shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
            @click="viewTab = 'debts'"
          >Dívidas Externas</button>
        </div>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="handleExportExcel">Exportar Excel</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="openModal()">Nova Transação</button>
      </div>
    </div>

    <div class="px-8 py-6 pb-14">
      <!-- Summary Totals -->
      <div v-if="viewTab === 'geral'" class="grid grid-cols-4 gap-4 mb-5 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div class="bg-[var(--color-income-bg)] border border-[var(--color-income-bg)] rounded-xl px-6 py-5 shadow-sm">
          <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[var(--color-income)] mb-1.5">Receitas Pessoais</p>
          <p class="text-2xl font-black text-[var(--color-income)]">{{ fmt(totIncome) }}</p>
        </div>
        <div class="bg-[var(--color-expense-bg)] border border-[var(--color-expense-bg)] rounded-xl px-6 py-5 shadow-sm">
          <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[var(--color-expense)] mb-1.5">Despesas Pessoais</p>
          <p class="text-2xl font-black text-[var(--color-expense)]">{{ fmt(totExpense) }}</p>
        </div>
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-6 py-5 shadow-sm">
          <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[var(--color-text-secondary)] mb-1.5">Gasto Conta</p>
          <p class="text-2xl font-black text-[var(--color-secondary)]">{{ fmt(totCashExpense) }}</p>
        </div>
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-6 py-5 shadow-sm">
          <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[var(--color-text-secondary)] mb-1.5">Gasto Cartão</p>
          <p class="text-2xl font-black text-[var(--color-accent)]">{{ fmt(totCardExpense) }}</p>
        </div>
      </div>

      <!-- External Debt Summary -->
      <div v-else class="grid grid-cols-2 gap-4 mb-5">
        <div class="bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-income)]/30 rounded-2xl px-6 py-6 shadow-sm">
          <p class="text-[12px] font-extrabold uppercase tracking-widest text-[var(--color-income)] mb-2">A Receber de Terceiros</p>
          <p class="text-3xl font-black text-[var(--color-income)]">{{ fmt(totThirdParty) }}</p>
          <p class="text-[11px] text-[var(--color-text-secondary)] mt-1">Dinheiro que você emprestou ou pagou para outros.</p>
        </div>
        <div class="bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-expense)]/30 rounded-2xl px-6 py-6 shadow-sm">
          <p class="text-[12px] font-extrabold uppercase tracking-widest text-[var(--color-expense)] mb-2">Dívidas que Eu Devo</p>
          <p class="text-3xl font-black text-[var(--color-expense)]">{{ fmt(totMyDebts) }}</p>
          <p class="text-[11px] text-[var(--color-text-secondary)] mt-1">Contas pendentes que você deve a terceiros.</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] mb-4 overflow-hidden">
        <!-- Primary Filter Row -->
        <div class="px-4 py-3.5 flex flex-wrap items-center gap-2">
          <input class="form-input max-w-[220px]" placeholder="Buscar..." v-model="search" />
          <div class="flex gap-1.5">
            <button
              v-for="[val, label] in [['all','Todos'],['income','Receitas'],['expense','Despesas']]"
              :key="val"
              @click="filter = val"
              class="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-150 border-none font-[var(--font-sans)]"
              :class="filterBtnClass(val)"
            >{{ label }}</button>
          </div>
          <button class="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-150 border-none bg-transparent text-[var(--color-text-secondary)] font-[var(--font-sans)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]" @click="sortDesc = !sortDesc">
            {{ sortDesc ? 'Recente' : 'Antigo' }}
          </button>
          <button 
            class="ml-auto px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all duration-150 border font-[var(--font-sans)] flex items-center gap-1.5"
            :class="showAdvanced ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] border-[var(--color-accent)]/30' : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-hover)]'"
            @click="showAdvanced = !showAdvanced"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filtros{{ activeFilterCount > 0 ? ` (${activeFilterCount})` : '' }}
          </button>
        </div>

        <!-- Advanced Filters Panel (collapsible) -->
        <div v-if="showAdvanced" class="px-4 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 flex flex-col gap-4">
          <!-- Date Range -->
          <div>
            <p class="text-xs font-black text-[var(--color-text-tertiary)] uppercase tracking-widest mb-2">Intervalo de Datas</p>
            <div class="flex items-center gap-2 flex-wrap">
              <input class="form-input max-w-[160px] text-xs" type="date" v-model="tempDateFrom" placeholder="De" />
              <span class="text-xs font-bold text-[var(--color-text-tertiary)]">até</span>
              <input class="form-input max-w-[160px] text-xs" type="date" v-model="tempDateTo" placeholder="Até" />
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div>
            <p class="text-xs font-black text-[var(--color-text-tertiary)] uppercase tracking-widest mb-2">Categorias</p>
            <div class="flex flex-wrap gap-1.5">
              <button 
                v-for="cat in allCategories" :key="cat"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border"
                :class="tempSelectedCategories.includes(cat) 
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'"
                @click="toggleTempCategory(cat)"
              >{{ cat }}</button>
            </div>
          </div>

          <!-- Account Filter -->
          <div>
            <p class="text-xs font-black text-[var(--color-text-tertiary)] uppercase tracking-widest mb-2">Conta / Cartão</p>
            <div class="flex flex-wrap gap-1.5">
              <button 
                v-for="acc in allAccounts" :key="acc"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border"
                :class="tempSelectedAccounts.includes(acc) 
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'"
                @click="toggleTempAccount(acc)"
              >{{ acc }}</button>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button class="px-5 py-2 rounded-xl text-[12px] font-bold bg-[var(--color-accent)] text-white border-none cursor-pointer shadow-md hover:bg-[var(--color-accent-hover)] transition-all" @click="applyFilters">
              Aplicar Filtros
            </button>
            <button class="px-5 py-2 rounded-xl text-[12px] font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer hover:bg-[var(--color-hover)] transition-all" @click="clearAllFilters">
              Limpar Tudo
            </button>
          </div>
        </div>
      </div>

      <!-- Table / List -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] p-0">
        <div v-if="filtered.length === 0" class="text-center py-12 text-[var(--color-text-secondary)]">
          <p class="text-lg font-bold text-[var(--color-text-tertiary)] mb-1.5">Nenhuma transação</p>
          <p class="text-[13px] font-medium">Nenhuma transação encontrada com os filtros atuais</p>
        </div>
        <div v-else>
          <!-- Desktop Table -->
          <div class="overflow-x-auto hidden md:block">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-left border-b border-[var(--color-separator)]">Data</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-left border-b border-[var(--color-separator)]">Descrição</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-left border-b border-[var(--color-separator)]">Categoria</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-left border-b border-[var(--color-separator)]">Tipo</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-center border-b border-[var(--color-separator)]">Parcelas</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-center border-b border-[var(--color-separator)]">Status</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-right border-b border-[var(--color-separator)]">Valor</th>
                  <th class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-5 py-4 text-right border-b border-[var(--color-separator)]">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in filtered" :key="t.id" class="hover:bg-[var(--color-hover)]">
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle text-[var(--color-text-secondary)] text-[13px] font-medium">{{ fmtDate(t.date) }}</td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle font-semibold">{{ t.name }}</td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle"><span class="text-[13px] text-[var(--color-text-secondary)]">{{ t.category || '—' }} &bull; {{ t.account === 'Conta Corrente' ? 'Conta' : t.account }}</span></td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold" :class="t.type === 'income' ? 'bg-[var(--color-income-bg)] text-[var(--color-income)]' : 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]'">
                      {{ t.type === 'income' ? 'Receita' : 'Despesa' }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle text-center">
                    <span v-if="t.installment_total && t.installment_total > 1" class="text-[12px] font-bold text-[var(--color-text-tertiary)] bg-[var(--color-surface-secondary)] px-2.5 py-1 rounded-md">
                      {{ t.installment_current || 1 }}/{{ t.installment_total }}
                    </span>
                    <span v-else class="text-[var(--color-text-tertiary)]">—</span>
                  </td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle text-center">
                    <button 
                      class="inline-flex items-center justify-center p-1.5 rounded-lg border-none cursor-pointer transition-all duration-200"
                      :class="t.is_paid ? 'bg-[var(--color-income-bg)] text-[var(--color-income)]' : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-hover)]'"
                      @click="togglePaid(t)"
                      :title="t.is_paid ? 'Marcado como Pago' : 'Marcar como Pago'"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </button>
                  </td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle text-right font-bold" :style="{ color: t.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }">
                    {{ t.type === 'income' ? '+' : '-' }} {{ fmt(t.amount) }}
                  </td>
                  <td class="px-4 py-3.5 text-sm border-b border-[var(--color-border)] align-middle text-right">
                    <button class="px-2.5 py-1.5 rounded-md bg-transparent cursor-pointer border-none text-[13px] font-semibold transition-all duration-150 text-[var(--color-text-secondary)] font-[var(--font-sans)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]" @click="openModal(t)">Editar</button>
                    <button class="px-2.5 py-1.5 rounded-md bg-transparent cursor-pointer border-none text-[13px] font-semibold transition-all duration-150 text-[var(--color-expense)] font-[var(--font-sans)] hover:bg-[var(--color-hover)]" @click="remove(t.id)">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Mobile List -->
          <div class="block md:hidden">
            <div v-for="t in filtered" :key="`mob-${t.id}`" class="px-4 py-4 border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" :class="t.type === 'income' ? 'bg-[var(--color-income)]' : 'bg-[var(--color-expense)]'">
                    <svg v-if="t.type === 'income'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-0.5">
                      <p class="text-[14px] font-bold text-[var(--color-text-primary)]">{{ t.name }}</p>
                      <span v-if="t.installment_total && t.installment_total > 1" class="text-[10px] font-bold text-[var(--color-text-tertiary)] bg-[var(--color-surface-secondary)] px-1.5 py-0.5 rounded">
                        {{ t.installment_current || 1 }}/{{ t.installment_total }}
                      </span>
                    </div>
                    <p class="text-[12px] font-medium text-[var(--color-text-secondary)]">{{ t.category || 'Sem categoria' }} &bull; {{ t.account === 'Conta Corrente' ? 'Conta' : t.account }} &bull; {{ fmtDate(t.date) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[15px] font-extrabold" :style="{ color: t.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }">
                    {{ t.type === 'income' ? '+' : '-' }} {{ fmt(t.amount) }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2 pt-1 border-t border-[var(--color-separator)] mt-1">
                <button class="flex-1 px-3 py-2 rounded-md bg-transparent border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-hover)]" @click="openModal(t)">Editar</button>
                <button class="flex-1 px-3 py-2 rounded-md bg-transparent border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-expense)] transition-all hover:bg-[var(--color-expense-bg)]" @click="remove(t.id)">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal :visible="showModal" :title="editing ? 'Editar Transação' : 'Nova Transação'" @close="closeModal">
      <div class="mb-5">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Tipo de Lançamento</label>
        <div class="flex gap-1.5 p-1 bg-[var(--color-surface-secondary)] rounded-xl border border-[var(--color-border)]">
          <button
            v-for="[val, label] in [['income','Receita'],['expense','Despesa']]"
            :key="val"
            @click="form.type = val; form.category = ''"
            class="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 border-none font-[var(--font-sans)]"
            :class="form.type === val ? (val === 'income' ? 'bg-white text-[var(--color-income)] shadow-sm dark:bg-[var(--color-income-bg)]' : 'bg-white text-[var(--color-expense)] shadow-sm dark:bg-[var(--color-expense-bg)]') : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
          >{{ label }}</button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Conta / Carteira</label>
        <select class="form-select" v-model="form.account">
          <option value="Conta Corrente">Conta Corrente (Dinheiro/Pix)</option>
          <option v-for="c in cards" :key="c.id" :value="c.name">Cartão: {{ c.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Descrição</label>
        <input class="form-input" v-model="form.name" placeholder="Ex: Supermercado" />
      </div>
      <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
            {{ form.is_installment && form.type === 'expense' ? 'Valor da Parcela (R$)' : 'Valor (R$)' }}
          </label>
          <input class="form-input" type="number" step="0.01" v-model.number="form.amount" placeholder="0,00" />
          <p v-if="form.type === 'expense' && form.is_installment && form.amount > 0" class="text-[10px] text-[var(--color-text-tertiary)] mt-1 font-bold">
             Valor Total da Compra: R$ {{ (form.amount * (Number(form.installments_paid) + Number(form.installments_remaining))).toFixed(2).replace('.', ',') }}
          </p>
        </div>
        <div v-if="form.type === 'expense'" class="mb-4 flex items-end pb-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer">
            <input type="checkbox" v-model="form.is_installment" class="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]">
            Compra Parcelada?
          </label>
        </div>
      </div>
      
      <div v-if="form.type === 'expense' && form.is_installment" class="grid grid-cols-2 gap-3 max-sm:grid-cols-1 mb-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50">
         <div>
           <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Parcelas Pagas</label>
           <input class="form-input bg-[var(--color-surface)]" type="number" min="0" v-model.number="form.installments_paid" placeholder="0" />
         </div>
         <div>
           <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Parcelas Restantes</label>
           <input class="form-input bg-[var(--color-surface)]" type="number" min="1" v-model.number="form.installments_remaining" placeholder="1" />
         </div>
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Data</label>
        <input class="form-input" type="date" v-model="form.date" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Categoria</label>
        <select class="form-select" v-model="form.category">
          <option value="">Selecione...</option>
          <option v-for="c in filteredCategories" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>
      </div>
      <div v-if="form.type === 'expense'" class="mb-4 flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
        <div>
          <p class="text-sm font-bold text-[var(--color-text-primary)]">Já foi pago?</p>
          <p class="text-[11px] text-[var(--color-text-secondary)] font-medium">Se marcado, o valor será debitado do saldo da conta agora.</p>
        </div>
        <input type="checkbox" v-model="form.is_paid" class="w-6 h-6 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer">
      </div>
      <div class="mb-4 flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
        <div>
          <p class="text-sm font-bold text-[var(--color-text-primary)]">Essa despesa é minha?</p>
          <p class="text-[11px] text-[var(--color-text-secondary)] font-medium">Se desmarcado, não será descontado do seu saldo pessoal.</p>
        </div>
        <input type="checkbox" v-model="form.is_personal" class="w-6 h-6 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer">
      </div>
      <!-- Debt toggle (only for expenses) -->
      <div v-if="form.type === 'expense'" class="mb-4 flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-expense-bg)]/20">
        <div>
          <p class="text-sm font-bold text-[var(--color-expense)]">Eu devo esse valor a alguém?</p>
          <p class="text-[11px] text-[var(--color-text-secondary)] font-medium">Marque como dívida para lembrar de pagar depois.</p>
        </div>
        <input type="checkbox" v-model="form.is_debt" @change="form.is_debt ? form.is_paid = false : null" class="w-6 h-6 rounded border-[var(--color-border)] text-[var(--color-expense)] focus:ring-[var(--color-expense)] cursor-pointer">
      </div>
      <template #footer>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]" @click="closeModal">Cancelar</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]" @click="save">{{ editing ? 'Salvar' : 'Adicionar' }}</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api/index.js'
import { useExport } from '../composables/useExport.js'
import AppModal from '../components/AppModal.vue'

const route = useRoute()
const { exportToExcel } = useExport()

const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—'
const todayISO = new Date().toISOString().slice(0, 10)

const transactions = ref([])
const categories = ref([])
const cards = ref([])
const showModal = ref(false)
const editing = ref(null)
const filter = ref('all')
const search = ref('')
const showAdvanced = ref(false)
const viewTab = ref('geral')
const sortDesc = ref(true)

// Active filters (actually applied)
const dateFrom = ref('')
const dateTo = ref('')
const selectedCategories = ref([])
const selectedAccounts = ref([])

// Temporary filters (staged in UI)
const tempDateFrom = ref('')
const tempDateTo = ref('')
const tempSelectedCategories = ref([])
const tempSelectedAccounts = ref([])

const emptyForm = () => ({ name: '', amount: '', category: '', date: new Date().toISOString().slice(0, 10), type: 'expense', account: 'Conta Corrente', is_paid: true, is_personal: true, is_debt: false, is_installment: false, installments_paid: 0, installments_remaining: 1 })
const form = ref(emptyForm())

onMounted(async () => {
  const [txns, cats, cardList] = await Promise.all([
    api.getTransactions(),
    api.getCategories(),
    api.getCreditCards()
  ])
  transactions.value = txns
  categories.value = cats
  cards.value = cardList

  // Handle Quick Add from Categories
  if (route.query.quickAdd === 'true' && route.query.catName) {
    openModal()
    form.value.type = route.query.catType || 'expense'
    form.value.category = route.query.catName
  }
})

const filteredCategories = computed(() =>
  categories.value.filter(c => c.type === form.value.type)
)

const allCategories = computed(() => [...new Set(transactions.value.map(t => t.category))].filter(Boolean).sort())
const allAccounts = computed(() => {
  const accs = transactions.value.map(t => t.account || 'Conta Corrente')
  return [...new Set(accs)].sort()
})

const activeFilterCount = computed(() => {
  let count = 0
  if (dateFrom.value) count++
  if (dateTo.value) count++
  count += selectedCategories.value.length
  count += selectedAccounts.value.length
  return count
})

function toggleTempCategory(name) {
  if (tempSelectedCategories.value.includes(name)) {
    tempSelectedCategories.value = tempSelectedCategories.value.filter(c => c !== name)
  } else {
    tempSelectedCategories.value.push(name)
  }
}

function toggleTempAccount(name) {
  if (tempSelectedAccounts.value.includes(name)) {
    tempSelectedAccounts.value = tempSelectedAccounts.value.filter(a => a !== name)
  } else {
    tempSelectedAccounts.value.push(name)
  }
}

function applyFilters() {
  dateFrom.value = tempDateFrom.value
  dateTo.value = tempDateTo.value
  selectedCategories.value = [...tempSelectedCategories.value]
  selectedAccounts.value = [...tempSelectedAccounts.value]
}

function clearAllFilters() {
  tempDateFrom.value = ''
  tempDateTo.value = ''
  tempSelectedCategories.value = []
  tempSelectedAccounts.value = []
  applyFilters()
}

const filtered = computed(() => {
  let list = [...transactions.value]
  
  if (viewTab.value === 'debts') {
    list = list.filter(t => !t.is_personal || !!t.is_debt)
  } else {
    list = list.filter(t => !!t.is_personal && !t.is_debt)
  }

  if (filter.value !== 'all') list = list.filter(t => t.type === filter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q))
  }
  // Date range filter
  if (dateFrom.value) {
    list = list.filter(t => t.date >= dateFrom.value)
  }
  if (dateTo.value) {
    list = list.filter(t => t.date <= dateTo.value)
  }
  // Category multi-select
  if (selectedCategories.value.length > 0) {
    list = list.filter(t => selectedCategories.value.includes(t.category))
  }
  // Account multi-select
  if (selectedAccounts.value.length > 0) {
    list = list.filter(t => selectedAccounts.value.includes(t.account))
  }
  return list.sort((a, b) => sortDesc.value ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))
})

const totIncome = computed(() => filtered.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))
const totExpense = computed(() => filtered.value.filter(t => t.type === 'expense' && t.is_personal).reduce((s, t) => s + t.amount, 0))
const totCardExpense = computed(() => {
  return filtered.value
    .filter(t => t.type === 'expense' && t.account !== 'Conta Corrente' && t.account && t.is_personal)
    .reduce((s, t) => s + t.amount, 0)
})
const totCashExpense = computed(() => {
  return filtered.value
    .filter(t => t.type === 'expense' && (t.account === 'Conta Corrente' || !t.account) && t.is_personal)
    .reduce((s, t) => s + t.amount, 0)
})
const totThirdParty = computed(() => {
  return filtered.value
    .filter(t => t.type === 'expense' && !t.is_personal)
    .reduce((s, t) => s + t.amount, 0)
})
const totMyDebts = computed(() => {
  return filtered.value
    .filter(t => !!t.is_debt && !t.is_paid)
    .reduce((s, t) => s + t.amount, 0)
})

function filterBtnClass(val) {
  if (filter.value === val) {
    if (val === 'income') return 'bg-[var(--color-income-bg)] text-[var(--color-income)]'
    if (val === 'expense') return 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]'
    return 'bg-[var(--color-accent)] text-white'
  }
  return 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]'
}

function typeBtnClass(val) {
  if (form.value.type === val) {
    if (val === 'income') return 'bg-[var(--color-income-bg)] text-[var(--color-income)]'
    return 'bg-[var(--color-expense-bg)] text-[var(--color-expense)]'
  }
  return 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]'
}

function openModal(t = null) {
  if (t) {
    editing.value = t.id
    form.value = { 
      name: t.name, 
      amount: t.amount, 
      category: t.category, 
      date: t.date, 
      type: t.type, 
      account: t.account || 'Conta Corrente',
      is_paid: !!t.is_paid,
      is_personal: t.is_personal !== undefined ? !!t.is_personal : true,
      is_debt: !!t.is_debt,
      is_installment: !!(t.installment_total && t.installment_total > 1),
      installments_paid: (t.installment_current || 1) - 1,
      installments_remaining: t.installment_total ? (t.installment_total - (t.installment_current || 1) + 1) : 1
    }
  } else {
    editing.value = null
    form.value = emptyForm()
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editing.value = null
}

async function save() {
  // If name is empty, try to use category
  if (!form.value.name.trim() && form.value.category) {
    form.value.name = form.value.category
  }
  
  if (!form.value.name.trim()) {
    alert('Por favor, insira uma descrição ou selecione uma categoria.')
    return
  }
  
  const amount = Number(form.value.amount)
  if (isNaN(amount) || amount <= 0) {
    alert('Por favor, insira um valor válido.')
    return
  }
  
  if (!form.value.date) {
    alert('Por favor, selecione uma data.')
    return
  }

  try {
    const data = { ...form.value, amount }
    
    if (!data.is_installment) {
      data.installments_paid = 0;
      data.installments_remaining = 1;
    } else {
      data.installments_paid = Number(data.installments_paid) || 0;
      data.installments_remaining = Number(data.installments_remaining) || 1;
    }
    
    if (editing.value) {
      const updated = await api.updateTransaction(editing.value, data)
      transactions.value = transactions.value.map(t => t.id === editing.value ? updated : t)
    } else {
      const created = await api.createTransaction(data)
      if (Array.isArray(created)) {
          transactions.value = [...created, ...transactions.value]
      } else {
          transactions.value = [created, ...transactions.value]
      }
    }
    closeModal()
  } catch (err) {
    console.error(err)
    alert('Erro ao salvar transação: ' + err.message)
  }
}

async function togglePaid(t) {
  const newStatus = t.is_paid ? 0 : 1
  const updated = await api.updateTransaction(t.id, { ...t, is_paid: newStatus })
  transactions.value = transactions.value.map(item => item.id === t.id ? updated : item)
}

async function remove(id) {
  if (!confirm('Excluir esta transação?')) return
  await api.deleteTransaction(id)
  transactions.value = transactions.value.filter(t => t.id !== id)
}

function handleExportExcel() {
  const data = filtered.value.map(t => ({
    'Data': t.date,
    'Descrição': t.name,
    'Categoria': t.category || 'Sem Categoria',
    'Conta': t.account || 'Conta Corrente',
    'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
    'Valor (R$)': Number(t.amount)
  }))
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  exportToExcel(data, `aurea_finance_extrato_${timestamp}`)
}
</script>
