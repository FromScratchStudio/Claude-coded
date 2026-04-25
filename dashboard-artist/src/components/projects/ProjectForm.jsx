import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const STATUS_OPTIONS = [
  { value: 'idea',        label: 'Idée'          },
  { value: 'planning',    label: 'Planification'  },
  { value: 'in-progress', label: 'En cours'       },
  { value: 'review',      label: 'Révision'       },
  { value: 'completed',   label: 'Terminé'        },
  { value: 'archived',    label: 'Archivé'        },
]

const CATEGORY_OPTIONS = [
  { value: 'music',       label: 'Musique'       },
  { value: 'visual',      label: 'Arts visuels'  },
  { value: 'writing',     label: 'Écriture'      },
  { value: 'video',       label: 'Vidéo'         },
  { value: 'performance', label: 'Performance'   },
  { value: 'other',       label: 'Autre'         },
]

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Basse'   },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high',   label: 'Haute'   },
]

const DEFAULTS = {
  title: '', description: '', status: 'idea',
  category: 'other', priority: 'medium', dueDate: '', tags: '', notes: '',
}

const toForm = (project) => ({
  ...project,
  tags:    project.tags?.join(', ') ?? '',
  dueDate: project.dueDate ? project.dueDate.slice(0, 10) : '',
})

const fromForm = (form) => ({
  ...form,
  tags:    form.tags.split(',').map((t) => t.trim()).filter(Boolean),
  dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
})

export default function ProjectForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(initial ? toForm(initial) : DEFAULTS)
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(fromForm(form))
    if (!initial) setForm(DEFAULTS)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier le projet' : 'Nouveau projet'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre *"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Nom du projet"
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Décrivez le projet..."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Select label="Statut"    options={STATUS_OPTIONS}   value={form.status}    onChange={(e) => set('status', e.target.value)} />
          <Select label="Catégorie" options={CATEGORY_OPTIONS} value={form.category}  onChange={(e) => set('category', e.target.value)} />
          <Select label="Priorité"  options={PRIORITY_OPTIONS} value={form.priority}  onChange={(e) => set('priority', e.target.value)} />
        </div>

        <Input
          label="Échéance"
          type="date"
          value={form.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
        />

        <Input
          label="Tags (séparés par des virgules)"
          value={form.tags}
          onChange={(e) => set('tags', e.target.value)}
          placeholder="album, studio, live"
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">Notes privées</label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Notes..."
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit" disabled={!form.title.trim()}>
            {initial ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
