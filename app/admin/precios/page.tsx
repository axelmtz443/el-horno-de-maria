"use client"

import { useEffect, useState } from "react"
import { CONFIGURADOR_TIPOS_INFO } from "@/lib/data/configurador"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Grupo = "caja_hogaza" | "baguette" | "pizza"

interface IngredienteRow {
  id:         string
  grupo:      Grupo
  precio:     number
  disponible: boolean
  is_custom:  boolean
  nombre:     string
  sabor:      string
}

interface BaseOverride {
  tipo_pan:        string
  precio_base:     number
  precio_integral: number
}

const GRUPOS: { key: Grupo; label: string; emoji: string; tipos: string[] }[] = [
  { key: "caja_hogaza", label: "Caja & Hogaza", emoji: "🍞", tipos: ["caja", "hogaza"] },
  { key: "baguette",    label: "Baguette",       emoji: "🥖", tipos: ["baguette"] },
  { key: "pizza",       label: "Pizza",           emoji: "🍕", tipos: ["pizza"] },
]

const SABOR_ICON: Record<string, string> = { salado: "🧂", dulce: "🍫", todos: "✦" }

// ─── Fila de ingrediente ──────────────────────────────────────────────────────

function IngredienteFilaRow({
  nombre,
  sabor,
  isCustom,
  precioActual,
  disponible,
  onSavePrecio,
  onToggle,
  onDelete,
}: {
  nombre:       string
  sabor:        string
  isCustom:     boolean
  precioActual: number
  disponible:   boolean
  onSavePrecio: (precio: number) => Promise<void>
  onToggle:     () => Promise<void>
  onDelete:     () => Promise<void>
}) {
  const [valor,      setValor]      = useState(String(precioActual))
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  const isDirty = valor !== String(precioActual)

  async function handleSave() {
    setSaving(true)
    await onSavePrecio(Number(valor))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3500)
      return
    }
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }

  return (
    <div className={`flex items-center gap-2.5 py-2 px-3 rounded-xl transition-colors
      ${!disponible ? "opacity-40" : "hover:bg-[var(--color-pan-50)]"}`}>

      <span className="text-sm shrink-0">{SABOR_ICON[sabor] ?? "✦"}</span>

      <p className={`flex-1 text-sm min-w-0 truncate ${!disponible ? "line-through text-gray-400" : "text-[var(--color-pan-800)]"}`}>
        {nombre}
        {isCustom && (
          <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">custom</span>
        )}
      </p>

      {/* Precio */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[var(--color-pan-400)] text-xs">+$</span>
        <input
          type="number"
          value={valor}
          disabled={!disponible}
          onChange={(e) => { setValor(e.target.value); setSaved(false) }}
          onKeyDown={(e) => e.key === "Enter" && isDirty && handleSave()}
          className="w-16 text-center border border-[var(--color-pan-300)] rounded-lg px-2 py-1 text-sm
                     text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]
                     disabled:bg-gray-50 disabled:text-gray-400"
        />
      </div>

      {/* Guardar */}
      {isDirty && disponible && (
        <button onClick={handleSave} disabled={saving}
          className="shrink-0 px-3 py-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)]
                     text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          {saving ? "…" : "Guardar"}
        </button>
      )}
      {saved && !isDirty && <span className="shrink-0 text-green-600 text-xs font-semibold">✓</span>}

      {/* Ocultar / mostrar */}
      <button onClick={onToggle}
        title={disponible ? "Ocultar ingrediente" : "Mostrar ingrediente"}
        className={`shrink-0 px-2.5 py-1 text-xs rounded-lg border transition-colors
          ${disponible
            ? "text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-gray-600"
            : "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"}`}>
        {disponible ? "✕" : "↩"}
      </button>

      {/* Eliminar permanentemente */}
      <button onClick={handleDelete} disabled={deleting}
        title="Eliminar permanentemente"
        className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors
          ${confirming
            ? "bg-red-600 text-white border-red-600"
            : "text-red-400 border-red-200 hover:bg-red-50"}`}>
        {deleting ? "…" : confirming ? "¿Eliminar?" : "🗑️"}
      </button>
    </div>
  )
}

// ─── Modal agregar ingrediente ────────────────────────────────────────────────

function AgregarIngredienteModal({
  grupo,
  onSave,
  onClose,
}: {
  grupo:   Grupo
  onSave:  (data: { nombre: string; precio: number; sabor: string }) => Promise<void>
  onClose: () => void
}) {
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [sabor,  setSabor]  = useState("todos")
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState("")

  const mostrarSaborOpciones = grupo === "caja_hogaza"

  async function handleSave() {
    if (!nombre.trim() || !precio) { setErr("Nombre y precio son obligatorios"); return }
    setSaving(true); setErr("")
    await onSave({ nombre: nombre.trim(), precio: Number(precio), sabor })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-bold text-[var(--color-pan-900)]">Agregar ingrediente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Nombre *</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Romero, Cúrcuma…"
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
          </div>

          <div>
            <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Precio extra ($MXN) *</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 15"
              className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm
                         text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
          </div>

          {mostrarSaborOpciones && (
            <div>
              <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1">Sabor</label>
              <div className="flex gap-2">
                {[
                  { v: "salado", label: "🧂 Salado" },
                  { v: "dulce",  label: "🍫 Dulce" },
                  { v: "todos",  label: "✦ Ambos" },
                ].map(({ v, label }) => (
                  <button key={v} type="button" onClick={() => setSabor(v)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all
                      ${sabor === v
                        ? "bg-[var(--color-pan-700)] text-white border-[var(--color-pan-700)]"
                        : "bg-white text-[var(--color-pan-600)] border-[var(--color-pan-200)] hover:border-[var(--color-pan-400)]"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {err && <p className="text-red-600 text-xs">{err}</p>}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white
                       font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? "Guardando…" : "Agregar"}
          </button>
          <button onClick={onClose}
            className="px-5 border border-[var(--color-pan-300)] text-[var(--color-pan-600)]
                       font-medium py-2.5 rounded-xl text-sm transition-colors hover:bg-[var(--color-pan-50)]">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sección de precio base ───────────────────────────────────────────────────

function PrecioBaseRow({
  tipoPan, label, emoji, baseActual, integralActual, onSave,
}: {
  tipoPan: string; label: string; emoji: string
  baseActual: number; integralActual: number
  onSave: (tipoPan: string, base: number, integral: number) => Promise<void>
}) {
  const [base,     setBase]     = useState(String(baseActual))
  const [integral, setIntegral] = useState(String(integralActual))
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const isDirty = base !== String(baseActual) || integral !== String(integralActual)

  async function handleSave() {
    setSaving(true)
    await onSave(tipoPan, Number(base), Number(integral))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 bg-[var(--color-pan-50)] rounded-xl">
      <span className="text-lg shrink-0">{emoji}</span>
      <p className="flex-1 text-sm font-semibold text-[var(--color-pan-800)]">{label}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[var(--color-pan-400)] text-xs">Base $</span>
        <input type="number" value={base} onChange={(e) => { setBase(e.target.value); setSaved(false) }}
          className="w-16 text-center border border-[var(--color-pan-300)] rounded-lg px-2 py-1 text-sm
                     text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
        <span className="text-[var(--color-pan-400)] text-xs ml-1">Integral $</span>
        <input type="number" value={integral} onChange={(e) => { setIntegral(e.target.value); setSaved(false) }}
          className="w-16 text-center border border-[var(--color-pan-300)] rounded-lg px-2 py-1 text-sm
                     text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]" />
      </div>
      {isDirty && (
        <button onClick={handleSave} disabled={saving}
          className="shrink-0 px-3 py-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)]
                     text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          {saving ? "…" : "Guardar"}
        </button>
      )}
      {saved && !isDirty && <span className="shrink-0 text-green-600 text-xs font-semibold">✓</span>}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminPreciosPage() {
  const [overrides,     setOverrides]     = useState<IngredienteRow[]>([])
  const [bases,         setBases]         = useState<BaseOverride[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState("")
  const [grupoActivo,   setGrupoActivo]   = useState<Grupo>("caja_hogaza")
  const [mostrarAgreg,  setMostrarAgreg]  = useState(false)

  useEffect(() => {
    fetch("/api/admin/configurador")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setOverrides(data.ingredientes ?? [])
        setBases(data.bases ?? [])
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false))
  }, [])

  function getPrecioBase(tipoPan: string, campo: "precio_base" | "precio_integral"): number {
    return bases.find((b) => b.tipo_pan === tipoPan)?.[campo] ?? 0
  }

  // Acciones
  async function savePrecioIngrediente(id: string, grupo: Grupo, precio: number) {
    const res = await fetch("/api/admin/configurador", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "ingrediente", id, grupo, precio }),
    })
    if (res.ok) {
      setOverrides((prev) => prev.map((o) => (o.id === id && o.grupo === grupo ? { ...o, precio } : o)))
    }
  }

  async function toggleIngrediente(id: string, grupo: Grupo, disponible: boolean) {
    // Actualizar estado local primero (optimista) para que la UI responda de inmediato
    setOverrides((prev) => prev.map((o) => (o.id === id && o.grupo === grupo ? { ...o, disponible } : o)))
    await fetch("/api/admin/configurador", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "ingrediente", id, grupo, disponible }),
    })
  }

  async function deleteIngrediente(id: string, grupo: Grupo) {
    // Quitar de UI primero
    setOverrides((prev) => prev.filter((o) => !(o.id === id && o.grupo === grupo)))
    await fetch("/api/admin/configurador", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, grupo }),
    })
  }

  async function addIngrediente(data: { nombre: string; precio: number; sabor: string }) {
    const res = await fetch("/api/admin/configurador", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, grupo: grupoActivo }),
    })
    if (res.ok) {
      const json = await res.json()
      setOverrides((prev) => [...prev, {
        id: json.id, grupo: grupoActivo, precio: data.precio,
        disponible: true, is_custom: true, nombre: data.nombre, sabor: data.sabor,
      }])
    }
  }

  async function saveBase(tipoPan: string, precio_base: number, precio_integral: number) {
    const res = await fetch("/api/admin/configurador", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "base", tipo_pan: tipoPan, precio_base, precio_integral }),
    })
    if (res.ok) {
      setBases((prev) => {
        const filtered = prev.filter((b) => b.tipo_pan !== tipoPan)
        return [...filtered, { tipo_pan: tipoPan, precio_base, precio_integral }]
      })
    }
  }

  const grupoInfo = GRUPOS.find((g) => g.key === grupoActivo)!

  const ingredientesGrupo = overrides.filter((o) => o.grupo === grupoActivo)
  const salados = ingredientesGrupo.filter((i) => i.sabor === "salado" || i.sabor === "todos")
  const dulces  = ingredientesGrupo.filter((i) => i.sabor === "dulce")

  return (
    <div className="p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">🧂 Precio Ingredientes</h1>
        <p className="text-[var(--color-pan-500)] text-sm">
          Precios que se suman al precio base en <strong>"Crea tu propio pan"</strong>.
          Puedes agregar, ocultar o eliminar ingredientes por grupo.
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-[var(--color-pan-400)]">
          <p className="text-4xl mb-3 animate-pulse">🧂</p>
          <p className="text-sm">Cargando precios…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm mb-6">
          <p className="font-semibold mb-1">Error al cargar</p>
          <p>{error}</p>
          <p className="mt-2 text-xs text-red-500">
            Asegúrate de haber creado las tablas{" "}
            <code className="bg-red-100 px-1 rounded">precios_ingredientes</code> y{" "}
            <code className="bg-red-100 px-1 rounded">precios_base_pan</code> en Supabase.
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* Tabs de grupo */}
          <div className="flex gap-2 mb-6">
            {GRUPOS.map((g) => (
              <button key={g.key} onClick={() => setGrupoActivo(g.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                  ${grupoActivo === g.key
                    ? "bg-[var(--color-pan-800)] text-white border-[var(--color-pan-800)]"
                    : "bg-white text-[var(--color-pan-700)] border-[var(--color-pan-200)] hover:border-[var(--color-pan-400)]"}`}>
                {g.emoji} {g.label}
              </button>
            ))}
          </div>

          {/* Precio base */}
          <div className="mb-6">
            <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-3">
              Precio base (sin ingredientes extras)
            </p>
            <div className="space-y-2">
              {grupoInfo.tipos.map((tipo) => {
                const info = CONFIGURADOR_TIPOS_INFO.find((t) => t.tipo === tipo)!
                return (
                  <PrecioBaseRow key={tipo} tipoPan={tipo} label={info.titulo} emoji={info.emoji}
                    baseActual={getPrecioBase(tipo, "precio_base")}
                    integralActual={getPrecioBase(tipo, "precio_integral")}
                    onSave={saveBase} />
                )
              })}
            </div>
          </div>

          {/* Ingredientes — Salados / Todos */}
          <div className="mb-6">
            <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">
              {grupoActivo === "caja_hogaza" ? "🧂 Salados" : "✦ Ingredientes"}
            </p>
            <div className="bg-white border border-[var(--color-pan-200)] rounded-2xl divide-y divide-[var(--color-pan-100)]">
              {salados.map((ing) => (
                <IngredienteFilaRow key={ing.id}
                  nombre={ing.nombre} sabor={ing.sabor} isCustom={ing.is_custom}
                  precioActual={ing.precio}
                  disponible={ing.disponible}
                  onSavePrecio={(p) => savePrecioIngrediente(ing.id, grupoActivo, p)}
                  onToggle={() => toggleIngrediente(ing.id, grupoActivo, !ing.disponible)}
                  onDelete={() => deleteIngrediente(ing.id, grupoActivo)} />
              ))}
            </div>
          </div>

          {/* Ingredientes — Dulces (solo caja/hogaza) */}
          {dulces.length > 0 && (
            <div className="mb-6">
              <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">
                🍫 Dulces
              </p>
              <div className="bg-white border border-[var(--color-pan-200)] rounded-2xl divide-y divide-[var(--color-pan-100)]">
                {dulces.map((ing) => (
                  <IngredienteFilaRow key={ing.id}
                    nombre={ing.nombre} sabor={ing.sabor} isCustom={ing.is_custom}
                    precioActual={ing.precio}
                    disponible={ing.disponible}
                    onSavePrecio={(p) => savePrecioIngrediente(ing.id, grupoActivo, p)}
                    onToggle={() => toggleIngrediente(ing.id, grupoActivo, !ing.disponible)}
                    onDelete={() => deleteIngrediente(ing.id, grupoActivo)} />
                ))}
              </div>
            </div>
          )}

          {/* Botón agregar */}
          <button onClick={() => setMostrarAgreg(true)}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-[var(--color-pan-300)]
                       text-[var(--color-pan-600)] hover:border-[var(--color-pan-500)] hover:text-[var(--color-pan-800)]
                       rounded-xl text-sm font-medium transition-colors">
            + Agregar ingrediente
          </button>

          <p className="text-[var(--color-pan-400)] text-xs mt-5">
            💡 Guardar con el botón o Enter · ✕ oculta · ↩ restaura · 🗑️ elimina permanentemente
          </p>
        </>
      )}

      {mostrarAgreg && (
        <AgregarIngredienteModal
          grupo={grupoActivo}
          onSave={addIngrediente}
          onClose={() => setMostrarAgreg(false)}
        />
      )}
    </div>
  )
}
