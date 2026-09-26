import type { ReactNode } from "react"
import { AlertTriangle, Info, XCircle } from "lucide-react"

type Kind = "info" | "warning" | "error" | "success"

interface AlertProps {
  kind?: Kind
  title?: string
  children: ReactNode
  icon?: ReactNode
}

const styles: Record<Kind, { box: string; icon: string; iconEl: ReactNode }> = {
  info: {
    box: "border-navy-200 bg-navy-50 text-navy-800",
    icon: "text-navy-600",
    iconEl: <Info className="h-5 w-5 shrink-0" aria-hidden />,
  },
  warning: {
    box: "border-sun-300 bg-sun-50 text-navy-900",
    icon: "text-sun-700",
    iconEl: <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />,
  },
  error: {
    box: "border-red-200 bg-red-50 text-red-800",
    icon: "text-red-600",
    iconEl: <XCircle className="h-5 w-5 shrink-0" aria-hidden />,
  },
  success: {
    box: "border-leaf-300 bg-leaf-50 text-leaf-800",
    icon: "text-leaf-600",
    iconEl: <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />,
  },
}

export default function Alert({ kind = "info", title, children, icon }: AlertProps) {
  const s = styles[kind]
  return (
    <div role="alert" className={`flex gap-3 rounded-2xl border p-4 ${s.box}`}>
      {icon ?? <span className={s.icon}>{s.iconEl}</span>}
      <div className="text-sm">
        {title && <p className="font-semibold">{title}</p>}
        <div className="[&_p]:mt-1">{children}</div>
      </div>
    </div>
  )
}