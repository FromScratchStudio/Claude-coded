import clsx from 'clsx'

export default function Select({ label, options, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
      <select
        className={clsx(
          'rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
