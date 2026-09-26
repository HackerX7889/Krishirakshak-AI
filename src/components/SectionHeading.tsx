import type { ReactNode } from "react"

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  children?: ReactNode
}) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-2 inline-block rounded-full bg-sun-100 px-3 py-1 text-sm font-semibold text-sun-800">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className={`mt-2 text-navy-600 ${center ? "mx-auto max-w-2xl" : ""}`}>{subtitle}</p>}
      {children}
    </div>
  )
}