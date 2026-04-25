import clsx from 'clsx'

const STYLES = {
  idea:         'bg-slate-700 text-slate-300',
  planning:     'bg-blue-900/50 text-blue-300',
  'in-progress':'bg-violet-900/50 text-violet-300',
  review:       'bg-amber-900/50 text-amber-300',
  completed:    'bg-emerald-900/50 text-emerald-300',
  archived:     'bg-slate-800 text-slate-500',
  active:       'bg-emerald-900/50 text-emerald-300',
  paused:       'bg-amber-900/50 text-amber-300',
  todo:         'bg-slate-700 text-slate-300',
  done:         'bg-emerald-900/50 text-emerald-300',
  high:         'bg-red-900/50 text-red-300',
  medium:       'bg-amber-900/50 text-amber-300',
  low:          'bg-slate-700 text-slate-400',
  music:        'bg-pink-900/50 text-pink-300',
  visual:       'bg-indigo-900/50 text-indigo-300',
  writing:      'bg-cyan-900/50 text-cyan-300',
  video:        'bg-orange-900/50 text-orange-300',
  performance:  'bg-purple-900/50 text-purple-300',
  other:        'bg-slate-700 text-slate-300',
}

const LABELS = {
  idea:         'Idée',
  planning:     'Planification',
  'in-progress':'En cours',
  review:       'Révision',
  completed:    'Terminé',
  archived:     'Archivé',
  active:       'Actif',
  paused:       'Pausé',
  todo:         'À faire',
  done:         'Fait',
  high:         'Haute',
  medium:       'Moyenne',
  low:          'Basse',
  music:        'Musique',
  visual:       'Arts visuels',
  writing:      'Écriture',
  video:        'Vidéo',
  performance:  'Performance',
  other:        'Autre',
}

export default function Badge({ value, label, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STYLES[value] ?? 'bg-slate-700 text-slate-300',
        className
      )}
    >
      {label ?? LABELS[value] ?? value}
    </span>
  )
}
