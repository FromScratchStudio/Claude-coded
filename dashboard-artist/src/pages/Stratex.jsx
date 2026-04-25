import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import useStratexStore from '../store/useStratexStore'
import ObjectiveCard from '../components/stratex/ObjectiveCard'
import ObjectiveForm from '../components/stratex/ObjectiveForm'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

export default function Stratex() {
  const {
    objectives,
    addObjective,
    updateObjective,
    deleteObjective,
    addInitiative,
    updateInitiative,
    deleteInitiative,
  } = useStratexStore()

  const [showForm, setShowForm] = useState(false)

  const active = objectives.filter((o) => o.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {active} objectif{active !== 1 ? 's' : ''} actif{active !== 1 ? 's' : ''}
          {objectives.length > active && ` · ${objectives.length - active} pausé${objectives.length - active !== 1 ? 's' : ''}`}
        </p>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nouvel objectif
        </Button>
      </div>

      {objectives.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Aucun objectif stratégique"
          description="Définissez vos grandes orientations artistiques et associez-y des initiatives concrètes."
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Premier objectif
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {objectives.map((o) => (
            <ObjectiveCard
              key={o.id}
              objective={o}
              onUpdateObjective={(data) => updateObjective(o.id, data)}
              onDeleteObjective={() => deleteObjective(o.id)}
              onAddInitiative={(data) => addInitiative(o.id, data)}
              onUpdateInitiative={(iid, data) => updateInitiative(o.id, iid, data)}
              onDeleteInitiative={(iid) => deleteInitiative(o.id, iid)}
            />
          ))}
        </div>
      )}

      <ObjectiveForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => { addObjective(data); setShowForm(false) }}
      />
    </div>
  )
}
