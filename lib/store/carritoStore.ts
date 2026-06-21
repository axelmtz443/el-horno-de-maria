"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { ItemCarrito, DatosCliente, Producto, ConfiguracionPan } from "@/types"

interface CarritoStore {
  items: ItemCarrito[]
  cliente: DatosCliente | null
  // Acciones
  agregarProductoCatalogo: (producto: Producto, cantidad?: number) => void
  agregarPanPersonalizado: (configuracion: ConfiguracionPan, cantidad?: number) => void
  quitarItem: (id: string) => void
  actualizarCantidad: (id: string, cantidad: number) => void
  setCliente: (datos: DatosCliente) => void
  limpiarCarrito: () => void
  // Computed
  totalItems: () => number
  totalPrecio: () => number
}

export const useCarritoStore = create<CarritoStore>()(
  persist(
    (set, get) => ({
      items: [],
      cliente: null,

      agregarProductoCatalogo: (producto, cantidad = 1) => {
        set((state) => {
          const existente = state.items.find(
            (i) => i.tipo === "catalogo" && i.producto?.id === producto.id
          )
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.id === existente.id ? { ...i, cantidad: i.cantidad + cantidad } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: uuidv4(),
                tipo: "catalogo",
                producto,
                cantidad,
                precio_unitario: producto.precio,
              },
            ],
          }
        })
      },

      agregarPanPersonalizado: (configuracion, cantidad = 1) => {
        const precio = calcularPrecioPersonalizado(configuracion)
        set((state) => ({
          items: [
            ...state.items,
            {
              id: uuidv4(),
              tipo: "personalizado",
              configuracion,
              cantidad,
              precio_unitario: precio,
            },
          ],
        }))
      },

      quitarItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      actualizarCantidad: (id, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, cantidad } : i)),
        })),

      setCliente: (datos) => set({ cliente: datos }),

      limpiarCarrito: () => set({ items: [], cliente: null }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      totalPrecio: () =>
        get().items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0),
    }),
    { name: "panaderia-carrito" }
  )
)

function calcularPrecioPersonalizado(cfg: ConfiguracionPan): number {
  const extras = cfg.ingredientes_extra.reduce((acc, e) => acc + e.precio_adicional, 0)
  return cfg.precio_base + extras
}
