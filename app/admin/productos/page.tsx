"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import ImageUploader from "@/components/admin/ImageUploader"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Producto {
  id:              string
  nombre:          string
  descripcion:     string | null
  ingredientes:    string[] | null
  precio:          number
  precio_integral: number
  imagen_url:      string | null
  disponible:      boolean
  tipo_pan:        string
  categoria:       string
  is_custom:       boolean
}

const TIPOS: Record<string, string> = {
  caja:     "Pan de Caja",
  hogaza:   "Pan de Hogaza",
  baguette: "Baguette",
  pizza:    "Pan para Pizza",
}

// ─── Modal de edición ────────────────────────────────────────────────────────

function EditModal({
  producto,
  onSave,
  onDelete,
  onClose,
}: {
  producto: Producto
  onSave:   (id: string, fields: Partial<Producto>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose:  () => void
}) {
  const [nombre,         setNombre]         = useState(producto.nombre)
  const [descripcion,    setDescripcion]    = useState(producto.descripcion ?? "")
  const [tags,           setTags]           = useState<string[]>(producto.ingredientes ?? [])
  const [newTag,         setNewTag]         = useState("")
  const [precio,         setPrecio]         = useState(String(producto.precio))
  const [precioIntegral, setPrecioIntegral] = useState(String(producto.precio_integral))
  const [imagenUrl,      setImagenUrl]      = useState(producto.imagen_url ?? "")
  const [saving,         setSaving]         = useState(false)
  const [deleting,       setDeleting]       = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(false)

  function addTag() {
    const t = newTag.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setNewTag("")
  }

  async function handleSave() {
    setSaving(true)
    await onSave(producto.id, {
      nombre:          nombre.trim() || producto.nombre,
      descripcion:     descripcion.trim() || null,
      ingredientes:    tags.length > 0 ? tags : null,
      precio:          Number(precio)         || producto.precio,
      precio_integral: Number(precioIntegral) || producto.precio_integral,
      imagen_url:      imagenUrl.trim()       || null,
    })
    setSaving(false)
    onClose()
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 4000)
      return
    }
    setDeleting(true)
    await onDelete(producto.id)
    setDeleting(false)
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
              {TIPOS[producto.tipo_pan] ?? producto.tipo_pan} · {producto.categoria}
              {producto.is_custom && (
                <span className="ml-2 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] normal-case tracking-normal">
                  personalizado
                </span>
              )}
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

          {/* Descripción */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">
              Descripción <span className="text-[var(--color-pan-400)] font-normal">(texto breve bajo el nombre)</span>
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Sin ingredientes adicionales"
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
            />
          </div>

          {/* Ingredientes extras */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1.5">
              Ingredientes extras
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
              {tags.map((t) => (
                <span key={t}
                  className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full
                             bg-[var(--color-pan-700)] text-white">
                  {t}
                  <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}
                    className="hover:opacity-70 transition-opacity leading-none ml-0.5">×</button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-[11px] text-[var(--color-pan-300)] italic">Sin ingredientes extras</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Ej: Nuez, canela, chocolate…"
                className="flex-1 border border-[var(--color-pan-300)] rounded-xl px-3 py-2 text-xs
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
              />
              <button type="button" onClick={addTag}
                className="px-4 py-2 bg-[var(--color-pan-200)] hover:bg-[var(--color-pan-300)]
                           text-[var(--color-pan-800)] text-xs font-semibold rounded-xl transition-colors">
                + Agregar
              </button>
            </div>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio natural ($MXN)</label>
              <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio integral ($MXN)</label>
              <input type="number" value={precioIntegral} onChange={(e) => setPrecioIntegral(e.target.value)}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-2">Foto del pan</label>
            <ImageUploader currentUrl={producto.imagen_url} onUrlReady={(u) => setImagenUrl(u)} />
          </div>
        </div>

        {/* Botones de acción */}
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

        {/* Eliminar pan */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors border
              ${confirmDelete
                ? "bg-red-600 text-white border-red-600"
                : "text-red-500 border-red-200 hover:bg-red-50"}`}
          >
            {deleting
              ? "Eliminando…"
              : confirmDelete
                ? "⚠️ Confirmar — se eliminará permanentemente"
                : "🗑️ Eliminar pan"}
          </button>
          {confirmDelete && (
            <p className="text-[10px] text-gray-400 text-center mt-1">
              Esta acción no se puede deshacer
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Modal agregar pan ────────────────────────────────────────────────────────

function AgregarPanModal({
  onSave,
  onClose,
}: {
  onSave:  (data: Omit<Producto, "id" | "is_custom" | "disponible" | "imagen_url">) => Promise<void>
  onClose: () => void
}) {
  const [nombre,         setNombre]         = useState("")
  const [tipoPan,        setTipoPan]        = useState("caja")
  const [categoria,      setCategoria]      = useState("")
  const [precio,         setPrecio]         = useState("")
  const [precioIntegral, setPrecioIntegral] = useState("")
  const [tags,           setTags]           = useState<string[]>([])
  const [newTag,         setNewTag]         = useState("")
  const [saving,         setSaving]         = useState(false)
  const [err,            setErr]            = useState("")

  function addTag() {
    const t = newTag.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setNewTag("")
  }

  async function handleSave() {
    if (!nombre.trim() || !categoria.trim() || !precio) {
      setErr("Nombre, categoría y precio son obligatorios")
      return
    }
    setSaving(true)
    setErr("")
    await onSave({
      nombre:          nombre.trim(),
      descripcion:     null,
      tipo_pan:        tipoPan,
      categoria:       categoria.trim(),
      precio:          Number(precio),
      precio_integral: Number(precioIntegral) || Number(precio) + 5,
      ingredientes:    tags.length > 0 ? tags : null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 overflow-y-auto py-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg font-bold text-[var(--color-pan-900)]">Agregar pan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Nombre *</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pan de Romero y Aceitunas"
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Tipo de pan *</label>
              <select value={tipoPan} onChange={(e) => setTipoPan(e.target.value)}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]">
                <option value="caja">🍞 Pan de Caja</option>
                <option value="hogaza">🫓 Pan de Hogaza</option>
                <option value="baguette">🥖 Baguette</option>
                <option value="pizza">🍕 Pan para Pizza</option>
              </select>
            </div>
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Categoría *</label>
              <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ej: Gourmet, Especiales…"
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio natural ($MXN) *</label>
              <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="65"
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio integral ($MXN)</label>
              <input type="number" value={precioIntegral} onChange={(e) => setPrecioIntegral(e.target.value)}
                placeholder={precio ? String(Number(precio) + 5) : "auto +$5"}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1.5">Ingredientes extras</label>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
              {tags.map((t) => (
                <span key={t}
                  className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-[var(--color-pan-700)] text-white">
                  {t}
                  <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}
                    className="hover:opacity-70 ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Agregar ingrediente…"
                className="flex-1 border border-[var(--color-pan-300)] rounded-xl px-3 py-2 text-xs
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
              <button type="button" onClick={addTag}
                className="px-4 py-2 bg-[var(--color-pan-200)] hover:bg-[var(--color-pan-300)]
                           text-[var(--color-pan-800)] text-xs font-semibold rounded-xl transition-colors">+</button>
            </div>
          </div>

          {err && <p className="text-red-600 text-xs">{err}</p>}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white
                       font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? "Guardando…" : "Agregar pan"}
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

export default function AdminPanesPage() {
  const [productos,     setProductos]     = useState<Producto[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState("")
  const [editando,      setEditando]      = useState<Producto | null>(null)
  const [mostrarAgreg,  setMostrarAgreg]  = useState(false)
  const [busqueda,      setBusqueda]      = useState("")
  const [tipoActivo,    setTipoActivo]    = useState<string>("todos")
  const [savedId,       setSavedId]       = useState<string | null>(null)

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

  async function handleDelete(id: string) {
    const res = await fetch("/api/admin/productos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleCreate(data: Omit<Producto, "id" | "is_custom" | "disponible" | "imagen_url">) {
    const res = await fetch("/api/admin/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const json = await res.json()
      const nuevo: Producto = { ...data, id: json.id, is_custom: true, disponible: true, imagen_url: null }
      setProductos((prev) => [...prev, nuevo])
    }
  }

  const tipos = ["todos", ...Object.keys(TIPOS)]

  const filtrados = productos.filter((p) => {
    const matchTipo = tipoActivo === "todos" || p.tipo_pan === tipoActivo
    const matchBusq = (p.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusq
  })

  const stats = {
    total:    productos.length,
    conImg:   productos.filter((p) => p.imagen_url).length,
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">🍞 Panes</h1>
          <p className="text-[var(--color-pan-500)] text-sm">
            Edita nombres, ingredientes, precios e imágenes de cada pan.
          </p>
        </div>
        <button
          onClick={() => setMostrarAgreg(true)}
          className="flex items-center gap-2 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)]
                     text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          + Agregar pan
        </button>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "Total panes",   value: stats.total,   color: "text-[var(--color-pan-800)]" },
            { label: "Con foto",      value: stats.conImg,  color: "text-green-700" },
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
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pan…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm
                         focus:outline-none focus:border-[var(--color-pan-400)] transition-colors" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tipos.map((t) => (
              <button key={t} onClick={() => setTipoActivo(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${tipoActivo === t
                    ? "bg-[var(--color-pan-700)] text-white border-[var(--color-pan-700)]"
                    : "border-gray-300 text-gray-600 hover:border-[var(--color-pan-400)]"}`}>
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
          <p className="text-sm">Cargando panes…</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm">
          <p className="font-semibold mb-1">Error al cargar</p>
          <p>{error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <p className="text-xs text-gray-400 mb-4">{filtrados.length} pan{filtrados.length !== 1 ? "es" : ""}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => setEditando(producto)}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden group cursor-pointer
                  transition-all hover:shadow-md
                  ${savedId === producto.id ? "ring-2 ring-green-400 border-green-300" : "border-gray-200"}`}
              >
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
                  {producto.is_custom && (
                    <span className="absolute top-1.5 right-1.5 bg-blue-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                      Custom
                    </span>
                  )}
                  {savedId === producto.id && (
                    <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                </div>
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
        <EditModal
          producto={editando}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditando(null)}
        />
      )}

      {mostrarAgreg && (
        <AgregarPanModal
          onSave={handleCreate}
          onClose={() => setMostrarAgreg(false)}
        />
      )}
    </div>
  )
}
