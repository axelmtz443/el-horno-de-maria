import type { TipoPan } from "./catalogo"

export type Grupo = "caja_hogaza" | "baguette" | "pizza"

export interface Ingrediente {
  id: string
  nombre: string
  precio: number
  sabor: "salado" | "dulce" | "todos"
}

export interface ConfiguradorTipo {
  tipo: TipoPan
  titulo: string
  subtitulo: string
  emoji: string
  precio_base: number
  precio_integral: number
  tiene_dulce_salado: boolean
  ingredientes: Ingrediente[]
}

// Metadatos de presentación por tipo de pan — esto no cambia con frecuencia,
// por eso se mantiene en código. Los precios e ingredientes (lo que el admin
// edita) viven en Supabase y se obtienen vía /api/configurador.
export interface ConfiguradorTipoInfo {
  tipo: TipoPan
  titulo: string
  subtitulo: string
  emoji: string
  tiene_dulce_salado: boolean
  grupo: Grupo
}

export const CONFIGURADOR_TIPOS_INFO: ConfiguradorTipoInfo[] = [
  { tipo: "caja",     titulo: "Pan de Caja",    subtitulo: "900 gr aprox.",  emoji: "🍞", tiene_dulce_salado: true,  grupo: "caja_hogaza" },
  { tipo: "hogaza",   titulo: "Pan de Hogaza",  subtitulo: "900 gr aprox.",  emoji: "🫓", tiene_dulce_salado: true,  grupo: "caja_hogaza" },
  { tipo: "baguette", titulo: "Baguette",       subtitulo: "3 piezas · 30 cm", emoji: "🥖", tiene_dulce_salado: false, grupo: "baguette" },
  { tipo: "pizza",    titulo: "Pan para Pizza", subtitulo: "2 piezas · 30 cm", emoji: "🍕", tiene_dulce_salado: false, grupo: "pizza" },
]

export function grupoDeTipo(tipo: TipoPan): Grupo {
  return CONFIGURADOR_TIPOS_INFO.find((t) => t.tipo === tipo)!.grupo
}
