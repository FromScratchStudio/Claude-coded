export const computeProjectProgress = (project) => {
  const tasks = project.tasks ?? []
  if (tasks.length === 0) return project.progress ?? 0
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
}

export const computeObjectiveProgress = (objective) => {
  const initiatives = objective.initiatives ?? []
  if (initiatives.length === 0) return 0
  return Math.round(
    initiatives.reduce((sum, i) => sum + (i.progress ?? 0), 0) / initiatives.length
  )
}

export const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const val = item[key]
    acc[val] = (acc[val] ?? 0) + 1
    return acc
  }, {})
