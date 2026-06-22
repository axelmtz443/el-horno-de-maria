"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import ImageUploader from "@/components/admin/ImageUploader"

interface Producto {
  id:              string
  nombre:          string
  descripcion:     string | null
  precio:          number
  precio_integral: number
  imagen_url:      string | null
  disponible:      boolean
  tipo_pan:        string
  categoria:       string
}

// ─── Modal de edición ────────────────────────────────────────────────────────

function EditModal({
  producto,
  onSave,
  onClose,
}: {
  producto: Producto
  onSave: (id: string, fields: Partial<Producto>) => Promise<void>
  onClose: () => void
}) {
  const [nombre,         setNombre]         = useState(producto.nombre)
  const [descripcion,    setDescripcion]    = useState(producto.descripcion ?? "")
  const [precio,         setPrecio]         = useState(String(producto.precio))
  const [precioIntegral, setPrecioIntegral] = useState(String(producto.precio_integral))
  const [imagenUrl,      setImagenUrl]      = useState(producto.imagen_url ?? "")
  const [saving,         setSaving]         = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(producto.id, {
      nombre:          nombre.trim() || producto.nombre,
      descripcion:     descripcion.trim() || null,
      precio:          Number(precio)         || producto.precio,
      precio_integral: Number(precioIntegral) || producto.precio_integral,
      imagen_url:      imagenUrl.trim()       || null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 overflow-y-auto py-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        {/* Cabecera */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[var(--color-pan-400)] text-xs uppercase tracking-wide mb-0.5">
              {producto.tipo_pan} · {producto.categoria}
            </p>
            <h2 className="font-serif text-lg font-bold text-[var(--color-pan-900)]">{producto.nombre}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4">✕</button>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Nombre del pan</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
            />
          </div>

          {/* Descripción / ingredientes */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">
              Descripción / ingredientes <span className="text-[var(--color-pan-400)] font-normal">(aparece en el catálogo y en los panes destacados)</span>
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Ej: Pasas, canela, arándano, nuez y pepitas de calabaza"
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)] resize-none"
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio natural ($MXN)</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
              />
            </div>
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio integral ($MXN)</label>
              <input
                type="number"
                value={precioIntegral}
                onChange={(e) => setPrecioIntegral(e.target.value)}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-2">Foto del pan</label>
            <ImageUploader
              currentUrl={producto.imagen_url}
              onUrlReady={(u) => setImagenUrl(u)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white
                       font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button onClick={onClose}
            className="px-5 border border-[var(--color-pan-300)] text-[var(--color-pan-600)] hover:bg-[var(--color-pan-100)]
                       font-medium py-2.5 rounded-xl text-sm transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

const TIPOS: Record<string, string> = {
  caja:     "Pan de Caja",
  hogaza:   "Pan de Hogaza",
  baguette: "Baguette",
  pizza:    "Pan para Pizza",
}

export default function AdminProductosPage() {
  const [productos,  setProductos]  = useState<Producto[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState("")
  const [editando,   setEditando]   = useState<Producto | null>(null)
  const [busqueda,   setBusqueda]   = useState("")
  const [tipoActivo, setTipoActivo] = useState<string>("todos")
  const [savedId,    setSavedId]    = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProductos(data)
        else setError(data.error ?? "Error al cargar")
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(id: string, fields: Partial<Producto>) {
    const res = await fetch("/api/admin/productos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    })
    if (res.ok) {
      setProductos((prev) => prev.map((p) => p.id === id ? { ...p, ...fields } : p))
      setSavedId(id)
      setTimeout(() => setSavedId(null), 2500)
    }
  }

  const tipos = ["todos", ...Object.keys(TIPOS)]

  const filtrados = productos.filter((p) => {
    const matchTipo = tipoActivo === "todos" || p.tipo_pan === tipoActivo
    const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusq
  })

  const stats = {
    total:    productos.length,
    conImg:   productos.filter((p) => p.imagen_url).length,
    editados: productos.filter((p) => p.imagen_url || p.descripcion).length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">Gestión de productos</h1>
        <p className="text-[var(--color-pan-500)] text-sm">
          Edita nombres, descripciones, precios e imágenes de cada pan.
        </p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total productos", value: stats.total,    color: "text-[var(--color-pan-800)]" },
            { label: "Con imagen",      value: stats.conImg,   color: "text-green-700" },
            { label: "Con descripción", value: stats.editados, color: "text-blue-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      {!loading && !error && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pan…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm
                         focus:outline-none focus:border-[var(--color-pan-400)] transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tipos.map((t) => (
              <button
                key={t}
                onClick={() => setTipoActivo(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${tipoActivo === t
                    ? "bg-[var(--color-pan-700)] text-white border-[var(--color-pan-700)]"
                    : "border-gray-300 text-gray-600 hover:border-[var(--color-pan-400)]"}`}
              >
                {t === "todos" ? "Todos" : TIPOS[t]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Estados */}
      {loading && (
        <div className="text-center py-20 text-[var(--color-pan-400)]">
          <p className="text-4xl mb-3 animate-pulse">🥖</p>
          <p className="text-sm">Cargando productos…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm">
          <p className="font-semibold mb-1">Error al cargar</p>
          <p>{error}</p>
          {error.includes("SUPABASE") && (
            <p className="mt-2 text-xs text-red-500">
              Agrega <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
              <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> en Vercel.
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <p className="text-xs text-gray-400 mb-4">{filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => setEditando(producto)}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden group cursor-pointer
                  transition-all hover:shadow-md
                  ${savedId === producto.id ? "ring-2 ring-green-400 border-green-300" : "border-gray-200"}`}
              >
                {/* Imagen */}
                <div className="relative h-28 bg-[var(--color-pan-100)]">
                  {producto.imagen_url ? (
                    <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-pan-300)]">
                      <span className="text-2xl">🍞</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-[var(--color-pan-900)] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition-opacity">
                      ✏️ Editar
                    </span>
                  </div>
                  {!producto.imagen_url && (
                    <span className="absolute top-1.5 left-1.5 bg-orange-100 text-orange-700 text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                      Sin foto
                    </span>
                  )}
                  {savedId === producto.id && (
                    <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="p-2.5">
                  <p className="text-[var(--color-pan-900)] text-xs font-semibold leading-tight line-clamp-2 mb-0.5">
                    {producto.nombre}
                  </p>
                  <p className="text-[var(--color-pan-400)] text-[10px]">
                    ${producto.precio} / ${producto.precio_integral} integral
                  </p>
                  {producto.descripcion && (
                    <p className="text-[var(--color-pan-500)] text-[10px] mt-0.5 italic line-clamp-1">
                      {producto.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {filtrados.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm">Sin resultados para "{busqueda}"</p>
              </div>
            )}
          </div>
        </>
      )}

      {editando && (
        <EditModal producto={editando} onSave={handleSave} onClose={() => setEditando(null)} />
      )}
    </div>
  )
}
