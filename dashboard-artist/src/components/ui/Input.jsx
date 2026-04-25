import clsx from 'clsx'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
      <input
        className={clsx(
          'rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-violet-500',
          error ? 'border-red-500' : 'border-slate-700 focus:border-violet-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
