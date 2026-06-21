"use client"

import Link from "next/link"
import { useCarritoStore } from "@/lib/store/carritoStore"
import { generarLinkWhatsApp } from "@/lib/whatsapp/generarMensaje"
import { useState, useMemo } from "react"


export default function PedidoPage() {
  const { items, totalPrecio, actualizarCantidad, quitarItem, limpiarCarrito } = useCarritoStore()
  const total = totalPrecio()
  const [enviado, setEnviado] = useState(false)

  const whatsappLink = useMemo(
    () => items.length > 0 ? generarLinkWhatsApp(items, total) : "#",
    [items, total]
  )

  if (items.length === 0 && !enviado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-800)] mb-3">
          Tu pedido está vacío
        </h1>
        <p className="text-[var(--color-pan-500)] mb-8">
          Agrega panes del catálogo o crea tu propio pan personalizado.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalogo"
            className="bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-800)] text-white
                       font-semibold px-8 py-3 rounded-full transition-colors">
            Ver catálogo
          </Link>
          <Link href="/configurador"
            className="border-2 border-[var(--color-pan-400)] text-[var(--color-pan-700)]
                       hover:bg-[var(--color-pan-200)] font-semibold px-8 py-3 rounded-full transition-colors">
            🎨 Armar mi pan
          </Link>
        </div>
      </div>
    )
  }

  if (enviado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🎉</p>
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-800)] mb-3">
          ¡Pedido enviado!
        </h1>
        <p className="text-[var(--color-pan-600)] mb-8">
          Se abrió WhatsApp con el resumen. La panadería te confirmará tu pedido pronto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { limpiarCarrito(); setEnviado(false) }}
            className="bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-800)] text-white
                       font-semibold px-8 py-3 rounded-full transition-colors cursor-pointer">
            Hacer otro pedido
          </button>
          <Link href="/"
            className="border-2 border-[var(--color-pan-400)] text-[var(--color-pan-700)]
                       hover:bg-[var(--color-pan-200)] font-semibold px-8 py-3 rounded-full transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-pan-900)] mb-2">Mi pedido</h1>
        <p className="text-[var(--color-pan-600)]">Revisa tu selección y envíalo directo por WhatsApp</p>
      </div>

      {/* Lista de items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id}
            className="flex items-center gap-4 bg-white rounded-2xl border border-[var(--color-pan-200)] p-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-pan-900)] text-sm leading-snug truncate">
                {item.producto?.nombre ?? "Pan personalizado"}
              </p>
              <p className="text-[var(--color-pan-500)] text-xs mt-0.5">
                ${item.precio_unitario} MXN c/u
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                className="w-7 h-7 rounded-full border-2 border-[var(--color-pan-300)] text-[var(--color-pan-700)]
                           text-sm font-bold hover:bg-[var(--color-pan-100)] transition-colors cursor-pointer">−</button>
              <span className="w-6 text-center font-bold text-[var(--color-pan-900)]">{item.cantidad}</span>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                className="w-7 h-7 rounded-full border-2 border-[var(--color-pan-300)] text-[var(--color-pan-700)]
                           text-sm font-bold hover:bg-[var(--color-pan-100)] transition-colors cursor-pointer">+</button>
            </div>

            <span className="font-bold text-[var(--color-pan-800)] text-sm shrink-0 w-20 text-right">
              ${item.precio_unitario * item.cantidad}
            </span>

            <button
              onClick={() => quitarItem(item.id)}
              className="text-[var(--color-pan-300)] hover:text-red-500 transition-colors text-lg cursor-pointer shrink-0"
              title="Quitar"
            >×</button>
          </div>
        ))}
      </div>

      {/* Seguir agregando */}
      <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-[var(--color-pan-200)]">
        <Link href="/catalogo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--color-pan-300)]
                     text-[var(--color-pan-700)] hover:bg-[var(--color-pan-200)] text-sm font-medium transition-colors">
          🍞 Agregar del catálogo
        </Link>
        <Link href="/configurador"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--color-pan-300)]
                     text-[var(--color-pan-700)] hover:bg-[var(--color-pan-200)] text-sm font-medium transition-colors">
          🎨 Crear otro personalizado
        </Link>
      </div>

      {/* Total + botón enviar */}
      <div className="bg-white rounded-3xl border border-[var(--color-pan-200)] shadow-sm p-6 flex flex-col sm:flex-row
                      items-center justify-between gap-6">
        <div>
          <p className="text-sm text-[var(--color-pan-500)] mb-1">Total estimado</p>
          <p className="font-bold text-3xl text-[var(--color-pan-900)]">
            ${total} <span className="text-base font-normal text-[var(--color-pan-400)]">MXN</span>
          </p>
          <p className="text-[var(--color-pan-400)] text-xs mt-1">El pago se coordina con la panadería</p>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => items.length > 0 && setEnviado(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8
                     rounded-full flex items-center justify-center gap-3 transition-colors text-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Enviar por WhatsApp
        </a>
      </div>
    </div>
  )
}
