import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import { computeObjectiveProgress } from '../../utils/metrics'

export default function StratexSummary({ objectives }) {
  const active = objectives.filter((o) => o.status === 'active').slice(0, 4)

  const progressColor = (v) => (v >= 70 ? 'emerald' : v >= 40 ? 'violet' : 'amber')

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">Objectifs stratégiques</p>
        <Link
          to="/stratex"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          Voir tout <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {active.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Aucun objectif actif</p>
      ) : (
        <div className="space-y-4">
          {active.map((o) => {
            const progress = computeObjectiveProgress(o)
            return (
              <div key={o.id}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-200">{o.title}</p>
                  <span className="shrink-0 text-xs font-medium text-slate-400">{progress}%</span>
                </div>
                <ProgressBar value={progress} color={progressColor(progress)} />
                <p className="mt-0.5 text-xs text-slate-500">
                  {o.initiatives.length} initiative{o.initiatives.length !== 1 ? 's' : ''}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
