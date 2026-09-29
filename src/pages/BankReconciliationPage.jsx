import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Landmark,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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

const reconciliations = [
  {
    id: 1,
    title: 'Itaú Unibanco',
    subtitle: 'Conciliação de setembro · 28451-0',
    bankKey: 'itau',
    bank: 'Itaú',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-17',
    currentMoves: 0,
    totalMoves: 7,
    status: 'Pendente',
    accountCode: '28451-0',
    agency: '0482',
    assignee: 'Tesouraria',
  },
  {
    id: 2,
    title: 'Banco do Brasil',
    subtitle: 'Conciliação de agosto · 24840-5',
    bankKey: 'bb',
    bank: 'Banco do Brasil',
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    currentMoves: 12,
    totalMoves: 12,
    status: 'Finalizada',
    accountCode: '24840-5',
    agency: '0123',
    assignee: 'Controladoria',
  },
  {
    id: 3,
    title: 'Santander',
    subtitle: 'Conciliação de setembro · 03491-2',
    bankKey: 'santander',
    bank: 'Santander',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-17',
    currentMoves: 3,
    totalMoves: 7,
    status: 'Em andamento',
    accountCode: '03491-2',
    agency: '0074',
    assignee: 'Financeiro',
  },
  {
    id: 4,
    title: 'Bradesco Operacional',
    subtitle: 'Conciliação de setembro · 33012-8',
    bankKey: 'bradesco',
    bank: 'Bradesco',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-17',
    currentMoves: 8,
    totalMoves: 10,
    status: 'Em andamento',
    accountCode: '33012-8',
    agency: '3110',
    assignee: 'Gerente financeiro',
  },
  {
    id: 5,
    title: 'Caixa Empresa',
    subtitle: 'Conciliação de agosto · 77110-4',
    bankKey: 'caixa',
    bank: 'Caixa',
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    currentMoves: 9,
    totalMoves: 9,
    status: 'Finalizada',
    accountCode: '77110-4',
    agency: '1100',
    assignee: 'Financeiro',
  },
]

const pageSize = 10

const defaultFilters = {
  status: 'Todos',
  bank: 'Todos',
  progress: 'Todos',
}

const statusOptions = [
  { value: 'Em andamento', label: 'Em andamento' },
  { value: 'Finalizada', label: 'Finalizadas' },
  { value: 'Pendente', label: 'Pendentes' },
  { value: 'Todos', label: 'Todos' },
]

const progressOptions = [
  { value: 'Todos', label: 'Todos' },
  { value: '0%', label: '0%' },
  { value: 'Parcial', label: 'Parcial' },
  { value: '100%', label: '100%' },
]

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

const formatCode = (value) => String(value).padStart(3, '0')
const formatDate = (value) => new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`))
const formatPeriod = (start, end) => `${formatDate(start)} à ${formatDate(end)}`

function BankIcon({ bankKey, bank }) {
  const logo = bankLogos[bankKey]

  if (logo) {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm dark:border-white/[0.08] dark:bg-white">
        <img src={logo} alt={bank} className="h-full w-full object-cover" loading="lazy" />
      </div>
    )
  }

  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border/70 bg-slate-100 text-[11px] font-extrabold tracking-[-0.04em] text-slate-600 shadow-sm dark:border-white/[0.08] dark:bg-slate-800 dark:text-slate-300">
      $
    </div>
  )
}

function SelectionButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 rounded-xl border px-3 text-xs font-semibold transition-all',
        active
          ? 'border-primary/35 bg-primary/10 text-primary shadow-sm'
          : 'bg-card text-muted-foreground hover:border-primary/20 hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function SortableHeader({ label, sortKey, sort, onSort, className = '', align = 'left' }) {
  const active = sort.key === sortKey
  const SortIcon = active ? (sort.direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <th className={cn('px-3 py-3.5 font-semibold', className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          align === 'center' && 'justify-center',
          align === 'right' && 'ml-auto justify-end',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
        aria-label={`Ordenar por ${label}`}
        title={`Ordenar por ${label}`}
      >
        <span>{label}</span>
        <SortIcon className={cn('h-3.5 w-3.5', active && 'text-primary')} strokeWidth={2} />
      </button>
    </th>
  )
}

function StatusBadge({ status }) {
  const styles = {
    'Em andamento': 'bg-primary/10 text-primary ring-primary/20',
    Finalizada: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
    Pendente: 'bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-400',
  }

  return (
    <span className={cn('inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold ring-1 ring-inset', styles[status])}>
      {status}
    </span>
  )
}

function ProgressCell({ current, total, status }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  const progressTone = status === 'Pendente'
    ? 'bg-orange-500'
    : percent === 100
      ? 'bg-emerald-500'
      : percent === 0
        ? 'bg-slate-300 dark:bg-slate-700'
        : 'bg-primary'

  return (
    <div className="min-w-[220px] max-w-[240px]">
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <span className="text-muted-foreground">{`${current} de ${total} movimentos`}</span>
        <span className={cn('font-semibold', status === 'Pendente' ? 'text-orange-600 dark:text-orange-400' : 'text-foreground')}>{percent}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', progressTone)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function FiltersSheet({ open, onOpenChange, filters, onApply, onClear }) {
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [filters, open])

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-[92vw] flex-col bg-card p-0 sm:max-w-[430px]">
        <div className="border-b px-5 pb-5 pt-6 sm:px-6">
          <SheetHeader className="pr-9 text-left">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <SheetTitle className="text-xl tracking-[-0.025em]">Filtros</SheetTitle>
            <SheetDescription>
              Refine a listagem de conciliações bancárias por status, instituição e progresso.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-6">
            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Status</p>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <SelectionButton key={option.value} active={draft.status === option.value} onClick={() => update('status', option.value)}>
                    {option.label}
                  </SelectionButton>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Instituição</p>
              <SelectField
                label="Banco"
                value={draft.bank}
                options={['Todos', ...Array.from(new Set(reconciliations.map((item) => item.bank))).sort((a, b) => a.localeCompare(b, 'pt-BR'))]}
                onChange={(value) => update('bank', value)}
              />
            </section>

            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Progresso</p>
              <div className="grid grid-cols-2 gap-2">
                {progressOptions.map((option) => (
                  <SelectionButton key={option.value} active={draft.progress === option.value} onClick={() => update('progress', option.value)}>
                    {option.label}
                  </SelectionButton>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="border-t bg-background/55 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => {
                setDraft(defaultFilters)
                onClear()
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
            <Button
              type="button"
              className="h-11 rounded-xl shadow-sm shadow-primary/20"
              onClick={() => {
                onApply(draft)
                onOpenChange(false)
              }}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


function StartReconciliationModal({ open, onClose, onConfirm }) {
  const availableAccounts = reconciliations.filter((item) => !!item.bankKey)
  const [selectedId, setSelectedId] = useState(availableAccounts[0]?.id ?? null)
  const [periodStart, setPeriodStart] = useState('2026-09-01')
  const [periodEnd, setPeriodEnd] = useState('2026-09-17')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const loadingMessages = [
    'Comunicando com a instituição',
    'Buscando extrato atualizado',
    'Atualizando dados',
  ]

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) onClose?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, isLoading])

  useEffect(() => {
    if (open) {
      setSelectedId(availableAccounts[0]?.id ?? null)
      setPeriodStart('2026-09-01')
      setPeriodEnd('2026-09-17')
      setName('')
      setIsLoading(false)
      setLoadingStep(0)
    }
  }, [open])

  if (!open) return null

  const selected = availableAccounts.find((item) => item.id === selectedId)
  const progress = ((loadingStep + 1) / loadingMessages.length) * 100

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={() => !isLoading && onClose?.()} aria-label="Fechar modal" />
      <div className="relative z-10 w-full max-w-[760px] overflow-hidden rounded-[28px] border bg-card shadow-[0_28px_80px_-24px_rgba(15,23,42,0.45)]">
        <div className="px-5 pb-5 pt-6 sm:px-6">
          <h2 className="text-[34px] font-bold tracking-[-0.04em] text-foreground">Qual conta vamos conciliar?</h2>
          <p className="mt-2 text-[14px] text-muted-foreground">Selecione a conta e o período. Nós organizamos os dois lados para você.</p>
        </div>

        <div className="mx-5 mb-5 rounded-[24px] border bg-background/45 p-4 sm:mx-6 sm:p-6">
          <div className="space-y-6">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-full border bg-card text-[12px] font-semibold text-muted-foreground">1</div>
                <h3 className="text-[16px] font-semibold text-foreground">Conta bancária</h3>
              </div>

              <div className="max-h-[248px] space-y-2.5 overflow-y-auto pr-1">
                {availableAccounts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-all',
                      selectedId === item.id ? 'border-primary/30 ring-2 ring-primary/10' : 'hover:border-primary/15 hover:bg-muted/20',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <BankIcon bankKey={item.bankKey} bank={item.bank} />
                      <div>
                        <div className="text-[14px] font-semibold text-foreground">{item.title}</div>
                        <div className="mt-1 text-[12px] text-muted-foreground">Ag. {item.agency} · Conta {item.accountCode}</div>
                      </div>
                    </div>
                    <span className={cn('grid h-5 w-5 place-items-center rounded-full border', selectedId === item.id ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background')}>
                      {selectedId === item.id && <span className="h-2 w-2 rounded-full bg-current" />}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-full border bg-card text-[12px] font-semibold text-muted-foreground">2</div>
                <h3 className="text-[16px] font-semibold text-foreground">Período de conferência</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-[12px] font-medium text-foreground">Data inicial</span>
                  <div className="relative">
                    <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="h-11 w-full rounded-xl border bg-card px-3 pr-10 text-[13px] outline-none focus:ring-2 focus:ring-primary/15" />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </label>
                <label className="space-y-1.5">
                  <span className="text-[12px] font-medium text-foreground">Data final</span>
                  <div className="relative">
                    <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="h-11 w-full rounded-xl border bg-card px-3 pr-10 text-[13px] outline-none focus:ring-2 focus:ring-primary/15" />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </label>
              </div>

              <label className="mt-5 block space-y-1.5">
                <span className="text-[12px] font-medium text-foreground">Descrição</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Conciliação de setembro"
                  className="h-11 w-full rounded-xl border bg-card px-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15"
                />
              </label>
            </section>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button
              type="button"
              className="h-10 rounded-xl shadow-sm shadow-primary/20"
              disabled={isLoading}
              onClick={() => {
                if (!selected || isLoading) return
                const payload = {
                  ...selected,
                  periodStart,
                  periodEnd,
                  currentMoves: selected.currentMoves,
                  totalMoves: selected.totalMoves,
                  subtitle: name || selected.subtitle,
                }
                setIsLoading(true)
                setLoadingStep(0)
                window.setTimeout(() => setLoadingStep(0), 120)
                window.setTimeout(() => setLoadingStep(1), 1200)
                window.setTimeout(() => setLoadingStep(2), 2400)
                window.setTimeout(() => {
                  setIsLoading(false)
                  onConfirm(payload)
                }, 3600)
              }}
            >
              Carregar lançamentos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/88 backdrop-blur-[2px]">
            <div className="w-full max-w-[420px] rounded-3xl border bg-card p-6 text-center shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LoaderCircle className="h-7 w-7 animate-spin" />
              </div>
              <h3 className="mt-4 text-[20px] font-bold tracking-[-0.03em] text-foreground">Preparando conciliação</h3>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{loadingMessages[loadingStep]}</p>
              <div className="mt-5 overflow-hidden rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 text-[12px] font-semibold text-primary">{Math.round(progress)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default function BankReconciliationPage({ onStartReconciliation }) {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'id', direction: 'asc' })
  const [startModalOpen, setStartModalOpen] = useState(false)

  const filteredReconciliations = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return reconciliations.filter((item) => {
      const searchable = [item.title, item.subtitle, item.bank, item.accountCode, item.assignee].join(' ').toLocaleLowerCase('pt-BR')
      const progress = item.totalMoves > 0 ? Math.round((item.currentMoves / item.totalMoves) * 100) : 0

      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch)
      const matchesStatus = filters.status === 'Todos' || item.status === filters.status
      const matchesBank = filters.bank === 'Todos' || item.bank === filters.bank
      const matchesProgress = filters.progress === 'Todos'
        || (filters.progress === '0%' && progress === 0)
        || (filters.progress === 'Parcial' && progress > 0 && progress < 100)
        || (filters.progress === '100%' && progress === 100)

      return matchesSearch && matchesStatus && matchesBank && matchesProgress
    })
  }, [filters, search])

  const sortedReconciliations = useMemo(() => {
    const direction = sort.direction === 'asc' ? 1 : -1

    return [...filteredReconciliations].sort((a, b) => {
      if (sort.key === 'progress') {
        const first = a.totalMoves > 0 ? a.currentMoves / a.totalMoves : 0
        const second = b.totalMoves > 0 ? b.currentMoves / b.totalMoves : 0
        return (first - second) * direction
      }

      if (sort.key === 'period') {
        return (new Date(a.periodStart) - new Date(b.periodStart)) * direction
      }

      let first = a[sort.key]
      let second = b[sort.key]

      if (typeof first === 'string' && typeof second === 'string') {
        return first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }) * direction
      }

      return (Number(first) - Number(second)) * direction
    })
  }, [filteredReconciliations, sort])

  const totalPages = Math.max(1, Math.ceil(sortedReconciliations.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleReconciliations = sortedReconciliations.slice((safePage - 1) * pageSize, safePage * pageSize)
  const firstVisible = sortedReconciliations.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastVisible = Math.min(safePage * pageSize, sortedReconciliations.length)
  const showStatusColumn = filters.status === 'Todos'

  useEffect(() => {
    setPage(1)
  }, [filters, search, sort])

  const activeFilterCount = [
    filters.status !== defaultFilters.status,
    filters.bank !== defaultFilters.bank,
    filters.progress !== defaultFilters.progress,
  ].filter(Boolean).length

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="no-print mb-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>Financeiro</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">Conciliação Bancária</span>
        </div>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="no-print flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por conta, conciliação, banco ou responsável..."
                className="h-10 rounded-xl bg-background pl-10 pr-3 shadow-none focus-visible:ring-2 focus-visible:ring-primary/15"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFilterOpen(true)}
                className={cn(
                  'relative h-10 justify-center rounded-xl px-3 sm:min-w-[112px] sm:px-4',
                  activeFilterCount > 0 && 'border-primary/30 bg-primary/[0.06] text-primary hover:bg-primary/10 hover:text-primary',
                )}
              >
                <SlidersHorizontal className="mr-1.5 h-4 w-4 sm:mr-2" />
                <span>Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <Button type="button" variant="outline" onClick={() => window.print()} className="h-10 justify-center rounded-xl px-3 sm:min-w-[112px] sm:px-4">
                <Printer className="mr-1.5 h-4 w-4 sm:mr-2" />
                Impressão
              </Button>

              <Button type="button" className="h-10 justify-center rounded-xl px-3 shadow-sm shadow-primary/20 sm:min-w-[140px] sm:px-4" onClick={() => setStartModalOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="print-table hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1240px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-muted/45 text-[11px] font-semibold text-muted-foreground">
                  <SortableHeader label="#" sortKey="id" sort={sort} onSort={handleSort} className="w-[86px] px-5" />
                  <SortableHeader label="Conta e conciliação" sortKey="title" sort={sort} onSort={handleSort} className="min-w-[300px]" />
                  <SortableHeader label="Período" sortKey="period" sort={sort} onSort={handleSort} className="min-w-[180px]" />
                  <SortableHeader label="Progresso" sortKey="progress" sort={sort} onSort={handleSort} className="min-w-[260px]" />
                  {showStatusColumn && (
                    <SortableHeader label="Status" sortKey="status" sort={sort} onSort={handleSort} className="w-[160px]" />
                  )}
                  <th className="w-[82px] px-5 py-3.5 text-center text-[11px] font-semibold text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visibleReconciliations.map((item) => (
                  <tr key={item.id} className="group border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-xs font-normal tabular-nums text-muted-foreground">{formatCode(item.id)}</td>
                    <td className="px-3 py-3">
                      <button type="button" className="flex min-w-0 items-center gap-3 text-left" onClick={() => onStartReconciliation?.(item)}>
                        <BankIcon bankKey={item.bankKey} bank={item.bank} />
                        <div className="min-w-0">
                          <span className="block truncate text-[13px] font-normal text-foreground">{item.title}</span>
                          <span className="mt-0.5 block truncate text-[10px] font-normal text-muted-foreground">{item.subtitle}</span>
                        </div>
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[12px] font-normal text-muted-foreground">{formatPeriod(item.periodStart, item.periodEnd)}</td>
                    <td className="px-3 py-3"><ProgressCell current={item.currentMoves} total={item.totalMoves} status={item.status} /></td>
                    {showStatusColumn && <td className="px-3 py-3"><StatusBadge status={item.status} /></td>}
                    <td className="px-5 py-3 text-center">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" aria-label={`Ações de ${item.title}`} title={`Ações de ${item.title}`}>
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-list grid gap-2.5 p-3 lg:hidden">
            {visibleReconciliations.map((item) => (
              <article key={item.id} className="rounded-2xl border bg-background/60 p-3.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <BankIcon bankKey={item.bankKey} bank={item.bank} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button type="button" className="truncate text-left text-[13px] font-normal" onClick={() => onStartReconciliation?.(item)}>{item.title}</button>
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{item.subtitle} · #{formatCode(item.id)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-lg text-muted-foreground">
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-2 text-[10px] text-muted-foreground">
                      <div><span className="font-medium text-foreground">Período:</span> {formatPeriod(item.periodStart, item.periodEnd)}</div>
                      <div><span className="font-medium text-foreground">Responsável:</span> {item.assignee}</div>
                    </div>
                    <div className="mt-3"><ProgressCell current={item.currentMoves} total={item.totalMoves} status={item.status} /></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  {showStatusColumn ? <StatusBadge status={item.status} /> : <span />}
                  <button type="button" onClick={() => onStartReconciliation?.(item)} className="text-[11px] text-primary">Continuar →</button>
                </div>
              </article>
            ))}
          </div>

          {visibleReconciliations.length === 0 && (
            <div className="grid min-h-[280px] place-items-center border-t px-5 py-10 text-center">
              <div className="max-w-[360px]">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">Nenhuma conciliação encontrada</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Ajuste a busca ou os filtros para visualizar outras conciliações bancárias.</p>
              </div>
            </div>
          )}

          <div className="no-print flex flex-col gap-3 border-t bg-muted/15 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] text-muted-foreground">
              {sortedReconciliations.length > 0
                ? <>Mostrando <strong className="font-semibold text-foreground">{firstVisible} a {lastVisible}</strong> de <strong className="font-semibold text-foreground">{sortedReconciliations.length}</strong> conciliações</>
                : 'Nenhuma conciliação para exibir'}
            </p>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button type="button" variant="outline" size="icon" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="h-8 w-8 rounded-lg" aria-label="Página anterior">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                <Button key={number} type="button" variant={number === safePage ? 'default' : 'outline'} size="icon" onClick={() => setPage(number)} className="h-8 w-8 rounded-lg text-xs">
                  {number}
                </Button>
              ))}

              <Button type="button" variant="outline" size="icon" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="h-8 w-8 rounded-lg" aria-label="Próxima página">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <FiltersSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={setFilters}
        onClear={() => {
          setFilters(defaultFilters)
          setFilterOpen(false)
        }}
      />

      <StartReconciliationModal
        open={startModalOpen}
        onClose={() => setStartModalOpen(false)}
        onConfirm={(payload) => {
          setStartModalOpen(false)
          onStartReconciliation?.(payload)
        }}
      />
    </>
  )
}
