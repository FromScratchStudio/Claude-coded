import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import useProjectStore from '../store/useProjectStore'
import TaskList from '../components/projects/TaskList'
import ProjectForm from '../components/projects/ProjectForm'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { computeProjectProgress } from '../utils/metrics'
import { formatDate, fromNow, isOverdue } from '../utils/date'
import clsx from 'clsx'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, updateProject, deleteProject, addTask, toggleTask, deleteTask } = useProjectStore()
  const [editing, setEditing] = useState(false)

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-slate-500">Projet introuvable.</p>
        <Link to="/projects" className="text-violet-400 hover:text-violet-300">
          ← Retour aux projets
        </Link>
      </div>
    )
  }

  const progress = computeProjectProgress(project)
  const overdue  = isOverdue(project.dueDate) && project.status !== 'completed'

  const handleDelete = () => {
    if (!window.confirm('Supprimer ce projet définitivement ?')) return
    deleteProject(id)
    navigate('/projects')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Projets
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <Edit2 className="h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-100">{project.title}</h2>
          <div className="flex shrink-0 gap-2">
            <Badge value={project.priority} />
            <Badge value={project.status} />
          </div>
        </div>

        {project.description && (
          <p className="mb-4 text-sm text-slate-400">{project.description}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge value={project.category} />
          {project.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-300">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-slate-500">Progression</span>
          <span className="text-xs font-medium text-slate-300">{progress}%</span>
        </div>
        <ProgressBar value={progress} className="mb-4" />

        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          {project.dueDate && (
            <span className={clsx(overdue && 'text-red-400')}>
              Échéance : {formatDate(project.dueDate)}{overdue ? ' (en retard)' : ''}
            </span>
          )}
          <span>Créé {fromNow(project.createdAt)}</span>
          <span>Modifié {fromNow(project.updatedAt)}</span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">
          Tâches ({project.tasks.filter((t) => t.completed).length}/{project.tasks.length})
        </h3>
        <TaskList
          tasks={project.tasks}
          onAdd={(title) => addTask(id, title)}
          onToggle={(taskId) => toggleTask(id, taskId)}
          onDelete={(taskId) => deleteTask(id, taskId)}
        />
      </Card>

      {project.notes && (
        <Card className="p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Notes</h3>
          <p className="whitespace-pre-wrap text-sm text-slate-400">{project.notes}</p>
        </Card>
      )}

      <ProjectForm
        open={editing}
        onClose={() => setEditing(false)}
        initial={project}
        onSubmit={(data) => { updateProject(id, data); setEditing(false) }}
      />
    </div>
  )
}
