import { Suspense, useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import Assistant from "./Assistant"
import Spinner from "./Spinner"
import { useLanguage } from "../contexts/LanguageContext"

export default function Layout() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f9f9f6]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-leaf-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-72">
        <Header onMenu={() => setMenuOpen(true)} />
        <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <Suspense fallback={<Spinner label={t("common.loading")} />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <Assistant />
    </div>
  )
}