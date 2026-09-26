import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Lock, Mail, Phone, Eye, EyeOff, Sprout, LogIn } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth, defaultProfile } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import Button from "../components/Button"
import Alert from "../components/Alert"

export default function Login() {
  const { t, lang } = useLanguage()
  const { login } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const mobileValid = /^\d{10}$/.test(mobile)
    const emailValid = /^\S+@\S+\.\S+$/.test(email)
    if (!mobileValid && !emailValid) {
      setError(t("auth.err.mobile"))
      return
    }
    if (password.length < 6) {
      setError(t("auth.err.password"))
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    login({
      ...defaultProfile(lang),
      name: "Ramesh Pawar",
      mobile: mobile || "9876543210",
      email: email || "ramesh@farmer.in",
      location: "Akola Village",
      farmName: "Loganagri Farm",
    })
    setLoading(false)
    show(t("auth.loginSuccess"), "success")
    navigate("/dashboard")
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
      {/* Left visual */}
      <div className="hidden rounded-3xl bg-gradient-to-br from-leaf-600 to-leaf-800 p-10 text-white lg:block">
        <Sprout className="h-12 w-12" aria-hidden />
        <h2 className="mt-6 font-display text-3xl font-bold leading-snug">
          Detect disease in seconds. <span className="text-sun-300">Grow more.</span>
        </h2>
        <ul className="mt-6 space-y-3 text-sm text-leaf-100">
          <li>🌱 Scan crop leaves with your phone camera</li>
          <li>💧 Auto irrigation & water saving up to 36%</li>
          <li>🌦️ Weather alerts in 9 Indian languages</li>
        </ul>
      </div>

      {/* Form */}
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-navy-950">{t("auth.loginTitle")}</h1>
        <p className="mt-2 text-navy-600">{t("auth.loginSubtitle")}</p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          {error && <Alert kind="error">{error}</Alert>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">{t("auth.mobile")}</label>
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
            <label className="mb-1.5 block text-sm font-semibold text-navy-700">{t("auth.password")}</label>
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

          <Button type="submit" size="lg" fullWidth loading={loading}>
            <LogIn className="h-5 w-5" aria-hidden /> {t("auth.login")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-500">
          {t("auth.noAccount")}{" "}
          <Link to="/signup" className="font-bold text-leaf-700 underline">
            {t("auth.createOne")}
          </Link>
        </p>
        <p className="mt-3 rounded-xl bg-sun-50 p-3 text-center text-xs text-sun-800">{t("auth.demoHint")}</p>
      </div>
    </div>
  )
}