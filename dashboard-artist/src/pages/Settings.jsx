import { useState } from 'react'
import { Download, Upload, Trash2, Database, Sparkles } from 'lucide-react'
import useProjectStore from '../store/useProjectStore'
import useStratexStore from '../store/useStratexStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Settings() {
  const projects        = useProjectStore((s) => s.projects)
  const objectives      = useStratexStore((s) => s.objectives)
  const loadDemoProjects = useProjectStore((s) => s.loadDemoData)
  const loadDemoStratex  = useStratexStore((s) => s.loadDemoData)
  const [importMsg, setImportMsg] = useState('')

  const exportData = () => {
    const payload = { projects, objectives, exportedAt: new Date().toISOString(), version: 1 }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `dashboard-artist-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.projects)   useProjectStore.setState({ projects: data.projects })
        if (data.objectives) useStratexStore.setState({ objectives: data.objectives })
        setImportMsg('Données importées avec succès.')
        setTimeout(() => setImportMsg(''), 4000)
      } catch {
        setImportMsg('Erreur : fichier JSON invalide.')
        setTimeout(() => setImportMsg(''), 4000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const clearAll = () => {
    if (!window.confirm('Effacer toutes les données ? Cette action est irréversible.')) return
    useProjectStore.setState({ projects: [] })
    useStratexStore.setState({ objectives: [] })
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Database className="h-5 w-5 text-violet-400" />
          <h2 className="text-sm font-semibold text-slate-100">Sauvegarde des données</h2>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          Toutes les données sont stockées dans le localStorage de votre navigateur.
          {' '}<span className="text-slate-300">{projects.length} projet(s)</span>,
          {' '}<span className="text-slate-300">{objectives.length} objectif(s)</span>.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={exportData}>
            <Download className="h-4 w-4" />
            Exporter JSON
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-600">
            <Upload className="h-4 w-4" />
            Importer JSON
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
        {importMsg && (
          <p className={`mt-3 text-xs ${importMsg.startsWith('Erreur') ? 'text-red-400' : 'text-emerald-400'}`}>
            {importMsg}
          </p>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-100">Données de démonstration</h2>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          Chargez des projets et objectifs exemples pour explorer toutes les fonctionnalités.
        </p>
        <Button
          variant="secondary"
          onClick={() => { loadDemoProjects(); loadDemoStratex() }}
        >
          <Sparkles className="h-4 w-4" />
          Charger la démo
        </Button>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <Trash2 className="h-5 w-5 text-red-400" />
          <h2 className="text-sm font-semibold text-slate-100">Zone de danger</h2>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          Supprime définitivement tous les projets et objectifs stockés localement.
        </p>
        <Button variant="danger" onClick={clearAll}>
          <Trash2 className="h-4 w-4" />
          Effacer toutes les données
        </Button>
      </Card>
    </div>
  )
}
