import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Lock, Mail, Phone, Eye, EyeOff, User, Sprout, UserPlus } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { LANGUAGES } from "../i18n/languages"
import { useAuth, defaultProfile } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import Button from "../components/Button"
import Alert from "../components/Alert"
import type { Language } from "../types"

export default function SignUp() {
  const { t, lang, setLang } = useLanguage()
  const { login } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [prefLang, setPrefLang] = useState<Language>(lang)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError(t("auth.err.name"))
      return
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError(t("auth.err.mobile"))
      return
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError(t("auth.err.email"))
      return
    }
    if (password.length < 6) {
      setError(t("auth.err.password"))
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setLang(prefLang)
    login({
      ...defaultProfile(prefLang),
      name: name.trim(),
      mobile,
      email,
    })
    setLoading(false)
    show(t("auth.signupSuccess"), "success")
    navigate("/profile")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-600 text-white">
            <Sprout className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-950">{t("auth.signupTitle")}</h1>
            <p className="text-sm text-navy-600">{t("auth.signupSubtitle")}</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          {error && <Alert kind="error">{error}</Alert>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">{t("auth.name")}</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" aria-hidden />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Pawar"
                className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-11 pr-4 text-navy-900 outline-none transition-colors focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">{t("auth.mobile")} *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" aria-hidden />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-11 pr-4 text-navy-900 outline-none transition-colors focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">
              {t("auth.email")} <span className="font-normal text-navy-400">({t("common.optional")})</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-11 pr-4 text-navy-900 outline-none transition-colors focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">{t("auth.password")} *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" aria-hidden />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-11 pr-12 text-navy-900 outline-none transition-colors focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-navy-400 hover:text-navy-700"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">{t("auth.language")}</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(({ code, native }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setPrefLang(code)}
                  className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors ${
                    prefLang === code ? "border-leaf-600 bg-leaf-50 text-leaf-800" : "border-navy-200 text-navy-600"
                  }`}
                >
                  {native}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading}>
            <UserPlus className="h-5 w-5" aria-hidden /> {t("auth.signup")}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-navy-400">{t("auth.agree")}</p>
        <p className="mt-4 text-center text-sm text-navy-500">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-bold text-leaf-700 underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  )
}