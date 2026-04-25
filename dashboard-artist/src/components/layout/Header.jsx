import { useLocation } from 'react-router-dom'

const TITLES = {
  '/':          'Vue d\'ensemble',
  '/projects':  'Projets créatifs',
  '/stratex':   'Tableau stratégique',
  '/settings':  'Réglages',
}

export default function Header() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = TITLES[base] ?? 'Dashboard Artist'

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4 shrink-0">
      <h1 className="text-base font-semibold text-slate-100">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-slate-500">Données locales</span>
      </div>
    </header>
  )
}
