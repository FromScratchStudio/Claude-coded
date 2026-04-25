import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { computeProjectProgress } from '../../utils/metrics'
import { fromNow } from '../../utils/date'

export default function RecentProjects({ projects }) {
  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">Projets récents</p>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          Voir tout <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Aucun projet</p>
      ) : (
        <div className="space-y-4">
          {recent.map((p) => {
            const progress = computeProjectProgress(p)
            return (
              <Link key={p.id} to={`/projects/${p.id}`} className="block group">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-200 group-hover:text-violet-300 transition-colors">
                    {p.title}
                  </p>
                  <Badge value={p.status} />
                </div>
                <ProgressBar value={progress} className="mb-1" />
                <p className="text-xs text-slate-500">{fromNow(p.updatedAt)}</p>
              </Link>
            )
          })}
        </div>
      )}
    </Card>
  )
}
