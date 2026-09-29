import { cn } from '@/lib/utils'

export default function Brand({ compact = false }) {
  return (
    <div className={cn('inline-flex flex-col', compact ? 'items-start' : 'items-center')}>
      <div className={cn('relative flex items-start italic font-black tracking-[-0.07em] leading-[0.9]', compact ? 'text-[23px]' : 'text-[clamp(52px,6vw,80px)]')}>
        <span className="text-slate-950 dark:text-white">Gerente</span>
        <span className="text-[#0d67b9] dark:text-[#5baaff]">Max</span>
        <span className={cn('ml-2 not-italic font-medium tracking-normal text-muted-foreground', compact ? 'text-[7px]' : 'text-xs')}>®</span>
      </div>
      <span className={cn('font-semibold uppercase text-zinc-500 dark:text-zinc-400', compact ? 'mt-0.5 text-[6px] tracking-[0.34em]' : 'mt-2 text-[clamp(15px,1.5vw,22px)] tracking-[0.36em] translate-x-[0.16em]')}>
        Softwares
      </span>
    </div>
  )
}
