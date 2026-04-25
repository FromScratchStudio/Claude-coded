import { Link } from 'react-router-dom'
import { Calendar, CheckSquare } from 'lucide-react'
import clsx from 'clsx'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { computeProjectProgress } from '../../utils/metrics'
import { formatDate, isOverdue } from '../../utils/date'

export default function ProjectCard({ project }) {
  const progress = computeProjectProgress(project)
  const overdue = isOverdue(project.dueDate) && project.status !== 'completed'
  const doneTasks = project.tasks?.filter((t) => t.completed).length ?? 0
  const totalTasks = project.tasks?.length ?? 0

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="group p-4 transition-all hover:border-slate-600 hover:shadow-lg hover:shadow-violet-500/5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-100 transition-colors group-hover:text-violet-300">
            {project.title}
          </h3>
          <Badge value={project.priority} />
        </div>

        {project.description && (
          <p className="mb-3 line-clamp-2 text-xs text-slate-400">{project.description}</p>
        )}

        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge value={project.status} />
          <Badge value={project.category} />
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-slate-500">Progression</span>
            <span className="text-xs font-medium text-slate-300">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          {totalTasks > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              {doneTasks}/{totalTasks}
            </span>
          )}
          {project.dueDate && (
            <span className={clsx('flex items-center gap-1', overdue && 'text-red-400')}>
              <Calendar className="h-3 w-3" />
              {formatDate(project.dueDate)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  )
}
