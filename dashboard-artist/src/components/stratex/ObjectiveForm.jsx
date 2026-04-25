import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const TIMEFRAME_OPTIONS = [
  { value: 'Q1', label: 'T1 (jan–mar)' },
  { value: 'Q2', label: 'T2 (avr–juin)' },
  { value: 'Q3', label: 'T3 (juil–sep)' },
  { value: 'Q4', label: 'T4 (oct–déc)' },
  { value: 'annual', label: 'Annuel' },
]

const DEFAULTS = {
  title: '', description: '', timeframe: 'annual',
  year: new Date().getFullYear(), status: 'active',
}

export default function ObjectiveForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(initial ?? DEFAULTS)
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
    if (!initial) setForm(DEFAULTS)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier l\'objectif' : 'Nouvel objectif stratégique'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre *"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Objectif stratégique"
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="Décrivez cet objectif..."
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Horizon"
            options={TIMEFRAME_OPTIONS}
            value={form.timeframe}
            onChange={(e) => set('timeframe', e.target.value)}
          />
          <Input
            label="Année"
            type="number"
            value={form.year}
            onChange={(e) => set('year', Number(e.target.value))}
            min={2020}
            max={2035}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
          <Button type="submit" disabled={!form.title.trim()}>
            {initial ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
