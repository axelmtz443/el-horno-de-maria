"use client"

import { useEffect, useRef, useState } from "react"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Producto {
  id:              string
  nombre:          string
  precio:          number
  precio_integral: number
  tipo_pan:        string
  categoria:       string
  disponible:      boolean
  is_custom:       boolean
  ingredientes:    string[] | null
}

const BASE_MASA = ["Harina de trigo", "Agua", "Levadura", "Sal"]

const TIPOS: Record<string, { label: string; emoji: string }> = {
  caja:     { label: "Pan de Caja",    emoji: "🍞" },
  hogaza:   { label: "Pan de Hogaza",  emoji: "🫓" },
  baguette: { label: "Baguette",       emoji: "🥖" },
  pizza:    { label: "Pan para Pizza", emoji: "🍕" },
}

// ─── Row individual ───────────────────────────────────────────────────────────

function ProductRow({
  producto,
  onSave,
  onDelete,
}: {
  producto:  Producto
  onSave:    (id: string, fields: Partial<Producto>) => Promise<boolean>
  onDelete?: (id: string) => Promise<void>
}) {
  const [nombre,         setNombre]         = useState(producto.nombre)
  const [precio,         setPrecio]         = useState(String(producto.precio))
  const [precioIntegral, setPrecioIntegral] = useState(String(producto.precio_integral))
  const [disponible,     setDisponible]     = useState(producto.disponible)
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [confirming,     setConfirming]     = useState(false)

  const isDirty = nombre          !== producto.nombre           ||
                  precio          !== String(producto.precio)   ||
                  precioIntegral  !== String(producto.precio_integral) ||
                  disponible      !== producto.disponible

  async function handleSave() {
    setSaving(true)
    const ok = await onSave(producto.id, {
      nombre:          nombre.trim() || producto.nombre,
      precio:          Number(precio)        || producto.precio,
      precio_integral: Number(precioIntegral) || producto.precio_integral,
      disponible,
    })
    setSaving(false)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2200) }
  }

  async function handleDelete() {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return }
    await onDelete?.(producto.id)
  }

  return (
    <div className={`flex flex-wrap md:flex-nowrap items-center gap-2.5 p-3 rounded-xl border transition-all
      ${!disponible ? "opacity-50 bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-[var(--color-pan-300)]"}`}>

      {/* Nombre */}
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="flex-1 min-w-[160px] border border-[var(--color-pan-200)] rounded-lg px-3 py-1.5 text-sm
                   text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
      />

      {/* Badge tipo */}
      <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-pan-100)]
                       text-[var(--color-pan-700)] whitespace-nowrap">
        {TIPOS[producto.tipo_pan]?.emoji} {TIPOS[producto.tipo_pan]?.label ?? producto.tipo_pan}
      </span>

      {/* Precio natural */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[10px] text-gray-400">$</span>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-20 border border-[var(--color-pan-200)] rounded-lg px-2 py-1.5 text-sm text-center
                     text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
        />
        <span className="text-[10px] text-gray-400">nat.</span>
      </div>

      {/* Precio integral */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[10px] text-gray-400">$</span>
        <input
          type="number"
          value={precioIntegral}
          onChange={(e) => setPrecioIntegral(e.target.value)}
          className="w-20 border border-[var(--color-pan-200)] rounded-lg px-2 py-1.5 text-sm text-center
                     text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
        />
        <span className="text-[10px] text-gray-400">int.</span>
      </div>

      {/* Toggle disponible */}
      <button
        onClick={() => setDisponible(!disponible)}
        title={disponible ? "Ocultar del catálogo" : "Mostrar en catálogo"}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
          ${disponible
            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}
      >
        {disponible ? "👁️ Visible" : "🙈 Oculto"}
      </button>

      {/* Guardar */}
      {isDirty && (
        <button onClick={handleSave} disabled={saving}
          className="shrink-0 px-3 py-1.5 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)]
                     text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          {saving ? "…" : "Guardar"}
        </button>
      )}
      {saved && !isDirty && (
        <span className="shrink-0 text-green-600 text-xs font-semibold">✓ Guardado</span>
      )}

      {/* Eliminar (solo productos custom) */}
      {producto.is_custom && (
        <button onClick={handleDelete}
          className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors
            ${confirming
              ? "bg-red-600 text-white border-red-600"
              : "text-red-400 border-red-200 hover:bg-red-50"}`}
        >
          {confirming ? "¿Eliminar?" : "🗑️"}
        </button>
      )}
    </div>
  )
}

// ─── Modal nuevo producto ─────────────────────────────────────────────────────

function NuevoProductoModal({
  onSave,
  onClose,
}: {
  onSave:  (data: Omit<Producto, "id" | "is_custom" | "disponible">) => Promise<void>
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
          <h2 className="font-serif text-lg font-bold text-[var(--color-pan-900)]">Nuevo producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Nombre *</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pan de Romero y Aceitunas"
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
          </div>

          {/* Tipo + Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Tipo de pan *</label>
              <select value={tipoPan} onChange={(e) => setTipoPan(e.target.value)}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]">
                {Object.entries(TIPOS).map(([k, { label, emoji }]) => (
                  <option key={k} value={k}>{emoji} {label}</option>
                ))}
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

          {/* Precios */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio natural ($MXN) *</label>
              <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 95"
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio integral ($MXN)</label>
              <input type="number" value={precioIntegral}
                onChange={(e) => setPrecioIntegral(e.target.value)}
                placeholder={precio ? String(Number(precio) + 5) : "auto +$5"}
                className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1.5">
              Ingredientes extras <span className="text-[var(--color-pan-400)] font-normal">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
              {BASE_MASA.map((i) => (
                <span key={i}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--color-pan-100)]
                             text-[var(--color-pan-500)] border border-[var(--color-pan-200)]">
                  {i}
                </span>
              ))}
              {tags.map((t) => (
                <span key={t}
                  className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full
                             bg-[var(--color-pan-700)] text-white">
                  {t}
                  <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}
                    className="hover:opacity-70 ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Agregar ingrediente…"
                className="flex-1 border border-[var(--color-pan-300)] rounded-xl px-3 py-2 text-xs
                           text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
              <button type="button" onClick={addTag}
                className="px-4 py-2 bg-[var(--color-pan-200)] hover:bg-[var(--color-pan-300)]
                           text-[var(--color-pan-800)] text-xs font-semibold rounded-xl transition-colors">
                +
              </button>
            </div>
          </div>

          {err && <p className="text-red-600 text-xs">{err}</p>}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white
                       font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? "Guardando…" : "Agregar producto"}
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

export default function AdminPreciosPage() {
  const [productos,    setProductos]    = useState<Producto[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState("")
  const [busqueda,     setBusqueda]     = useState("")
  const [tipoActivo,   setTipoActivo]   = useState("todos")
  const [mostrarModal, setMostrarModal] = useState(false)

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

  async function handleSave(id: string, fields: Partial<Producto>): Promise<boolean> {
    const res = await fetch("/api/admin/productos", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, ...fields }),
    })
    if (res.ok) {
      setProductos((prev) => prev.map((p) => p.id === id ? { ...p, ...fields } : p))
      return true
    }
    return false
  }

  async function handleDelete(id: string) {
    const res = await fetch("/api/admin/productos", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id }),
    })
    if (res.ok) setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleCreate(data: Omit<Producto, "id" | "is_custom" | "disponible">) {
    const res = await fetch("/api/admin/productos", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    })
    if (res.ok) {
      const json = await res.json()
      const nuevo: Producto = {
        ...data,
        id:         json.id,
        is_custom:  true,
        disponible: true,
      }
      setProductos((prev) => [...prev, nuevo])
    }
  }

  const tipos = ["todos", ...Object.keys(TIPOS)]

  const filtrados = productos.filter((p) => {
    const matchTipo = tipoActivo === "todos" || p.tipo_pan === tipoActivo
    const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusq
  })

  const stats = {
    total:   productos.length,
    ocultos: productos.filter((p) => !p.disponible).length,
    custom:  productos.filter((p) => p.is_custom).length,
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">Gestión de precios</h1>
          <p className="text-[var(--color-pan-500)] text-sm">
            Edita nombres, precios y visibilidad de cada pan. Agrega nuevos productos.
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)]
                     text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          + Nuevo producto
        </button>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total productos", value: stats.total,   color: "text-[var(--color-pan-800)]" },
            { label: "Ocultos",         value: stats.ocultos, color: "text-orange-600" },
            { label: "Personalizados",  value: stats.custom,  color: "text-blue-700" },
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
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative max-w-xs flex-1">
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
                {t === "todos" ? "Todos" : `${TIPOS[t].emoji} ${TIPOS[t].label}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leyenda columnas */}
      {!loading && !error && (
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 text-[10px] text-gray-400 font-medium mb-1">
          <span className="flex-1">Nombre</span>
          <span className="w-32">Tipo</span>
          <span className="w-24 text-center">$ Natural</span>
          <span className="w-24 text-center">$ Integral</span>
          <span className="w-24 text-center">Estado</span>
          <span className="w-20 text-center">Acciones</span>
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
        </div>
      )}

      {/* Lista */}
      {!loading && !error && (
        <div className="space-y-2">
          {filtrados.map((p) => (
            <ProductRow
              key={p.id}
              producto={p}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
          {filtrados.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">Sin resultados para "{busqueda}"</p>
            </div>
          )}
        </div>
      )}

      {/* Modal nuevo producto */}
      {mostrarModal && (
        <NuevoProductoModal
          onSave={handleCreate}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}
