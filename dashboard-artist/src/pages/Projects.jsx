import { useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
import useProjectStore from '../store/useProjectStore'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectForm from '../components/projects/ProjectForm'
import ProjectFilters from '../components/projects/ProjectFilters'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const applyFilters = (projects, { search, status, category, sort }) => {
  let result = projects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.description?.toLowerCase().includes(search.toLowerCase())) return false
    if (status && p.status !== status) return false
    if (category && p.category !== category) return false
    return true
  })

  result = [...result].sort((a, b) => {
    if (sort === 'title')    return a.title.localeCompare(b.title)
    if (sort === 'priority') return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
    if (sort === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return new Date(b[sort]) - new Date(a[sort])
  })

  return result
}

export default function Projects() {
  const { projects, addProject } = useProjectStore()
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ search: '', status: '', category: '', sort: 'updatedAt' })

  const filtered = applyFilters(projects, filters)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ProjectFilters filters={filters} onChange={setFilters} />
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Aucun projet trouvé"
          description={
            projects.length === 0
              ? 'Créez votre premier projet créatif.'
              : 'Aucun résultat pour ces filtres.'
          }
          action={
            projects.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                Créer un projet
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      <ProjectForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => { addProject(data); setShowForm(false) }}
      />
    </div>
  )
}
