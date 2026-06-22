"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Producto {
  id:         string
  nombre:     string
  descripcion: string | null
  precio:     number
  imagen_url: string | null
  tipo_pan:   string
}

const EMPTY: Producto = { id: "", nombre: "Sin seleccionar", descripcion: null, precio: 0, imagen_url: null, tipo_pan: "" }

const TIPO_LABEL: Record<string, string> = {
  caja: "Caja", hogaza: "Hogaza", baguette: "Baguette", pizza: "Pizza",
}

export default function AdminMasCompradosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [slots,     setSlots]     = useState<[string, string, string]>(["hg-basico", "cj-capricho", "cj-fino"])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState("")
  const [busqueda,  setBusqueda]  = useState("")
  const [slotAct,   setSlotAct]   = useState<0 | 1 | 2 | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/productos").then((r) => r.json()),
      fetch("/api/admin/mas-comprados").then((r) => r.json()),
    ])
      .then(([prods, mc]) => {
        if (Array.isArray(prods)) setProductos(prods)
        else { setError(prods.error ?? "Error"); return }
        if (Array.isArray(mc) && mc.length === 3) {
          setSlots([mc[0].producto_id, mc[1].producto_id, mc[2].producto_id])
        }
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    const items = slots.map((id, i) => ({ posicion: i + 1, producto_id: id }))
    const res = await fetch("/api/admin/mas-comprados", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const { error: msg } = await res.json()
      setError(msg ?? "Error al guardar")
    }
  }

  function selectProduct(id: string) {
    if (slotAct === null) return
    const next = [...slots] as [string, string, string]
    next[slotAct] = id
    setSlots(next)
    setSlotAct(null)
    setBusqueda("")
  }

  function getProducto(id: string): Producto {
    return productos.find((p) => p.id === id) ?? EMPTY
  }

  const filtrados = busqueda
    ? productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : productos

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">
          Panes más comprados
        </h1>
        <p className="text-[var(--color-pan-500)] text-sm">
          Selecciona los 3 panes que aparecen en la sección de inicio.
          Haz clic en un slot para elegir un producto diferente.
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-[var(--color-pan-400)]">
          <p className="text-4xl mb-3 animate-pulse">🥖</p>
          <p className="text-sm">Cargando…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm mb-6">
          <p className="font-semibold mb-1">Error</p>
          <p>{error}</p>
          {error.includes("SUPABASE") && (
            <p className="mt-2 text-xs text-red-500">
              Configura las variables de Supabase en Vercel para guardar cambios.
            </p>
          )}
        </div>
      )}

      {!loading && (
        <>
          {/* Los 3 slots */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {([0, 1, 2] as const).map((i) => {
              const p = getProducto(slots[i])
              const active = slotAct === i
              return (
                <button
                  key={i}
                  onClick={() => setSlotAct(active ? null : i)}
                  className={`rounded-2xl border-2 overflow-hidden text-left transition-all
                    ${active
                      ? "border-[var(--color-pan-600)] shadow-lg ring-2 ring-[var(--color-pan-300)]"
                      : "border-[var(--color-pan-200)] hover:border-[var(--color-pan-400)]"}`}
                >
                  {/* Imagen */}
                  <div className="relative h-32 bg-[var(--color-pan-100)]">
                    {p.imagen_url ? (
                      <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-pan-300)]">
                        <span className="text-3xl">🍞</span>
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${active ? "bg-[var(--color-pan-700)] text-white" : "bg-white/80 text-[var(--color-pan-700)]"}`}>
                      {i + 1}
                    </div>
                    {active && (
                      <div className="absolute inset-0 bg-[var(--color-pan-900)]/30 flex items-center justify-center">
                        <span className="bg-white text-[var(--color-pan-900)] text-xs font-bold px-3 py-1.5 rounded-full">
                          Eligiendo…
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Nombre */}
                  <div className="p-3 bg-white">
                    <p className="text-[var(--color-pan-900)] text-xs font-semibold leading-tight">
                      {p.nombre}
                    </p>
                    {p.tipo_pan && (
                      <p className="text-[var(--color-pan-400)] text-[10px] mt-0.5">
                        {TIPO_LABEL[p.tipo_pan] ?? p.tipo_pan}
                      </p>
                    )}
                    <p className="text-[var(--color-pan-500)] text-[10px] mt-1.5 font-medium">
                      {active ? "Haz clic abajo para cambiar →" : "Clic para cambiar"}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Panel de selección */}
          {slotAct !== null && (
            <div className="border-2 border-[var(--color-pan-300)] rounded-2xl bg-[var(--color-pan-50)] p-5 mb-6">
              <p className="text-[var(--color-pan-700)] text-sm font-semibold mb-3">
                Elige el pan para el slot {slotAct + 1}:
              </p>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar pan…"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm
                             focus:outline-none focus:border-[var(--color-pan-400)]"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
                {filtrados.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectProduct(p.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all
                      ${slots[slotAct] === p.id
                        ? "bg-[var(--color-pan-700)] text-white border-[var(--color-pan-700)]"
                        : "bg-white border-gray-200 hover:border-[var(--color-pan-400)] text-[var(--color-pan-800)]"}`}
                  >
                    <span className="font-semibold leading-tight block line-clamp-2">{p.nombre}</span>
                    <span className={`text-[10px] mt-0.5 block ${slots[slotAct] === p.id ? "text-white/70" : "text-[var(--color-pan-400)]"}`}>
                      ${p.precio} · {TIPO_LABEL[p.tipo_pan] ?? p.tipo_pan}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón guardar */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all
                ${saved
                  ? "bg-green-600 text-white"
                  : "bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white disabled:opacity-60"}`}
            >
              {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar selección"}
            </button>
            {saved && (
              <p className="text-green-700 text-sm">
                Los cambios se reflejarán en la página de inicio.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
