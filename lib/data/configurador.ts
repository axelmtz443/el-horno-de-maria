import type { TipoPan } from "./catalogo"

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
  tiene_dulce_salado: boolean
  ingredientes: Ingrediente[]
}

// ── Caja / Hogaza ────────────────────────────────────────────────────────────
const INGREDIENTES_CAJA_HOGAZA: Ingrediente[] = [
  // Salados — individuales
  { id: "ajo",          nombre: "Ajo",                   precio: 10, sabor: "salado" },
  { id: "albahaca",     nombre: "Albahaca",               precio: 10, sabor: "salado" },
  { id: "ajonjoli-b",  nombre: "Ajonjolí Blanco",        precio: 10, sabor: "salado" },
  { id: "ajonjoli-n",  nombre: "Ajonjolí Negro",         precio: 10, sabor: "salado" },
  { id: "avena",        nombre: "Avena",                  precio: 10, sabor: "salado" },
  { id: "chia",         nombre: "Chía",                   precio: 10, sabor: "salado" },
  { id: "linaza",       nombre: "Linaza",                 precio: 10, sabor: "salado" },
  { id: "mejorana",     nombre: "Mejorana",               precio: 10, sabor: "salado" },
  { id: "girasol",      nombre: "Semillas de Girasol",    precio: 10, sabor: "salado" },
  { id: "pepitas",      nombre: "Pepitas de Calabaza",    precio: 25, sabor: "salado" },
  { id: "queso",        nombre: "Queso Parmesano",        precio: 35, sabor: "salado" },
  // Salados — combos
  { id: "ajo-romero",   nombre: "Ajo, Romero y Albahaca", precio: 15, sabor: "salado" },
  { id: "chia-linaza",  nombre: "Chía y Linaza",          precio: 15, sabor: "salado" },

  // Dulces — individuales
  { id: "canela-azucar",   nombre: "Canela y Azúcar",                                       precio: 15, sabor: "dulce" },
  { id: "pasas-canela",    nombre: "Pasas, Canela y Azúcar",                                precio: 20, sabor: "dulce" },
  { id: "arandano-linaza", nombre: "Arándano y Linaza",                                     precio: 25, sabor: "dulce" },
  { id: "arandano-canela", nombre: "Arándano, Canela y Azúcar",                             precio: 30, sabor: "dulce" },
  { id: "choc-trad",       nombre: "Chocolate Tradicional",                                 precio: 30, sabor: "dulce" },
  { id: "choc-caca",       nombre: "Chocolate y Cacahuate",                                 precio: 40, sabor: "dulce" },
  { id: "choc-blanco",     nombre: "Chocolate Blanco",                                      precio: 40, sabor: "dulce" },
  { id: "arandano-nuez",   nombre: "Arándano, Nuez, Canela y Azúcar",                       precio: 45, sabor: "dulce" },
  { id: "choc-almendra",   nombre: "Chocolate y Almendra",                                  precio: 60, sabor: "dulce" },
  { id: "nuez-azucar",     nombre: "Nuez y Azúcar",                                         precio: 80, sabor: "dulce" },
  // Dulces — combos gourmet
  { id: "capricho",  nombre: "Capricho — Pasas, Canela, Arándano, Nuez y Pepitas",          precio: 80, sabor: "dulce" },
  { id: "antojo",    nombre: "Antojo — Nuez, Almendra, Chocolate y Canela",                 precio: 80, sabor: "dulce" },
  { id: "fino",      nombre: "El Fino 💅 — Cereza, Chocolate Blanco, Almendra y Mascabado", precio: 85, sabor: "dulce" },
]

// ── Baguette ─────────────────────────────────────────────────────────────────
const INGREDIENTES_BAGUETTE: Ingrediente[] = [
  { id: "ajo",         nombre: "Ajo",                   precio: 10, sabor: "todos" },
  { id: "albahaca",    nombre: "Albahaca",               precio: 10, sabor: "todos" },
  { id: "ajonjoli-b", nombre: "Ajonjolí Blanco",        precio: 10, sabor: "todos" },
  { id: "ajonjoli-n", nombre: "Ajonjolí Negro",         precio: 10, sabor: "todos" },
  { id: "avena",       nombre: "Avena",                  precio: 10, sabor: "todos" },
  { id: "chia",        nombre: "Chía",                   precio: 10, sabor: "todos" },
  { id: "linaza",      nombre: "Linaza",                 precio: 10, sabor: "todos" },
  { id: "mejorana",    nombre: "Mejorana",               precio: 10, sabor: "todos" },
  { id: "girasol",     nombre: "Semillas de Girasol",    precio: 10, sabor: "todos" },
  { id: "pepitas",     nombre: "Pepitas de Calabaza",    precio: 30, sabor: "todos" },
  { id: "queso",       nombre: "Queso Parmesano",        precio: 40, sabor: "todos" },
  { id: "ajo-romero",  nombre: "Ajo, Romero y Albahaca", precio: 15, sabor: "todos" },
  { id: "chia-linaza", nombre: "Chía y Linaza",          precio: 15, sabor: "todos" },
]

// ── Pizza ─────────────────────────────────────────────────────────────────────
const INGREDIENTES_PIZZA: Ingrediente[] = [
  { id: "ajo",        nombre: "Ajo",              precio: 10, sabor: "todos" },
  { id: "albahaca",   nombre: "Albahaca",          precio: 10, sabor: "todos" },
  { id: "mejorana",   nombre: "Mejorana",          precio: 10, sabor: "todos" },
  { id: "romero",     nombre: "Romero",            precio: 10, sabor: "todos" },
  { id: "ajonjoli-b", nombre: "Ajonjolí Blanco",  precio: 10, sabor: "todos" },
  { id: "ajonjoli-n", nombre: "Ajonjolí Negro",   precio: 10, sabor: "todos" },
]

// ── Export ────────────────────────────────────────────────────────────────────
export const CONFIGURADOR_TIPOS: ConfiguradorTipo[] = [
  {
    tipo: "caja",
    titulo: "Pan de Caja",
    subtitulo: "900 gr aprox.",
    emoji: "🍞",
    precio_base: 65,
    tiene_dulce_salado: true,
    ingredientes: INGREDIENTES_CAJA_HOGAZA,
  },
  {
    tipo: "hogaza",
    titulo: "Pan de Hogaza",
    subtitulo: "900 gr aprox.",
    emoji: "🫓",
    precio_base: 65,
    tiene_dulce_salado: true,
    ingredientes: INGREDIENTES_CAJA_HOGAZA,
  },
  {
    tipo: "baguette",
    titulo: "Baguette",
    subtitulo: "3 piezas · 30 cm",
    emoji: "🥖",
    precio_base: 70,
    tiene_dulce_salado: false,
    ingredientes: INGREDIENTES_BAGUETTE,
  },
  {
    tipo: "pizza",
    titulo: "Pan para Pizza",
    subtitulo: "2 piezas · 30 cm",
    emoji: "🍕",
    precio_base: 80,
    tiene_dulce_salado: false,
    ingredientes: INGREDIENTES_PIZZA,
  },
]

export const PRECIO_INTEGRAL = 5
