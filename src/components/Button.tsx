import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

type Variant = "primary" | "secondary" | "warning" | "danger" | "ghost"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: "bg-leaf-600 text-white hover:bg-leaf-700 shadow-sm shadow-leaf-600/30 focus-visible:ring-leaf-500",
  secondary:
    "bg-white text-navy-800 border-2 border-navy-200 hover:border-leaf-500 hover:text-leaf-700 focus-visible:ring-leaf-500",
  warning: "bg-sun-500 text-navy-900 hover:bg-sun-400 shadow-sm shadow-sun-500/30 focus-visible:ring-sun-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  ghost: "bg-transparent text-navy-600 hover:bg-navy-100 focus-visible:ring-navy-400",
}

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}