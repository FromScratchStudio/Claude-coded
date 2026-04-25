import { Search } from 'lucide-react'
import Select from '../ui/Select'

const STATUS_OPTIONS = [
  { value: '', label: 'Tous statuts' },
  { value: 'idea', label: 'Idée' },
  { value: 'planning', label: 'Planification' },
  { value: 'in-progress', label: 'En cours' },
  { value: 'review', label: 'Révision' },
  { value: 'completed', label: 'Terminé' },
  { value: 'archived', label: 'Archivé' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'Toutes catégories' },
  { value: 'music', label: 'Musique' },
  { value: 'visual', label: 'Arts visuels' },
  { value: 'writing', label: 'Écriture' },
  { value: 'video', label: 'Vidéo' },
  { value: 'performance', label: 'Performance' },
  { value: 'other', label: 'Autre' },
]

const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Récemment modifié' },
  { value: 'createdAt', label: 'Date de création' },
  { value: 'dueDate', label: 'Échéance' },
  { value: 'title', label: 'Titre A–Z' },
  { value: 'priority', label: 'Priorité' },
]

export default function ProjectFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="w-44 rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <Select
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(e) => set('status', e.target.value)}
      />
      <Select
        options={CATEGORY_OPTIONS}
        value={filters.category}
        onChange={(e) => set('category', e.target.value)}
      />
      <Select
        options={SORT_OPTIONS}
        value={filters.sort}
        onChange={(e) => set('sort', e.target.value)}
      />
    </div>
  )
}
