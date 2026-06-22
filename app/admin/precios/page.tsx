"use client"

import { useEffect, useState } from "react"
import { CONFIGURADOR_TIPOS, type Ingrediente } from "@/lib/data/configurador"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Grupo = "caja_hogaza" | "baguette" | "pizza"

interface PrecioOverride {
  id:     string
  grupo:  Grupo
  precio: number
}

interface BaseOverride {
  tipo_pan:        string
  precio_base:     number
  precio_integral: number
}

// Los grupos únicos del configurador (caja y hogaza comparten lista)
const GRUPOS: { key: Grupo; label: string; emoji: string; tipos: string[] }[] = [
  { key: "caja_hogaza", label: "Caja & Hogaza", emoji: "🍞",  tipos: ["caja", "hogaza"] },
  { key: "baguette",    label: "Baguette",       emoji: "🥖",  tipos: ["baguette"] },
  { key: "pizza",       label: "Pizza",           emoji: "🍕",  tipos: ["pizza"] },
]

// ─── Fila de ingrediente ──────────────────────────────────────────────────────

function IngredienteRow({
  ingrediente,
  grupo,
  precioActual,
  onSave,
}: {
  ingrediente:  Ingrediente
  grupo:        Grupo
  precioActual: number
  onSave:       (id: string, grupo: Grupo, precio: number) => Promise<void>
}) {
  const [valor,  setValor]  = useState(String(precioActual))
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const isDirty = valor !== String(precioActual)

  async function handleSave() {
    setSaving(true)
    await onSave(ingrediente.id, grupo, Number(valor))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const SABOR_LABEL: Record<string, string> = {
    salado: "🧂",
    dulce:  "🍫",
    todos:  "✦",
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[var(--color-pan-50)] transition-colors">
      <span className="text-sm shrink-0" title={ingrediente.sabor}>{SABOR_LABEL[ingrediente.sabor]}</span>

      <p className="flex-1 text-sm text-[var(--color-pan-800)] min-w-0 truncate">{ingrediente.nombre}</p>

      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[var(--color-pan-400)] text-xs">+$</span>
        <input
          type="number"
          value={valor}
          onChange={(e) => { setValor(e.target.value); setSaved(false) }}
          onKeyDown={(e) => e.key === "Enter" && isDirty && handleSave()}
          className="w-16 text-center border border-[var(--color-pan-300)] rounded-lg px-2 py-1 text-sm
                     text-[var(--color-pan-900)] focus:outline-none focus:border-[var(--color-pan-500)]"
        />
      </div>

      {isDirty && (
        <button onClick={handleSave} disabled={saving}
          className="shrink-0 px-3 py-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)]
                     text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60">
          {saving ? "…" : "Guardar"}
        </button>
      )}
      {saved && !isDirty && (
        <span className="shrink-0 text-green-600 text-xs font-semibold">✓</span>
      )}
    </div>
  )
}

// ─── Sección de precio base ───────────────────────────────────────────────────

function PrecioBaseRow({
  tipoPan,
  label,
  emoji,
  baseActual,
  integralActual,
  onSave,
}: {
  tipoPan:        string
  label:          string
  emoji:          string
  baseActual:     number
  integralActual: number
  onSave:         (tipoPan: string, base: number, integral: number) => Promise<void>
}) {
  const [base,     setBase]     = useState(String(baseActual))
  const [integral, setIntegral] = useState(String(integralActual))
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const isDirty = base !== String(baseActual) || integral !== String(integralActual)

  async function handleSave() {
    setSaving(true)
    await onSave(tipoPan, Number(base), Number(integral))
    setSaving(false)
    setSaved(true)
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
  const [overrides,  setOverrides]  = useState<PrecioOverride[]>([])
  const [bases,      setBases]      = useState<BaseOverride[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState("")
  const [grupoActivo, setGrupoActivo] = useState<Grupo>("caja_hogaza")

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

  // Precio efectivo de un ingrediente (override > estático)
  function getPrecioIngrediente(id: string, grupo: Grupo, precioEstatico: number): number {
    return overrides.find((o) => o.id === id && o.grupo === grupo)?.precio ?? precioEstatico
  }

  function getPrecioBase(tipoPan: string, campo: "precio_base" | "precio_integral", fallback: number): number {
    return bases.find((b) => b.tipo_pan === tipoPan)?.[campo] ?? fallback
  }

  async function saveIngrediente(id: string, grupo: Grupo, precio: number) {
    const res = await fetch("/api/admin/configurador", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ tipo: "ingrediente", id, grupo, precio }),
    })
    if (res.ok) {
      setOverrides((prev) => {
        const filtered = prev.filter((o) => !(o.id === id && o.grupo === grupo))
        return [...filtered, { id, grupo, precio }]
      })
    }
  }

  async function saveBase(tipoPan: string, precio_base: number, precio_integral: number) {
    const res = await fetch("/api/admin/configurador", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ tipo: "base", tipo_pan: tipoPan, precio_base, precio_integral }),
    })
    if (res.ok) {
      setBases((prev) => {
        const filtered = prev.filter((b) => b.tipo_pan !== tipoPan)
        return [...filtered, { tipo_pan: tipoPan, precio_base, precio_integral }]
      })
    }
  }

  // Ingredientes del grupo activo
  const grupoInfo = GRUPOS.find((g) => g.key === grupoActivo)!
  const tipoConfig = CONFIGURADOR_TIPOS.find((t) => t.tipo === grupoInfo.tipos[0])!
  const ingredientes = tipoConfig.ingredientes

  const salados = ingredientes.filter((i) => i.sabor === "salado" || i.sabor === "todos")
  const dulces  = ingredientes.filter((i) => i.sabor === "dulce")

  return (
    <div className="p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">🧂 Precio Ingredientes</h1>
        <p className="text-[var(--color-pan-500)] text-sm">
          Precios que se suman al precio base en la herramienta <strong>"Crea tu propio pan"</strong>.
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
            Asegúrate de haber creado las tablas <code className="bg-red-100 px-1 rounded">precios_ingredientes</code> y{" "}
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
                <span>{g.emoji}</span> {g.label}
              </button>
            ))}
          </div>

          {/* Precio base por tipo */}
          <div className="mb-6">
            <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-3">
              Precio base (sin ingredientes extras)
            </p>
            <div className="space-y-2">
              {grupoInfo.tipos.map((tipo) => {
                const cfg = CONFIGURADOR_TIPOS.find((t) => t.tipo === tipo)!
                return (
                  <PrecioBaseRow
                    key={tipo}
                    tipoPan={tipo}
                    label={cfg.titulo}
                    emoji={cfg.emoji}
                    baseActual={getPrecioBase(tipo, "precio_base", cfg.precio_base)}
                    integralActual={getPrecioBase(tipo, "precio_integral", cfg.precio_base + 5)}
                    onSave={saveBase}
                  />
                )
              })}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="space-y-6">
            {/* Salados / Todos */}
            <div>
              <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">
                {grupoActivo === "caja_hogaza" ? "🧂 Salados" : "✦ Ingredientes"}
              </p>
              <div className="bg-white border border-[var(--color-pan-200)] rounded-2xl divide-y divide-[var(--color-pan-100)]">
                {salados.map((ing) => (
                  <IngredienteRow
                    key={ing.id}
                    ingrediente={ing}
                    grupo={grupoActivo}
                    precioActual={getPrecioIngrediente(ing.id, grupoActivo, ing.precio)}
                    onSave={saveIngrediente}
                  />
                ))}
              </div>
            </div>

            {/* Dulces (solo caja/hogaza) */}
            {dulces.length > 0 && (
              <div>
                <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">
                  🍫 Dulces
                </p>
                <div className="bg-white border border-[var(--color-pan-200)] rounded-2xl divide-y divide-[var(--color-pan-100)]">
                  {dulces.map((ing) => (
                    <IngredienteRow
                      key={ing.id}
                      ingrediente={ing}
                      grupo={grupoActivo}
                      precioActual={getPrecioIngrediente(ing.id, grupoActivo, ing.precio)}
                      onSave={saveIngrediente}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-[var(--color-pan-400)] text-xs mt-6">
            💡 Los cambios se guardan individualmente al presionar "Guardar" o Enter en cada fila.
          </p>
        </>
      )}
    </div>
  )
}
