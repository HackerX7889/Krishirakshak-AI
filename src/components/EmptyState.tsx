import type { ReactNode } from "react"
import { Sprout } from "lucide-react"

interface EmptyStateProps {
  title: string
  hint?: string
  action?: ReactNode
  icon?: ReactNode
}

export default function EmptyState({ title, hint, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/40 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-leaf-600 shadow-sm">
        {icon ?? <Sprout className="h-7 w-7" aria-hidden />}
      </div>
      <div>
        <p className="font-semibold text-navy-800">{title}</p>
        {hint && <p className="mt-1 text-sm text-navy-500">{hint}</p>}
      </div>
      {action}
    </div>
  )
}