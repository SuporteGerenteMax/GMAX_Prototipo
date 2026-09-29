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
  FolderTree,
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

const groups = [
  { id: 1, name: 'Operacional', accounts: 6, status: 'Ativo', note: 'Contas principais da empresa', icon: Settings2, color: '#079447' },
  { id: 2, name: 'Administrativo', accounts: 3, status: 'Ativo', note: 'Despesas administrativas e estrutura', icon: Building2, color: '#175AEF' },
  { id: 3, name: 'Vendas', accounts: 4, status: 'Ativo', note: 'Recebimentos e despesas comerciais', icon: ShoppingCart, color: '#A050EF' },
  { id: 4, name: 'Frota', accounts: 5, status: 'Ativo', note: 'Veículos, combustível e manutenção', icon: Truck, color: '#F5680C' },
  { id: 5, name: 'Obras', accounts: 2, status: 'Ativo', note: 'Projetos, contratos e construções', icon: HardHat, color: '#F4B514' },
  { id: 6, name: 'Agrícola', accounts: 2, status: 'Ativo', note: 'Custeio agrícola e safra', icon: Sprout, color: '#08A43F' },
  { id: 7, name: 'Folha de Pagamento', accounts: 3, status: 'Ativo', note: 'Salários, benefícios e encargos', icon: UsersRound, color: '#9215DE' },
  { id: 8, name: 'Impostos', accounts: 1, status: 'Ativo', note: 'Tributos e obrigações fiscais', icon: Landmark, color: '#8420E4' },
  { id: 9, name: 'Investimentos', accounts: 1, status: 'Desativado', note: 'Aplicações e investimentos', icon: TrendingUp, color: '#D33339' },
  { id: 10, name: 'Reservas', accounts: 1, status: 'Desativado', note: 'Fundos e reservas financeiras', icon: ShieldCheck, color: '#34405C' },
  { id: 11, name: 'Taxas Bancárias', accounts: 2, status: 'Ativo', note: 'Tarifas, juros e despesas bancárias', icon: CircleDollarSign, color: '#0891B2' },
  { id: 12, name: 'Cartões Corporativos', accounts: 4, status: 'Ativo', note: 'Faturas e despesas com cartões', icon: WalletCards, color: '#DB2777' },
  { id: 13, name: 'Adiantamentos', accounts: 0, status: 'Ativo', note: 'Adiantamentos a colaboradores e fornecedores', icon: CircleDollarSign, color: '#4F46E5' },
  { id: 14, name: 'Seguros', accounts: 1, status: 'Ativo', note: 'Seguros patrimoniais e operacionais', icon: ShieldCheck, color: '#0D9488' },
  { id: 15, name: 'Projetos Especiais', accounts: 0, status: 'Desativado', note: 'Centros temporários para projetos específicos', icon: FolderTree, color: '#64748B' },
]

const pageSize = 10

const defaultFilters = {
  status: 'Ativo',
  link: 'Todos',
  minAccounts: '',
  maxAccounts: '',
}

const statusOptions = [
  { value: 'Ativo', label: 'Ativos' },
  { value: 'Desativado', label: 'Desativados' },
  { value: 'Todos', label: 'Todos' },
]

const formatCode = (value) => String(value).padStart(3, '0')

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

function SortableHeader({ label, sortKey, sort, onSort, className = '', align = 'left' }) {
  const active = sort.key === sortKey
  const SortIcon = active
    ? sort.direction === 'asc' ? ArrowUp : ArrowDown
    : ArrowUpDown

  return (
    <th className={cn('px-3 py-3.5 font-semibold', className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          align === 'center' && 'justify-center',
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
              Refine a listagem de grupos sem perder o contexto da tela.
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
                A listagem abre mostrando somente os grupos ativos. A coluna Status é exibida quando você selecionar “Todos”.
              </p>
            </section>

            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Vínculo com contas</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ['Todos', 'Todos'],
                  ['Com contas', 'Com contas'],
                  ['Sem contas', 'Sem contas'],
                ].map(([value, label]) => (
                  <SelectionButton
                    key={value}
                    active={draft.link === value}
                    onClick={() => update('link', value)}
                  >
                    {label}
                  </SelectionButton>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2.5 text-xs font-semibold text-foreground">Quantidade de contas</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Mínimo</span>
                  <Input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={draft.minAccounts}
                    onChange={(event) => update('minAccounts', event.target.value)}
                    placeholder="0"
                    className="h-10 rounded-xl"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Máximo</span>
                  <Input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={draft.maxAccounts}
                    onChange={(event) => update('maxAccounts', event.target.value)}
                    placeholder="Sem limite"
                    className="h-10 rounded-xl"
                  />
                </label>
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
              <Filter className="mr-2 h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function AccountGroupsPage() {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'id', direction: 'asc' })

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return groups.filter((group) => {
      const matchesSearch = !normalizedSearch
        || group.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
        || group.note.toLocaleLowerCase('pt-BR').includes(normalizedSearch)

      const matchesStatus = filters.status === 'Todos' || group.status === filters.status
      const matchesLink = filters.link === 'Todos'
        || (filters.link === 'Com contas' ? group.accounts > 0 : group.accounts === 0)
      const matchesMin = filters.minAccounts === '' || group.accounts >= Number(filters.minAccounts)
      const matchesMax = filters.maxAccounts === '' || group.accounts <= Number(filters.maxAccounts)

      return matchesSearch && matchesStatus && matchesLink && matchesMin && matchesMax
    })
  }, [filters, search])

  const sortedGroups = useMemo(() => {
    const direction = sort.direction === 'asc' ? 1 : -1

    return [...filteredGroups].sort((a, b) => {
      let first = a[sort.key]
      let second = b[sort.key]

      if (typeof first === 'string' && typeof second === 'string') {
        return first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }) * direction
      }

      return (Number(first) - Number(second)) * direction
    })
  }, [filteredGroups, sort])

  const totalPages = Math.max(1, Math.ceil(sortedGroups.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleGroups = sortedGroups.slice((safePage - 1) * pageSize, safePage * pageSize)
  const firstVisible = sortedGroups.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastVisible = Math.min(safePage * pageSize, sortedGroups.length)
  const showStatusColumn = filters.status === 'Todos'

  useEffect(() => {
    setPage(1)
  }, [filters, search, sort])

  const activeFilterCount = [
    filters.status !== defaultFilters.status,
    filters.link !== defaultFilters.link,
    filters.minAccounts !== defaultFilters.minAccounts,
    filters.maxAccounts !== defaultFilters.maxAccounts,
  ].filter(Boolean).length

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handlePrint = () => window.print()

  return (
    <>
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="no-print mb-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>Financeiro</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">Grupo de Contas</span>
        </div>

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="no-print flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome ou observação..."
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
                onClick={handlePrint}
                className="h-10 justify-center rounded-xl px-3 sm:min-w-[112px] sm:px-4"
              >
                <Printer className="mr-1.5 h-4 w-4 sm:mr-2" />
                Impressão
              </Button>

              <Button
                type="button"
                className="h-10 justify-center rounded-xl px-3 shadow-sm shadow-primary/20 sm:min-w-[112px] sm:px-4"
              >
                <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="print-table hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-muted/45 text-[11px] font-semibold text-muted-foreground">
                  <SortableHeader label="#" sortKey="id" sort={sort} onSort={handleSort} className="w-[86px] px-5" />
                  <SortableHeader label="Grupo de contas" sortKey="name" sort={sort} onSort={handleSort} />
                  <SortableHeader label="Contas" sortKey="accounts" sort={sort} onSort={handleSort} className="w-[130px] text-center" align="center" />
                  <SortableHeader label="Observação" sortKey="note" sort={sort} onSort={handleSort} />
                  {showStatusColumn && (
                    <SortableHeader label="Status" sortKey="status" sort={sort} onSort={handleSort} className="w-[150px]" />
                  )}
                  <th className="w-[82px] px-5 py-3.5 text-center text-[11px] font-semibold text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visibleGroups.map((group) => {
                  const Icon = group.icon
                  return (
                    <tr key={group.id} className="group border-b last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 text-xs font-normal tabular-nums text-muted-foreground">{formatCode(group.id)}</td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                            style={{
                              color: group.color,
                              backgroundColor: `${group.color}18`,
                              boxShadow: `inset 0 0 0 1px ${group.color}24`,
                            }}
                          >
                            <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
                          </div>
                          <span className="truncate text-[13px] font-normal text-foreground">{group.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-[13px] font-normal tabular-nums text-muted-foreground">{group.accounts}</td>
                      <td className="max-w-[460px] px-3 py-3 text-[12px] font-normal text-muted-foreground">
                        <span className="block truncate">{group.note}</span>
                      </td>
                      {showStatusColumn && (
                        <td className="px-3 py-3"><StatusBadge status={group.status} /></td>
                      )}
                      <td className="px-5 py-3 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                          aria-label={`Ações de ${group.name}`}
                          title={`Ações de ${group.name}`}
                        >
                          <MoreHorizontal className="h-[18px] w-[18px]" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mobile-list grid gap-2.5 p-3 lg:hidden">
            {visibleGroups.map((group) => {
              const Icon = group.icon
              return (
                <article key={group.id} className="rounded-2xl border bg-background/60 p-3.5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                      style={{
                        color: group.color,
                        backgroundColor: `${group.color}18`,
                        boxShadow: `inset 0 0 0 1px ${group.color}24`,
                      }}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-normal">{group.name}</p>
                          <p className="mt-0.5 text-[10px] tabular-nums text-muted-foreground">Grupo #{formatCode(group.id)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-lg text-muted-foreground">
                          <MoreHorizontal className="h-[18px] w-[18px]" />
                        </Button>
                      </div>
                      <p className="mt-2 text-[11px] font-normal leading-4 text-muted-foreground">{group.note}</p>
                    </div>
                  </div>
                  <div className={cn('mt-3 flex items-center gap-3 border-t pt-3', showStatusColumn ? 'justify-between' : 'justify-end')}>
                    {showStatusColumn && <StatusBadge status={group.status} />}
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {group.accounts} {group.accounts === 1 ? 'conta vinculada' : 'contas vinculadas'}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>

          {visibleGroups.length === 0 && (
            <div className="grid min-h-[280px] place-items-center border-t px-5 py-10 text-center">
              <div className="max-w-[360px]">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">Nenhum grupo encontrado</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  Ajuste a busca ou os filtros para visualizar outros grupos de contas.
                </p>
              </div>
            </div>
          )}

          <div className="no-print flex flex-col gap-3 border-t bg-muted/15 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[11px] text-muted-foreground">
              {sortedGroups.length > 0
                ? <>Mostrando <strong className="font-semibold text-foreground">{firstVisible} a {lastVisible}</strong> de <strong className="font-semibold text-foreground">{sortedGroups.length}</strong> grupos</>
                : 'Nenhum grupo para exibir'}
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
