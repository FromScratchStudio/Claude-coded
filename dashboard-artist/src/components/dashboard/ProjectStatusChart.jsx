import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'

const STATUS_META = {
  idea:         { label: 'Idée',          color: '#64748b' },
  planning:     { label: 'Planification', color: '#3b82f6' },
  'in-progress':{ label: 'En cours',      color: '#8b5cf6' },
  review:       { label: 'Révision',      color: '#f59e0b' },
  completed:    { label: 'Terminé',       color: '#10b981' },
  archived:     { label: 'Archivé',       color: '#374151' },
}

export default function ProjectStatusChart({ projects }) {
  const data = Object.entries(
    projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1
      return acc
    }, {})
  )
    .map(([status, count]) => ({
      name: STATUS_META[status]?.label ?? status,
      value: count,
      color: STATUS_META[status]?.color ?? '#64748b',
    }))
    .filter((d) => d.value > 0)

  return (
    <Card className="p-5">
      <p className="mb-4 text-sm font-medium text-slate-300">Répartition par statut</p>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">Aucun projet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '12px',
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
