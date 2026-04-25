import clsx from 'clsx'

const COLORS = {
  violet:  'bg-violet-500',
  emerald: 'bg-emerald-500',
  amber:   'bg-amber-500',
  red:     'bg-red-500',
}

export default function ProgressBar({ value = 0, color = 'violet', className }) {
  return (
    <div className={clsx('h-1.5 w-full rounded-full bg-slate-700', className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500', COLORS[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
