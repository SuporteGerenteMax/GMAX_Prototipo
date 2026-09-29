import { useState } from 'react'
import {
  ArrowLeftRight,
  BarChart3,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  Home,
  FolderTree,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Scale,
  TrendingDown,
  TrendingUp,
  Truck,
  UsersRound,
  WalletCards,
  Wrench,
} from 'lucide-react'
import Brand from './Brand.jsx'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const sections = [
  {
    title: 'Atalhos',
    items: [
      { label: 'Início', icon: Home },
      { label: 'Dashboards', icon: BarChart3, expandable: true },
      { label: 'Cadastros', icon: UsersRound, expandable: true },
    ],
  },
  {
    title: 'Módulos',
    items: [
      { label: 'Logística', icon: ClipboardList, expandable: true },
      { label: 'Útil', icon: Wrench, expandable: true },
      { label: 'Financeiro', icon: CircleDollarSign, expandable: true, finance: true },
      { label: 'Comercial', icon: Boxes, expandable: true },
      { label: 'Frota', icon: Truck, expandable: true },
      { label: 'Fluxos', icon: Gauge, expandable: true },
    ],
  },
]

const financeItems = [
  { label: 'Grupo de Contas', icon: FolderTree },
  { label: 'Contas Financeiras', icon: WalletCards },
  { label: 'Receitas', icon: TrendingUp },
  { label: 'Despesas', icon: TrendingDown },
  { label: 'Movimentações', icon: ArrowLeftRight },
  { label: 'Conciliação Bancária', icon: Scale },
]

function NavButton({ item, collapsed = false, onClick, open, mobile = false }) {
  const Icon = item.icon
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-xl font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground',
        mobile ? 'h-12 px-3.5 text-[13px]' : 'h-10 px-3 text-[13px]',
        collapsed && 'h-11 justify-center px-0',
        item.active && 'bg-primary/10 font-semibold text-primary hover:bg-primary/12 hover:text-primary',
      )}
      aria-expanded={item.expandable ? open : undefined}
    >
      {item.active && !mobile && <span className="absolute -left-[10px] h-6 w-[3px] rounded-r-full bg-primary" />}
      <span className={cn('grid shrink-0 place-items-center', mobile && 'h-8 w-8 rounded-lg bg-muted/70 group-hover:bg-background')}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </span>
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
      {!collapsed && item.expandable && (
        <ChevronRight className={cn('h-4 w-4 shrink-0 text-muted-foreground/70 transition-transform duration-200', open && 'rotate-90')} />
      )}
    </button>
  )

  if (!collapsed) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>{item.label}</TooltipContent>
    </Tooltip>
  )
}

function FinanceMenu({ open, setOpen, activeItem, setActiveItem, collapsed = false, mobile = false, onNavigate }) {
  const financeBase = sections[1].items.find((item) => item.finance)
  const finance = { ...financeBase, active: Boolean(activeItem) }

  return (
    <Collapsible open={collapsed ? false : open}>
      <NavButton
        item={finance}
        collapsed={collapsed}
        mobile={mobile}
        open={open}
        onClick={() => setOpen(!open)}
      />

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className={cn(
          'relative mt-1 grid gap-0.5 border-l',
          mobile ? 'ml-7 pl-3' : 'ml-[18px] pl-3',
        )}>
          {financeItems.map(({ label, icon: Icon }) => {
            const active = activeItem === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setActiveItem(label)
                  onNavigate?.(label)
                }}
                className={cn(
                  'group flex w-full items-center gap-2.5 rounded-lg text-left font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  mobile ? 'h-11 px-3 text-[12px]' : 'h-9 px-2.5 text-[12px]',
                  active && 'bg-accent text-accent-foreground',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} strokeWidth={1.9} />
                <span className="truncate">{label}</span>
              </button>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function DesktopSidebar({ collapsed, onToggle, onExpand, financeOpen, setFinanceOpen, activeFinanceItem, setActiveFinanceItem, onFinanceNavigate, activePage, onHomeNavigate }) {
  const handleFinanceChange = (nextOpen) => {
    if (collapsed && nextOpen) onExpand?.()
    setFinanceOpen(nextOpen)
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden border-r bg-card transition-[width] duration-300 ease-out md:flex',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn('flex h-[72px] items-center border-b px-4', collapsed && 'justify-center px-0')}>
          {collapsed ? (
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-sky-400 text-[11px] font-black tracking-[-0.04em] text-white shadow-lg shadow-primary/20">GM</div>
          ) : (
            <Brand compact />
          )}
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-2.5 py-3" aria-label="Navegação principal">
          {sections.map((section) => (
            <div className="mb-5" key={section.title}>
              {!collapsed && (
                <div className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">
                  {section.title}
                </div>
              )}

              <div className="grid gap-1">
                {section.items.map((item) => {
                  if (item.finance) {
                    return (
                      <FinanceMenu
                        key={item.label}
                        open={financeOpen}
                        setOpen={handleFinanceChange}
                        collapsed={collapsed}
                        activeItem={activeFinanceItem}
                        setActiveItem={setActiveFinanceItem}
                        onNavigate={onFinanceNavigate}
                      />
                    )
                  }
                  const navItem = item.label === 'Início' ? { ...item, active: activePage === 'home' } : item
                  return <NavButton key={item.label} item={navItem} collapsed={collapsed} onClick={item.label === 'Início' ? onHomeNavigate : undefined} />
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t p-2.5">
          <Button
            variant="ghost"
            type="button"
            onClick={onToggle}
            className={cn('h-10 w-full justify-center gap-2 rounded-xl text-xs text-muted-foreground hover:text-foreground', collapsed && 'px-0')}
          >
            {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
            {!collapsed && <span>Recolher menu</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}

function MobileCommandCenter({ open, onOpenChange, financeOpen, setFinanceOpen, activeFinanceItem, setActiveFinanceItem, onFinanceNavigate, onHomeNavigate }) {
  const close = () => onOpenChange(false)

  const quickActions = [
    { label: 'Início', icon: Home },
    { label: 'Dashboards', icon: BarChart3 },
    { label: 'Cadastros', icon: UsersRound },
    { label: 'Módulos', icon: LayoutGrid },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="max-h-[88svh] overflow-hidden rounded-b-[30px] border-x-0 border-t-0 bg-card/95 px-0 pb-0 pt-[max(1rem,env(safe-area-inset-top))] shadow-[0_28px_90px_-26px_rgba(15,23,42,0.55)] backdrop-blur-2xl md:hidden"
      >
        <SheetTitle className="sr-only">Centro de navegação GerenteMax</SheetTitle>

        <div className="px-5 pb-4 pr-16">
          <Brand compact />
          <p className="mt-2 text-[11px] text-muted-foreground">Centro de navegação</p>
        </div>

        <div className="scrollbar-thin max-h-[calc(88svh-104px)] overflow-y-auto px-4 pb-7">
          <div className="mb-5 grid grid-cols-4 gap-2">
            {quickActions.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (label === 'Início') onHomeNavigate?.()
                  close()
                }}
                className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl border bg-background/75 px-2 py-3 text-center shadow-sm transition-all active:scale-[0.97]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="w-full truncate text-[10px] font-semibold">{label}</span>
              </button>
            ))}
          </div>

          <div className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground/70">Módulos</div>
          <div className="grid gap-1 rounded-[22px] border bg-background/60 p-2 shadow-sm">
            {sections[1].items.map((item) => {
              if (item.finance) {
                return (
                  <FinanceMenu
                    key={item.label}
                    mobile
                    open={financeOpen}
                    setOpen={setFinanceOpen}
                    activeItem={activeFinanceItem}
                    setActiveItem={setActiveFinanceItem}
                    onNavigate={(label) => {
                      onFinanceNavigate?.(label)
                      close()
                    }}
                  />
                )
              }
              return <NavButton key={item.label} item={item} mobile onClick={close} />
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/[0.06] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ReceiptText className="h-4 w-4" />
              </div>
              <div>
                <strong className="block text-xs font-semibold">Financeiro preparado para crescer</strong>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Contas financeiras poderão reunir bancos, caixas, cartões e carteiras digitais em um único cadastro.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-2 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-muted-foreground/25" />
      </SheetContent>
    </Sheet>
  )
}

export default function Sidebar({ collapsed, onToggle, onExpand, mobileOpen, onMobileOpenChange, onFinanceNavigate, activePage = 'home', onHomeNavigate }) {
  const [financeOpen, setFinanceOpen] = useState(false)
  const [activeFinanceItem, setActiveFinanceItem] = useState(null)

  const handleHomeNavigate = () => {
    setActiveFinanceItem(null)
    onHomeNavigate?.()
  }

  return (
    <>
      <DesktopSidebar
        collapsed={collapsed}
        onToggle={onToggle}
        onExpand={onExpand}
        financeOpen={financeOpen}
        setFinanceOpen={setFinanceOpen}
        activeFinanceItem={activeFinanceItem}
        setActiveFinanceItem={setActiveFinanceItem}
        onFinanceNavigate={onFinanceNavigate}
        activePage={activePage}
        onHomeNavigate={handleHomeNavigate}
      />

      <MobileCommandCenter
        open={mobileOpen}
        onOpenChange={onMobileOpenChange}
        financeOpen={financeOpen}
        setFinanceOpen={setFinanceOpen}
        activeFinanceItem={activeFinanceItem}
        setActiveFinanceItem={setActiveFinanceItem}
        onFinanceNavigate={onFinanceNavigate}
        onHomeNavigate={handleHomeNavigate}
      />
    </>
  )
}
