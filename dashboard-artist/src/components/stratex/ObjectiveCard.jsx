import { useState } from 'react'
import { Target, Trash2, Plus } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import InitiativeItem from './InitiativeItem'
import Button from '../ui/Button'
import { computeObjectiveProgress } from '../../utils/metrics'

const TIMEFRAME_LABELS = { Q1: 'T1', Q2: 'T2', Q3: 'T3', Q4: 'T4', annual: 'Annuel' }

export default function ObjectiveCard({
  objective,
  onUpdateObjective,
  onDeleteObjective,
  onAddInitiative,
  onUpdateInitiative,
  onDeleteInitiative,
}) {
  const [addingInit, setAddingInit] = useState(false)
  const [initTitle, setInitTitle] = useState('')

  const progress = computeObjectiveProgress(objective)
  const progressColor = progress >= 70 ? 'emerald' : progress >= 40 ? 'violet' : 'amber'

  const handleAddInit = () => {
    const trimmed = initTitle.trim()
    if (!trimmed) return
    onAddInitiative({ title: trimmed, description: '', status: 'todo' })
    setInitTitle('')
    setAddingInit(false)
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Target className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-100">{objective.title}</h3>
            {objective.description && (
              <p className="mt-0.5 text-xs text-slate-400">{objective.description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-slate-500">
            {TIMEFRAME_LABELS[objective.timeframe]} {objective.year}
          </span>
          <Badge value={objective.status} />
          <button
            onClick={onDeleteObjective}
            className="text-slate-600 transition-colors hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-slate-500">Progression globale</span>
          <span className="text-xs font-medium text-slate-300">{progress}%</span>
        </div>
        <ProgressBar value={progress} color={progressColor} />
      </div>

      {objective.initiatives.length > 0 && (
        <div className="mb-3 space-y-2">
          {objective.initiatives.map((init) => (
            <InitiativeItem
              key={init.id}
              initiative={init}
              onUpdate={(data) => onUpdateInitiative(init.id, data)}
              onDelete={() => onDeleteInitiative(init.id)}
            />
          ))}
        </div>
      )}

      {addingInit ? (
        <div className="flex gap-2">
          <input
            value={initTitle}
            onChange={(e) => setInitTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddInit()
              if (e.key === 'Escape') { setAddingInit(false); setInitTitle('') }
            }}
            placeholder="Titre de l'initiative..."
            autoFocus
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <Button size="sm" onClick={handleAddInit} disabled={!initTitle.trim()}>
            Ajouter
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setAddingInit(false); setInitTitle('') }}
          >
            ✕
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setAddingInit(true)}
          className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-violet-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter une initiative
        </button>
      )}
    </Card>
  )
}
