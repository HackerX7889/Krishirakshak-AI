import type { ReactNode } from "react"

export default function PageHeader({
  title,
  subtitle,
  icon,
  actions,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-navy-600">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}