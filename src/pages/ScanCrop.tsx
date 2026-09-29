import { useEffect, useMemo, useState } from "react"
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
  Cpu,
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { analyzeCrop, fetchAiStatus } from "../services/diseaseApi"
import type { AnalysisSource } from "../services/diseaseApi"
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
type RichResult = DiseaseResult & { severity?: string; advice?: string }

export default function ScanCrop() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { show } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>("idle")
  const [result, setResult] = useState<RichResult | null>(null)
  const [source, setSource] = useState<AnalysisSource | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [aiModel, setAiModel] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchAiStatus().then((s) => {
      if (alive) setAiModel(s.configured ? s.model : null)
    })
    return () => {
      alive = false
    }
  }, [])

  const analyze = async (sample?: keyof typeof diseaseSamples) => {
    setPhase("analyzing")
    setNotice(null)

    const outcome = await analyzeCrop({
      imageDataUrl: sample ? undefined : (image ?? undefined),
      sample,
      crop: user?.cropType,
      lang,
      location: [user?.farmName, user?.location].filter(Boolean).join(", ") || undefined,
    })

    setResult(outcome.result)
    setSource(outcome.source)
    setNotice(outcome.notice ?? null)
    setPhase("done")
    if (outcome.source === "ai") {
      show(t("toast.analysisDone"), "success")
    } else {
      show(outcome.notice ?? t("scan.aiFallback"), "info")
    }
  }

  const runSample = (key: keyof typeof diseaseSamples) => {
    setImage(null)
    void analyze(key)
  }

  const canAnalyze = image !== null && phase !== "analyzing"

  const resultCard = useMemo(
    () => (result ? <ResultCard result={result} source={source} model={aiModel} /> : null),
    [result, source, aiModel],
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
                onClick={() => void analyze()}
              >
                <ScanLine className="h-5 w-5" aria-hidden /> {phase === "analyzing" ? t("common.analyzing") : t("scan.analyze")}
              </Button>
            )}
            {phase === "analyzing" && <p className="mt-3 text-center text-sm text-navy-500">{t("scan.analyzingNote")}</p>}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-navy-400">
              <Cpu className="h-3.5 w-3.5" aria-hidden />
              {aiModel ? `${t("scan.aiModel")}: ${aiModel}` : t("scan.aiNotConfigured")}
            </p>
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

          {phase === "done" && notice && (
            <div className="mb-4">
              <Alert kind="info" title={t("scan.aiFallback")} icon={<Cpu className="h-5 w-5 shrink-0 text-navy-500" aria-hidden />}>
                <p>{notice}</p>
              </Alert>
            </div>
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

function ResultCard({
  result,
  source,
  model,
}: {
  result: RichResult
  source: AnalysisSource | null
  model: string | null
}) {
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

  const fromAi = source === "ai"
  const severity = (result.severity ?? "").toLowerCase()

  return (
    <div className={`overflow-hidden rounded-3xl border-2 ${colorMap.card} shadow-lg`}>
      <div className={`${colorMap.header} px-5 py-4 text-white`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            {healthy ? <Leaf className="h-5 w-5" aria-hidden /> : <AlertTriangle className="h-5 w-5" aria-hidden />}
            {t("scan.resultTitle")}
          </h2>
          <div className="flex items-center gap-2">
            {severity && !healthy && (
              <span className="rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                {t(`scan.severity.${severity}`)}
              </span>
            )}
            <Badge tone={healthy ? "green" : "red"} className="border-white/30 bg-white/20 text-white">
              {healthy ? t("common.healthy") : t("common.diseased")}
            </Badge>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
          <Cpu className="h-3.5 w-3.5" aria-hidden />
          {fromAi ? `${t("scan.sourceAi")}${model ? ` — ${model}` : ""}` : t("scan.sourceMock")}
        </p>
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

        {result.advice && (
          <div className="rounded-2xl border border-navy-200 bg-white p-4 text-sm text-navy-800">
            <p className="mb-1 flex items-center gap-2 font-bold">
              <Sparkles className="h-4 w-4" aria-hidden /> {t("scan.advice")}
            </p>
            <p>{result.advice}</p>
          </div>
        )}

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

        {result.fertilizer && (
          <div className="rounded-2xl border border-sun-200 bg-sun-50 p-4">
            <p className="mb-2 text-sm font-bold text-sun-800">🌱 {t("scan.fertilizer")}</p>
            <p className="text-sm text-sun-900">{result.fertilizer}</p>
          </div>
        )}

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
