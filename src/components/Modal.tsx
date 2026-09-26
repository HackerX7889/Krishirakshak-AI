import type { ReactNode } from "react"
import { X } from "lucide-react"
import Button from "./Button"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-navy-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-navy-100 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmModal({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
  loading,
}: {
  open: boolean
  onClose: () => void
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  loading?: boolean
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-navy-700">{message}</p>
    </Modal>
  )
}