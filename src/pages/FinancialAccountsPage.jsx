import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Filter,
  HardHat,
  Landmark,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  TrendingUp,
  Truck,
  UsersRound,
  WalletCards,
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

const accounts = [
  { id: 1, description: 'Conta Corrente Principal', bank: 'Banco do Brasil', bankKey: 'bb', group: 'Operacional', type: 'Conta Corrente', company: 'GerenteMax Softwares', openingBalance: 125430.75, status: 'Ativo' },
  { id: 2, description: 'Conta de Recebimentos', bank: 'Sicredi', bankKey: 'sicredi', group: 'Vendas', type: 'Conta Corrente', company: 'GerenteMax Softwares', openingBalance: 58320.10, status: 'Ativo' },
  { id: 3, description: 'Conta Administrativa', bank: 'Itaú', bankKey: 'itau', group: 'Administrativo', type: 'Conta Corrente', company: 'GerenteMax Softwares', openingBalance: 12480, status: 'Ativo' },
  { id: 4, description: 'Caixa Matriz', bank: 'Caixa Interno', bankKey: 'cash', group: 'Operacional', type: 'Caixa', company: 'GerenteMax Softwares', openingBalance: 3500, status: 'Ativo' },
  { id: 5, description: 'Cartão Corporativo Visa', bank: 'Sicredi', bankKey: 'sicredi', group: 'Cartões Corporativos', type: 'Cartão de Crédito', company: 'GerenteMax Softwares', openingBalance: -2480.45, status: 'Ativo' },
  { id: 6, description: 'Conta Frota', bank: 'Banco do Brasil', bankKey: 'bb', group: 'Frota', type: 'Conta Corrente', company: 'GerenteMax Transportes', openingBalance: 19760.30, status: 'Ativo' },
  { id: 7, description: 'Conta Obras', bank: 'Caixa', bankKey: 'caixa', group: 'Obras', type: 'Conta Corrente', company: 'GerenteMax Obras', openingBalance: 0, status: 'Ativo' },
  { id: 8, description: 'Conta Agrícola', bank: 'Inter', bankKey: 'inter', group: 'Agrícola', type: 'Conta Corrente', company: 'Fazenda Modelo', openingBalance: 42580.90, status: 'Ativo' },
  { id: 9, description: 'Reserva Estratégica', bank: 'Nubank', bankKey: 'nubank', group: 'Reservas', type: 'Conta de Pagamento', company: 'GerenteMax Softwares', openingBalance: 18000, status: 'Ativo' },
  { id: 10, description: 'Conta de Investimentos', bank: 'Santander', bankKey: 'santander', group: 'Investimentos', type: 'Investimento', company: 'GerenteMax Softwares', openingBalance: 87000, status: 'Desativado' },
  { id: 11, description: 'Carteira Digital Vendas', bank: 'PicPay', bankKey: 'picpay', group: 'Vendas', type: 'Carteira Digital', company: 'GerenteMax Softwares', openingBalance: 2300.20, status: 'Ativo' },
  { id: 12, description: 'Caixa Filial', bank: 'Caixa Interno', bankKey: 'cash', group: 'Operacional', type: 'Caixa', company: 'Filial Barreiras', openingBalance: 0, status: 'Ativo' },
  { id: 13, description: 'Cartão Obras', bank: 'Itaú', bankKey: 'itau', group: 'Obras', type: 'Cartão de Crédito', company: 'GerenteMax Obras', openingBalance: -9560, status: 'Ativo' },
  { id: 14, description: 'Conta de Impostos', bank: 'Bradesco', bankKey: 'bradesco', group: 'Impostos', type: 'Conta Corrente', company: 'GerenteMax Softwares', openingBalance: 6400, status: 'Ativo' },
  { id: 15, description: 'Conta Reserva Antiga', bank: 'Bradesco', bankKey: 'bradesco', group: 'Reservas', type: 'Conta Corrente', company: 'GerenteMax Softwares', openingBalance: 0, status: 'Desativado' },
]

const pageSize = 10

const defaultFilters = {
  status: 'Ativo',
  group: 'Todos',
  type: 'Todos',
  company: 'Todos',
  balance: 'Todos',
}

const statusOptions = [
  { value: 'Ativo', label: 'Ativos' },
  { value: 'Desativado', label: 'Desativados' },
  { value: 'Todos', label: 'Todos' },
]

const balanceOptions = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Positivo', label: 'Positivo' },
  { value: 'Zero', label: 'Zerado' },
  { value: 'Negativo', label: 'Negativo' },
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

const groupStyles = {
  Operacional: { icon: Settings2, color: '#079447' },
  Administrativo: { icon: Building2, color: '#175AEF' },
  Vendas: { icon: ShoppingCart, color: '#A050EF' },
  Frota: { icon: Truck, color: '#F5680C' },
  Obras: { icon: HardHat, color: '#F4B514' },
  Agrícola: { icon: Sprout, color: '#08A43F' },
  'Folha de Pagamento': { icon: UsersRound, color: '#9215DE' },
  Impostos: { icon: Landmark, color: '#8420E4' },
  Investimentos: { icon: TrendingUp, color: '#D33339' },
  Reservas: { icon: ShieldCheck, color: '#34405C' },
  'Taxas Bancárias': { icon: CircleDollarSign, color: '#0891B2' },
  'Cartões Corporativos': { icon: WalletCards, color: '#DB2777' },
}

const formatCode = (value) => String(value).padStart(3, '0')
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const toRgba = (hex, alpha) => {
  const sanitized = hex.replace('#', '')
  const normalized = sanitized.length === 3
    ? sanitized.split('').map((char) => char + char).join('')
    : sanitized

  const value = parseInt(normalized, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

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

function GroupTag({ group }) {
  const meta = groupStyles[group] || { icon: WalletCards, color: '#64748B' }
  const Icon = meta.icon

  return (
    <span
      className="inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold"
      style={{
        color: meta.color,
        backgroundColor: toRgba(meta.color, 0.1),
        borderColor: toRgba(meta.color, 0.18),
      }}
    >
      <span
        className="inline-grid h-4 w-4 place-items-center rounded-full"
        style={{ backgroundColor: toRgba(meta.color, 0.16) }}
      >
        <Icon className="h-3 w-3" strokeWidth={2.1} />
      </span>
      <span className="truncate">{group}</span>
    </span>
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

function StatusBadge({ status }) {
  const active = status === 'Ativo'
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold ring-1 ring-inset',
        active
          ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400'
          : 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-400',
      )}
    >
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', active ? 'bg-emerald-500' : 'bg-rose-500')} />
      {status}
    </span>
  )
}

function BalanceValue({ value }) {
  return (
    <span
      className={cn(
        'whitespace-nowrap text-[12px] font-semibold tabular-nums',
        value > 0 && 'text-primary',
        value === 0 && 'text-muted-foreground',
        value < 0 && 'text-rose-600 dark:text-rose-400',
      )}
    >
      {formatCurrency(value)}
    </span>
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

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
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
  const groupOptions = ['Todos', ...new Set(accounts.map((account) => account.group))]
  const typeOptions = ['Todos', ...new Set(accounts.map((account) => account.type))]
  const companyOptions = ['Todos', ...new Set(accounts.map((account) => account.company))]

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
              Refine a listagem de contas financeiras sem perder o contexto da tela.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-6">
            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Status</p>
              <div className="grid grid-cols-3 gap-2">
                {statusOptions.map((option) => (
                  <SelectionButton
                    key={option.value}
                    active={draft.status === option.value}
                    onClick={() => update('status', option.value)}
                  >
                    {option.label}
                  </SelectionButton>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                A listagem abre mostrando somente as contas ativas. A coluna Status aparece apenas quando você selecionar “Todos”.
              </p>
            </section>

            <section className="space-y-3">
              <p className="text-xs font-semibold text-foreground">Classificação</p>
              <SelectField label="Grupo financeiro" value={draft.group} options={groupOptions} onChange={(value) => update('group', value)} />
              <SelectField label="Tipo da conta" value={draft.type} options={typeOptions} onChange={(value) => update('type', value)} />
            </section>

            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Saldo inicial</p>
              <div className="grid grid-cols-2 gap-2">
                {balanceOptions.map((option) => (
                  <SelectionButton
                    key={option.value}
                    active={draft.balance === option.value}
                    onClick={() => update('balance', option.value)}
                  >
                    {option.label}
                  </SelectionButton>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Empresa</p>
              <SelectField label="Empresa vinculada" value={draft.company} options={companyOptions} onChange={(value) => update('company', value)} />
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
              <Filter className="mr-2 h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function FinancialAccountsPage({ onAdd }) {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'id', direction: 'asc' })

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return accounts.filter((account) => {
      const searchable = [account.description, account.bank, account.group, account.type, account.company]
        .join(' ')
        .toLocaleLowerCase('pt-BR')

      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch)
      const matchesStatus = filters.status === 'Todos' || account.status === filters.status
      const matchesGroup = filters.group === 'Todos' || account.group === filters.group
      const matchesType = filters.type === 'Todos' || account.type === filters.type
      const matchesCompany = filters.company === 'Todos' || account.company === filters.company
      const matchesBalance = filters.balance === 'Todos'
        || (filters.balance === 'Positivo' && account.openingBalance > 0)
        || (filters.balance === 'Zero' && account.openingBalance === 0)
        || (filters.balance === 'Negativo' && account.openingBalance < 0)

      return matchesSearch && matchesStatus && matchesGroup && matchesType && matchesCompany && matchesBalance
    })
  }, [filters, search])

  const sortedAccounts = useMemo(() => {
    const direction = sort.direction === 'asc' ? 1 : -1

    return [...filteredAccounts].sort((a, b) => {
      let first = a[sort.key]
      let second = b[sort.key]

      if (typeof first === 'string' && typeof second === 'string') {
        return first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }) * direction
      }

      return (Number(first) - Number(second)) * direction
    })
  }, [filteredAccounts, sort])

  const totalPages = Math.max(1, Math.ceil(sortedAccounts.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleAccounts = sortedAccounts.slice((safePage - 1) * pageSize, safePage * pageSize)
  const firstVisible = sortedAccounts.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastVisible = Math.min(safePage * pageSize, sortedAccounts.length)
  const showStatusColumn = filters.status === 'Todos'

  useEffect(() => {
    setPage(1)
  }, [filters, search, sort])

  const activeFilterCount = [
    filters.status !== defaultFilters.status,
    filters.group !== defaultFilters.group,
    filters.type !== defaultFilters.type,
    filters.company !== defaultFilters.company,
    filters.balance !== defaultFilters.balance,
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
          <span className="font-semibold text-foreground">Contas Financeiras</span>
        </div>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="no-print flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por conta, banco, grupo, tipo ou empresa..."
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

              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
                className="h-10 justify-center rounded-xl px-3 sm:min-w-[112px] sm:px-4"
              >
                <Printer className="mr-1.5 h-4 w-4 sm:mr-2" />
                Impressão
              </Button>

              <Button
                type="button"
                onClick={onAdd}
                className="h-10 justify-center rounded-xl px-3 shadow-sm shadow-primary/20 sm:min-w-[112px] sm:px-4"
              >
                <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="print-table hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1320px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-muted/45 text-[11px] font-semibold text-muted-foreground">
                  <SortableHeader label="#" sortKey="id" sort={sort} onSort={handleSort} className="w-[86px] px-5" />
                  <SortableHeader label="Descrição da conta" sortKey="description" sort={sort} onSort={handleSort} className="min-w-[260px]" />
                  <SortableHeader label="Grupo financeiro" sortKey="group" sort={sort} onSort={handleSort} className="min-w-[190px]" />
                  <SortableHeader label="Tipo da conta" sortKey="type" sort={sort} onSort={handleSort} className="min-w-[160px]" />
                  <SortableHeader label="Empresa" sortKey="company" sort={sort} onSort={handleSort} className="min-w-[190px]" />
                  <SortableHeader label="Saldo inicial" sortKey="openingBalance" sort={sort} onSort={handleSort} className="w-[150px] text-right" align="right" />
                  {showStatusColumn && (
                    <SortableHeader label="Status" sortKey="status" sort={sort} onSort={handleSort} className="w-[140px]" />
                  )}
                  <th className="w-[82px] px-5 py-3.5 text-center text-[11px] font-semibold text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visibleAccounts.map((account) => (
                  <tr key={account.id} className="group border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-xs font-normal tabular-nums text-muted-foreground">{formatCode(account.id)}</td>
                    <td className="px-3 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <BankIcon bankKey={account.bankKey} bank={account.bank} />
                        <div className="min-w-0">
                          <span className="block truncate text-[13px] font-normal text-foreground">{account.description}</span>
                          <span className="mt-0.5 block truncate text-[10px] font-normal text-muted-foreground">{account.bank}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <GroupTag group={account.group} />
                    </td>
                    <td className="px-3 py-3 text-[12px] font-normal text-muted-foreground">{account.type}</td>
                    <td className="max-w-[240px] px-3 py-3 text-[12px] font-normal text-muted-foreground"><span className="block truncate">{account.company}</span></td>
                    <td className="px-3 py-3 text-right"><BalanceValue value={account.openingBalance} /></td>
                    {showStatusColumn && <td className="px-3 py-3"><StatusBadge status={account.status} /></td>}
                    <td className="px-5 py-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                        aria-label={`Ações de ${account.description}`}
                        title={`Ações de ${account.description}`}
                      >
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-list grid gap-2.5 p-3 lg:hidden">
            {visibleAccounts.map((account) => (
              <article key={account.id} className="rounded-2xl border bg-background/60 p-3.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <BankIcon bankKey={account.bankKey} bank={account.bank} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-normal">{account.description}</p>
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{account.bank} · #{formatCode(account.id)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-lg text-muted-foreground">
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                      </Button>
                    </div>
                    <div className="mt-2 grid gap-2 text-[10px] text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-foreground font-medium">Grupo:</span>
                        <GroupTag group={account.group} />
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        <span><strong className="font-medium text-foreground">Tipo:</strong> {account.type}</span>
                        <span className="truncate"><strong className="font-medium text-foreground">Empresa:</strong> {account.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cn('mt-3 flex items-center gap-3 border-t pt-3', showStatusColumn ? 'justify-between' : 'justify-end')}>
                  {showStatusColumn && <StatusBadge status={account.status} />}
                  <div className="text-right">
                    <span className="block text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Saldo inicial</span>
                    <BalanceValue value={account.openingBalance} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visibleAccounts.length === 0 && (
            <div className="grid min-h-[280px] place-items-center border-t px-5 py-10 text-center">
              <div className="max-w-[360px]">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <WalletCards className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">Nenhuma conta encontrada</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  Ajuste a busca ou os filtros para visualizar outras contas financeiras.
                </p>
              </div>
            </div>
          )}

          <div className="no-print flex flex-col gap-3 border-t bg-muted/15 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] text-muted-foreground">
              {sortedAccounts.length > 0
                ? <>Mostrando <strong className="font-semibold text-foreground">{firstVisible} a {lastVisible}</strong> de <strong className="font-semibold text-foreground">{sortedAccounts.length}</strong> contas</>
                : 'Nenhuma conta para exibir'}
            </p>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={safePage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="h-8 w-8 rounded-lg"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                <Button
                  key={number}
                  type="button"
                  variant={number === safePage ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setPage(number)}
                  className="h-8 w-8 rounded-lg text-xs"
                >
                  {number}
                </Button>
              ))}

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={safePage === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="h-8 w-8 rounded-lg"
                aria-label="Próxima página"
              >
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
    </>
  )
}
