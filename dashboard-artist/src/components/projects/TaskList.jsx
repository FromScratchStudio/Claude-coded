import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import clsx from 'clsx'
import Button from '../ui/Button'

export default function TaskList({ tasks = [], onAdd, onToggle, onDelete }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div>
      <div className="mb-3 space-y-2">
        {tasks.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-500">Aucune tâche</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2"
          >
            <button
              onClick={() => onToggle(task.id)}
              className={clsx(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                task.completed
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-600 hover:border-violet-500'
              )}
            >
              {task.completed && <Check className="h-3 w-3" />}
            </button>
            <span
              className={clsx(
                'flex-1 text-sm',
                task.completed ? 'text-slate-500 line-through' : 'text-slate-200'
              )}
            >
              {task.title}
            </span>
            <button
              onClick={() => onDelete(task.id)}
              className="text-slate-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nouvelle tâche..."
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button size="sm" onClick={handleAdd} disabled={!input.trim()}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
