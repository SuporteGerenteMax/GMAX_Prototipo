import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BadgeDollarSign,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  CreditCard,
  FileText,
  Landmark,
  Link2,
  ListChecks,
  NotebookPen,
  Save,
  ShieldCheck,
  UserRound,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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

const institutionOptions = [
  { value: 'others', label: 'Outros', detail: 'Caixa, carteira ou instituição não listada', logo: othersLogo, featured: true, kind: 'other' },
  { value: 'sicredi', label: 'Sicredi', detail: 'Cooperativa financeira', logo: sicrediLogo, kind: 'bank' },
  { value: 'sicoob', label: 'Sicoob', detail: 'Cooperativa financeira', logo: sicoobLogo, kind: 'bank' },
  { value: 'caixa', label: 'Caixa', detail: 'Banco público', logo: caixaLogo, kind: 'bank' },
  { value: 'nubank', label: 'Nubank', detail: 'Conta digital / fintech', logo: nubankLogo, kind: 'bank' },
  { value: 'bb', label: 'Banco do Brasil', detail: 'Banco tradicional', logo: bbLogo, kind: 'bank' },
  { value: 'inter', label: 'Inter', detail: 'Banco digital', logo: interLogo, kind: 'bank' },
  { value: 'bradesco', label: 'Bradesco', detail: 'Banco tradicional', logo: bradescoLogo, kind: 'bank' },
  { value: 'itau', label: 'Itaú', detail: 'Banco tradicional', logo: itauLogo, kind: 'bank' },
  { value: 'santander', label: 'Santander', detail: 'Banco tradicional', logo: santanderLogo, kind: 'bank' },
  { value: 'picpay', label: 'PicPay', detail: 'Instituição de pagamento', logo: picpayLogo, kind: 'bank' },
]

const accountTypeOptions = [
  { value: 'Conta Corrente', detail: 'Conta bancária tradicional', color: '#2563EB' },
  { value: 'Conta Poupança', detail: 'Conta de poupança', color: '#0EA5E9' },
  { value: 'Conta Digital', detail: 'Nubank, Inter, Mercado Pago etc.', color: '#8B5CF6' },
  { value: 'Conta de Pagamento', detail: 'Instituições de pagamento / fintechs', color: '#10B981' },
  { value: 'Caixa', detail: 'Dinheiro físico da empresa', color: '#F59E0B' },
  { value: 'Carteira', detail: 'Valores em posse de funcionário/responsável', color: '#EC4899' },
  { value: 'Cartão de Crédito', detail: 'Controle de cartão e fatura', color: '#F97316' },
  { value: 'Cartão de Débito', detail: 'Vinculado a uma conta bancária', color: '#06B6D4' },
  { value: 'Cartão Pré-pago', detail: 'Saldo carregado antecipadamente', color: '#A855F7' },
  { value: 'Investimento / Aplicação', detail: 'CDB, fundos, aplicações', color: '#14B8A6' },
  { value: 'Conta Salário', detail: 'Pagamento de funcionários', color: '#3B82F6' },
  { value: 'Conta Garantia', detail: 'Valores bloqueados ou caucionados', color: '#64748B' },
  { value: 'Empréstimo / Financiamento', detail: 'Controle de saldo devedor', color: '#DC2626' },
  { value: 'Outros', detail: 'Casos que não se enquadram nos anteriores', color: '#6B7280' },
]

const restrictedOtherInstitutionTypes = ['Caixa', 'Carteira', 'Outros']

const companyOptions = ['GerenteMax Softwares', 'GerenteMax Obras', 'GerenteMax Transportes', 'Fazenda Modelo', 'Filial Barreiras']
const personOptions = ['Leonardo Ladeia', 'Tatiana Alves', 'Financeiro Matriz', 'Controladoria', 'Tesouraria']
const groupOptions = [
  'Operacional',
  'Administrativo',
  'Vendas',
  'Frota',
  'Obras',
  'Agrícola',
  'Folha de Pagamento',
  'Impostos',
  'Investimentos',
  'Reservas',
  'Cartões Corporativos',
]

const bankingTypes = new Set([
  'Conta Corrente',
  'Conta Poupança',
  'Conta Digital',
  'Conta de Pagamento',
  'Conta Salário',
  'Conta Garantia',
  'Investimento / Aplicação',
  'Empréstimo / Financiamento',
])

const defaultForm = {
  description: '',
  type: 'Conta Corrente',
  agency: '',
  number: '',
  favored: '',
  cpfCnpj: '',
  company: '',
  person: '',
  group: '',
  bank: '',
  initialBalanceDate: '',
  initialBalance: '',
  accountLimit: '',
  note: '',
}

const tabs = [
  { key: 'geral', icon: FileText, title: 'Geral', subtitle: 'Todos os dados' },
  { key: 'principal', icon: Wallet, title: 'Principal', subtitle: 'Dados bancários' },
  { key: 'vinculos', icon: Link2, title: 'Vínculos', subtitle: 'Empresa e pessoas' },
  { key: 'financeiro', icon: BadgeDollarSign, title: 'Financeiro', subtitle: 'Saldo e limites' },
  { key: 'observacao', icon: NotebookPen, title: 'Observação', subtitle: 'Notas adicionais' },
]

function SectionCard({ icon: Icon, title, subtitle, right, children }) {
  return (
    <section className="overflow-visible rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-col gap-2.5 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {right}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

function Field({ label, required = false, help, icon: Icon, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-foreground">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        {children}
      </div>
      {help && <span className="block text-[11px] text-muted-foreground">{help}</span>}
    </label>
  )
}

function BaseInput({ className = '', icon = false, ...props }) {
  return (
    <input
      {...props}
      className={cn(
        'h-12 w-full rounded-xl border border-input bg-white px-3 text-[13px] text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/15 dark:bg-background',
        icon && 'pl-10',
        className,
      )}
    />
  )
}

function BaseSelect({ options, className = '', icon = false, placeholder = 'Selecione', ...props }) {
  return (
    <select
      {...props}
      className={cn(
        'h-12 w-full rounded-xl border border-input bg-white px-3 text-[13px] text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/15 dark:bg-background',
        icon && 'pl-10',
        className,
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : (option.label || option.value)
        return <option key={value} value={value}>{label}</option>
      })}
    </select>
  )
}

function TabButton({ active, icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all',
        active
          ? 'border-primary/25 bg-primary/[0.05] shadow-sm'
          : 'bg-card hover:border-primary/15 hover:bg-muted/35',
      )}
    >
      <div className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-xl', active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <strong className={cn('block text-[12px] leading-4', active ? 'text-primary' : 'text-foreground')}>{title}</strong>
        <span className="mt-0.5 block truncate text-[10px] leading-4 text-muted-foreground">{subtitle}</span>
      </div>
    </button>
  )
}

function SummaryRow({ label, value, strong = false, tone = 'default' }) {
  return (
    <div className="flex items-start justify-between gap-3 text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-right', strong ? 'font-semibold' : 'font-medium', tone === 'positive' && 'text-primary', tone === 'negative' && 'text-rose-600 dark:text-rose-400', tone === 'muted' && 'text-muted-foreground')}>
        {value || '—'}
      </span>
    </div>
  )
}

function InstitutionBadge({ option, small = false }) {
  if (!option) return null

  if (option.logo) {
    return (
      <div className={cn('grid shrink-0 place-items-center overflow-hidden rounded-xl border bg-white shadow-sm', small ? 'h-8 w-8' : 'h-10 w-10')}>
        <img src={option.logo} alt={option.label} className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className={cn('grid shrink-0 place-items-center rounded-xl border bg-primary/10 text-primary', small ? 'h-8 w-8' : 'h-10 w-10')}>
      <Landmark className={cn(small ? 'h-4 w-4' : 'h-[18px] w-[18px]')} />
    </div>
  )
}

function InstitutionSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const selected = useMemo(() => institutionOptions.find((option) => option.value === value), [value])
  const featured = institutionOptions.find((option) => option.featured)
  const regular = institutionOptions.filter((option) => !option.featured)

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-white px-3 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background',
          open && 'border-primary/30 ring-2 ring-primary/10',
        )}
      >
        {selected ? <InstitutionBadge option={selected} small /> : <Landmark className="h-4 w-4 shrink-0 text-muted-foreground" />}
        <div className="min-w-0 flex-1">
          <span className={cn('block truncate text-[13px] font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>
            {selected ? selected.label : 'Selecione a instituição'}
          </span>
        </div>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border bg-popover shadow-xl">
          <div className="max-h-[320px] overflow-y-auto p-2">
            {featured && (
              <button
                type="button"
                onClick={() => {
                  onChange(featured.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/70',
                  value === featured.value && 'bg-primary/[0.06]',
                )}
              >
                <InstitutionBadge option={featured} small />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-foreground">{featured.label}</span>
                </div>
                {value === featured.value && <Check className="h-4 w-4 text-primary" />}
              </button>
            )}

            <div className="my-2 flex items-center gap-2 px-2.5">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Instituições</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-1">
              {regular.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/70',
                    value === option.value && 'bg-primary/[0.06]',
                  )}
                >
                  <InstitutionBadge option={option} small />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-foreground">{option.label}</span>
                  </div>
                  {value === option.value && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TypeIndicator({ color }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
}

function TypeSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-white px-3 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/15 dark:bg-background',
          open && 'border-primary/30 ring-2 ring-primary/10',
        )}
      >
        {selected ? <TypeIndicator color={selected.color} /> : <span className="inline-block h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />}
        <div className="min-w-0 flex-1">
          <span className={cn('block truncate text-[13px] font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>
            {selected ? selected.value : 'Selecione o tipo'}
          </span>
        </div>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border bg-popover shadow-xl">
          <div className="max-h-[320px] overflow-y-auto p-2">
            <div className="grid gap-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/70',
                    value === option.value && 'bg-primary/[0.06]',
                  )}
                >
                  <TypeIndicator color={option.color} />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-foreground">{option.value}</span>
                  </div>
                  {value === option.value && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const formatCurrency = (value) => {
  const numeric = Number(String(value).replace(/\./g, '').replace(',', '.'))
  if (!Number.isFinite(numeric)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numeric)
}

export default function AddFinancialAccountPage({ onCancel, onSave }) {
  const [form, setForm] = useState(defaultForm)
  const [activeTab, setActiveTab] = useState('geral')

  const filteredAccountTypeOptions = useMemo(() => {
    if (form.bank === 'others') {
      return accountTypeOptions.filter((option) => restrictedOtherInstitutionTypes.includes(option.value))
    }
    return accountTypeOptions
  }, [form.bank])

  const selectedInstitution = useMemo(() => institutionOptions.find((option) => option.value === form.bank), [form.bank])
  const institutionIsBank = selectedInstitution?.kind === 'bank'
  const showBankingFields = institutionIsBank && bankingTypes.has(form.type)
  const balanceNumber = Number(String(form.initialBalance).replace(/\./g, '').replace(',', '.'))
  const balanceTone = !form.initialBalance || Number.isNaN(balanceNumber)
    ? 'muted'
    : balanceNumber > 0
      ? 'positive'
      : balanceNumber < 0
        ? 'negative'
        : 'muted'

  useEffect(() => {
    if (!filteredAccountTypeOptions.some((option) => option.value === form.type)) {
      setForm((current) => ({ ...current, type: filteredAccountTypeOptions[0]?.value || '' }))
    }
  }, [filteredAccountTypeOptions, form.type])

  const updateField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value }

      if (key === 'bank' && value !== current.bank) {
        next.agency = ''
        next.number = ''
        next.favored = ''
        next.cpfCnpj = ''
      }

      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Financeiro</span>
        <span>/</span>
        <span>Contas Financeiras</span>
        <span>/</span>
        <span className="font-semibold text-foreground">Nova conta</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <section className="grid gap-2 rounded-2xl border bg-card p-2.5 shadow-sm sm:grid-cols-2 xl:grid-cols-5">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                icon={tab.icon}
                title={tab.title}
                subtitle={tab.subtitle}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </section>

          {(activeTab === 'geral' || activeTab === 'principal') && (
            <SectionCard
              icon={Wallet}
              title="Principal"
              subtitle="Informações principais e dados bancários da conta."
              right={<div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-medium text-rose-600 dark:text-rose-400"><CircleAlert className="h-3 w-3" /> Campos obrigatórios</div>}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Descrição" required help="Nome que identificará a conta no sistema." icon={FileText}>
                  <BaseInput icon value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Ex: Sicredi Franco" />
                </Field>

                <Field label="Instituição" required help="Selecione a instituição.">
                  <InstitutionSelect value={form.bank} onChange={(value) => updateField('bank', value)} />
                </Field>

                <Field label="Tipo de conta" required help={form.bank === 'others' ? 'Para “Outros”, ficam disponíveis apenas Caixa, Carteira e Outros.' : 'Selecione o tipo da conta.'}>
                  <TypeSelect value={form.type} onChange={(value) => updateField('type', value)} options={filteredAccountTypeOptions} />
                </Field>

                {showBankingFields && (
                  <>
                    <Field label="Agência" help="Número da agência, se aplicável." icon={Landmark}>
                      <BaseInput icon value={form.agency} onChange={(e) => updateField('agency', e.target.value)} placeholder="Ex: 1234" />
                    </Field>

                    <Field label="Número" required help="Número da conta com dígito, se houver." icon={ListChecks}>
                      <BaseInput icon value={form.number} onChange={(e) => updateField('number', e.target.value)} placeholder="Ex: 56789-0" />
                    </Field>

                    <Field label="Favorecido" required help="Nome do titular da conta." icon={UserRound}>
                      <BaseInput icon value={form.favored} onChange={(e) => updateField('favored', e.target.value)} placeholder="Ex: Franco Azevedo" />
                    </Field>

                    <Field label="CPF/CNPJ" required help="CPF ou CNPJ do titular." icon={ShieldCheck}>
                      <BaseInput icon value={form.cpfCnpj} onChange={(e) => updateField('cpfCnpj', e.target.value)} placeholder="000.000.000-00" />
                    </Field>
                  </>
                )}
              </div>
            </SectionCard>
          )}

          {(activeTab === 'geral' || activeTab === 'vinculos') && (
            <SectionCard icon={Link2} title="Vínculos" subtitle="Relacione a conta à empresa, pessoa e grupo financeiro.">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Empresa" required help="Empresa proprietária da conta." icon={Building2}>
                  <BaseSelect icon value={form.company} onChange={(e) => updateField('company', e.target.value)} options={companyOptions} />
                </Field>

                <Field label="Pessoa" help="Pessoa vinculada (titular/responsável)." icon={UserRound}>
                  <BaseSelect icon value={form.person} onChange={(e) => updateField('person', e.target.value)} options={personOptions} />
                </Field>

                <Field label="Grupo da conta" required help="Grupo para classificação da conta." icon={Link2}>
                  <BaseSelect icon value={form.group} onChange={(e) => updateField('group', e.target.value)} options={groupOptions} />
                </Field>
              </div>
            </SectionCard>
          )}

          {(activeTab === 'geral' || activeTab === 'financeiro') && (
            <SectionCard icon={BadgeDollarSign} title="Financeiro" subtitle="Defina o saldo inicial e o limite da conta.">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Data do saldo inicial" required help="Data de referência do saldo inicial." icon={CalendarDays}>
                  <BaseInput icon type="date" value={form.initialBalanceDate} onChange={(e) => updateField('initialBalanceDate', e.target.value)} />
                </Field>

                <Field label="Saldo inicial" help="Saldo disponível em conta nesta data." icon={BadgeDollarSign}>
                  <BaseInput icon value={form.initialBalance} onChange={(e) => updateField('initialBalance', e.target.value)} placeholder="0,00" />
                </Field>

                <Field label="Limite da conta" help="Limite de utilização da conta (opcional)." icon={CreditCard}>
                  <BaseInput icon value={form.accountLimit} onChange={(e) => updateField('accountLimit', e.target.value)} placeholder="0,00" />
                </Field>
              </div>
            </SectionCard>
          )}

          {(activeTab === 'geral' || activeTab === 'observacao') && (
            <SectionCard icon={NotebookPen} title="Observação" subtitle="Adicione informações complementares, se necessário.">
              <div className="space-y-1.5">
                <textarea
                  value={form.note}
                  onChange={(e) => updateField('note', e.target.value.slice(0, 1000))}
                  placeholder="Digite observações sobre a conta..."
                  className="min-h-[126px] w-full rounded-2xl border border-input bg-white px-4 py-3 text-[13px] text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/15 dark:bg-background"
                />
                <div className="text-right text-[11px] text-muted-foreground">{form.note.length}/1000</div>
              </div>
            </SectionCard>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[88px] xl:self-start">
          <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.03em] text-foreground">Resumo da conta</h2>
                <p className="mt-1 text-[12px] text-muted-foreground">Confira as informações antes de salvar.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <SummaryRow label="Descrição" value={form.description} strong />
              <SummaryRow label="Instituição" value={selectedInstitution?.label} />
              <SummaryRow label="Tipo de conta" value={form.type} />
              {showBankingFields && <SummaryRow label="Agência" value={form.agency} />}
              {showBankingFields && <SummaryRow label="Número" value={form.number} />}
              {showBankingFields && <SummaryRow label="Favorecido" value={form.favored} />}
              {showBankingFields && <SummaryRow label="CPF/CNPJ" value={form.cpfCnpj} />}
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="space-y-3">
              <SummaryRow label="Empresa" value={form.company} />
              <SummaryRow label="Pessoa" value={form.person} />
              <SummaryRow label="Grupo de conta" value={form.group} />
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="space-y-3">
              <SummaryRow label="Data do saldo inicial" value={form.initialBalanceDate} />
              <SummaryRow label="Saldo inicial" value={form.initialBalance ? formatCurrency(form.initialBalance) : 'R$ 0,00'} strong tone={balanceTone} />
              <SummaryRow label="Limite da conta" value={form.accountLimit ? formatCurrency(form.accountLimit) : 'R$ 0,00'} strong />
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <CircleAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[20px] font-bold tracking-[-0.03em] text-foreground">Dicas importantes</h3>
                <p className="mt-1 text-[12px] text-muted-foreground">Boas práticas para um cadastro eficiente.</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-[12px] text-muted-foreground">
              <li className="flex gap-2"><span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary" />Use uma descrição clara e padronizada.</li>
              <li className="flex gap-2"><span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary" />Escolha a instituição correta para facilitar a identificação visual da conta.</li>
              <li className="flex gap-2"><span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary" />Selecione o tipo correto para mostrar somente os campos necessários.</li>
              <li className="flex gap-2"><span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary" />Vincule a conta à empresa e ao grupo financeiro adequado.</li>
              <li className="flex gap-2"><span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary" />Mantenha o saldo inicial atualizado para relatórios mais precisos.</li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-2 gap-2.5">
              <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="button" className="h-12 rounded-xl shadow-sm shadow-primary/20" onClick={() => onSave?.(form)}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
