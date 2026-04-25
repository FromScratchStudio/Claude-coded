import clsx from 'clsx'
import Card from '../ui/Card'

const ICON_COLORS = {
  violet:  'text-violet-400 bg-violet-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  amber:   'text-amber-400 bg-amber-500/10',
  blue:    'text-blue-400 bg-blue-500/10',
}

export default function MetricCard({ label, value, sub, icon: Icon, color = 'violet' }) {
  const iconCls = ICON_COLORS[color]

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-100">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
        </div>
        {Icon && (
          <div className={clsx('rounded-lg p-2.5', iconCls.split(' ')[1])}>
            <Icon className={clsx('h-5 w-5', iconCls.split(' ')[0])} />
          </div>
        )}
      </div>
    </Card>
  )
}
