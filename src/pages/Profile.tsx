import { useState } from "react"
import {
  UserCircle2,
  MapPin,
  Ruler,
  Sprout,
  Languages,
  Save,
  LandPlot,
  Mail,
  Phone,
  Pencil,
  ShieldCheck,
  Radio,
  LocateFixed,
  Navigation,
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { LANGUAGES, LANG_NAME } from "../i18n/languages"
import type { Language, UserProfile } from "../types"
import { searchLocation } from "../services/weatherApi"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Badge from "../components/Badge"

const inputCls =
  "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-navy-900 outline-none transition-colors focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"

export default function Profile() {
  const { t, setLang } = useLanguage()
  const { user, updateProfile } = useAuth()
  const { show } = useToast()
  const [edit, setEdit] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(false)
  const [geoPlace, setGeoPlace] = useState("")

  const [form, setForm] = useState({
    name: user?.name ?? "",
    mobile: user?.mobile ?? "",
    email: user?.email ?? "",
    location: user?.location ?? "",
    state: user?.state ?? "Maharashtra",
    farmSize: user?.farmSize ?? "2",
    cropType: user?.cropType ?? "Wheat",
    farmName: user?.farmName ?? "",
    language: (user?.language ?? "en") as Language,
    lat: user?.lat,
    lon: user?.lon,
  })

  const resolveCoords = async (target: typeof form): Promise<{ lat?: number; lon?: number }> => {
    const query = `${target.location.trim() || "Akola"}, ${target.state}, India`
    const hit = await searchLocation(query)
    return hit ? { lat: hit.lat, lon: hit.lon } : {}
  }

  const locate = async () => {
    setGeoLoading(true)
    setGeoError(false)
    setGeoPlace("")
    try {
      const query = `${form.location.trim() || "Akola"}, ${form.state}, India`
      const hit = await searchLocation(query)
      if (hit) {
        setForm((f) => ({ ...f, lat: hit.lat, lon: hit.lon }))
        setGeoPlace(`${hit.name}${hit.state ? ", " + hit.state : ""}`)
        show(`${hit.name} · ${hit.lat.toFixed(3)}, ${hit.lon.toFixed(3)}`, "success")
      } else {
        setGeoError(true)
      }
    } catch {
      setGeoError(true)
    } finally {
      setGeoLoading(false)
    }
  }

  const save = async () => {
    setSaveLoading(true)
    let patch = { ...form } as Partial<UserProfile>
    try {
      const coords = await resolveCoords(form)
      patch = { ...patch, ...coords }
    } catch {
      // keep existing coords; weather falls back to defaults
    }
    await new Promise((r) => setTimeout(r, 600))
    updateProfile(patch)
    setLang(form.language)
    setEdit(false)
    setSaveLoading(false)
    show(t("profile.saveSuccess"), "success")
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <UserCircle2 className="mx-auto h-16 w-16 text-navy-300" aria-hidden />
        <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">{t("nav.login")}</h1>
        <p className="mt-2 text-navy-600">{t("auth.noAccount")}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("profile.title")}
        subtitle={t("profile.subtitle")}
        icon={<UserCircle2 className="h-6 w-6" aria-hidden />}
        actions={
          !edit ? (
            <Button variant="secondary" onClick={() => setEdit(true)}>
              <Pencil className="h-4 w-4" aria-hidden /> {t("profile.edit")}
            </Button>
          ) : (
            <Button loading={saveLoading} onClick={save}>
              <Save className="h-4 w-4" aria-hidden /> {t("common.save")}
            </Button>
          )
        }
      />

      {/* Identity card */}
      <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 to-navy-800 text-white shadow-lg">
        <div className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-leaf-500 text-3xl font-bold">
            {(user.name || "F").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">{user.name || "Farmer"}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-300">
              <LandPlot className="h-4 w-4 text-leaf-400" aria-hidden /> {user.farmName || t("farm.location")} · {user.state}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="green" className="border-white/20 bg-white/10 text-white"><Sprout className="h-3.5 w-3.5" aria-hidden /> {user.cropType}</Badge>
              <Badge tone="yellow" className="border-white/20 bg-white/10 text-white"><Ruler className="h-3.5 w-3.5" aria-hidden /> {user.farmSize} acres</Badge>
              <Badge tone="blue" className="border-white/20 bg-white/10 text-white"><Radio className="h-3.5 w-3.5" aria-hidden /> 14 sensors online</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Details / Edit */}
      <div className="mt-6 rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
        {edit ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("auth.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label={t("profile.farmName")} value={form.farmName} onChange={(v) => setForm({ ...form, farmName: v })} />
            <Field label={t("auth.mobile")} type="tel" value={form.mobile} maxLength={10} onChange={(v) => setForm({ ...form, mobile: v.replace(/\D/g, "") })} />
            <Field label={t("auth.email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label={t("farm.location")} value={form.location} onChange={(v) => setForm({ ...form, location: v })} />

            <label className="block text-sm font-medium text-navy-700">
              {t("profile.state")}
              <select className={`${inputCls} mt-1`} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                {["Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Karnataka", "Telangana", "Andhra Pradesh", "Rajasthan", "Bihar"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <div className="sm:col-span-2 rounded-2xl border border-sun-200 bg-sun-50/60 p-3.5">
              <p className="flex items-center gap-1.5 text-sm font-bold text-navy-800">
                <Navigation className="h-4 w-4 text-sun-700" aria-hidden /> {t("profile.weatherLocation")}
              </p>
              <p className="mt-1 text-xs text-navy-600">{t("profile.weatherLocationHint")}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 font-mono text-sm text-navy-800 ring-1 ring-navy-200">
                  <MapPin className="h-4 w-4 text-leaf-600" aria-hidden />
                  {form.lat != null && form.lon != null
                    ? `${form.lat.toFixed(3)}, ${form.lon.toFixed(3)}`
                    : t("profile.autoCoords")}
                </span>
                <Button variant="secondary" onClick={locate} loading={geoLoading}>
                  <LocateFixed className="h-4 w-4" aria-hidden /> {t("profile.locate")}
                </Button>
              </div>
              {geoPlace && <p className="mt-1.5 text-xs font-semibold text-leaf-700">{geoPlace}</p>}
              {geoError && <p className="mt-1.5 text-xs font-semibold text-red-600">{t("profile.geoError")}</p>}
            </div>

            <label className="block text-sm font-medium text-navy-700">
              {t("profile.farmSize")}
              <select className={`${inputCls} mt-1`} value={form.farmSize} onChange={(e) => setForm({ ...form, farmSize: e.target.value })}>
                {["1", "2", "3", "5", "8", "10+"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-navy-700">
              {t("profile.cropType")}
              <select className={`${inputCls} mt-1`} value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })}>
                {["Wheat", "Rice", "Tomato", "Onion", "Corn", "Cotton", "Sugarcane", "Soybean"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-navy-700">
              {t("auth.language")}
              <div className="mt-1 grid grid-cols-3 gap-2">
                {LANGUAGES.map(({ code, native }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setForm({ ...form, language: code })}
                    className={`rounded-xl border-2 py-2 text-sm font-semibold ${
                      form.language === code ? "border-leaf-600 bg-leaf-50 text-leaf-800" : "border-navy-200 text-navy-600"
                    }`}
                  >
                    {native}
                  </button>
                ))}
              </div>
            </label>
          </div>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <Row icon={<Phone className="h-4 w-4" aria-hidden />} label={t("auth.mobile")} value={user.mobile || "—"} />
            <Row icon={<Mail className="h-4 w-4" aria-hidden />} label={t("auth.email")} value={user.email || "—"} />
            <Row icon={<MapPin className="h-4 w-4" aria-hidden />} label={t("farm.location")} value={user.location || "—"} />
            <Row icon={<LandPlot className="h-4 w-4" aria-hidden />} label={t("profile.state")} value={user.state} />
            <Row icon={<Ruler className="h-4 w-4" aria-hidden />} label={t("profile.farmSize")} value={`${user.farmSize} acres`} />
            <Row icon={<Sprout className="h-4 w-4" aria-hidden />} label={t("profile.cropType")} value={user.cropType} />
            <Row
              icon={<Navigation className="h-4 w-4" aria-hidden />}
              label={t("profile.coords")}
              value={user.lat != null && user.lon != null ? `${user.lat.toFixed(3)}, ${user.lon.toFixed(3)}` : t("profile.autoCoords")}
            />
            <Row icon={<Languages className="h-4 w-4" aria-hidden />} label={t("auth.language")} value={LANG_NAME[user.language] ?? "English"} />
          </dl>
        )}
      </div>

      {/* Safety note */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-leaf-200 bg-leaf-50 p-4 text-sm text-leaf-800">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">{t("profile.savedInfo")}</p>
          <p className="mt-1 text-leaf-700">{t("profile.viewAs")}</p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = "text", maxLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; maxLength?: number }) {
  return (
    <label className="block text-sm font-medium text-navy-700">
      {label}
      <input
        type={type}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} mt-1`}
      />
    </label>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-3.5">
      <span className="mt-0.5 text-leaf-600">{icon}</span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</dt>
        <dd className="mt-0.5 font-semibold text-navy-900">{value}</dd>
      </div>
    </div>
  )
}