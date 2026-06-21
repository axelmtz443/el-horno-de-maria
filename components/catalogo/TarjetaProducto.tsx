"use client"

import { useState } from "react"
import Link from "next/link"
import { useCarritoStore } from "@/lib/store/carritoStore"
import type { ProductoCatalogo } from "@/lib/data/catalogo"

export default function TarjetaProducto({ producto }: { producto: ProductoCatalogo }) {
  const [integral, setIntegral] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const agregarProductoCatalogo = useCarritoStore((s) => s.agregarProductoCatalogo)

  const precio = integral ? producto.precio_integral : producto.precio

  function handleAgregar() {
    const nombre = `${producto.nombre}${integral ? " (Integral)" : ""}`
    for (let i = 0; i < cantidad; i++) {
      agregarProductoCatalogo({
        id: `${producto.id}-${integral ? "int" : "nat"}-${Date.now()}-${i}`,
        nombre,
        descripcion: producto.descripcion ?? "",
        ingredientes: [],
        precio,
        imagen_url: "",
        valor_nutrimental: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, sodio: 0 },
        disponible: true,
        created_at: new Date().toISOString(),
      })
    }
    setAgregado(true)
    setTimeout(() => setAgregado(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-pan-200)] p-4 flex flex-col gap-3
                    hover:shadow-md hover:border-[var(--color-pan-300)] transition-all">

      {/* Nombre */}
      <div>
        <p className="font-semibold text-[var(--color-pan-900)] text-sm leading-snug">{producto.nombre}</p>
        {producto.descripcion && (
          <p className="text-[var(--color-pan-400)] text-xs mt-0.5 italic">{producto.descripcion}</p>
        )}
      </div>

      {/* Toggle Integral */}
      <button
        onClick={() => setIntegral((v) => !v)}
        className={`flex items-center gap-2 self-start px-3 py-1.5 rounded-lg border-2 text-xs font-medium
                    transition-all cursor-pointer
          ${integral
            ? "border-[var(--color-pan-600)] bg-[var(--color-pan-200)] text-[var(--color-pan-800)]"
            : "border-[var(--color-pan-200)] text-[var(--color-pan-500)] hover:border-[var(--color-pan-400)]"}`}
      >
        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
          ${integral ? "bg-[var(--color-pan-600)] border-[var(--color-pan-600)]" : "border-[var(--color-pan-300)]"}`}>
          {integral && <span className="text-white text-[10px] font-bold">✓</span>}
        </span>
        🌿 Integral +$5
      </button>

      {/* Precio + cantidad + botón */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <span className="font-bold text-[var(--color-pan-800)] text-base">
          ${precio}
          <span className="text-xs font-normal text-[var(--color-pan-400)] ml-1">MXN</span>
        </span>

        {/* Cantidad */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            className="w-6 h-6 rounded-full border border-[var(--color-pan-300)] text-[var(--color-pan-600)]
                       text-xs font-bold hover:bg-[var(--color-pan-100)] transition-colors cursor-pointer">−</button>
          <span className="w-5 text-center text-sm font-bold text-[var(--color-pan-900)]">{cantidad}</span>
          <button onClick={() => setCantidad((c) => c + 1)}
            className="w-6 h-6 rounded-full border border-[var(--color-pan-300)] text-[var(--color-pan-600)]
                       text-xs font-bold hover:bg-[var(--color-pan-100)] transition-colors cursor-pointer">+</button>
        </div>

        <button
          onClick={handleAgregar}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0
            ${agregado
              ? "bg-green-600 text-white"
              : "bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-800)] text-white"}`}
        >
          {agregado ? "✓ Agregado" : "+ Agregar"}
        </button>
      </div>

      {/* Botón ver pedido — aparece tras agregar */}
      {agregado && (
        <Link
          href="/pedido"
          className="w-full text-center text-xs font-semibold py-2 rounded-xl
                     bg-[var(--color-pan-100)] hover:bg-[var(--color-pan-200)]
                     text-[var(--color-pan-700)] border border-[var(--color-pan-300)]
                     transition-all animate-fade-in"
        >
          🛒 Ver mi pedido →
        </Link>
      )}
    </div>
  )
}
