import type { ReactNode } from "react"

type Tone = "green" | "yellow" | "red" | "blue" | "neutral"

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  icon?: ReactNode
  className?: string
}

const tones: Record<Tone, string> = {
  green: "bg-leaf-100 text-leaf-800 border-leaf-200",
  yellow: "bg-sun-100 text-sun-800 border-sun-200",
  red: "bg-red-100 text-red-700 border-red-200",
  blue: "bg-navy-100 text-navy-800 border-navy-200",
  neutral: "bg-navy-50 text-navy-600 border-navy-100",
}

export default function Badge({ tone = "neutral", children, icon, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${tones[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}