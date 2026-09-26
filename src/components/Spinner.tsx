import { Loader2 } from "lucide-react"

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-navy-600" role="status">
      <Loader2 className="h-6 w-6 animate-spin text-leaf-600" aria-hidden />
      <span>{label ?? "Loading..."}</span>
    </div>
  )
}