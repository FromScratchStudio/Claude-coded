import { FolderOpen, CheckSquare, Target, TrendingUp } from 'lucide-react'
import useProjectStore from '../store/useProjectStore'
import useStratexStore from '../store/useStratexStore'
import MetricCard from '../components/dashboard/MetricCard'
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart'
import RecentProjects from '../components/dashboard/RecentProjects'
import StratexSummary from '../components/dashboard/StratexSummary'
import { computeProjectProgress } from '../utils/metrics'
import Button from '../components/ui/Button'
import { Sparkles } from 'lucide-react'

export default function Dashboard() {
  const projects   = useProjectStore((s) => s.projects)
  const objectives = useStratexStore((s) => s.objectives)
  const loadDemoProjects = useProjectStore((s) => s.loadDemoData)
  const loadDemoStratex  = useStratexStore((s) => s.loadDemoData)

  const active           = projects.filter((p) => p.status === 'in-progress').length
  const completed        = projects.filter((p) => p.status === 'completed').length
  const avgProgress      = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + computeProjectProgress(p), 0) / projects.length)
    : 0
  const activeObjectives = objectives.filter((o) => o.status === 'active').length

  const isEmpty = projects.length === 0 && objectives.length === 0

  return (
    <div className="space-y-6">
      {isEmpty && (
        <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/5 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-violet-300">Bienvenue dans Dashboard Artist</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Chargez les données de démo pour explorer toutes les fonctionnalités.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { loadDemoProjects(); loadDemoStratex() }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Charger la démo
          </Button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Projets totaux"
          value={projects.length}
          sub={`${active} en cours`}
          icon={FolderOpen}
          color="violet"
        />
        <MetricCard
          label="Terminés"
          value={completed}
          sub="projets complétés"
          icon={CheckSquare}
          color="emerald"
        />
        <MetricCard
          label="Progression moy."
          value={`${avgProgress}%`}
          sub="tous projets"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          label="Objectifs actifs"
          value={activeObjectives}
          sub="stratex"
          icon={Target}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <RecentProjects projects={projects} />
          <ProjectStatusChart projects={projects} />
        </div>
        <StratexSummary objectives={objectives} />
      </div>
    </div>
  )
}
