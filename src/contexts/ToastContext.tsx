import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Notification stack */}
      <div aria-live="polite" className="fixed bottom-4 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "border-leaf-200 bg-leaf-50 text-leaf-800"
                : toast.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-navy-200 bg-navy-50 text-navy-800"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden />}
            {toast.type === "error" && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />}
            {toast.type === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" aria-hidden />}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-md p-1 hover:bg-black/5"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}