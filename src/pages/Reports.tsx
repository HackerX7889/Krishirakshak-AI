import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FileDown,
  FileText,
  History,
  Bug,
  Droplet,
  TrendingUp,
  Download,
  BarChart3,
  Table2,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from "recharts"
import { jsPDF } from "jspdf"
import { useLanguage } from "../contexts/LanguageContext"
import { useToast } from "../contexts/ToastContext"
import { detectionRecords, waterRecords } from "../data/mockData"
import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"
import Badge from "../components/Badge"
import Button from "../components/Button"

const healthTrend = [
  { month: "Jun", health: 92 },
  { month: "Jul", health: 88 },
  { month: "Aug", health: 74 },
  { month: "Sep", health: 69 },
  { month: "Oct", health: 78 },
  { month: "Nov", health: 84 },
]

export default function Reports() {
  const { t } = useLanguage()
  const { show } = useToast()
  const [downloading, setDownloading] = useState<null | "pdf" | "csv">(null)

  const downloadCsv = () => {
    const rows = [
      ["Date", "Crop", "Result", "Status", "Confidence %"],
      ...detectionRecords.map((d) => [d.date, d.crop, d.result, d.status, String(d.confidence)]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smart-farming-report.csv"
    a.click()
    URL.revokeObjectURL(url)
    show(t("toast.reportDownloaded"), "success")
  }

  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.setFillColor(22, 101, 52)
    doc.rect(0, 0, 210, 30, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("Krishirakshak AI — Farm Report", 14, 14)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text("Loganagri Farm  |  3.5 acres  |  Akola, Maharashtra", 14, 22)

    doc.setTextColor(20, 40, 58)
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
    doc.text("Disease Detection Records", 14, 42)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    detectionRecords.forEach((d, i) => {
      const y = 52 + i * 9
      doc.text(
        `${d.date}  |  ${d.crop}  |  ${d.result}  |  ${d.status}  |  ${d.confidence}%`,
        14,
        y,
      )
    })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("Water Usage (litres/month)", 14, 118)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    waterRecords.forEach((w, i) => {
      doc.text(`${w.date}:  ${w.liters} L`, 14, 128 + i * 8)
    })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("Productivity Summary", 14, 190)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text("- Yield improved by 32% (manual 28q/acre -> smart 37q/acre)", 14, 198)
    doc.text("- Water usage reduced by 36% this season", 14, 206)
    doc.text("- 5 crop diseases detected in early stage", 14, 214)
    doc.text("- Rs. 4,500 cost saved per acre", 14, 222)

    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text("Generated on " + new Date().toLocaleDateString() + " by Krishirakshak AI", 14, 240)

    doc.save("krishirakshak-report.pdf")
    show(t("toast.reportDownloaded"), "success")
  }

  const handleDownload = async (kind: "pdf" | "csv") => {
    setDownloading(kind)
    // simulate a delay so the loading state is visible
    await new Promise((r) => setTimeout(r, 800))
    if (kind === "pdf") downloadPdf()
    else downloadCsv()
    setDownloading(null)
  }

  const statusTone = (s: string) => (s === "healthy" ? "green" : s === "diseased" ? "red" : "yellow") as "green" | "red" | "yellow"

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("rep.title")}
        subtitle={t("rep.subtitle")}
        icon={<FileText className="h-6 w-6" aria-hidden />}
        actions={
          <>
            <Button variant="secondary" loading={downloading === "csv"} onClick={() => handleDownload("csv")}>
              <Download className="h-4 w-4" aria-hidden /> {t("rep.downloadCsv")}
            </Button>
            <Button loading={downloading === "pdf"} onClick={() => handleDownload("pdf")}>
              <FileDown className="h-4 w-4" aria-hidden /> {t("rep.downloadPdf")}
            </Button>
          </>
        }
      />

      {/* Productivity stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<TrendingUp className="h-5 w-5" aria-hidden />} label={t("rep.yieldUp")} value="+32%" sub="28 → 37 q/acre" />
        <StatCard icon={<Droplet className="h-5 w-5" aria-hidden />} label={t("rep.waterDown")} value="-36%" sub="12,850 L saved" accent="blue" />
        <StatCard icon={<Bug className="h-5 w-5" aria-hidden />} label={t("rep.diseaseCaught")} value="5 of 6" sub="early detection" accent="yellow" />
        <StatCard icon={<TrendingUp className="h-5 w-5" aria-hidden />} label={t("rep.costDown")} value="₹4,500" sub="saved per acre" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Health history */}
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
            <History className="h-5 w-5 text-leaf-600" aria-hidden /> {t("rep.healthHistory")}
          </h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrend} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#2c5373" }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                <Tooltip />
                <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                <Line type="monotone" dataKey="health" name="Crop health" stroke="#379c4f" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water usage */}
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
            <BarChart3 className="h-5 w-5 text-sun-600" aria-hidden /> {t("rep.waterUsage")}
          </h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterRecords} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#2c5373" }} />
                <YAxis tick={{ fontSize: 12, fill: "#2c5373" }} />
                <Tooltip />
                <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                <Bar dataKey="liters" name="Litres" radius={[6, 6, 0, 0]}>
                  {waterRecords.map((w) => (
                    <Cell key={w.date} fill={w.liters <= 650 ? "#379c4f" : "#69c087"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detection records table */}
      <div className="mt-6 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
            <Table2 className="h-5 w-5 text-navy-500" aria-hidden /> {t("rep.detections")}
          </h2>
          <span className="text-sm text-navy-400">{t("rep.period")}: Jun – Nov 2026</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-125 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                <th className="px-3 py-2.5">{t("common.date")}</th>
                <th className="px-3 py-2.5">{t("farm.name")}</th>
                <th className="px-3 py-2.5">Result</th>
                <th className="px-3 py-2.5">{t("common.status")}</th>
                <th className="px-3 py-2.5">{t("common.confidence")}</th>
              </tr>
            </thead>
            <tbody>
              {detectionRecords.map((d) => (
                <tr key={d.id} className="border-b border-navy-50 hover:bg-navy-50/50">
                  <td className="px-3 py-3 text-navy-600">{d.date}</td>
                  <td className="px-3 py-3 font-semibold text-navy-900">{d.crop}</td>
                  <td className="px-3 py-3 text-navy-700">{d.result}</td>
                  <td className="px-3 py-3">
                    <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy-800">{d.confidence}%</span>
                      <span className="h-2 w-16 overflow-hidden rounded-full bg-navy-100">
                        <span className={`block h-full rounded-full ${d.status === "healthy" ? "bg-leaf-500" : "bg-red-400"}`} style={{ width: `${d.confidence}%` }} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-navy-400">
        💡 {t("rep.printHint")}{" "}
        <Link to="/irrigation" className="font-semibold text-leaf-700 underline">{t("nav.dashboard")}</Link>
      </p>
    </div>
  )
}