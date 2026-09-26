interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
  description?: string
}

export default function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-colors ${
        checked ? "border-leaf-300 bg-leaf-50" : "border-navy-200 bg-white"
      }`}
    >
      <span>
        {label && <span className="block font-semibold text-navy-900">{label}</span>}
        {description && <span className="mt-0.5 block text-sm text-navy-600">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-13 shrink-0 rounded-full transition-colors ${
          checked ? "bg-leaf-600" : "bg-navy-200"
        }`}
        style={{ width: "3.25rem" }}
      >
        <span
          className={`absolute top-1 inline-block h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </label>
  )
}