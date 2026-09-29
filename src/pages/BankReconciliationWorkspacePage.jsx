import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  Building2,
  ChevronDown,
  CircleCheckBig,
  Landmark,
  Search,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import sicrediLogo from '@/assets/banks/sicredi.png'
import caixaLogo from '@/assets/banks/caixa.png'
import nubankLogo from '@/assets/banks/nubank.png'
import bbLogo from '@/assets/banks/bb.png'
import interLogo from '@/assets/banks/inter.png'
import bradescoLogo from '@/assets/banks/bradesco.png'
import itauLogo from '@/assets/banks/itau.png'
import santanderLogo from '@/assets/banks/santander.png'
import picpayLogo from '@/assets/banks/picpay.png'
import sicoobLogo from '@/assets/banks/sicoob.png'
import othersLogo from '@/assets/banks/others.png'

const bankLogos = {
  sicredi: sicrediLogo,
  caixa: caixaLogo,
  nubank: nubankLogo,
  bb: bbLogo,
  inter: interLogo,
  bradesco: bradescoLogo,
  itau: itauLogo,
  santander: santanderLogo,
  picpay: picpayLogo,
  sicoob: sicoobLogo,
  cash: othersLogo,
  others: othersLogo,
}

const defaultSystemEntries = [
  { id: 1, date: '15/09', title: 'Vendas · Mercantil Norte', detail: 'NF 4821 · Recebimento', value: 1250.0 },
  { id: 2, date: '15/09', title: 'Vendas · Mercantil Norte', detail: 'NF 4822 · Recebimento', value: 750.0 },
  { id: 3, date: '16/09', title: 'Serviços · Via Leste', detail: 'NF 4830 · Parcela única', value: 3000.0 },
  { id: 4, date: '16/09', title: 'Aluguel · Galpão', detail: 'Contrato 032 · Despesa', value: -850.0 },
  { id: 5, date: '16/09', title: 'Vendas · Lote cartão 094', detail: 'Cielo · Valor bruto', value: 1500.0 },
  { id: 6, date: '17/09', title: 'Taxa bancária', detail: 'Tarifa manutenção', value: -32.5 },
]

const defaultBankEntries = [
  { id: 1, date: '15/09', title: 'PIX recebido · Mercantil Norte', detail: 'PIX · E2E 9a81', value: 2000.0, suggestion: true },
  { id: 2, date: '16/09', title: 'TED recebida · Via Leste', detail: 'TED · Documento 03741', value: 1800.0, suggestion: true },
  { id: 3, date: '16/09', title: 'PIX recebido · Via Leste', detail: 'PIX · E2E 3b24', value: 1200.0, suggestion: true },
  { id: 4, date: '16/09', title: 'Pagamento · Aluguel do galpão', detail: 'Transferência · 08219', value: -850.0, suggestion: true },
  { id: 5, date: '16/09', title: 'Cielo · Liquidação de cartão', detail: 'Cartão · Líquido de taxas', value: 1480.0 },
  { id: 6, date: '17/09', title: 'Tarifa pacote Itaú', detail: 'Débito automático', value: -32.5, suggestion: true },
  { id: 7, date: '17/09', title: 'Depósito identificado', detail: 'Cliente eventual', value: 430.0 },
]

const suggestionGroups = [
  {
    id: 1,
    badge: '2 → 1',
    title: 'Mercantil Norte',
    detail: 'Recebimento consolidado',
    systemIds: [1, 2],
    bankIds: [1],
    system: [
      { id: 1, date: '15/09', title: 'Vendas · Mercantil Norte', detail: 'NF 4821 · Recebimento', value: 1250.0 },
      { id: 2, date: '16/09', title: 'Vendas · Mercantil Norte', detail: 'NF 4822 · Recebimento', value: 750.0 },
    ],
    bank: [
      { id: 1, date: '17/09', title: 'PIX recebido · Mercantil Norte', detail: 'PIX · E2E 9a81', value: 2000.0 },
    ],
  },
  {
    id: 2,
    badge: '1 ↔ 2',
    title: 'Via Leste',
    detail: 'Parcelas recebidas',
    systemIds: [3],
    bankIds: [2, 3],
    system: [
      { id: 3, date: '15/09', title: 'Serviços · Via Leste', detail: 'NF 4830 · Parcela única', value: 3000.0 },
    ],
    bank: [
      { id: 2, date: '16/09', title: 'TED recebida · Via Leste', detail: 'TED · Documento 03741', value: 1800.0 },
      { id: 3, date: '17/09', title: 'PIX recebido · Via Leste', detail: 'PIX · E2E 3b24', value: 1200.0 },
    ],
  },
  {
    id: 3,
    badge: '1 ↔ 1',
    title: 'Aluguel · Galpão',
    detail: 'Pagamento equivalente',
    systemIds: [4],
    bankIds: [4],
    system: [
      { id: 4, date: '16/09', title: 'Aluguel · Galpão', detail: 'Contrato 032 · Despesa', value: -850.0 },
    ],
    bank: [
      { id: 4, date: '16/09', title: 'Pagamento · Aluguel do galpão', detail: 'Transferência · 08219', value: -850.0 },
    ],
  },
]

const initialMatchedRecords = [
  {
    id: 1,
    title: 'Cliente Serra Azul',
    detail: 'Recebimento conciliado anteriormente',
    statusLabel: 'Conciliado',
    badge: '1 ↔ 1',
    system: [
      { id: 'm1-s1', date: '14/09', title: 'Venda · Cliente Serra Azul', detail: 'NF 4798 · Recebimento', value: 980.0 },
    ],
    bank: [
      { id: 'm1-b1', date: '14/09', title: 'PIX recebido · Serra Azul', detail: 'PIX · E2E 7d14', value: 980.0 },
    ],
  },
  {
    id: 2,
    title: 'Fornecedor Horizonte',
    detail: 'Pagamento conciliado anteriormente',
    statusLabel: 'Conciliado',
    badge: '1 ↔ 1',
    system: [
      { id: 'm2-s1', date: '14/09', title: 'Fornecedor · Horizonte', detail: 'Título 8812 · Despesa', value: -420.0 },
    ],
    bank: [
      { id: 'm2-b1', date: '14/09', title: 'Pagamento · Horizonte', detail: 'TED · Documento 02018', value: -420.0 },
    ],
  },
]

const approvals = [
  { id: 1, title: 'Tarifa bancária', detail: 'Conciliação automática identificada pela regra de tarifa', owner: 'Motor automático', status: 'Aguardando revisão' },
  { id: 2, title: 'Liquidação Cielo', detail: 'Possível correspondência com lote cartão 094', owner: 'Financeiro', status: 'Pendente de aprovação' },
]

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const formatDate = (value) => new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`))
const getSign = (value) => (value >= 0 ? 'positive' : 'negative')

function BankIcon({ bankKey, bank, className = '' }) {
  const logo = bankLogos[bankKey]
  if (logo) {
    return (
      <div className={cn('grid shrink-0 place-items-center overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm dark:border-white/[0.08] dark:bg-white', className || 'h-10 w-10')}>
        <img src={logo} alt={bank} className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }
  return (
    <div className={cn('grid shrink-0 place-items-center rounded-xl border border-border/70 bg-slate-100 text-slate-600 shadow-sm dark:border-white/[0.08] dark:bg-slate-800 dark:text-slate-300', className || 'h-10 w-10')}>
      <Landmark className="h-4 w-4" />
    </div>
  )
}

function TabButton({ active, onClick, children, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 border-b-2 px-1 py-3 text-[13px] font-semibold transition-colors',
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
      )}
    >
      <span>{children}</span>
      {typeof badge !== 'undefined' && (
        <span className={cn('rounded-md px-1.5 py-0.5 text-[10px]', active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
          {badge}
        </span>
      )}
    </button>
  )
}

function TransactionScopeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)

  const options = {
    all: { label: 'Entradas e saídas', icon: ArrowRightLeft, color: 'text-primary', bg: 'bg-primary/10' },
    income: { label: 'Somente entradas', icon: ArrowDownLeft, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    expense: { label: 'Somente despesas', icon: ArrowUpRight, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  }

  const current = options[value]
  const CurrentIcon = current.icon

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 min-w-[190px] items-center justify-between gap-3 rounded-xl border bg-background px-3 text-[13px] outline-none transition-shadow hover:bg-muted/30 focus:ring-2 focus:ring-primary/15"
      >
        <span className="flex items-center gap-2.5">
          <span className={cn('grid h-7 w-7 place-items-center rounded-lg', current.bg)}>
            <CurrentIcon className={cn('h-4 w-4', current.color)} />
          </span>
          <span className="font-medium text-foreground">{current.label}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-label="Fechar" />
          <div className="absolute right-0 z-20 mt-2 w-[240px] overflow-hidden rounded-2xl border bg-card p-1.5 shadow-lg">
            {Object.entries(options).map(([key, option]) => {
              const Icon = option.icon
              const active = key === value
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key)
                    setOpen(false)
                  }}
                  className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', active ? 'bg-primary/8' : 'hover:bg-muted/50')}
                >
                  <span className={cn('grid h-8 w-8 place-items-center rounded-lg', option.bg)}>
                    <Icon className={cn('h-4 w-4', option.color)} />
                  </span>
                  <span className="text-[13px] font-medium text-foreground">{option.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function SelectionFooter({
  visible,
  systemCount,
  bankCount,
  systemTotal,
  bankTotal,
  onClear,
  onMatch,
  onCreateLaunch,
  onResolveDifference,
}) {
  if (!visible) {
    return (
      <div className="border-t px-4 py-3 text-[12px] text-muted-foreground sm:px-5">
        Selecione os lançamentos correspondentes nos dois lados para avançar com a conciliação.
      </div>
    )
  }

  const erpAmount = Math.abs(systemTotal)
  const bankAmount = Math.abs(bankTotal)
  const differenceAmount = Math.abs(bankAmount - erpAmount)
  const isBankOnly = bankCount > 0 && systemCount === 0
  const isEqual = !isBankOnly && differenceAmount < 0.005
  const erpGreater = !isBankOnly && erpAmount > bankAmount

  const formula = isBankOnly
    ? 'Banco → criar lançamento no ERP'
    : isEqual
      ? 'Banco = ERP'
      : erpGreater
        ? 'Banco + diferença = ERP'
        : 'Banco - ERP = diferença'

  const valueColor = (value) => {
    if (Math.abs(value) < 0.005) return 'text-slate-500 dark:text-slate-400'
    return value > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
  }

  return (
    <div className="border-t bg-background px-4 py-2.5 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
              <span>Banco</span>
              <span className="rounded-md bg-muted px-1 py-0.5 text-[8px] font-semibold normal-case">{bankCount}</span>
            </div>
            <div className={cn('mt-0.5 text-[16px] font-semibold tracking-[-0.02em]', valueColor(bankTotal))}>
              {bankTotal < 0 ? '-' : ''}{money(Math.abs(bankTotal))}
            </div>
          </div>

          <div className="hidden h-7 w-px bg-border md:block" />

          <div className="flex items-center justify-center text-muted-foreground">
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </div>

          <div className="hidden h-7 w-px bg-border md:block" />

          <div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
              <span>ERP</span>
              <span className="rounded-md bg-muted px-1 py-0.5 text-[8px] font-semibold normal-case">{systemCount}</span>
            </div>
            <div className={cn('mt-0.5 text-[16px] font-semibold tracking-[-0.02em]', valueColor(systemTotal))}>
              {systemTotal < 0 ? '-' : ''}{money(Math.abs(systemTotal))}
            </div>
          </div>

          <div className="hidden h-7 w-px bg-border md:block" />

          <div>
            <div className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Diferença</div>
            <div className={cn('mt-0.5 text-[16px] font-semibold tracking-[-0.02em]', differenceAmount < 0.005 ? 'text-slate-500 dark:text-slate-400' : 'text-amber-600 dark:text-amber-400')}>
              {money(differenceAmount)}
            </div>
          </div>

          <div className="hidden h-7 w-px bg-border md:block" />

          <div className="rounded-lg bg-muted/55 px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground">
            {formula}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
          >
            Limpar seleção
          </button>
          <Button
            className="h-9 rounded-xl px-4 text-[12px] shadow-sm shadow-primary/20"
            onClick={isBankOnly ? onCreateLaunch : isEqual ? onMatch : onResolveDifference}
          >
            {isBankOnly ? 'Criar lançamento' : isEqual ? 'Conciliar seleção' : 'Resolver diferença'}
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function DifferenceResolutionModal({ open, bankTotal, systemTotal, onClose, onApply }) {
  const [selectedOption, setSelectedOption] = useState('partial')

  if (!open) return null

  const bankAmount = Math.abs(bankTotal)
  const erpAmount = Math.abs(systemTotal)
  const erpGreater = erpAmount > bankAmount
  const difference = Math.abs(erpAmount - bankAmount)

  const options = erpGreater
    ? [
        {
          key: 'partial',
          title: 'Conciliação parcial',
          description: `Concilia ${money(bankAmount)} e mantém ${money(difference)} em aberto no lançamento do ERP.`,
        },
        {
          key: 'adjustment',
          title: 'Gerar lançamento de despesa',
          description: `Cria uma despesa de ajuste de ${money(difference)} no sistema para compensar a diferença.`,
        },
        {
          key: 'discount',
          title: 'Gerar desconto no lançamento original',
          description: `Aplica desconto de ${money(difference)} no lançamento original do ERP.`,
        },
        {
          key: 'change-original',
          title: 'Alterar o valor do lançamento original',
          description: `Altera o valor do lançamento do ERP para ${money(bankAmount)}.`,
        },
      ]
    : [
        {
          key: 'partial',
          title: 'Conciliação parcial',
          description: `Concilia o valor existente e gera no ERP um lançamento do restante de ${money(difference)}.`,
        },
        {
          key: 'adjustment',
          title: 'Gerar lançamento de receita',
          description: `Cria uma receita de ajuste de ${money(difference)} no sistema para completar o valor do banco.`,
        },
        {
          key: 'addition',
          title: 'Gerar acréscimo no lançamento original',
          description: `Aplica acréscimo de ${money(difference)} no lançamento original do ERP.`,
        },
        {
          key: 'change-original',
          title: 'Alterar o valor do lançamento original',
          description: `Altera o valor do lançamento do ERP para ${money(bankAmount)}.`,
        },
      ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} aria-label="Fechar" />
      <div className="relative z-10 w-full max-w-[700px] overflow-hidden rounded-[26px] border bg-card shadow-[0_28px_80px_-24px_rgba(15,23,42,0.45)]">
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            Diferença de {money(difference)}
          </div>
          <h2 className="mt-3 text-[21px] font-bold tracking-[-0.03em] text-foreground">
            {erpGreater ? 'Valor do ERP maior que o extrato' : 'Valor do ERP menor que o extrato'}
          </h2>
          <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">
            Selecione como o GerenteMax deve tratar essa diferença antes de concluir a conciliação.
          </p>
        </div>

        <div className="grid gap-2.5 p-5 sm:p-6">
          {options.map((option, index) => {
            const active = selectedOption === option.key
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedOption(option.key)}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                  active ? 'border-primary/30 bg-primary/[0.05] ring-2 ring-primary/10' : 'bg-background/45 hover:border-primary/15 hover:bg-muted/25',
                )}
              >
                <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[11px] font-bold', active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[13px] font-semibold text-foreground">{option.title}</strong>
                  <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{option.description}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t bg-muted/15 px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>Cancelar</Button>
          <Button type="button" className="rounded-xl shadow-sm shadow-primary/20" onClick={() => onApply(selectedOption)}>
            Aplicar regra e conciliar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function getMatchedStatusStyles(statusLabel) {
  const normalized = (statusLabel || 'Conciliado').toLowerCase()

  if (normalized.includes('parcial')) {
    return 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400'
  }

  if (normalized.includes('acréscimo')) {
    return 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400'
  }

  if (normalized.includes('alteração')) {
    return 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400'
  }

  return 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400'
}

function ReconciliationCard({ item, mode = 'suggestion', onIgnore, onReconcile }) {
  const systemTotal = item.system.reduce((acc, entry) => acc + entry.value, 0)
  const bankTotal = item.bank.reduce((acc, entry) => acc + entry.value, 0)
  const totalValue = systemTotal

  const renderEntry = (entry, side) => (
    <div key={`${side}-${entry.id}`} className="grid grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-0 border-b last:border-b-0 py-3">
      <div className="border-r px-3 text-[12px] font-medium text-muted-foreground">{entry.date}</div>
      <div className="min-w-0 px-4">
        <div className="truncate text-[13px] font-semibold text-foreground">{entry.title}</div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{entry.detail}</div>
      </div>
      <div className={cn('whitespace-nowrap px-4 text-[13px] font-bold', entry.value >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
        {entry.value < 0 ? '-' : ''}{money(Math.abs(entry.value))}
      </div>
    </div>
  )

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', mode === 'matched' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-primary/10 text-primary')}>
            {mode === 'matched' ? <CircleCheckBig className="h-5 w-5" /> : <ArrowRightLeft className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-[14px] font-bold tracking-[-0.02em] text-foreground">{item.title}</strong>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{item.detail}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end lg:self-auto">
          <div className="hidden h-12 w-px bg-border lg:block" />
          <div className="min-w-[170px]">
            <div className="text-[11px] font-medium text-muted-foreground">Total lançamentos</div>
            <div className={cn('mt-1 text-[17px] font-bold tracking-[-0.03em]', totalValue > 0 ? 'text-emerald-700 dark:text-emerald-400' : totalValue < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400')}>
              {totalValue < 0 ? '-' : ''}{money(Math.abs(totalValue))}
            </div>
          </div>

          {mode === 'suggestion' ? (
            <>
              <Button type="button" variant="outline" className="h-10 rounded-xl px-5 text-[12px]" onClick={() => onIgnore?.(item.id)}>
                Ignorar
              </Button>
              <Button type="button" className="h-10 rounded-xl px-5 text-[12px] shadow-sm shadow-primary/20" onClick={() => onReconcile?.(item)}>
                Conciliar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className={cn('inline-flex h-9 items-center rounded-full px-3 text-[11px] font-semibold ring-1 ring-inset', getMatchedStatusStyles(item.statusLabel))}>
              {item.statusLabel || 'Conciliado'}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-0 border-t lg:grid-cols-[1fr_54px_1fr]">
        <div className="p-4">
          <section className="overflow-hidden rounded-2xl border bg-background/45">
            <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-3">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-[14px] font-semibold text-foreground">Sistema</span>
              <span className="rounded-lg bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {item.system.length} lançamento{item.system.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="px-1">{item.system.map((entry) => renderEntry(entry, 'system'))}</div>
          </section>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
          <div className="absolute left-1/2 top-1/2 z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-card text-[15px] font-bold text-primary shadow-sm">
            =
          </div>
        </div>

        <div className="border-t p-4 lg:border-t-0">
          <section className="overflow-hidden rounded-2xl border bg-background/45">
            <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-3">
              <Landmark className="h-4 w-4 text-primary" />
              <span className="text-[14px] font-semibold text-foreground">Extrato bancário</span>
              <span className="rounded-lg bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {item.bank.length} lançamento{item.bank.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="px-1">{item.bank.map((entry) => renderEntry(entry, 'bank'))}</div>
          </section>
        </div>
      </div>
    </article>
  )
}

function LedgerTable({ title, icon: Icon, entries, available, selectedIds, onToggle, forcedSign }) {
  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-foreground">{title}</h3>
          </div>
        </div>
        <span className="grid h-6 min-w-6 place-items-center rounded-md bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">{entries.length}</span>
      </div>

      <div className="max-h-[392px] overflow-auto">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 bg-card text-[11px] text-muted-foreground">
            <tr className="border-b">
              <th className="w-10 px-3 py-3" />
              <th className="px-3 py-3">Data</th>
              <th className="px-3 py-3">Descrição</th>
              <th className="px-3 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item) => {
              const selected = selectedIds.includes(item.id)
              const sign = getSign(item.value)
              const blocked = forcedSign && forcedSign !== sign && !selected
              const hoverClass = sign === 'positive'
                ? 'hover:bg-emerald-50/25 dark:hover:bg-emerald-950/10'
                : 'hover:bg-rose-50/25 dark:hover:bg-rose-950/10'
              const selectedClass = sign === 'positive'
                ? 'bg-emerald-50/45 dark:bg-emerald-950/12'
                : 'bg-rose-50/45 dark:bg-rose-950/12'
              const blockedClass = 'cursor-not-allowed bg-slate-50 opacity-45 dark:bg-slate-900/50'
              const checkboxColor = sign === 'positive' ? 'accent-emerald-600' : 'accent-rose-600'

              return (
                <tr
                  key={item.id}
                  onClick={() => !blocked && onToggle(item.id)}
                  className={cn(
                    'border-b last:border-0 transition-colors',
                    blocked ? blockedClass : 'cursor-pointer',
                    !blocked && hoverClass,
                    selected && selectedClass,
                  )}
                >
                  <td className="px-3 py-3 align-top">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={blocked}
                      onChange={() => onToggle(item.id)}
                      onClick={(event) => event.stopPropagation()}
                      className={cn('mt-1 h-4 w-4 rounded border-input focus:ring-0', checkboxColor)}
                    />
                  </td>
                  <td className="px-3 py-3 align-top text-[12px] text-muted-foreground">{item.date}</td>
                  <td className="px-3 py-3 align-top">
                    <div className="text-[13px] font-semibold text-foreground">{item.title}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{item.detail}</div>
                  </td>
                  <td className={cn('px-3 py-3 align-top text-right text-[13px] font-semibold', sign === 'positive' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                    {item.value < 0 ? '-' : ''}{money(Math.abs(item.value))}
                    {item.suggestion && <div className="mt-1 text-[10px] text-primary">✧ Sugestão</div>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t px-4 py-3 text-[11px] text-muted-foreground">
        <span>{entries.length} movimento(s)</span>
        <span>Disponível <strong className="font-semibold text-foreground">{money(available)}</strong></span>
      </div>
    </section>
  )
}

export default function BankReconciliationWorkspacePage({ data, onFinish }) {
  const [activeTab, setActiveTab] = useState('to-match')
  const [search, setSearch] = useState('')
  const [movementFilter, setMovementFilter] = useState('all')
  const [selectedSystemIds, setSelectedSystemIds] = useState([])
  const [selectedBankIds, setSelectedBankIds] = useState([])
  const [systemPool, setSystemPool] = useState(defaultSystemEntries)
  const [bankPool, setBankPool] = useState(defaultBankEntries)
  const [matchedRecords, setMatchedRecords] = useState(initialMatchedRecords)
  const [suggestionPool, setSuggestionPool] = useState(suggestionGroups)
  const [differenceModalOpen, setDifferenceModalOpen] = useState(false)

  const title = data?.title || 'Santander'
  const description = data?.subtitle || 'Conciliação de setembro'
  const accountCode = data?.accountCode || '03491-2'
  const bankKey = data?.bankKey || 'santander'
  const periodStart = data?.periodStart || '2026-09-01'
  const periodEnd = data?.periodEnd || '2026-09-17'
  const currentMoves = data?.currentMoves ?? 0
  const totalMoves = data?.totalMoves ?? 7

  const normalized = search.trim().toLocaleLowerCase('pt-BR')
  const filterEntries = (entries) => entries.filter((item) => {
    const matchesText = !normalized || `${item.title} ${item.detail} ${item.value}`.toLocaleLowerCase('pt-BR').includes(normalized)
    const matchesType = movementFilter === 'all' || (movementFilter === 'income' && item.value >= 0) || (movementFilter === 'expense' && item.value < 0)
    return matchesText && matchesType
  })

  const systemEntries = useMemo(() => filterEntries(systemPool), [normalized, movementFilter, systemPool])
  const bankEntries = useMemo(() => filterEntries(bankPool), [normalized, movementFilter, bankPool])
  const suggestions = useMemo(() => suggestionPool.filter((item) => !normalized || `${item.title} ${item.detail}`.toLocaleLowerCase('pt-BR').includes(normalized)), [normalized, suggestionPool])
  const matchedCount = Math.min(currentMoves, totalMoves)

  const systemSelectedItems = systemPool.filter((item) => selectedSystemIds.includes(item.id))
  const bankSelectedItems = bankPool.filter((item) => selectedBankIds.includes(item.id))
  const systemSelectedSign = systemSelectedItems[0] ? getSign(systemSelectedItems[0].value) : null
  const bankSelectedSign = bankSelectedItems[0] ? getSign(bankSelectedItems[0].value) : null
  const forcedSystemSign = systemSelectedSign || bankSelectedSign
  const forcedBankSign = bankSelectedSign || systemSelectedSign

  const systemSelectionTotal = systemSelectedItems.reduce((acc, item) => acc + item.value, 0)
  const bankSelectionTotal = bankSelectedItems.reduce((acc, item) => acc + item.value, 0)
  const hasSelectionOnBothSides = systemSelectedItems.length > 0 && bankSelectedItems.length > 0
  const hasBankOnlySelection = bankSelectedItems.length > 0 && systemSelectedItems.length === 0

  const toggleSelection = (items, selectedIds, setSelectedIds, id, forcedSign) => {
    const item = items.find((entry) => entry.id === id)
    if (!item) return
    const sign = getSign(item.value)
    if (!selectedIds.includes(id) && forcedSign && forcedSign !== sign) return
    setSelectedIds((current) => (current.includes(id) ? current.filter((entryId) => entryId !== id) : [...current, id]))
  }

  const clearSelection = () => {
    setSelectedSystemIds([])
    setSelectedBankIds([])
  }

  const handleMatchSelection = () => {
    if (!hasSelectionOnBothSides || Math.abs(Math.abs(systemSelectionTotal) - Math.abs(bankSelectionTotal)) >= 0.005) return

    const selectedSystem = systemPool.filter((item) => selectedSystemIds.includes(item.id))
    const selectedBank = bankPool.filter((item) => selectedBankIds.includes(item.id))

    const newRecord = {
      id: matchedRecords.length + 1,
      title: selectedSystem.length === 1 ? selectedSystem[0].title : 'Conciliação manual',
      detail: 'Conciliação normal · valores equivalentes',
      badge: `${selectedSystem.length} ↔ ${selectedBank.length}`,
      statusLabel: 'Conciliado',
      system: selectedSystem.map((item) => ({ ...item, id: `manual-system-${matchedRecords.length + 1}-${item.id}` })),
      bank: selectedBank.map((item) => ({ ...item, id: `manual-bank-${matchedRecords.length + 1}-${item.id}` })),
    }

    setMatchedRecords((current) => [...current, newRecord])
    setSystemPool((current) => current.filter((item) => !selectedSystemIds.includes(item.id)))
    setBankPool((current) => current.filter((item) => !selectedBankIds.includes(item.id)))
    clearSelection()
  }

  const handleCreateLaunch = () => {
    if (!hasBankOnlySelection) return

    const selectedBank = bankPool.filter((item) => selectedBankIds.includes(item.id))

    const createdRecords = selectedBank.map((item, index) => ({
      id: matchedRecords.length + index + 1,
      title: item.title,
      detail: 'Lançamento criado a partir do extrato',
      statusLabel: 'Conciliado com acréscimo',
      badge: '1 ↔ 1',
      system: [{ ...item, id: `created-system-${item.id}` }],
      bank: [{ ...item, id: `created-bank-${item.id}` }],
    }))

    setMatchedRecords((current) => [...current, ...createdRecords])
    setBankPool((current) => current.filter((item) => !selectedBankIds.includes(item.id)))
    clearSelection()
  }

  const handleResolveDifference = (strategy) => {
    if (!hasSelectionOnBothSides) return

    const selectedSystem = systemPool.filter((item) => selectedSystemIds.includes(item.id))
    const selectedBank = bankPool.filter((item) => selectedBankIds.includes(item.id))
    if (selectedSystem.length === 0 || selectedBank.length === 0) return

    const erpAmount = Math.abs(systemSelectionTotal)
    const bankAmount = Math.abs(bankSelectionTotal)
    const differenceAmount = Math.abs(erpAmount - bankAmount)
    if (differenceAmount < 0.005) {
      setDifferenceModalOpen(false)
      handleMatchSelection()
      return
    }

    const erpGreater = erpAmount > bankAmount
    const adjustmentValue = bankSelectionTotal - systemSelectionTotal
    const nextId = matchedRecords.length + 1
    let matchedSystem = selectedSystem.map((item) => ({ ...item, id: `rule-system-${nextId}-${item.id}` }))
    let detail = ''
    let statusLabel = 'Conciliado'
    let residualEntry = null

    const adjustOriginalToBank = (label) => {
      const cloned = selectedSystem.map((item) => ({ ...item, id: `rule-system-${nextId}-${item.id}` }))
      const targetIndex = cloned.length - 1
      cloned[targetIndex] = {
        ...cloned[targetIndex],
        value: cloned[targetIndex].value + adjustmentValue,
        detail: `${cloned[targetIndex].detail} · ${label}`,
      }
      return cloned
    }

    if (erpGreater) {
      if (strategy === 'partial') {
        const base = selectedSystem[0]
        const sign = systemSelectionTotal < 0 ? -1 : 1
        matchedSystem = [{
          ...base,
          id: `partial-system-${nextId}`,
          title: `${base.title} · Parcela conciliada`,
          detail: `Conciliação parcial de ${money(bankAmount)}`,
          value: sign * bankAmount,
        }]
        residualEntry = {
          ...base,
          id: `residual-system-${Date.now()}`,
          title: `Saldo remanescente · ${base.title}`,
          detail: 'Restante mantido em aberto após conciliação parcial',
          value: sign * differenceAmount,
          suggestion: false,
        }
        detail = `Conciliação parcial · ${money(differenceAmount)} permanece em aberto no ERP`
        statusLabel = 'Conciliado parcial'
      } else if (strategy === 'adjustment') {
        matchedSystem = [
          ...matchedSystem,
          {
            id: `expense-adjustment-${nextId}`,
            date: selectedBank[0]?.date || selectedSystem[0]?.date,
            title: 'Despesa de ajuste da conciliação',
            detail: `Diferença gerada automaticamente · ${money(differenceAmount)}`,
            value: adjustmentValue,
          },
        ]
        detail = `Despesa de ajuste gerada no sistema · ${money(differenceAmount)}`
        statusLabel = 'Conciliado'
      } else if (strategy === 'discount') {
        matchedSystem = adjustOriginalToBank(`Desconto de ${money(differenceAmount)}`)
        detail = `Desconto aplicado ao lançamento original · ${money(differenceAmount)}`
        statusLabel = 'Conciliado'
      } else if (strategy === 'change-original') {
        matchedSystem = adjustOriginalToBank(`Valor alterado para conciliar com o banco`)
        detail = `Valor do lançamento original alterado para ${money(bankAmount)}`
        statusLabel = 'Conciliado com alteração valor original'
      }
    } else {
      if (strategy === 'partial') {
        matchedSystem = [
          ...matchedSystem,
          {
            id: `remainder-system-${nextId}`,
            date: selectedBank[0]?.date || selectedSystem[0]?.date,
            title: 'Lançamento complementar · restante',
            detail: 'Gerado pelo processo de conciliação parcial',
            value: adjustmentValue,
          },
        ]
        detail = `Conciliação parcial · lançamento complementar de ${money(differenceAmount)} gerado no ERP`
        statusLabel = 'Conciliado com acréscimo'
      } else if (strategy === 'adjustment') {
        matchedSystem = [
          ...matchedSystem,
          {
            id: `income-adjustment-${nextId}`,
            date: selectedBank[0]?.date || selectedSystem[0]?.date,
            title: 'Receita de ajuste da conciliação',
            detail: `Diferença gerada automaticamente · ${money(differenceAmount)}`,
            value: adjustmentValue,
          },
        ]
        detail = `Receita de ajuste gerada no sistema · ${money(differenceAmount)}`
        statusLabel = 'Conciliado com acréscimo'
      } else if (strategy === 'addition') {
        matchedSystem = adjustOriginalToBank(`Acréscimo de ${money(differenceAmount)}`)
        detail = `Acréscimo aplicado ao lançamento original · ${money(differenceAmount)}`
        statusLabel = 'Conciliado com acréscimo'
      } else if (strategy === 'change-original') {
        matchedSystem = adjustOriginalToBank(`Valor alterado para conciliar com o banco`)
        detail = `Valor do lançamento original alterado para ${money(bankAmount)}`
        statusLabel = 'Conciliado com alteração valor original'
      }
    }

    const newRecord = {
      id: nextId,
      title: selectedSystem.length === 1 ? selectedSystem[0].title : 'Conciliação com ajuste',
      detail,
      badge: `${matchedSystem.length} ↔ ${selectedBank.length}`,
      statusLabel,
      system: matchedSystem,
      bank: selectedBank.map((item) => ({ ...item, id: `rule-bank-${nextId}-${item.id}` })),
    }

    setMatchedRecords((current) => [...current, newRecord])
    setSystemPool((current) => {
      const remaining = current.filter((item) => !selectedSystemIds.includes(item.id))
      return residualEntry ? [...remaining, residualEntry] : remaining
    })
    setBankPool((current) => current.filter((item) => !selectedBankIds.includes(item.id)))
    clearSelection()
    setDifferenceModalOpen(false)
  }

  const handleIgnoreSuggestion = (suggestionId) => {
    setSuggestionPool((current) => current.filter((item) => item.id !== suggestionId))
  }

  const handleReconcileSuggestion = (suggestion) => {
    const record = {
      id: matchedRecords.length + 1,
      title: suggestion.title,
      detail: suggestion.detail,
      badge: suggestion.badge,
      statusLabel: 'Conciliado',
      system: suggestion.system.map((entry) => ({ ...entry, id: `matched-system-${suggestion.id}-${entry.id}` })),
      bank: suggestion.bank.map((entry) => ({ ...entry, id: `matched-bank-${suggestion.id}-${entry.id}` })),
    }

    setMatchedRecords((current) => [...current, record])
    setSystemPool((current) => current.filter((item) => !suggestion.systemIds.includes(item.id)))
    setBankPool((current) => current.filter((item) => !suggestion.bankIds.includes(item.id)))
    setSuggestionPool((current) => current.filter((item) => item.id !== suggestion.id))
  }

  return (
    <div className="mx-auto w-full max-w-[1700px] space-y-4">
      <div className="space-y-2.5">
        <h1 className="text-[16px] font-bold tracking-[-0.02em] text-foreground">{description}</h1>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            <BankIcon bankKey={bankKey} bank={title} className="h-7 w-7 rounded-lg" />
            <span className="font-semibold text-foreground">{title}</span>
            <span>Conta {accountCode}</span>
            <span className="rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground">
              {formatDate(periodStart)} até {formatDate(periodEnd)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button className="h-10 rounded-xl shadow-sm shadow-primary/20" onClick={onFinish}>
              Concluir conferência <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b px-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-5">
            <TabButton active={activeTab === 'to-match'} onClick={() => setActiveTab('to-match')}>A conciliar</TabButton>
            <TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')} badge={suggestions.length}>Sugestões</TabButton>
            <TabButton active={activeTab === 'matched'} onClick={() => setActiveTab('matched')} badge={matchedRecords.length}>Conciliados</TabButton>
            <div className="ml-auto py-3 text-[12px] text-muted-foreground">{matchedCount} de {totalMoves} movimentos conferidos</div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar descrição, documento ou valor"
                className="h-10 rounded-xl bg-background pl-10"
              />
            </div>

            <div className="flex items-center gap-2 self-end lg:self-auto">
              <TransactionScopeSelect value={movementFilter} onChange={setMovementFilter} />
            </div>
          </div>

          {activeTab === 'to-match' && (
            <div className="grid gap-4 xl:grid-cols-2">
              <LedgerTable
                title="Lançamentos do sistema"
                icon={Building2}
                entries={systemEntries}
                available={6650}
                selectedIds={selectedSystemIds}
                forcedSign={forcedSystemSign}
                onToggle={(id) => toggleSelection(systemPool, selectedSystemIds, setSelectedSystemIds, id, forcedSystemSign)}
              />
              <LedgerTable
                title="Extrato bancário"
                icon={Landmark}
                entries={bankEntries}
                available={6151}
                selectedIds={selectedBankIds}
                forcedSign={forcedBankSign}
                onToggle={(id) => toggleSelection(bankPool, selectedBankIds, setSelectedBankIds, id, forcedBankSign)}
              />
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <ReconciliationCard
                    key={item.id}
                    item={item}
                    mode="suggestion"
                    onIgnore={handleIgnoreSuggestion}
                    onReconcile={handleReconcileSuggestion}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed px-5 py-10 text-center">
                  <Sparkles className="mx-auto h-5 w-5 text-muted-foreground" />
                  <p className="mt-3 text-[12px] font-semibold text-foreground">Nenhuma sugestão disponível</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Os lançamentos ignorados continuam disponíveis na aba A conciliar.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'matched' && (
            <div className="space-y-3">
              {matchedRecords.map((item) => (
                <ReconciliationCard key={item.id} item={item} mode="matched" />
              ))}
            </div>
          )}
        </div>

        {activeTab === 'to-match' && (
          <SelectionFooter
            visible={hasSelectionOnBothSides || hasBankOnlySelection}
            systemCount={systemSelectedItems.length}
            bankCount={bankSelectedItems.length}
            systemTotal={systemSelectionTotal}
            bankTotal={bankSelectionTotal}
            onClear={clearSelection}
            onMatch={handleMatchSelection}
            onCreateLaunch={handleCreateLaunch}
            onResolveDifference={() => setDifferenceModalOpen(true)}
          />
        )}
      </section>

      <DifferenceResolutionModal
        open={differenceModalOpen}
        bankTotal={bankSelectionTotal}
        systemTotal={systemSelectionTotal}
        onClose={() => setDifferenceModalOpen(false)}
        onApply={handleResolveDifference}
      />
    </div>
  )
}
