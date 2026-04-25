import { useState } from 'react'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

const STATUS_CYCLE = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }

export default function InitiativeItem({ initiative, onUpdate, onDelete }) {
  const [progress, setProgress] = useState(initiative.progress)

  const nudge = (delta) => {
    const next = Math.min(100, Math.max(0, progress + delta))
    setProgress(next)
    onUpdate({ progress: next })
  }

  const cycleStatus = () => onUpdate({ status: STATUS_CYCLE[initiative.status] ?? 'todo' })

  const progressColor = progress >= 70 ? 'emerald' : progress >= 40 ? 'violet' : 'amber'

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <button onClick={cycleStatus} className="mb-0.5">
            <Badge value={initiative.status} />
          </button>
          <p className="text-sm font-medium text-slate-200">{initiative.title}</p>
          {initiative.description && (
            <p className="mt-0.5 text-xs text-slate-400">{initiative.description}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 text-slate-600 transition-colors hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar value={progress} color={progressColor} />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => nudge(-10)}
            className="text-slate-500 transition-colors hover:text-slate-300"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-medium text-slate-300">{progress}%</span>
          <button
            onClick={() => nudge(10)}
            className="text-slate-500 transition-colors hover:text-slate-300"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
