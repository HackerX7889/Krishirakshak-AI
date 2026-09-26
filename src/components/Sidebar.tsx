import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  Sprout,
  Home,
  ScanLine,
  LayoutDashboard,
  Droplets,
  CloudSun,
  LayoutGrid,
  FileBarChart2,
  UserCircle2,
  Radio,
  X,
  LogOut,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

const navItems: { to: string; key: string; icon: LucideIcon; end?: boolean }[] = [
  { to: "/", key: "nav.home", icon: Home, end: true },
  { to: "/scan", key: "nav.scan", icon: ScanLine },
  { to: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { to: "/irrigation", key: "nav.irrigation", icon: Droplets },
  { to: "/advisory", key: "nav.advisory", icon: CloudSun },
  { to: "/farm", key: "nav.myfarm", icon: LayoutGrid },
  { to: "/reports", key: "nav.reports", icon: FileBarChart2 },
  { to: "/profile", key: "nav.profile", icon: UserCircle2 },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-leaf-100 text-leaf-800"
      : "text-gray-600 hover:bg-gray-50 hover:text-navy-900"
  }`

function SidebarInner({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  const { t } = useLanguage()
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-5 pt-6" aria-label={t("app.name")}>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-600 text-white shadow-sm shadow-leaf-600/40">
          <Sprout className="h-6 w-6" aria-hidden />
        </span>
        <span>
          <span className="block font-display text-lg font-bold leading-tight text-navy-950">
            Smart <span className="text-leaf-600">Farming</span>
          </span>
          <span className="block text-xs text-gray-500">AI companion</span>
        </span>
      </Link>

      {/* Workspace nav */}
      <div className="mt-7 px-5">
        <p className="px-1 text-xs font-bold uppercase tracking-wider text-gray-400">{t("sidebar.workspace")}</p>
        <nav className="mt-2 flex flex-col gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={linkClass}
            >
              <item.icon className="h-5 w-5" aria-hidden />
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1" />

      {/* IoT status */}
      <div className="mx-5 mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
            <Radio className="h-3.5 w-3.5 text-leaf-600" aria-hidden /> {t("iot.title")}
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-500" />
          </span>
        </div>
        <p className="mt-2 text-sm font-bold text-navy-900">{t("iot.online")}</p>
        <p className="mt-0.5 text-xs text-gray-500">{t("iot.devices")}</p>
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="mt-3 inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-leaf-700 ring-1 ring-leaf-200 transition-colors hover:bg-leaf-50"
        >
          {t("iot.viewStatus")}
        </Link>
      </div>

      {/* Auth */}
      <div className="border-t border-gray-100 p-4">
        {isAuthenticated ? (
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/profile"
              onClick={onNavigate}
              className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                {(user?.name || "F").charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-navy-900">{user?.name || "Farmer"}</span>
                <span className="block text-xs text-gray-500">{t("nav.profile")}</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={t("nav.logout")}
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={onNavigate}
              className="rounded-xl bg-leaf-600 px-4 py-2 text-center text-sm font-bold text-white transition-colors hover:bg-leaf-700"
            >
              {t("nav.login")}
            </Link>
            <Link
              to="/signup"
              onClick={onNavigate}
              className="rounded-xl border-2 border-leaf-600 px-4 py-2 text-center text-sm font-bold text-leaf-700 hover:bg-leaf-50"
            >
              {t("nav.signup")}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const { logout } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    show(t("toast.loggedOut"), "info")
    navigate("/")
  }

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-gray-200 bg-white lg:block">
        <SidebarInner onLogout={handleLogout} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <SidebarInner onNavigate={onClose} onLogout={handleLogout} />
          </aside>
        </div>
      )}
    </>
  )
}