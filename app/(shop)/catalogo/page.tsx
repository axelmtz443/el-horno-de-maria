"use client"

import { useState, useRef, useEffect } from "react"
import { SECCIONES_CATALOGO, buscarProductoPorId, type TipoPan, type ProductoCatalogo } from "@/lib/data/catalogo"
import TarjetaProducto from "@/components/catalogo/TarjetaProducto"
import Link from "next/link"

// ─── Clasificación dulce / salado ────────────────────────────────────────────

const CATEGORIAS_DULCE = new Set([
  "Línea Dulce — Frutales",
  "Línea Dulce — Chocolates",
  "Línea Dulce — Gourmet",
])

function sabor(p: ProductoCatalogo): "dulce" | "salado" {
  return CATEGORIAS_DULCE.has(p.categoria) ? "dulce" : "salado"
}

// ─── Constantes de navegación ─────────────────────────────────────────────────

const TABS: { tipo: TipoPan; emoji: string; label: string; subtitulo: string }[] = [
  { tipo: "caja",     emoji: "🍞", label: "Pan de Caja",    subtitulo: "900 gr · Rebanado" },
  { tipo: "hogaza",   emoji: "🫓", label: "Pan de Hogaza",  subtitulo: "900 gr · Rústico" },
  { tipo: "baguette", emoji: "🥖", label: "Baguette",       subtitulo: "3 pzas · 900 gr" },
  { tipo: "pizza",    emoji: "🍕", label: "Pan para Pizza", subtitulo: "2 pzas · 900 gr" },
]

const HAS_SABOR = new Set<TipoPan>(["caja", "hogaza"])

// ─── Componente de filtros de categoría ───────────────────────────────────────

function FiltrosCategorias({
  categorias,
  activa,
  onChange,
  productos,
}: {
  categorias: string[]
  activa: string | null
  onChange: (cat: string | null) => void
  productos: ProductoCatalogo[]
}) {
  const conteo = (cat: string) => productos.filter((p) => p.categoria === cat).length

  return (
    <div className="flex gap-2 flex-wrap mb-6">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
          ${activa === null
            ? "bg-[var(--color-pan-700)] text-white border-[var(--color-pan-700)]"
            : "border-[var(--color-pan-300)] text-[var(--color-pan-600)] hover:border-[var(--color-pan-500)]"}`}
      >
        Todos ({productos.length})
      </button>
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === activa ? null : cat)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${activa === cat
              ? "bg-[var(--color-pan-700)] text-white border-[var(--color-pan-700)]"
              : "border-[var(--color-pan-300)] text-[var(--color-pan-600)] hover:border-[var(--color-pan-500)]"}`}
        >
          {cat} <span className="opacity-60 font-normal">({conteo(cat)})</span>
        </button>
      ))}
    </div>
  )
}

// ─── Los más comprados ─────────────────────────────────────────────────────────

function MasComprados({ productos }: { productos: ProductoCatalogo[] }) {
  if (productos.length === 0) return null

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⭐</span>
        <h2 className="font-serif text-lg font-bold text-[var(--color-pan-900)]">Los más comprados</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {productos.map((p) => (
          <div key={p.id} className="w-64 shrink-0">
            <TarjetaProducto producto={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Grid de productos ────────────────────────────────────────────────────────

function GridProductos({ productos }: { productos: ProductoCatalogo[] }) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-pan-400)]">
        <p className="text-3xl mb-2">🥖</p>
        <p className="text-sm">Sin productos en esta categoría</p>
      </div>
    )
  }

  // Agrupar por categoría
  const grupos = productos.reduce<Record<string, ProductoCatalogo[]>>((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = []
    acc[p.categoria].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(grupos).map(([cat, prods]) => (
        <div key={cat}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex-1 h-px bg-[var(--color-pan-200)]" />
            <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-pan-600)] px-2 whitespace-nowrap">
              {cat}
            </span>
            <span className="flex-1 h-px bg-[var(--color-pan-200)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {prods.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CatalogoPage() {
  const [tipActivo,   setTipActivo]   = useState<TipoPan>("caja")
  const [saborActivo, setSaborActivo] = useState<"salado" | "dulce">("salado")
  const [catActiva,   setCatActiva]   = useState<string | null>(null)
  const [destacados,  setDestacados]  = useState<ProductoCatalogo[]>([])
  const tabBarRef = useRef<HTMLDivElement>(null)

  // Cargar destacados ("Los más comprados"), administrados manualmente desde /admin/destacados
  useEffect(() => {
    fetch("/api/destacados")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        const productos = data
          .map((d: { producto_id: string }) => buscarProductoPorId(d.producto_id))
          .filter((p): p is ProductoCatalogo => Boolean(p))
        setDestacados(productos)
      })
      .catch(() => {})
  }, [])

  // Resetear filtros al cambiar de tipo de pan
  function cambiarTipo(tipo: TipoPan) {
    setTipActivo(tipo)
    setSaborActivo("salado")
    setCatActiva(null)
  }

  // Resetear categoría al cambiar sabor
  function cambiarSabor(s: "salado" | "dulce") {
    setSaborActivo(s)
    setCatActiva(null)
  }

  const seccion   = SECCIONES_CATALOGO.find((s) => s.tipo_pan === tipActivo)!
  const productos = seccion.productos

  // Filtrar por sabor (solo en caja/hogaza)
  const productosSabor = HAS_SABOR.has(tipActivo)
    ? productos.filter((p) => sabor(p) === saborActivo)
    : productos

  // Filtrar por categoría
  const productosFiltrados = catActiva
    ? productosSabor.filter((p) => p.categoria === catActiva)
    : productosSabor

  // Categorías disponibles para el sabor/tipo actual
  const categorias = [...new Set(productosSabor.map((p) => p.categoria))]

  // Contadores dulce/salado
  const nSalado = HAS_SABOR.has(tipActivo) ? productos.filter((p) => sabor(p) === "salado").length : 0
  const nDulce  = HAS_SABOR.has(tipActivo) ? productos.filter((p) => sabor(p) === "dulce").length  : 0

  // Scroll tab activo al centro en móvil
  useEffect(() => {
    const bar = tabBarRef.current
    if (!bar) return
    const btn = bar.querySelector<HTMLElement>(`[data-tipo="${tipActivo}"]`)
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [tipActivo])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-pan-900)] mb-2">
          Nuestro catálogo
        </h1>
        <p className="text-[var(--color-pan-500)] text-sm max-w-lg mx-auto">
          Todos nuestros panes a mano, sin conservadores.
        </p>
      </div>

      {/* ── Los más comprados ── */}
      <MasComprados productos={destacados} />

      {/* ── Tabs de tipo de pan ── */}
      <div ref={tabBarRef}
        className="flex gap-2 overflow-x-auto pb-1 mb-6 sticky top-[60px] z-30
                   bg-[var(--color-pan-100)] pt-3 -mx-4 px-4
                   scrollbar-none"
        style={{ scrollbarWidth: "none" }}>
        {TABS.map(({ tipo, emoji, label, subtitulo }) => {
          const activo = tipo === tipActivo

          return (
            <button
              key={tipo}
              data-tipo={tipo}
              onClick={() => cambiarTipo(tipo)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-medium shrink-0
                          border-2 transition-all duration-200 text-sm
                ${activo
                  ? "bg-[var(--color-pan-800)] text-white border-[var(--color-pan-800)] shadow-md"
                  : "bg-white text-[var(--color-pan-700)] border-[var(--color-pan-200)] hover:border-[var(--color-pan-400)]"}`}
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span className="leading-tight">
                <span className="block font-semibold">{label}</span>
                <span className={`block text-[10px] font-normal ${activo ? "text-[var(--color-pan-300)]" : "text-[var(--color-pan-400)]"}`}>
                  {subtitulo}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Descripción del tipo seleccionado ── */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-pan-200)]">
        <span className="text-3xl">{TABS.find((t) => t.tipo === tipActivo)!.emoji}</span>
        <div>
          <h2 className="font-serif text-xl font-bold text-[var(--color-pan-800)]">
            {TABS.find((t) => t.tipo === tipActivo)!.label}
          </h2>
          <p className="text-[var(--color-pan-400)] text-xs">
            {seccion.subtitulo} · {productos.length} variedades disponibles
          </p>
        </div>
      </div>

      {/* ── Sub-tabs Salado / Dulce (solo caja y hogaza) ── */}
      {HAS_SABOR.has(tipActivo) && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => cambiarSabor("salado")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all
              ${saborActivo === "salado"
                ? "bg-[var(--color-pan-200)] border-[var(--color-pan-500)] text-[var(--color-pan-900)]"
                : "bg-white border-[var(--color-pan-200)] text-[var(--color-pan-500)] hover:border-[var(--color-pan-400)]"}`}
          >
            🧂 Salados
            <span className="text-xs font-normal opacity-70">({nSalado})</span>
          </button>
          <button
            onClick={() => cambiarSabor("dulce")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all
              ${saborActivo === "dulce"
                ? "bg-[var(--color-trigo-100)] border-[var(--color-trigo-500)] text-[var(--color-pan-900)]"
                : "bg-white border-[var(--color-pan-200)] text-[var(--color-pan-500)] hover:border-[var(--color-pan-400)]"}`}
          >
            🍫 Dulces
            <span className="text-xs font-normal opacity-70">({nDulce})</span>
          </button>
        </div>
      )}

      {/* ── Filtros por categoría ── */}
      <FiltrosCategorias
        categorias={categorias}
        activa={catActiva}
        onChange={setCatActiva}
        productos={productosSabor}
      />

      {/* ── Resultado: N panes ── */}
      <p className="text-xs text-[var(--color-pan-400)] mb-4">
        Mostrando <span className="font-semibold text-[var(--color-pan-700)]">{productosFiltrados.length}</span> panes
        {catActiva && <> en <em>{catActiva}</em></>}
      </p>

      {/* ── Grid de productos ── */}
      <GridProductos productos={productosFiltrados} />

      {/* ── CTA Configurador ── */}
      <div className="text-center mt-12 mb-4 p-8 rounded-3xl bg-[var(--color-pan-200)]">
        <p className="font-serif text-xl font-semibold text-[var(--color-pan-800)] mb-2">
          ¿No encuentras lo que buscas?
        </p>
        <p className="text-[var(--color-pan-600)] mb-4 text-sm">
          Crea tu combinación personalizada en el configurador
        </p>
        <Link href="/configurador"
          className="inline-block bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-800)]
                     text-white font-semibold px-8 py-3 rounded-full text-sm transition-colors">
          🎨 Arma tu pan →
        </Link>
      </div>
    </div>
  )
}
