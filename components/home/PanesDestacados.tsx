"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCarritoStore } from "@/lib/store/carritoStore"

const PANES = [
  {
    id: "hg-basico",
    nombre: "Hogaza Natural",
    descripcion: "El clásico de la casa. Corteza crujiente, miga esponjosa.",
    ingredientes: ["Harina natural", "Agua", "Sal de mar", "Masa madre «Martes»"],
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&auto=format&q=80",
    bgColor: "#8b4f24",
    precio: 65,
  },
  {
    id: "cj-capricho",
    nombre: "Capricho",
    descripcion: "Nuestra mezcla más festiva y compleja.",
    ingredientes: ["Pasas", "Canela", "Arándano", "Nuez", "Pepitas de calabaza"],
    imagen: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop&auto=format&q=80",
    bgColor: "#6b3a1a",
    precio: 145,
  },
  {
    id: "cj-fino",
    nombre: "El Fino 💅",
    descripcion: "Cereza, chocolate blanco, almendra y azúcar mascabado.",
    ingredientes: ["Cereza", "Chocolate blanco", "Almendra", "Azúcar mascabado", "Masa madre"],
    imagen: "/el-fino.jpeg",
    bgColor: "#3d2b1f",
    precio: 150,
  },
]

function FlipCard({ pan }: { pan: typeof PANES[0] }) {
  const [agregado, setAgregado] = useState(false)
  const agregarProductoCatalogo = useCarritoStore((s) => s.agregarProductoCatalogo)

  function handleAgregar() {
    agregarProductoCatalogo({
      id: `${pan.id}-home-${Date.now()}`,
      nombre: pan.nombre,
      descripcion: pan.descripcion,
      ingredientes: [],
      precio: pan.precio,
      imagen_url: pan.imagen,
      valor_nutrimental: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, sodio: 0 },
      disponible: true,
      created_at: new Date().toISOString(),
    })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2500)
  }

  return (
    <div className="flip-card h-80 cursor-pointer">
      <div className="flip-card-inner">

        {/* Frente */}
        <div className="flip-card-front">
          <div className="relative w-full h-full">
            <Image
              src={pan.imagen}
              alt={pan.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-serif font-bold text-white text-xl leading-tight">{pan.nombre}</p>
              <p className="text-white/70 text-xs mt-1">{pan.descripcion}</p>
              <p className="text-white/50 text-xs mt-2 italic">Pasa el cursor para agregar →</p>
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div
          className="flip-card-back flex flex-col justify-center p-7"
          style={{ background: `linear-gradient(135deg, ${pan.bgColor}, #1a0f0a)` }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-semibold">
            Ingredientes principales
          </p>
          <ul className="space-y-2 mb-5">
            {pan.ingredientes.map((ing) => (
              <li key={ing} className="flex items-center gap-3 text-white text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-pan-300)] shrink-0" />
                {ing}
              </li>
            ))}
          </ul>

          <p className="text-white/60 text-xs mb-3 text-center">
            ${pan.precio} MXN
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleAgregar}
              className={`text-center text-xs font-semibold py-2.5 px-5 rounded-full transition-colors border
                ${agregado
                  ? "bg-green-600 border-green-600 text-white"
                  : "bg-white/15 hover:bg-white/25 text-white border-white/20"}`}
            >
              {agregado ? "✓ Agregado al carrito" : "🛒 Agregar al carrito"}
            </button>

            {agregado && (
              <Link
                href="/pedido"
                className="text-center text-xs font-semibold py-2 px-5 rounded-full
                           bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 transition-colors"
              >
                Ver mi pedido →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PanesDestacados() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">Los favoritos</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-pan-800)] mb-4">
          Panes más comprados
        </h2>
        <p className="text-[var(--color-pan-500)] max-w-md mx-auto text-sm">
          Pasa el cursor sobre cada pan para ver ingredientes y agregar directo a tu pedido.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {PANES.map((pan) => (
          <FlipCard key={pan.id} pan={pan} />
        ))}
      </div>
    </section>
  )
}
