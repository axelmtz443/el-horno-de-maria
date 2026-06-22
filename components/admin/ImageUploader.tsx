"use client"

import Image from "next/image"
import { useRef, useState } from "react"

interface Props {
  currentUrl?: string | null
  onUrlReady: (url: string) => void
}

export default function ImageUploader({ currentUrl, onUrlReady }: Props) {
  const [preview,    setPreview]   = useState(currentUrl ?? "")
  const [dragging,   setDragging]  = useState(false)
  const [uploading,  setUploading] = useState(false)
  const [uploadErr,  setUploadErr] = useState("")
  const [imgErr,     setImgErr]    = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadErr("Solo se aceptan imágenes (JPG, PNG, WEBP…)")
      return
    }

    // Preview inmediato (antes de subir)
    const local = URL.createObjectURL(file)
    setPreview(local)
    setImgErr(false)
    setUploadErr("")
    setUploading(true)

    try {
      const form = new FormData()
      form.append("file", file)

      const res  = await fetch("/api/admin/upload", { method: "POST", body: form })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? "Error al subir")

      setPreview(json.url)
      onUrlReady(json.url)
    } catch (e: unknown) {
      setUploadErr(e instanceof Error ? e.message : "Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  return (
    <div className="space-y-2">
      {/* Zona de drop */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative h-44 rounded-xl border-2 border-dashed overflow-hidden transition-all
          ${uploading ? "cursor-wait opacity-70" : "cursor-pointer"}
          ${dragging
            ? "border-[var(--color-pan-600)] bg-[var(--color-pan-50)] scale-[1.01]"
            : "border-[var(--color-pan-300)] hover:border-[var(--color-pan-500)] bg-[var(--color-pan-50)]"}`}
      >
        {preview && !imgErr ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized
              onError={() => setImgErr(true)} />
            {/* Overlay hover */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors
                              flex items-center justify-center">
                <span className="opacity-0 hover:opacity-100 transition-opacity
                                 bg-white text-[var(--color-pan-900)] text-xs font-bold
                                 px-4 py-2 rounded-full shadow">
                  📁 Cambiar foto
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2
                          text-[var(--color-pan-400)] select-none">
            <span className="text-4xl">{dragging ? "⬇️" : "🖼️"}</span>
            <p className="text-sm font-semibold text-[var(--color-pan-600)]">
              {dragging ? "Suelta la foto aquí" : "Arrastra una foto o haz clic"}
            </p>
            <p className="text-xs">JPG, PNG, WEBP — máx. 5 MB</p>
          </div>
        )}

        {/* Overlay subiendo */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-[var(--color-pan-600)] border-t-transparent
                            rounded-full animate-spin" />
            <p className="text-[var(--color-pan-700)] text-xs font-semibold">Subiendo foto…</p>
          </div>
        )}

        {/* Drag overlay */}
        {dragging && !uploading && (
          <div className="absolute inset-0 bg-[var(--color-pan-100)]/80 flex items-center justify-center">
            <p className="text-[var(--color-pan-700)] font-bold text-sm">Suelta aquí ↓</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />

      {/* Error de upload */}
      {uploadErr && (
        <p className="text-red-600 text-xs flex items-center gap-1">
          <span>⚠️</span> {uploadErr}
        </p>
      )}

      {/* URL alternativa (colapsable) */}
      <details className="group">
        <summary className="text-[var(--color-pan-400)] text-xs cursor-pointer
                            hover:text-[var(--color-pan-600)] list-none flex items-center gap-1 w-fit">
          <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
          Pegar URL en lugar de subir foto
        </summary>
        <input
          type="url"
          defaultValue={currentUrl ?? ""}
          onBlur={(e) => {
            const val = e.target.value.trim()
            if (val) { setPreview(val); setImgErr(false); onUrlReady(val) }
          }}
          placeholder="https://…"
          className="mt-1.5 w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2
                     text-sm text-[var(--color-pan-900)] focus:outline-none
                     focus:border-[var(--color-pan-500)] transition-colors"
        />
      </details>
    </div>
  )
}
