"use client"

import { useEffect, useMemo, useState } from "react"
import { TODOS_LOS_PRODUCTOS, buscarProductoPorId } from "@/lib/data/catalogo"

export default function AdminDestacadosPage() {
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState("")
  const [guardando, setGuardando] = useState(false)
  const [guardado,  setGuardado]  = useState(false)
  const [busqueda,  setBusqueda]  = useState("")

  useEffect(() => {
    fetch("/api/admin/destacados")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSeleccionados(data.map((d) => d.producto_id))
        else setError(data.error ?? "Error al cargar destacados")
      })
      .catch(() => setError("No se pudo conectar con el servidor"))
      .finally(() => setLoading(false))
  }, [])

  function agregar(id: string) {
    setSeleccionados((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  function quitar(id: string) {
    setSeleccionados((prev) => prev.filter((p) => p !== id))
  }

  function moverArriba(i: number) {
    if (i === 0) return
    setSeleccionados((prev) => {
      const copia = [...prev]
      ;[copia[i - 1], copia[i]] = [copia[i], copia[i - 1]]
      return copia
    })
  }

  function moverAbajo(i: number) {
    setSeleccionados((prev) => {
      if (i === prev.length - 1) return prev
      const copia = [...prev]
      ;[copia[i + 1], copia[i]] = [copia[i], copia[i + 1]]
      return copia
    })
  }

  async function guardar() {
    setGuardando(true)
    const res = await fetch("/api/admin/destacados", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: seleccionados }),
    })
    setGuardando(false)
    if (res.ok) {
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
    }
  }

  const disponibles = useMemo(
    () =>
      TODOS_LOS_PRODUCTOS.filter(
        (p) =>
          !seleccionados.includes(p.id) &&
          p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [seleccionados, busqueda]
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">
          Los más comprados
        </h1>
        <p className="text-[var(--color-pan-500)] text-sm">
          Elige manualmente qué productos aparecen en la sección destacada al inicio del catálogo, y en qué orden.
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-[var(--color-pan-400)]">
          <p className="text-4xl mb-3 animate-pulse">⭐</p>
          <p className="text-sm">Cargando…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm mb-6">
          <p className="font-semibold mb-1">Error al cargar</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-6">
          {/* Seleccionados / orden */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-pan-700)] mb-3">
              Destacados ({seleccionados.length})
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 min-h-[120px]">
              {seleccionados.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">
                  Aún no hay productos destacados
                </p>
              )}
              {seleccionados.map((id, i) => {
                const producto = buscarProductoPorId(id)
                if (!producto) return null
                return (
                  <div key={id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xs font-bold text-[var(--color-pan-400)] w-5 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-pan-900)] truncate">{producto.nombre}</p>
                      <p className="text-[10px] text-[var(--color-pan-400)]">{producto.categoria}</p>
                    </div>
                    <button onClick={() => moverArriba(i)} disabled={i === 0}
                      className="w-6 h-6 rounded-full text-xs text-[var(--color-pan-500)] hover:bg-[var(--color-pan-100)] disabled:opacity-30 cursor-pointer disabled:cursor-default">↑</button>
                    <button onClick={() => moverAbajo(i)} disabled={i === seleccionados.length - 1}
                      className="w-6 h-6 rounded-full text-xs text-[var(--color-pan-500)] hover:bg-[var(--color-pan-100)] disabled:opacity-30 cursor-pointer disabled:cursor-default">↓</button>
                    <button onClick={() => quitar(id)}
                      className="w-6 h-6 rounded-full text-xs text-red-500 hover:bg-red-50 cursor-pointer">✕</button>
                  </div>
                )
              })}
            </div>

            <button onClick={guardar} disabled={guardando}
              className={`mt-4 w-full font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60
                ${guardado ? "bg-green-600 text-white" : "bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white"}`}>
              {guardando ? "Guardando…" : guardado ? "✓ Guardado" : "Guardar cambios"}
            </button>
          </div>

          {/* Buscador de productos disponibles */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-pan-700)] mb-3">
              Agregar producto
            </h2>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto…"
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded-xl text-sm
                         focus:outline-none focus:border-[var(--color-pan-400)] transition-colors"
            />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 max-h-[480px] overflow-auto">
              {disponibles.map((p) => (
                <button key={p.id} onClick={() => agregar(p.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-pan-100)] transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-pan-900)] truncate">{p.nombre}</p>
                    <p className="text-[10px] text-[var(--color-pan-400)]">{p.categoria} · {p.tipo_pan}</p>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-pan-500)] shrink-0">+</span>
                </button>
              ))}
              {disponibles.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">Sin resultados</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
