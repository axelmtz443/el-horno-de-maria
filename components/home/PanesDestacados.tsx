"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCarritoStore } from "@/lib/store/carritoStore"

interface PanDestacado {
  id:              string
  nombre:          string
  descripcion?:    string | null
  ingredientes?:   string[] | null
  precio:          number
  precio_integral: number
  tipo_pan:        string
  imagen_url?:     string | null
}

const FALLBACK: PanDestacado[] = [
  {
    id: "hg-basico", nombre: "Hogaza Natural", tipo_pan: "hogaza", precio: 65, precio_integral: 70,
    descripcion: "Harina natural, agua, sal de mar, masa madre «Martes»",
    imagen_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    id: "cj-capricho", nombre: "Capricho", tipo_pan: "caja", precio: 145, precio_integral: 150,
    descripcion: "Pasas, canela, arándano, nuez, pepitas de calabaza",
    imagen_url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    id: "cj-fino", nombre: "El Fino 💅", tipo_pan: "caja", precio: 150, precio_integral: 155,
    descripcion: "Cereza, chocolate blanco, almendra, azúcar mascabado",
    imagen_url: "/el-fino.jpeg",
  },
]

const BG_COLORS: Record<string, string> = {
  hogaza:   "#8b4f24",
  caja:     "#6b3a1a",
  baguette: "#5a3010",
  pizza:    "#3d2b1f",
}

const FALLBACK_IMGS: Record<string, string> = {
  hogaza:   "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
  caja:     "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop",
  baguette: "https://images.unsplash.com/photo-1568471173242-461f0a730452?w=600&h=400&fit=crop",
  pizza:    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
}

// ─── Tarjeta con flip ─────────────────────────────────────────────────────────

function FlipCard({ pan }: { pan: PanDestacado }) {
  const [agregado, setAgregado] = useState(false)
  const agregarProductoCatalogo = useCarritoStore((s) => s.agregarProductoCatalogo)

  const imagen    = pan.imagen_url || FALLBACK_IMGS[pan.tipo_pan] || FALLBACK_IMGS.hogaza
  const bgColor   = BG_COLORS[pan.tipo_pan] ?? "#3d2b1f"
  const ingredientes = pan.ingredientes && pan.ingredientes.length > 0
    ? pan.ingredientes
    : pan.descripcion
      ? pan.descripcion.split(/[,·\n]/).map((s) => s.trim()).filter(Boolean)
      : []

  function handleAgregar() {
    agregarProductoCatalogo({
      id:          `${pan.id}-home-nat`,
      nombre:      pan.nombre,
      descripcion: pan.descripcion ?? "",
      ingredientes,
      precio:      pan.precio,
      imagen_url:  pan.imagen_url ?? "",
      valor_nutrimental: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, sodio: 0 },
      disponible:  true,
      created_at:  new Date().toISOString(),
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
            <Image src={imagen} alt={pan.nombre} fill className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-serif font-bold text-white text-xl leading-tight">{pan.nombre}</p>
              {pan.descripcion && (
                <p className="text-white/70 text-xs mt-1 line-clamp-2">{pan.descripcion}</p>
              )}
            </div>
          </div>
        </div>

        {/* Reverso */}
        <div className="flip-card-back flex flex-col justify-center p-7"
          style={{ background: `linear-gradient(135deg, ${bgColor}, #1a0f0a)` }}>
          {ingredientes.length > 0 ? (
            <>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-semibold">
                Ingredientes principales
              </p>
              <ul className="space-y-2 mb-5">
                {ingredientes.slice(0, 5).map((ing) => (
                  <li key={ing} className="flex items-center gap-3 text-white text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-pan-300)] shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-white/70 text-sm mb-5">Pan artesanal de masa madre</p>
          )}

          <p className="text-white/60 text-xs mb-3 text-center">${pan.precio} MXN</p>

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
              <Link href="/pedido"
                className="text-center text-xs font-semibold py-2 px-5 rounded-full
                           bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 transition-colors">
                Ver mi pedido →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sección ──────────────────────────────────────────────────────────────────

export default function PanesDestacados() {
  const [panes, setPanes] = useState<PanDestacado[]>(FALLBACK)

  useEffect(() => {
    fetch("/api/mas-comprados")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: PanDestacado[]) => {
        if (Array.isArray(data) && data.length > 0) setPanes(data)
      })
      .catch(() => {}) // mantener fallback si falla
  }, [])

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">Los favoritos</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-pan-800)] mb-4">
          Panes más comprados
        </h2>
        <p className="text-[var(--color-pan-500)] max-w-md mx-auto text-sm">
          Voltea cada tarjeta para ver ingredientes y agregar directo a tu pedido.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {panes.map((pan) => (
          <FlipCard key={pan.id} pan={pan} />
        ))}
      </div>
    </section>
  )
}
