import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Target, Settings, Sparkles } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/projects',  icon: FolderOpen,       label: 'Projets'    },
  { to: '/stratex',   icon: Target,           label: 'Stratex'    },
  { to: '/settings',  icon: Settings,         label: 'Réglages'   },
]

export default function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-slate-800 bg-slate-900 shrink-0">
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Artist Studio</p>
          <p className="text-xs text-slate-500">Dashboard créatif</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-xs text-slate-600">Persistance locale · localStorage</p>
      </div>
    </aside>
  )
}
