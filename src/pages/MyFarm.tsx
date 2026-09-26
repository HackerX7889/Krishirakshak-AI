import { useState } from "react"
import {
  LayoutGrid,
  Plus,
  MapPin,
  CalendarDays,
  LandPlot,
  Droplet,
  FlaskConical,
  StickyNote,
  Bell,
  Trash2,
  Pencil,
  Sprout,
  Leaf,
  Flower2,
  Apple,
  Timer,
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useToast } from "../contexts/ToastContext"
import { initialCrops } from "../data/mockData"
import type { CropEntry, StageType } from "../types"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Badge from "../components/Badge"
import Modal from "../components/Modal"
import EmptyState from "../components/EmptyState"
import { ConfirmModal } from "../components/Modal"

const stageMeta: Record<StageType, { label: string; color: string; bar: string }> = {
  seedling: { label: "Seedling", color: "bg-sun-100 text-sun-800 border-sun-200", bar: "bg-sun-400" },
  vegetative: { label: "Vegetative", color: "bg-leaf-100 text-leaf-800 border-leaf-200", bar: "bg-leaf-400" },
  flowering: { label: "Flowering", color: "bg-navy-100 text-navy-800 border-navy-200", bar: "bg-navy-400" },
  fruiting: { label: "Fruiting", color: "bg-red-100 text-red-800 border-red-200", bar: "bg-red-400" },
  maturity: { label: "Maturity", color: "bg-sun-100 text-sun-800 border-sun-300", bar: "bg-sun-500" },
}

const stageIcon: Record<StageType, typeof Sprout> = {
  seedling: Sprout,
  vegetative: Leaf,
  flowering: Flower2,
  fruiting: Apple,
  maturity: Timer,
}

const emptyForm = {
  name: "",
  variety: "",
  plantingDate: "",
  location: "",
  soilType: "Loam",
  growthStage: "seedling" as StageType,
  expectedHarvest: "",
}

export default function MyFarm() {
  const { t } = useLanguage()
  const { show } = useToast()
  const [crops, setCrops] = useState<CropEntry[]>(initialCrops)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<CropEntry | null>(null)
  const [noteOpen, setNoteOpen] = useState<CropEntry | null>(null)
  const [noteText, setNoteText] = useState("")
  const [reminderOpen, setReminderOpen] = useState<CropEntry | null>(null)
  const [reminderText, setReminderText] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<CropEntry | null>(null)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (crop: CropEntry) => {
    setEditing(crop)
    setForm({
      name: crop.name,
      variety: crop.variety === "—" ? "" : crop.variety,
      plantingDate: crop.plantingDate,
      location: crop.location === "Main Plot" ? "" : crop.location,
      soilType: crop.soilType,
      growthStage: crop.growthStage,
      expectedHarvest: crop.expectedHarvest === "—" ? "" : crop.expectedHarvest,
    })
    setFormOpen(true)
  }

  const saveCrop = () => {
    if (!form.name || !form.plantingDate) {
      show(t("auth.err.name"), "error")
      return
    }
    if (editing) {
      setCrops((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                name: form.name,
                variety: form.variety || "—",
                plantingDate: form.plantingDate,
                location: form.location || "Main Plot",
                soilType: form.soilType,
                growthStage: form.growthStage,
                expectedHarvest: form.expectedHarvest || "—",
              }
            : c,
        ),
      )
      show(t("toast.cropUpdated"), "success")
    } else {
      const crop: CropEntry = {
        id: `c${Date.now()}`,
        name: form.name,
        variety: form.variety || "—",
        plantingDate: form.plantingDate,
        location: form.location || "Main Plot",
        soilType: form.soilType,
        growthStage: form.growthStage,
        stageProgress: 20,
        notes: [],
        reminders: [],
        waterUsed: 0,
        expectedHarvest: form.expectedHarvest || "—",
      }
      setCrops((prev) => [crop, ...prev])
      show(t("toast.cropAdded"), "success")
    }
    setForm(emptyForm)
    setEditing(null)
    setFormOpen(false)
  }

  const addNote = () => {
    if (!noteText.trim() || !noteOpen) return
    setCrops((prev) =>
      prev.map((c) =>
        c.id === noteOpen.id
          ? { ...c, notes: [...c.notes, { id: `n${Date.now()}`, text: noteText.trim(), date: new Date().toISOString().slice(0, 10) }] }
          : c,
      ),
    )
    setNoteText("")
    setNoteOpen(null)
    show(t("toast.noteAdded"), "success")
  }

  const addReminder = () => {
    if (!reminderText.trim() || !reminderOpen) return
    setCrops((prev) =>
      prev.map((c) =>
        c.id === reminderOpen.id
          ? { ...c, reminders: [...c.reminders, { id: `r${Date.now()}`, text: reminderText.trim(), date: reminderDate || new Date().toISOString().slice(0, 10), done: false }] }
          : c,
      ),
    )
    setReminderText("")
    setReminderDate("")
    setReminderOpen(null)
    show(t("toast.reminderAdded"), "success")
  }

  const toggleReminder = (cropId: string, reminderId: string) => {
    setCrops((prev) =>
      prev.map((c) =>
        c.id === cropId
          ? { ...c, reminders: c.reminders.map((r) => (r.id === reminderId ? { ...r, done: !r.done } : r)) }
          : c,
      ),
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setCrops((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    show(t("toast.reminderAdded"), "info")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("farm.title")}
        subtitle={t("farm.subtitle")}
        icon={<LayoutGrid className="h-6 w-6" aria-hidden />}
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-5 w-5" aria-hidden /> {t("farm.addCrop")}
          </Button>
        }
      />

      {crops.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t("farm.noCrops")}
            hint={t("farm.noCropsHint")}
            action={<Button onClick={openAdd}><Plus className="h-5 w-5" aria-hidden /> {t("farm.addCrop")}</Button>}
            icon={<Sprout className="h-7 w-7" aria-hidden />}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {crops.map((crop) => {
            const StageIcon = stageIcon[crop.growthStage]
            const st = stageMeta[crop.growthStage]
            return (
              <div key={crop.id} className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${st.color}`}>
                      <StageIcon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-navy-900">{crop.name}</h3>
                      <p className="text-sm text-navy-500">{crop.variety}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(crop)}
                    className="rounded-lg p-2 text-navy-400 hover:bg-leaf-50 hover:text-leaf-700"
                    aria-label={t("farm.editCrop")}
                  >
                    <Pencil className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(crop)}
                    className="rounded-lg p-2 text-navy-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={t("farm.deleteCrop")}
                  >
                    <Trash2 className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <Badge tone="neutral"><MapPin className="h-3.5 w-3.5" aria-hidden /> {crop.location}</Badge>
                  <Badge tone="neutral"><LandPlot className="h-3.5 w-3.5" aria-hidden /> {crop.soilType}</Badge>
                  <Badge tone="blue"><CalendarDays className="h-3.5 w-3.5" aria-hidden /> {crop.plantingDate}</Badge>
                  <Badge tone="green"><CalendarDays className="h-3.5 w-3.5" aria-hidden /> {crop.expectedHarvest}</Badge>
                </div>

                {/* Growth stage */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy-700">{t("farm.growthStage")}: {st.label}</span>
                    <span className="font-semibold text-leaf-700">{crop.stageProgress}%</span>
                  </div>
                  <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-navy-100">
                    <div className={`h-full rounded-full ${st.bar}`} style={{ width: `${crop.stageProgress}%` }} />
                  </div>
                </div>

                {/* Schedule */}
                <div className="mt-4 rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("farm.schedules")}</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-navy-700">
                    <li className="flex items-center gap-2"><FlaskConical className="h-4 w-4 text-leaf-600" aria-hidden /> {t("farm.schedule.fertilizer")}</li>
                    <li className="flex items-center gap-2"><Droplet className="h-4 w-4 text-leaf-600" aria-hidden /> {t("farm.schedule.irrigation")}</li>
                    <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-sun-600" aria-hidden /> {t("farm.schedule.foliar")}</li>
                  </ul>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-leaf-50 p-3 text-sm">
                  <span className="font-medium text-leaf-800">{t("farm.waterUsed")}</span>
                  <span className="font-bold text-navy-900">{(crop.waterUsed / 1000).toFixed(1)} kL</span>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-navy-800"><StickyNote className="h-4 w-4 text-navy-500" aria-hidden /> {t("common.notes")}</p>
                    <button type="button" onClick={() => setNoteOpen(crop)} className="text-sm font-semibold text-leaf-700 hover:underline">{t("farm.addNote")}</button>
                  </div>
                  {crop.notes.length === 0 ? (
                    <p className="mt-2 rounded-xl border border-dashed border-navy-200 p-3 text-sm text-navy-400">{t("farm.emptyNotes")}</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {crop.notes.slice(-2).reverse().map((n) => (
                        <li key={n.id} className="rounded-xl bg-navy-50 p-3 text-sm">
                          <p className="text-navy-700">{n.text}</p>
                          <p className="mt-1 text-xs text-navy-400">{n.date}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Reminders */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-navy-800"><Bell className="h-4 w-4 text-sun-600" aria-hidden /> {t("common.reminders")}</p>
                    <button type="button" onClick={() => setReminderOpen(crop)} className="text-sm font-semibold text-leaf-700 hover:underline">{t("farm.addReminder")}</button>
                  </div>
                  {crop.reminders.length === 0 ? (
                    <p className="mt-2 rounded-xl border border-dashed border-navy-200 p-3 text-sm text-navy-400">{t("farm.emptyReminders")}</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {crop.reminders.map((r) => (
                        <li key={r.id} className="flex items-start justify-between gap-2 rounded-xl border border-navy-100 p-3 text-sm">
                          <label className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={r.done}
                              onChange={() => toggleReminder(crop.id, r.id)}
                              className="mt-0.5 h-4 w-4 accent-leaf-600"
                            />
                            <span className={r.done ? "text-navy-400 line-through" : "text-navy-700"}>{r.text}</span>
                          </label>
                          <span className="shrink-0 text-xs text-navy-400">{r.date}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / edit crop modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? t("farm.editCrop") : t("farm.addCrop")}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={saveCrop}>{editing ? <Pencil className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />} {t("common.save")}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("farm.name")} required>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wheat" />
          </Field>
          <Field label={t("farm.variety")}>
            <input className={inputCls} value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} placeholder="e.g. HD-2967" />
          </Field>
          <Field label={t("farm.plantingDate")} required>
            <input type="date" className={inputCls} value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} />
          </Field>
          <Field label={t("farm.expectedHarvest")}>
            <input type="date" className={inputCls} value={form.expectedHarvest} onChange={(e) => setForm({ ...form, expectedHarvest: e.target.value })} />
          </Field>
          <Field label={t("farm.location")}>
            <input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. East Plot" />
          </Field>
          <Field label={t("farm.soilType")}>
            <select className={inputCls} value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })}>
              {["Loam", "Clay", "Sandy Loam", "Black Cotton", "Red Soil", "Alluvial"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label={t("farm.growthStage")}>
            <select className={inputCls} value={form.growthStage} onChange={(e) => setForm({ ...form, growthStage: e.target.value as StageType })}>
              {Object.entries(stageMeta).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </Modal>

      {/* Note modal */}
      <Modal open={noteOpen !== null} onClose={() => setNoteOpen(null)} title={t("farm.addNote")} footer={
        <>
          <Button variant="ghost" onClick={() => setNoteOpen(null)}>{t("common.cancel")}</Button>
          <Button onClick={addNote}>{t("common.save")}</Button>
        </>
      }>
        <label className="block text-sm font-medium text-navy-700">
          {t("common.notes")}
          <textarea className={`${inputCls} mt-1 min-h-24`} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder={t("farm.notePlaceholder")} />
        </label>
      </Modal>

      {/* Reminder modal */}
      <Modal open={reminderOpen !== null} onClose={() => setReminderOpen(null)} title={t("farm.addReminder")} footer={
        <>
          <Button variant="ghost" onClick={() => setReminderOpen(null)}>{t("common.cancel")}</Button>
          <Button onClick={addReminder}>{t("common.save")}</Button>
        </>
      }>
        <div className="grid gap-3">
          <label className="block text-sm font-medium text-navy-700">
            {t("farm.reminderPlaceholder")}
            <input className={`${inputCls} mt-1`} value={reminderText} onChange={(e) => setReminderText(e.target.value)} placeholder={t("farm.reminderPlaceholder")} />
          </label>
          <label className="block text-sm font-medium text-navy-700">
            {t("common.date")}
            <input type="date" className={`${inputCls} mt-1`} value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
          </label>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title={t("farm.deleteCrop")}
        message={`${t("farm.removeConfirm")} ${deleteTarget?.name ?? ""}`}
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-navy-900 outline-none transition-colors focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-navy-700">
      {label} {required && <span className="text-red-500">*</span>}
      <span className="mt-1 block">{children}</span>
    </label>
  )
}
