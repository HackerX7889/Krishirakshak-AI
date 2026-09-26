import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon: ReactNode
  accent?: "green" | "yellow" | "blue"
}

const accents = {
  green: "bg-leaf-100 text-leaf-700",
  yellow: "bg-sun-100 text-sun-700",
  blue: "bg-navy-100 text-navy-700",
}

export default function StatCard({ label, value, sub, icon, accent = "green" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>{icon}</div>
      <p className="mt-3 font-display text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-sm font-medium text-navy-600">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-navy-400">{sub}</p>}
    </div>
  )
}