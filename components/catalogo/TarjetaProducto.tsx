"use client"

import { useId, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCarritoStore } from "@/lib/store/carritoStore"
import { obtenerIngredientes, type ProductoCatalogo } from "@/lib/data/catalogo"

export default function TarjetaProducto({ producto }: { producto: ProductoCatalogo }) {
  const idHarina = useId()
  const [integral, setIntegral] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const [imgErr,   setImgErr]   = useState(false)
  const agregarProductoCatalogo = useCarritoStore((s) => s.agregarProductoCatalogo)

  const precio = integral ? producto.precio_integral : producto.precio
  const ingredientes = obtenerIngredientes(producto)

  function handleAgregar() {
    const nombre = `${producto.nombre}${integral ? " (Integral)" : ""}`
    agregarProductoCatalogo({
      id: `${producto.id}-${integral ? "int" : "nat"}`,
      nombre,
      descripcion: producto.descripcion ?? "",
      ingredientes,
      precio,
      imagen_url: producto.imagen_url ?? "",
      valor_nutrimental: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, sodio: 0 },
      disponible: true,
      created_at: new Date().toISOString(),
    }, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 3000)
  }

  const tieneImagen = !!producto.imagen_url && !imgErr

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-pan-200)] overflow-hidden flex flex-col
                    hover:shadow-md hover:border-[var(--color-pan-300)] transition-all">

      {/* ── Imagen ── */}
      <div className="relative h-40 bg-[var(--color-pan-50)] shrink-0">
        {tieneImagen ? (
          <Image
            src={producto.imagen_url!}
            alt={producto.nombre}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 select-none">
            <span className="text-5xl">🍞</span>
            <p className="text-[10px] font-medium text-[var(--color-pan-400)]">📸 próximamente</p>
          </div>
        )}
      </div>

      {/* ── Contenido ── */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Nombre */}
        <div>
          <p className="font-semibold text-[var(--color-pan-900)] text-sm leading-snug">{producto.nombre}</p>
          {producto.descripcion && (
            <p className="text-[var(--color-pan-400)] text-xs mt-0.5 italic">{producto.descripcion}</p>
          )}
        </div>

        {/* Selector de harina: Natural / Integral */}
        <fieldset className="flex items-center gap-3 text-xs">
          <legend className="font-semibold text-[var(--color-pan-600)] mr-1">Harina:</legend>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="radio"
              name={`harina-${idHarina}`}
              checked={!integral}
              onChange={() => setIntegral(false)}
              className="accent-[var(--color-pan-700)] w-3.5 h-3.5"
            />
            <span className={!integral ? "font-semibold text-[var(--color-pan-900)]" : "text-[var(--color-pan-500)]"}>
              Natural
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="radio"
              name={`harina-${idHarina}`}
              checked={integral}
              onChange={() => setIntegral(true)}
              className="accent-[var(--color-pan-700)] w-3.5 h-3.5"
            />
            <span className={integral ? "font-semibold text-[var(--color-pan-900)]" : "text-[var(--color-pan-500)]"}>
              Integral (alto en fibra) <span className="opacity-70">+$5</span>
            </span>
          </label>
        </fieldset>

        {/* Ingredientes */}
        <p className="text-[10px] text-[var(--color-pan-400)] leading-snug">
          <span className="font-semibold text-[var(--color-pan-500)]">Ingredientes: </span>
          {ingredientes.join(", ")}
        </p>

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
    </div>
  )
}
