export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-slate-800 p-4">
          <Icon className="h-8 w-8 text-slate-500" />
        </div>
      )}
      <h3 className="mb-1 text-base font-medium text-slate-300">{title}</h3>
      {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}
