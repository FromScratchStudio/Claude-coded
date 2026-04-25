import clsx from 'clsx'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-700/50 bg-slate-800/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
