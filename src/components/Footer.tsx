import { Sprout } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-10 text-center sm:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-600 text-white">
          <Sprout className="h-6 w-6" aria-hidden />
        </span>
        <p className="font-display text-base font-bold text-navy-950">{t("footer.brand")}</p>
        <p className="text-sm text-gray-500">{t("footer.line")}</p>
        <p className="mt-3 text-xs text-gray-400">© 2026 · {t("footer.rights")}</p>
      </div>
    </footer>
  )
}