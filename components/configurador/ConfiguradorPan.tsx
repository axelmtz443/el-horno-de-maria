"use client"

import { useState } from "react"
import Link from "next/link"
import { useCarritoStore } from "@/lib/store/carritoStore"
import VisualizadorPan from "./VisualizadorPan"
import { CONFIGURADOR_TIPOS, PRECIO_INTEGRAL, type ConfiguradorTipo, type Ingrediente } from "@/lib/data/configurador"

const PASOS = ["Tipo de pan", "Ingredientes"] as const

export default function ConfiguradorPan() {
  const [paso, setPaso] = useState(0)
  const [tipo, setTipo] = useState<ConfiguradorTipo | null>(null)
  const [seleccionados, setSeleccionados] = useState<Ingrediente[]>([])
  const [integral, setIntegral] = useState(false)
  const [tabSabor, setTabSabor] = useState<"salado" | "dulce">("salado")
  const [agregado, setAgregado] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  const agregarProductoCatalogo = useCarritoStore((s) => s.agregarProductoCatalogo)

  const precioBase = tipo ? tipo.precio_base + (integral ? PRECIO_INTEGRAL : 0) : 0
  const precioIngredientes = seleccionados.reduce((acc, i) => acc + i.precio, 0)
  const precioUnitario = precioBase + precioIngredientes

  function toggleIngrediente(ing: Ingrediente) {
    setSeleccionados((prev) =>
      prev.find((i) => i.id === ing.id)
        ? prev.filter((i) => i.id !== ing.id)
        : [...prev, ing]
    )
  }

  function seleccionarTipo(t: ConfiguradorTipo) {
    setTipo(t)
    setSeleccionados([])
    setIntegral(false)
    setTabSabor("salado")
  }

  function handleAgregar() {
    if (!tipo) return
    const nombresIng = seleccionados.map((i) => i.nombre).join(", ")
    const nombre = [
      tipo.titulo,
      integral ? "Integral" : "Natural",
      nombresIng ? `· ${nombresIng}` : "",
    ].filter(Boolean).join(" ")

    // ID estable basado en la configuración para que el store pueda agrupar
    const idConfig = `config-${tipo.tipo}-${integral ? "int" : "nat"}-${seleccionados.map((i) => i.id).sort().join("_")}`

    agregarProductoCatalogo({
      id: idConfig,
      nombre,
      descripcion: "Pan configurado a tu gusto",
      ingredientes: [],
      precio: precioUnitario,
      imagen_url: "",
      valor_nutrimental: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, sodio: 0 },
      disponible: true,
      created_at: new Date().toISOString(),
    }, cantidad)

    setAgregado(true)
    setTimeout(() => setAgregado(false), 3000)
  }

  function resetear() {
    setTipo(null); setSeleccionados([]); setIntegral(false); setPaso(0); setCantidad(1)
  }

  const ingredientesFiltrados = tipo?.ingredientes.filter(
    (i) => !tipo.tiene_dulce_salado || i.sabor === tabSabor
  ) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-pan-900)] mb-2">
          Arma tu propio pan 🍞
        </h1>
        <p className="text-[var(--color-pan-600)]">
          Elige el tipo, los ingredientes y mira cómo queda en tiempo real
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Pasos ── */}
        <div className="flex-1 min-w-0">

          {/* Indicador */}
          <div className="flex items-center mb-8">
            {PASOS.map((nombre, i) => (
              <div key={nombre} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => i < paso && setPaso(i)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors
                    ${i === paso ? "text-[var(--color-pan-800)]"
                    : i < paso ? "text-[var(--color-pan-500)] cursor-pointer hover:text-[var(--color-pan-700)]"
                    : "text-[var(--color-pan-300)]"}`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${i === paso ? "bg-[var(--color-pan-700)] text-white"
                    : i < paso ? "bg-[var(--color-pan-400)] text-white"
                    : "bg-[var(--color-pan-200)] text-[var(--color-pan-400)]"}`}>
                    {i < paso ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{nombre}</span>
                </button>
                {i < PASOS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < paso ? "bg-[var(--color-pan-400)]" : "bg-[var(--color-pan-200)]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── Paso 0: Tipo de pan ── */}
          {paso === 0 && (
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--color-pan-800)] mb-4">
                ¿Qué tipo de pan?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CONFIGURADOR_TIPOS.map((t) => (
                  <button
                    key={t.tipo}
                    onClick={() => seleccionarTipo(t)}
                    className={`relative text-center p-4 rounded-2xl border-2 transition-all cursor-pointer
                      ${tipo?.tipo === t.tipo
                        ? "border-[var(--color-pan-600)] bg-[var(--color-pan-200)] shadow-md scale-[1.02]"
                        : "border-[var(--color-pan-200)] bg-white hover:border-[var(--color-pan-400)]"}`}
                  >
                    {tipo?.tipo === t.tipo && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-pan-600)]
                                       flex items-center justify-center text-white text-xs font-bold">✓</span>
                    )}
                    <span className="text-3xl block mb-2">{t.emoji}</span>
                    <p className="font-semibold text-[var(--color-pan-900)] text-sm">{t.titulo}</p>
                    <p className="text-[var(--color-pan-400)] text-xs mt-0.5">{t.subtitulo}</p>
                    <p className="text-[var(--color-pan-600)] font-bold text-sm mt-1">Desde ${t.precio_base}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Paso 1: Ingredientes ── */}
          {paso === 1 && tipo && (
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--color-pan-800)] mb-1">
                Ingredientes
                <span className="text-[var(--color-pan-400)] font-normal text-base ml-2">
                  (opcional · selección múltiple)
                </span>
              </h2>
              <p className="text-[var(--color-pan-500)] text-sm mb-4">
                Puedes elegir cuantos quieras — los precios se suman
              </p>

              {/* Tabs dulce / salado */}
              {tipo.tiene_dulce_salado && (
                <div className="flex gap-2 mb-4">
                  {(["salado", "dulce"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setTabSabor(s)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                                  border-2 transition-all cursor-pointer
                        ${tabSabor === s
                          ? "bg-[var(--color-pan-700)] border-[var(--color-pan-700)] text-white"
                          : "border-[var(--color-pan-200)] text-[var(--color-pan-600)] hover:border-[var(--color-pan-400)] bg-white"}`}
                    >
                      {s === "salado" ? "🧂" : "🍯"} {s === "salado" ? "Salados" : "Dulces"}
                      {seleccionados.filter((i) => i.sabor === s).length > 0 && (
                        <span className="bg-[var(--color-trigo-500)] text-white text-xs w-5 h-5 rounded-full
                                         flex items-center justify-center font-bold">
                          {seleccionados.filter((i) => i.sabor === s).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Lista de ingredientes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {ingredientesFiltrados.map((ing) => {
                  const sel = seleccionados.some((i) => i.id === ing.id)
                  return (
                    <button
                      key={ing.id}
                      onClick={() => toggleIngrediente(ing)}
                      className={`text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer
                        ${sel
                          ? "border-[var(--color-pan-600)] bg-[var(--color-pan-200)]"
                          : "border-[var(--color-pan-200)] bg-white hover:border-[var(--color-pan-300)]"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm leading-snug ${sel ? "font-semibold text-[var(--color-pan-900)]" : "text-[var(--color-pan-700)]"}`}>
                          {ing.nombre}
                        </span>
                        {sel && <span className="text-[var(--color-pan-600)] text-xs shrink-0 mt-0.5">✓</span>}
                      </div>
                      <span className="text-xs font-bold text-[var(--color-pan-500)] mt-1 block">+${ing.precio}</span>
                    </button>
                  )
                })}
              </div>

              {/* Integral como extra */}
              <div className="mt-5 pt-4 border-t border-[var(--color-pan-200)]">
                <button
                  onClick={() => setIntegral((v) => !v)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer
                    ${integral
                      ? "border-[var(--color-pan-600)] bg-[var(--color-pan-200)]"
                      : "border-[var(--color-pan-200)] bg-white hover:border-[var(--color-pan-300)]"}`}
                >
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
                    ${integral ? "bg-[var(--color-pan-600)] border-[var(--color-pan-600)]" : "border-[var(--color-pan-300)]"}`}>
                    {integral && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--color-pan-900)] text-sm">🌿 Pan Integral</p>
                    <p className="text-[var(--color-pan-500)] text-xs">100% grano entero, más fibra y sabor</p>
                  </div>
                  <span className="ml-auto font-bold text-[var(--color-pan-600)] text-sm shrink-0">+$5</span>
                </button>
              </div>

              {/* Cantidad */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-pan-700)]">Cantidad:</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-pan-300)] text-[var(--color-pan-700)]
                               hover:bg-[var(--color-pan-200)] font-bold transition-colors cursor-pointer">−</button>
                  <span className="w-8 text-center font-bold text-[var(--color-pan-900)]">{cantidad}</span>
                  <button onClick={() => setCantidad((c) => c + 1)}
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-pan-300)] text-[var(--color-pan-700)]
                               hover:bg-[var(--color-pan-200)] font-bold transition-colors cursor-pointer">+</button>
                </div>
                {cantidad > 1 && (
                  <span className="text-sm text-[var(--color-pan-500)]">
                    Total: ${precioUnitario * cantidad} MXN
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => paso > 0 ? setPaso(0) : resetear()}
              className="px-6 py-2.5 rounded-full border-2 border-[var(--color-pan-300)] text-[var(--color-pan-600)]
                         hover:border-[var(--color-pan-500)] transition-colors text-sm font-medium cursor-pointer"
            >
              {paso === 0 ? "Resetear" : "← Atrás"}
            </button>

            {paso === 0 ? (
              <button
                onClick={() => tipo && setPaso(1)}
                disabled={!tipo}
                className="px-6 py-2.5 rounded-full bg-[var(--color-pan-700)] text-white text-sm font-medium
                           hover:bg-[var(--color-pan-800)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleAgregar}
                disabled={!tipo}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer
                  ${agregado
                    ? "bg-green-600 text-white"
                    : "bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-800)] text-white disabled:opacity-40 disabled:cursor-not-allowed"}`}
              >
                {agregado
                  ? "✓ Agregado al pedido"
                  : `Agregar ${cantidad > 1 ? `${cantidad}x` : ""} · $${precioUnitario * cantidad} MXN`}
              </button>
            )}
          </div>

          {/* Botón ver pedido — aparece tras agregar */}
          {agregado && paso === 1 && (
            <div className="mt-4 flex justify-end">
              <Link
                href="/pedido"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                           bg-[var(--color-pan-100)] hover:bg-[var(--color-pan-200)]
                           text-[var(--color-pan-700)] border border-[var(--color-pan-300)] transition-colors"
              >
                🛒 Ver mi pedido →
              </Link>
            </div>
          )}
        </div>

        {/* ── Vista previa ── */}
        <div className="lg:w-80 xl:w-96">
          <div className="sticky top-24 bg-white rounded-3xl border border-[var(--color-pan-200)] shadow-sm p-6">
            <h3 className="font-serif text-lg font-semibold text-[var(--color-pan-800)] mb-4 text-center">
              Vista previa
            </h3>
            <VisualizadorPan
              tipoPan={tipo?.tipo ?? null}
              integral={integral}
              seleccionados={seleccionados}
            />

            {precioBase > 0 && (
              <div className="mt-5 pt-4 border-t border-[var(--color-pan-200)] space-y-1.5 text-sm">
                <div className="flex justify-between text-[var(--color-pan-600)]">
                  <span>{tipo?.titulo} {integral ? "Integral" : "Natural"}</span>
                  <span>${precioBase}</span>
                </div>
                {seleccionados.map((ing) => (
                  <div key={ing.id} className="flex justify-between text-[var(--color-pan-500)]">
                    <span className="truncate pr-2">{ing.nombre}</span>
                    <span className="shrink-0">+${ing.precio}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-[var(--color-pan-900)] pt-2 border-t border-[var(--color-pan-100)]">
                  <span>Total {cantidad > 1 ? `× ${cantidad}` : ""}</span>
                  <span>${precioUnitario * cantidad} MXN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
