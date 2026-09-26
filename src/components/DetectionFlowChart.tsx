import { GitBranch } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

export default function DetectionFlowChart() {
  const { t } = useLanguage()
  return (
    <div className="mt-10 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
        <GitBranch className="h-5 w-5 text-leaf-600" aria-hidden /> {t("fw.title")}
      </h2>
      <p className="mt-1 text-sm text-navy-600">{t("fw.subtitle")}</p>

      <svg viewBox="0 0 760 380" className="mt-4 h-auto w-full" role="img" aria-label={t("fw.title")}>
        <defs>
          <marker
            id="fw-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#2c5373" />
          </marker>
        </defs>

        <line x1="380" y1="76" x2="380" y2="111" stroke="#2c5373" strokeWidth="2" markerEnd="url(#fw-arrow)" />
        <line x1="380" y1="174" x2="380" y2="181" stroke="#2c5373" strokeWidth="2" markerEnd="url(#fw-arrow)" />

        <line x1="250" y1="236" x2="237" y2="236" stroke="#2c5373" strokeWidth="2" markerEnd="url(#fw-arrow)" />
        <text x="243" y="228" fontSize="11" fontWeight="700" fill="#1f405e" textAnchor="middle">
          {t("fw.no")}
        </text>

        <line x1="510" y1="236" x2="523" y2="236" stroke="#2c5373" strokeWidth="2" markerEnd="url(#fw-arrow)" />
        <text x="517" y="228" fontSize="11" fontWeight="700" fill="#1f405e" textAnchor="middle">
          {t("fw.yes")}
        </text>

        <line x1="150" y1="260" x2="150" y2="299" stroke="#2c5373" strokeWidth="2" markerEnd="url(#fw-arrow)" />
        <line x1="610" y1="260" x2="610" y2="299" stroke="#2c5373" strokeWidth="2" markerEnd="url(#fw-arrow)" />

        <rect x="230" y="14" width="300" height="62" rx="14" fill="#eef4f9" stroke="#2c5373" strokeWidth="1.5" />
        <text x="380" y="38" fontSize="14" fontWeight="700" fill="#1f405e" textAnchor="middle">
          {t("fw.capture")}
        </text>
        <text x="380" y="56" fontSize="12" fill="#4a6d8a" textAnchor="middle">
          {t("fw.captureDesc")}
        </text>

        <rect x="230" y="112" width="300" height="62" rx="14" fill="#eef4f9" stroke="#2c5373" strokeWidth="1.5" />
        <text x="380" y="136" fontSize="14" fontWeight="700" fill="#1f405e" textAnchor="middle">
          {t("fw.ai")}
        </text>
        <text x="380" y="154" fontSize="12" fill="#4a6d8a" textAnchor="middle">
          {t("fw.aiDesc")}
        </text>

        <polygon points="380,182 510,236 380,290 250,236" fill="#fdf1dd" stroke="#ed900d" strokeWidth="2" />
        <text x="380" y="232" fontSize="14" fontWeight="700" fill="#8a5906" textAnchor="middle">
          {t("fw.diag")}
        </text>
        <text x="380" y="250" fontSize="12" fill="#b27a14" textAnchor="middle">
          {t("fw.diagQ")}
        </text>

        <rect x="64" y="198" width="172" height="62" rx="12" fill="#379c4f" />
        <text x="150" y="222" fontSize="14" fontWeight="700" fill="#ffffff" textAnchor="middle">
          {t("fw.healthy")}
        </text>
        <text x="150" y="240" fontSize="12" fill="#e7f6ec" textAnchor="middle">
          {t("fw.healthyDesc")}
        </text>

        <rect x="524" y="198" width="172" height="62" rx="12" fill="#dc2626" />
        <text x="610" y="222" fontSize="14" fontWeight="700" fill="#ffffff" textAnchor="middle">
          {t("fw.diseased")}
        </text>
        <text x="610" y="240" fontSize="12" fill="#ffe9e9" textAnchor="middle">
          {t("fw.diseasedDesc")}
        </text>

        <rect x="64" y="300" width="172" height="56" rx="12" fill="#eaf7ef" stroke="#379c4f" strokeWidth="1.5" />
        <text x="150" y="321" fontSize="13" fontWeight="700" fill="#2e7d3f" textAnchor="middle">
          {t("fw.healthyAction")}
        </text>
        <text x="150" y="339" fontSize="11" fill="#579a66" textAnchor="middle">
          {t("fw.healthyActionDesc")}
        </text>

        <rect x="524" y="300" width="172" height="56" rx="12" fill="#fdecec" stroke="#dc2626" strokeWidth="1.5" />
        <text x="610" y="321" fontSize="13" fontWeight="700" fill="#b91c1c" textAnchor="middle">
          {t("fw.diseasedAction")}
        </text>
        <text x="610" y="339" fontSize="11" fill="#c25454" textAnchor="middle">
          {t("fw.diseasedActionDesc")}
        </text>
      </svg>
    </div>
  )
}