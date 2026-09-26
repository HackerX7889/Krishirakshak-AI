import { useRef, useState } from "react"
import type { ChangeEvent, DragEvent } from "react"
import { Camera, ImagePlus, UploadCloud, X } from "lucide-react"

interface UploadAreaProps {
  image: string | null
  onImage: (dataUrl: string | null) => void
  uploadHint: string
  buttons: { camera: string; choose: string }
}

export default function UploadArea({ image, onImage, uploadHint, buttons }: UploadAreaProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [cameraError, setCameraError] = useState(false)

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => onImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) readFile(file)
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) readFile(file)
    e.target.value = ""
  }

  const openCamera = () => {
    setCameraError(false)
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) readFile(file)
    }
    input.click()
  }

  if (image) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-leaf-300 bg-leaf-50 p-2">
        <img src={image} alt="Selected leaf for analysis" className="h-64 w-full rounded-xl object-cover" />
        <button
          type="button"
          onClick={() => onImage(null)}
          className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-navy-950/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur hover:bg-navy-950/90"
        >
          <X className="h-4 w-4" aria-hidden /> Change Photo
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            fileRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-leaf-500 bg-leaf-50" : "border-navy-300 bg-navy-50/40 hover:bg-leaf-50"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-leaf-600 shadow-sm">
          <UploadCloud className="h-8 w-8" aria-hidden />
        </div>
        <p className="font-semibold text-navy-800">{uploadHint}</p>
        <p className="text-sm text-navy-500">JPG / PNG / WebP</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={openCamera}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          <Camera className="h-5 w-5" aria-hidden /> {buttons.camera}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-navy-200 px-5 py-3 font-semibold text-navy-800 transition-colors hover:border-leaf-500 hover:text-leaf-700"
        >
          <ImagePlus className="h-5 w-5" aria-hidden /> {buttons.choose}
        </button>
      </div>

      {cameraError && (
        <p className="mt-3 text-sm text-red-600">Camera access was denied. Please choose a photo instead.</p>
      )}
    </div>
  )
}