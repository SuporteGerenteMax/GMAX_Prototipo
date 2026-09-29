import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  CalendarRange,
  CheckCheck,
  CircleDollarSign,
  FileSpreadsheet,
  Filter,
  Printer,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const movementData = [
  {
    id: 1,
    date: '2026-09-17',
    description: 'Comissão motorista - viagem nº 10570',
    paymentMethod: 'Dinheiro',
    partner: 'Ardey Salles Batista Santos',
    credit: 0,
    debit: 1446.72,
    company: 'GerenteMax Transportes',
    account: 'Caixa Motorista',
    launchStatus: 'sem-conciliar',
    situation: 'realizado',
  },
  {
    id: 2,
    date: '2026-09-17',
    description: 'Transferência valor acerto a repassar para transferência entre conta',
    paymentMethod: 'Transferência entre conta',
    partner: 'Transferência entre conta',
    credit: 240.5,
    debit: 0,
    company: 'GerenteMax Softwares',
    account: 'Banco do Brasil - Faz',
    launchStatus: 'conciliado',
    situation: 'realizado',
  },
  {
    id: 3,
    date: '2026-09-17',
    description: 'Transferência acerto com o motorista via carteira',
    paymentMethod: 'Carteira',
    partner: 'Transferência entre conta',
    credit: 3559.78,
    debit: 0,
    company: 'GerenteMax Transportes',
    account: 'Carteira Operacional',
    launchStatus: 'sem-conciliar',
    situation: 'realizado',
  },
  {
    id: 4,
    date: '2026-09-17',
    description: 'Transferência acerto com o motorista via carteira',
    paymentMethod: 'Transferência entre conta',
    partner: 'Transferência entre conta',
    credit: 0,
    debit: 3559.78,
    company: 'GerenteMax Transportes',
    account: 'Caixa Matriz',
    launchStatus: 'sem-conciliar',
    situation: 'realizado',
  },
  {
    id: 5,
    date: '2026-09-17',
    description: 'Saldo frete - frete viagem nº 10570, de cand dinheiro',
    paymentMethod: 'Dinheiro',
    partner: 'Bunge',
    credit: 13152.0,
    debit: 0,
    company: 'GerenteMax Transportes',
    account: 'Caixa Frete',
    launchStatus: 'conciliado',
    situation: 'realizado',
  },
  {
    id: 6,
    date: '2026-09-17',
    description: 'Diesel caminhonete falamansa',
    paymentMethod: 'Dinheiro',
    partner: 'Diesel Garagem',
    credit: 0,
    debit: 240.5,
    company: 'GerenteMax Obras',
    account: 'Caixa Operacional',
    launchStatus: 'conciliado',
    situation: 'realizado',
  },
  {
    id: 7,
    date: '2026-09-17',
    description: 'Fatura nº 00342 ref. documentos: 10566, 1051',
    paymentMethod: 'Carteira',
    partner: 'Ardey Salles Batista Santos',
    credit: 0,
    debit: 3319.28,
    company: 'GerenteMax Transportes',
    account: 'Carteira Operacional',
    launchStatus: 'sem-conciliar',
    situation: 'realizado',
  },
  {
    id: 8,
    date: '2026-09-17',
    description: 'Serviço solda mecânico',
    paymentMethod: 'Dinheiro',
    partner: 'Despesas diversas',
    credit: 0,
    debit: 3735.0,
    company: 'GerenteMax Transportes',
    account: 'Caixa Empresa',
    launchStatus: 'conciliado',
    situation: 'realizado',
  },
  {
    id: 9,
    date: '2026-09-17',
    description: 'Abastecimento viagem nº 10570',
    paymentMethod: 'Dinheiro',
    partner: 'Diesel Garagem',
    credit: 0,
    debit: 1924.0,
    company: 'GerenteMax Transportes',
    account: 'Caixa Motorista',
    launchStatus: 'sem-conciliar',
    situation: 'realizado',
  },
  {
    id: 10,
    date: '2026-09-17',
    description: 'Abastecimento viagem nº 10570',
    paymentMethod: 'Dinheiro',
    partner: 'Combustível',
    credit: 0,
    debit: 2007.0,
    company: 'GerenteMax Transportes',
    account: 'Caixa Motorista',
    launchStatus: 'sem-conciliar',
    situation: 'realizado',
  },
]

const accountSummary = [
  { bank: 'Banco do Brasil - Faz', balance: 41742.56 },
  { bank: 'Bradesco - Edilson TR', balance: -15381.01 },
  { bank: 'Bradesco - Fazenda Ag', balance: -127892.99 },
  { bank: 'Bradesco - Nove Eixos', balance: 69052.0 },
  { bank: 'Bradesco Reinaldo - 3C', balance: -156571.89 },
  { bank: 'Caixa Acerto', balance: 486811.06 },
  { bank: 'Caixa Cheques Devolvi', balance: 2062.62 },
  { bank: 'Caixa Combustível', balance: -1333.8 },
  { bank: 'Caixa Empresa - Edilsc', balance: -43912.48 },
  { bank: 'Caixa Fala Mansa', balance: -13560.0 },
  { bank: 'Quademir Nolaço Perf', balance: 2478551.01 },
]

const consolidationHistory = [
  { id: 1, account: 'Aplicação BB - Guzzi', date: '2020-10-31', status: 'inativo' },
  { id: 2, account: 'Aplicação BB - Nove Eix', date: '2020-10-31', status: 'inativo' },
  { id: 3, account: 'Aplicação Sicoob - Nove', date: '2020-12-15', status: 'inativo' },
  { id: 4, account: 'B. Reinaldo - Desativada', date: '—', status: 'inativo' },
  { id: 5, account: 'Banco do Brasil - Faz 32', date: '—', status: 'inativo' },
  { id: 6, account: 'BB - Guzzi 28480-7', date: '2022-06-21', status: 'inativo' },
  { id: 7, account: 'BB - Nove Eixos 23899-6', date: '2022-05-16', status: 'inativo' },
  { id: 8, account: 'Bradesco - Edilson Tran', date: '2022-04-30', status: 'inativo' },
  { id: 9, account: 'Bradesco - Edilson Tran 29/05/2026', date: '2026-05-29', status: 'inativo' },
  { id: 10, account: 'Bradesco - Fazenda Ag 3', date: '2022-04-11', status: 'inativo' },
]

const companies = ['Todas', 'GerenteMax Softwares', 'GerenteMax Transportes', 'GerenteMax Obras']
const accounts = ['Todas', 'Banco do Brasil - Faz', 'Caixa Motorista', 'Caixa Empresa', 'Carteira Operacional', 'Caixa Frete']

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const shortDate = (value) => new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`))

function InfoCard({ title, value, icon: Icon, tone = 'blue' }) {
  const toneStyles = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    red: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  }

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-muted-foreground">{title}</span>
          <div className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-foreground">{value}</div>
        </div>
        <div className={cn('grid h-11 w-11 place-items-center rounded-2xl', toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function FilterRadio({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-colors',
        active ? 'border-primary/20 bg-primary/10 text-primary' : 'bg-background text-muted-foreground hover:bg-muted/60',
      )}
    >
      <span className={cn('h-2.5 w-2.5 rounded-full', active ? 'bg-primary' : 'bg-muted-foreground/35')} />
      {label}
    </button>
  )
}

function Panel({ title, subtitle, icon: Icon, children, actions }) {
  return (
    <section className="rounded-3xl border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
            {subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {actions}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

function StatusPill({ status }) {
  const map = {
    conciliado: { label: 'Conciliado', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    'sem-conciliar': { label: 'Sem conciliar', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    todos: { label: 'Todos', className: 'bg-primary/10 text-primary' },
  }
  const current = map[status]
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold', current.className)}>{current.label}</span>
}

export default function MovementsPage() {
  const [situation, setSituation] = useState('realizado')
  const [launchStatus, setLaunchStatus] = useState('todos')
  const [company, setCompany] = useState('Todas')
  const [account, setAccount] = useState('Todas')
  const [dateStart, setDateStart] = useState('2026-09-17')
  const [dateEnd, setDateEnd] = useState('2026-09-17')
  const [searchValue, setSearchValue] = useState('')

  const filteredMovements = useMemo(() => {
    return movementData.filter((item) => {
      const matchesSituation = situation === 'todos' || item.situation === situation
      const matchesLaunch = launchStatus === 'todos' || item.launchStatus === launchStatus
      const matchesCompany = company === 'Todas' || item.company === company
      const matchesAccount = account === 'Todas' || item.account === account
      const matchesText = !searchValue || [item.description, item.paymentMethod, item.partner, item.account].join(' ').toLowerCase().includes(searchValue.toLowerCase())
      const matchesStart = !dateStart || item.date >= dateStart
      const matchesEnd = !dateEnd || item.date <= dateEnd
      return matchesSituation && matchesLaunch && matchesCompany && matchesAccount && matchesText && matchesStart && matchesEnd
    })
  }, [account, company, dateEnd, dateStart, launchStatus, searchValue, situation])

  const totals = useMemo(() => {
    const credit = filteredMovements.reduce((sum, item) => sum + item.credit, 0)
    const debit = filteredMovements.reduce((sum, item) => sum + item.debit, 0)
    const previous = 2723117.83
    return {
      credit,
      debit,
      previous,
      balance: previous + credit - debit,
    }
  }, [filteredMovements])

  const totalAccountsBalance = useMemo(() => accountSummary.reduce((sum, item) => sum + item.balance, 0), [])

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-4">
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Financeiro</span>
        <span>/</span>
        <span className="font-semibold text-foreground">Movimentações</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Receitas / Entradas" value={money(totals.credit)} icon={TrendingUp} tone="green" />
            <InfoCard title="Despesas / Saídas" value={money(totals.debit)} icon={TrendingDown} tone="red" />
            <InfoCard title="Saldo anterior" value={money(totals.previous)} icon={Wallet} tone="slate" />
            <InfoCard title="Saldo do período" value={money(totals.balance)} icon={CircleDollarSign} tone="blue" />
          </div>

          <Panel
            title="Filtros e visão da movimentação"
            subtitle="Acompanhe entradas, saídas e pendências de conciliação em tempo real."
            icon={SlidersHorizontal}
            actions={
              <div className="hidden items-center gap-2 sm:flex">
                <StatusPill status={launchStatus} />
              </div>
            }
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
              <div className="grid gap-4">
                <div>
                  <div className="mb-2 text-[12px] font-semibold text-foreground">Situação</div>
                  <div className="flex flex-wrap gap-2">
                    <FilterRadio active={situation === 'realizado'} label="Realizados" onClick={() => setSituation('realizado')} />
                    <FilterRadio active={situation === 'arealizar'} label="A realizar" onClick={() => setSituation('arealizar')} />
                    <FilterRadio active={situation === 'todos'} label="Todos" onClick={() => setSituation('todos')} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-foreground">Período inicial</span>
                    <div className="relative">
                      <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background" />
                    </div>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-foreground">Período final</span>
                    <div className="relative">
                      <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background" />
                    </div>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-foreground">Empresa</span>
                    <select value={company} onChange={(e) => setCompany(e.target.value)} className="h-11 w-full rounded-xl border bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background">
                      {companies.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-foreground">Conta</span>
                    <select value={account} onChange={(e) => setAccount(e.target.value)} className="h-11 w-full rounded-xl border bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background">
                      {accounts.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border bg-background/55 p-4">
                <div className="mb-3 text-[12px] font-semibold text-foreground">Lançamentos</div>
                <div className="grid gap-2">
                  <FilterRadio active={launchStatus === 'todos'} label="Todos" onClick={() => setLaunchStatus('todos')} />
                  <FilterRadio active={launchStatus === 'conciliado'} label="Conciliados" onClick={() => setLaunchStatus('conciliado')} />
                  <FilterRadio active={launchStatus === 'sem-conciliar'} label="Sem conciliar" onClick={() => setLaunchStatus('sem-conciliar')} />
                </div>
                <div className="mt-4 rounded-2xl border bg-card p-3 text-[11px] leading-5 text-muted-foreground">
                  Use os filtros para localizar rapidamente pagamentos, transferências e lançamentos ainda pendentes de conciliação.
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Movimentações financeiras"
            subtitle={`${filteredMovements.length} lançamento(s) encontrados no período selecionado.`}
            icon={FileSpreadsheet}
            actions={
              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Buscar discriminação, cliente ou conta..."
                    className="h-10 w-[300px] rounded-xl border bg-white pl-10 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background"
                  />
                </div>
                <Button variant="outline" className="rounded-xl"><Filter className="mr-2 h-4 w-4" />Filtros</Button>
              </div>
            }
          >
            <div className="mb-3 block sm:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar discriminação, cliente ou conta..."
                  className="h-10 w-full rounded-xl border bg-white pl-10 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border">
              <table className="min-w-[980px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/45 text-left text-[12px] font-semibold text-foreground">
                    <th className="px-4 py-3">Data pago</th>
                    <th className="px-4 py-3">Discriminação</th>
                    <th className="px-4 py-3">Forma pagto</th>
                    <th className="px-4 py-3">Cliente / Fornecedor</th>
                    <th className="px-4 py-3 text-right">Vl. crédito</th>
                    <th className="px-4 py-3 text-right">Vl. débito</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((item) => (
                    <tr key={item.id} className="border-t align-top text-[13px] transition-colors hover:bg-muted/25">
                      <td className="px-4 py-3 font-medium text-primary">{shortDate(item.date)}</td>
                      <td className="px-4 py-3">
                        <div className="max-w-[320px] font-medium text-foreground">{item.description}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">{item.company} • {item.account}</div>
                      </td>
                      <td className="px-4 py-3">{item.paymentMethod}</td>
                      <td className="px-4 py-3">{item.partner}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">{item.credit > 0 ? money(item.credit) : '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-rose-600 dark:text-rose-400">{item.debit > 0 ? money(item.debit) : '—'}</td>
                      <td className="px-4 py-3"><StatusPill status={item.launchStatus} /></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/35 text-[13px] font-semibold">
                    <td className="px-4 py-3" colSpan={4}>Total</td>
                    <td className="px-4 py-3 text-right text-primary">{money(totals.credit)}</td>
                    <td className="px-4 py-3 text-right text-rose-600 dark:text-rose-400">{money(totals.debit)}</td>
                    <td className="px-4 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Button className="h-12 rounded-2xl shadow-sm shadow-primary/20"><CheckCheck className="mr-2 h-4 w-4" />Conciliação de lançamentos</Button>
            <Button variant="outline" className="h-12 rounded-2xl"><ArrowUpRight className="mr-2 h-4 w-4" />Consolidar conta</Button>
            <Button variant="outline" className="h-12 rounded-2xl"><Printer className="mr-2 h-4 w-4" />Impressão</Button>
            <Button variant="outline" className="h-12 rounded-2xl text-rose-600 hover:text-rose-600 dark:text-rose-400"><XCircle className="mr-2 h-4 w-4" />Sair</Button>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[88px] xl:self-start">
          <Panel title="Resumo de todas as contas" subtitle="Saldos consolidados por banco/caixa." icon={Building2}>
            <div className="space-y-2">
              {accountSummary.map((item) => (
                <div key={item.bank} className="flex items-center justify-between gap-3 rounded-2xl border bg-background/40 px-3 py-2.5 text-[12px]">
                  <span className="line-clamp-2 text-foreground">{item.bank}</span>
                  <span className={cn('shrink-0 text-right font-semibold', item.balance >= 0 ? 'text-primary' : 'text-rose-600 dark:text-rose-400')}>
                    {money(item.balance)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/[0.04] px-3 py-3 text-sm font-semibold">
              <span>Total</span>
              <span className="text-primary">{money(totalAccountsBalance)}</span>
            </div>
          </Panel>

          <Panel title="Histórico de consolidação" subtitle="Contas e datas consolidadas recentemente." icon={ArrowDownLeft}>
            <div className="space-y-2">
              {consolidationHistory.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl border bg-background/40 px-3 py-2.5">
                  <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <XCircle className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-medium text-foreground">{item.account}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">Data: {item.date === '—' ? 'Não consolidado' : shortDate(item.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
