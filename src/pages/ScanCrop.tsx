import { useMemo, useState } from "react"
import {
  Camera,
  ScanLine,
  Leaf,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Image as ImageIcon,
  Stethoscope,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useToast } from "../contexts/ToastContext"
import { diseaseSamples } from "../data/mockData"
import type { DiseaseResult } from "../types"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Badge from "../components/Badge"
import Alert from "../components/Alert"
import UploadArea from "../components/UploadArea"
import EmptyState from "../components/EmptyState"
import Spinner from "../components/Spinner"
import DetectionFlowChart from "../components/DetectionFlowChart"

type Phase = "idle" | "analyzing" | "done"

export default function ScanCrop() {
  const { t } = useLanguage()
  const { show } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>("idle")
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [activeSample, setActiveSample] = useState<keyof typeof diseaseSamples | null>(null)


  const analyze = (sample?: keyof typeof diseaseSamples) => {
    setPhase("analyzing")
    // Mock 2.4s AI analysis delay — replace with real inference API later.
    window.setTimeout(() => {
      const r =
        sample && diseaseSamples[sample]
          ? diseaseSamples[sample]
          : activeSample && diseaseSamples[activeSample]
            ? diseaseSamples[activeSample]
            : diseaseSamples.sample2
      setResult(r)
      setPhase("done")
      show(t("toast.analysisDone"), "success")
    }, 2400)
  }

  const runSample = (key: keyof typeof diseaseSamples) => {
    setActiveSample(key)
    setImage(null)
    analyze(key)
  }

  const canAnalyze = image !== null && phase !== "analyzing"

  const resultCard = useMemo(
    () => (result ? <ResultCard result={result} /> : null),
    [result],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("scan.title")}
        subtitle={t("scan.subtitle")}
        icon={<Stethoscope className="h-6 w-6" aria-hidden />}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Left: upload */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <ImageIcon className="h-5 w-5 text-leaf-600" aria-hidden /> {t("scan.uploadTitle")}
            </h2>

            <div className="mt-4">
              <UploadArea
                image={image}
                onImage={setImage}
                uploadHint={t("scan.uploadHint")}
                buttons={{ camera: t("scan.camera"), choose: t("scan.choosePhoto") }}
              />
            </div>

            {image && (
              <Button
                size="lg"
                fullWidth
                className="mt-4"
                loading={phase === "analyzing"}
                disabled={!canAnalyze}
                onClick={() => analyze()}
              >
                <ScanLine className="h-5 w-5" aria-hidden /> {phase === "analyzing" ? t("common.analyzing") : t("scan.analyze")}
              </Button>
            )}
            {phase === "analyzing" && <p className="mt-3 text-center text-sm text-navy-500">{t("scan.analyzingNote")}</p>}
          </div>

          {/* Sample results */}
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <Sparkles className="h-5 w-5 text-sun-600" aria-hidden /> {t("scan.sampleLabel")}
            </h2>
            <p className="mt-1 text-sm text-navy-600">{t("scan.sampleResult")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SampleButton label={t("scan.sample1")} tone="green" onClick={() => runSample("sample1")} />
              <SampleButton label={t("scan.sample2")} tone="red" onClick={() => runSample("sample2")} />
              <SampleButton label={t("scan.sample3")} tone="yellow" onClick={() => runSample("sample3")} />
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-3xl bg-navy-950 p-5 text-white sm:p-6">
            <h2 className="font-display text-lg font-bold">{t("scan.howWorks")}</h2>
            <ul className="mt-3 space-y-2 text-sm text-navy-200">
              <li>1️⃣ {t("scan.stepUpload")}</li>
              <li>🤖 {t("scan.stepAi")}</li>
              <li>🗣️ {t("scan.stepAdvice")}</li>
            </ul>
          </div>
        </div>

        {/* Right: results */}
        <div>
          {phase === "analyzing" && (
            <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
              <Spinner label={t("common.analyzing")} />
            </div>
          )}

          {phase === "idle" && !image && (
            <EmptyState
              title={t("scan.noPhoto")}
              hint={t("scan.noPhotoHint")}
              icon={<Camera className="h-7 w-7" aria-hidden />}
            />
          )}

          {phase === "done" && resultCard}
        </div>
      </div>

      {/* Detection flow chart */}
      <DetectionFlowChart />

      {/* Disclaimer */}
      <div className="mt-10">
        <Alert kind="warning" title={t("scan.disclaimer")} icon={<ShieldCheck className="h-5 w-5 shrink-0 text-sun-700" aria-hidden />}>
          <p>{t("scan.disclaimer")}</p>
        </Alert>
      </div>
    </div>
  )
}

function SampleButton({
  label,
  tone,
  onClick,
}: {
  label: string
  tone: "green" | "red" | "yellow"
  onClick: () => void
}) {
  const tones = {
    green: "border-leaf-300 bg-leaf-50 text-leaf-800 hover:bg-leaf-100",
    red: "border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
    yellow: "border-sun-300 bg-sun-50 text-sun-800 hover:bg-sun-100",
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-3 text-left text-sm font-semibold transition-colors ${tones[tone]}`}
    >
      {label}
    </button>
  )
}

function ResultCard({ result }: { result: DiseaseResult }) {
  const { t } = useLanguage()
  const healthy = result.status === "healthy"
  const accent = healthy ? "leaf" : result.status === "warning" ? "sun" : "red"

  const colorMap = {
    leaf: {
      card: "border-leaf-300 bg-white",
      header: "bg-leaf-600",
      chip: "bg-leaf-100 text-leaf-800 border-leaf-200",
    },
    sun: {
      card: "border-sun-300 bg-white",
      header: "bg-sun-500",
      chip: "bg-sun-100 text-sun-800 border-sun-200",
    },
    red: {
      card: "border-red-300 bg-white",
      header: "bg-red-600",
      chip: "bg-red-100 text-red-800 border-red-200",
    },
  }[accent]

  return (
    <div className={`overflow-hidden rounded-3xl border-2 ${colorMap.card} shadow-lg`}>
      <div className={`${colorMap.header} px-5 py-4 text-white`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            {healthy ? <Leaf className="h-5 w-5" aria-hidden /> : <AlertTriangle className="h-5 w-5" aria-hidden />}
            {t("scan.resultTitle")}
          </h2>
          <Badge tone={healthy ? "green" : "red"} className="border-white/30 bg-white/20 text-white">
            {healthy ? t("common.healthy") : t("common.diseased")}
          </Badge>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Confidence bar */}
        <div>
          <div className="flex items-center justify-between text-sm font-semibold text-navy-800">
            <span>{t("common.confidence")}</span>
            <span>{result.confidence}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-navy-100">
            <div
              className={`h-full rounded-full ${healthy ? "bg-leaf-500" : "bg-red-500"}`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox label={t("scan.crop")} value={result.cropName} />
          <InfoBox label={t("scan.disease")} value={result.diseaseName} />
        </div>

        <div className={`rounded-2xl border p-4 ${colorMap.chip}`}>
          <p className="mb-2 flex items-center gap-2 text-sm font-bold">
            <HeartPulse className="h-4 w-4" aria-hidden /> {t("scan.symptoms")}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.symptoms.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-navy-50 p-4">
          <p className="mb-2 text-sm font-bold text-navy-900">💊 {t("scan.treatment")}</p>
          <p className="text-sm text-navy-700">{result.treatment}</p>
        </div>

        <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-4">
          <p className="mb-2 text-sm font-bold text-leaf-800">🛡️ {t("scan.prevention")}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-leaf-900">
            {result.prevention.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <p className="text-right text-xs text-navy-400">{t("common.date")}: {result.scannedAt}</p>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-navy-100 p-3.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</p>
      <p className="mt-1 font-semibold text-navy-900">{value}</p>
    </div>
  )
}
