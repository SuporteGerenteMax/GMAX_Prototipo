import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  DollarSign,
  Link2,
  Plug,
  ShieldCheck,
  Sparkles,
  Truck,
  WalletCards,
  X,
} from 'lucide-react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Brand from './components/Brand.jsx'
import AccountGroupsPage from './pages/AccountGroupsPage.jsx'
import FinancialAccountsPage from './pages/FinancialAccountsPage.jsx'
import AddFinancialAccountPage from './pages/AddFinancialAccountPage.jsx'
import MovementsPage from './pages/MovementsPage.jsx'
import BankReconciliationPage from './pages/BankReconciliationPage.jsx'
import BankReconciliationWorkspacePage from './pages/BankReconciliationWorkspacePage.jsx'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const shortcuts = [
  { label: 'Visão financeira', detail: 'Fluxo de caixa e resultados', icon: DollarSign },
  { label: 'Gestão de frota', detail: 'Veículos, custos e manutenção', icon: Truck },
  { label: 'Operações', detail: 'Acompanhe tarefas e pendências', icon: ClipboardCheck },
  { label: 'Dashboards', detail: 'Indicadores em tempo real', icon: BarChart3 },
]

function HomePage() {
  return (
    <>
      <section className="relative grid min-h-[46vh] place-items-center overflow-hidden rounded-2xl border bg-card shadow-soft sm:min-h-[48vh] lg:rounded-[22px]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,hsl(var(--border)/0.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.45)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(circle_at_center,black_0,transparent_64%)]" />
        <div className="pointer-events-none absolute left-[18%] top-[8%] h-[360px] w-[360px] rounded-full bg-primary/20 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-18%] right-[18%] h-[360px] w-[360px] rounded-full bg-sky-400/20 blur-[90px]" />

        <div className="relative z-10 max-w-[760px] px-5 py-10 text-center sm:px-6 sm:py-12">
          <div className="mb-5 inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-[10px] font-extrabold tracking-[0.12em] text-primary">
            ERP GERENTEMAX
          </div>
          <Brand />
          <h1 className="mt-5 text-balance text-[22px] font-bold tracking-[-0.035em] sm:text-3xl lg:text-[36px]">
            Bem-vindo ao seu centro de gestão
          </h1>
          <p className="mx-auto mt-3 max-w-[600px] text-sm leading-6 text-muted-foreground">
            Uma visão clara da operação, com acesso rápido aos módulos que movem o seu negócio.
          </p>
        </div>
      </section>

      <section className="px-0.5 pb-1 pt-7" aria-label="Acessos rápidos">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-[0.12em] text-primary">ACESSO RÁPIDO</span>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">Continue de onde parou</h2>
          </div>
          <Button variant="link" size="sm" className="hidden h-auto gap-1.5 p-0 text-xs font-semibold sm:inline-flex">
            Ver todos os módulos <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map(({ label, detail, icon: Icon }) => (
            <button
              className="group flex min-h-[92px] min-w-0 items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
              type="button"
              key={label}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs font-semibold">{label}</strong>
                <span className="mt-1 block truncate text-[10px] text-muted-foreground">{detail}</span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

function AddAccountMethodModal({ open, onClose, onManual, onPluggy }) {
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" onClick={onClose} aria-label="Fechar modal" />

      <div className="relative z-10 w-full max-w-[760px] overflow-hidden rounded-[28px] border bg-card shadow-[0_28px_80px_-24px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-3 border-b px-5 py-5 sm:px-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Contas Financeiras
            </div>
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-foreground">Como deseja adicionar a conta?</h2>
            <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
              Escolha a melhor forma de iniciar o cadastro da sua conta financeira.
            </p>
          </div>

          <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-2xl" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <button
            type="button"
            onClick={onManual}
            className="group rounded-3xl border bg-background p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.03] hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <WalletCards className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-[16px] font-semibold tracking-[-0.02em] text-foreground">Cadastro Manual</strong>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Disponível</span>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                  Preencha os dados da conta manualmente, com controle total sobre descrição, tipo, vínculos, saldo inicial e observações.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onPluggy}
            className="group rounded-3xl border bg-background p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.03] hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Plug className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-[16px] font-semibold tracking-[-0.02em] text-foreground">Open Finance (Via Pluggy)</strong>
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-600 dark:text-sky-400">Automatizado</span>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                  Conecte a instituição financeira via Pluggy para importar contas com mais rapidez, reduzindo digitação manual e preparando integrações futuras.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-end border-t px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

function PluggyIntroPage({ onBack }) {
  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Financeiro</span>
        <span>/</span>
        <span>Contas Financeiras</span>
        <span>/</span>
        <span className="font-semibold text-foreground">Open Finance (Via Pluggy)</span>
      </div>

      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="border-b px-5 py-6 sm:px-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            Importação Inteligente
          </div>
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">Open Finance via Pluggy</h1>
          <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-muted-foreground">
            Fluxo preparado para conectar instituições financeiras, importar dados com consentimento e acelerar o cadastro de contas no GerenteMax.
          </p>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:p-6">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-background/70 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Plug className="h-5 w-5" />
                </div>
                <div>
                  <strong className="block text-[15px] font-semibold">Conexão com instituição financeira</strong>
                  <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                    Aqui você poderá iniciar a autenticação Open Finance via Pluggy para buscar contas, titulares e dados complementares de forma segura.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Consentimento', detail: 'Autorização segura do usuário para acesso aos dados.' },
                { icon: Link2, title: 'Conexão', detail: 'Vínculo com a instituição financeira escolhida.' },
                { icon: Sparkles, title: 'Importação', detail: 'Pré-preenchimento das contas e seus dados.' },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="rounded-2xl border bg-background/70 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <strong className="mt-3 block text-[13px] font-semibold text-foreground">{title}</strong>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-background/70 p-4">
            <strong className="block text-[15px] font-semibold text-foreground">Próxima etapa sugerida</strong>
            <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">
              Integrar esse fluxo com a Pluggy para listar instituições, abrir a autenticação e receber as contas importadas no cadastro do GerenteMax.
            </p>

            <div className="mt-5 grid gap-2.5">
              <Button type="button" className="h-11 rounded-xl shadow-sm shadow-primary/20">
                <Plug className="mr-2 h-4 w-4" />
                Iniciar conexão
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={onBack}>
                Voltar para Contas Financeiras
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [page, setPage] = useState('home')
  const [accountMethodModalOpen, setAccountMethodModalOpen] = useState(false)
  const [selectedReconciliation, setSelectedReconciliation] = useState(null)

  const handleFinanceNavigate = (label) => {
    if (label === 'Grupo de Contas') setPage('account-groups')
    if (label === 'Contas Financeiras') setPage('financial-accounts')
    if (label === 'Movimentações') setPage('financial-movements')
    if (label === 'Conciliação Bancária') setPage('bank-reconciliation')
  }

  const isFinancialFlow = ['financial-accounts', 'financial-account-create', 'financial-account-pluggy', 'financial-movements', 'bank-reconciliation', 'bank-reconciliation-workspace'].includes(page)
  const pageTitle = page === 'account-groups'
    ? 'Grupos de Contas'
    : isFinancialFlow
      ? page === 'financial-account-create'
        ? 'Nova conta'
        : page === 'financial-account-pluggy'
          ? 'Open Finance (Via Pluggy)'
          : page === 'financial-movements'
            ? 'Movimentações'
            : page === 'bank-reconciliation'
              ? 'Conciliação Bancária'
              : page === 'bank-reconciliation-workspace'
                ? 'Conciliação'
                : 'Contas Financeiras'
      : undefined

  const pageSubtitle = page === 'account-groups'
    ? 'Organize suas contas financeiras por finalidade para tornar a gestão e os relatórios mais claros.'
    : isFinancialFlow
      ? page === 'financial-account-create'
        ? 'Cadastre uma nova conta com dados gerais, vínculos e saldo inicial.'
        : page === 'financial-account-pluggy'
          ? 'Conecte instituições financeiras e prepare a importação automática de contas.'
          : page === 'financial-movements'
            ? 'Visualize entradas, saídas, saldos e conciliações em uma experiência moderna e dinâmica.'
            : page === 'bank-reconciliation'
              ? 'Acompanhe e organize o andamento das conciliações bancárias com clareza e produtividade.'
              : page === 'bank-reconciliation-workspace'
                ? 'Compare os lançamentos do sistema com o extrato bancário e acelere a conferência.'
                : 'Centralize bancos, caixas, cartões e demais contas financeiras da empresa.'
      : undefined

  return (
    <TooltipProvider delayDuration={250}>
      <div className="min-h-screen bg-background">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onExpand={() => setCollapsed(false)}
          mobileOpen={mobileMenuOpen}
          onMobileOpenChange={setMobileMenuOpen}
          onFinanceNavigate={handleFinanceNavigate}
          activePage={page}
          onHomeNavigate={() => setPage('home')}
        />

        <div
          className={cn(
            'app-shell-content min-w-0 transition-[padding] duration-300 ease-out',
            collapsed ? 'md:pl-[var(--sidebar-collapsed-width)]' : 'md:pl-[var(--sidebar-width)]',
          )}
        >
          <Header
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            title={pageTitle}
            subtitle={pageSubtitle}
          />

          <main
            className={cn(
              'min-h-[calc(100vh-64px)] bg-background md:min-h-[calc(100vh-72px)]',
              page === 'account-groups' || isFinancialFlow
                ? 'px-3 pb-3 pt-1.5 sm:px-5 sm:pb-5 sm:pt-2.5 lg:px-7 lg:pb-7 lg:pt-3.5'
                : 'p-3 sm:p-5 lg:p-7',
            )}
          >
            {page === 'account-groups' && <AccountGroupsPage />}
            {page === 'financial-accounts' && <FinancialAccountsPage onAdd={() => setAccountMethodModalOpen(true)} />}
            {page === 'financial-account-create' && (
              <AddFinancialAccountPage
                onCancel={() => setPage('financial-accounts')}
                onSave={() => setPage('financial-accounts')}
              />
            )}
            {page === 'financial-account-pluggy' && <PluggyIntroPage onBack={() => setPage('financial-accounts')} />}
            {page === 'financial-movements' && <MovementsPage />}
            {page === 'bank-reconciliation' && (
              <BankReconciliationPage
                onStartReconciliation={(payload) => {
                  setSelectedReconciliation(payload)
                  setPage('bank-reconciliation-workspace')
                }}
              />
            )}
            {page === 'bank-reconciliation-workspace' && (
              <BankReconciliationWorkspacePage
                data={selectedReconciliation}
                onBack={() => setPage('bank-reconciliation')}
                onFinish={() => setPage('bank-reconciliation')}
              />
            )}
            {page === 'home' && <HomePage />}
          </main>
        </div>

        <AddAccountMethodModal
          open={accountMethodModalOpen}
          onClose={() => setAccountMethodModalOpen(false)}
          onManual={() => {
            setAccountMethodModalOpen(false)
            setPage('financial-account-create')
          }}
          onPluggy={() => {
            setAccountMethodModalOpen(false)
            setPage('financial-account-pluggy')
          }}
        />
      </div>
    </TooltipProvider>
  )
}
