import {
  Bell,
  ChevronDown,
  Maximize2,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
} from 'lucide-react'
import Brand from './Brand.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/providers/ThemeProvider'

function HeaderIcon({ label, children, onClick, className = '' }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" type="button" onClick={onClick} className={`relative h-9 w-9 rounded-xl ${className}`} aria-label={label}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}

export default function Header({ onOpenMobileMenu, title, subtitle }) {
  const { theme, setTheme } = useTheme()
  const dark = theme === 'dark'

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/90 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-card/75 md:h-[72px] md:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 md:hidden">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={onOpenMobileMenu}
          className="h-10 w-10 shrink-0 rounded-2xl border-border/80 bg-background/70 shadow-sm"
          aria-label="Abrir menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </Button>
        {title ? (
          <div className="min-w-0">
            <h1 className="truncate text-[12px] font-semibold tracking-[-0.02em] text-foreground sm:text-[13px]">{title}</h1>
            {subtitle && <p className="mt-0.5 max-w-[44vw] truncate text-[9px] text-muted-foreground sm:text-[10px]">{subtitle}</p>}
          </div>
        ) : (
          <div className="scale-[0.78] origin-left sm:scale-90">
            <Brand compact />
          </div>
        )}
      </div>

      <div className="hidden min-w-0 flex-1 items-center md:flex">
        {title && (
          <div className="min-w-0">
            <h1 className="truncate text-[13px] font-semibold tracking-[-0.02em] text-foreground lg:text-sm">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground lg:text-[11px]">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <HeaderIcon label="Buscar"><Search className="h-[18px] w-[18px]" /></HeaderIcon>
          <HeaderIcon label="Tela cheia" onClick={toggleFullscreen} className="hidden sm:inline-flex"><Maximize2 className="h-[18px] w-[18px]" /></HeaderIcon>
          <HeaderIcon label={dark ? 'Tema claro' : 'Tema escuro'} onClick={() => setTheme(dark ? 'light' : 'dark')}>
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </HeaderIcon>
          <HeaderIcon label="Mensagens" className="hidden sm:inline-flex"><MessageCircle className="h-[18px] w-[18px]" /></HeaderIcon>
          <HeaderIcon label="Notificações" className="hidden min-[420px]:inline-flex">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-card" />
          </HeaderIcon>
        </div>

        <Separator orientation="vertical" className="mx-1 hidden h-8 sm:block lg:mx-2" />

        <Button variant="ghost" className="h-11 gap-2 rounded-xl px-1.5 font-normal sm:px-2.5 md:h-12">
          <Avatar className="h-8 w-8 md:h-9 md:w-9">
            <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary md:text-xs">SE</AvatarFallback>
          </Avatar>
          <span className="hidden min-w-[98px] text-left lg:grid">
            <strong className="text-xs font-semibold leading-4">Service</strong>
            <span className="text-[10px] leading-4 text-muted-foreground">Administrador</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
        </Button>
      </div>
    </header>
  )
}
