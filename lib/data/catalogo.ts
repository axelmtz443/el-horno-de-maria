export type TipoPan = "caja" | "hogaza" | "baguette" | "pizza"

export interface ProductoCatalogo {
  id: string
  nombre: string
  descripcion?: string
  ingredientes?: string[]     // ingredientes extra, además de la masa base
  imagen_url?: string | null  // foto del pan (seteada desde admin)
  disponible?: boolean        // si está visible en el catálogo
  is_custom?: boolean         // producto agregado desde el admin (no estático)
  categoria: string
  tipo_pan: TipoPan
  precio: number          // precio base (natural)
  precio_integral: number // +$5 siempre
}

// ─── Ingredientes ──────────────────────────────────────────────────────────────

const BASE_MASA = ["Harina de trigo", "Agua", "Levadura", "Sal"]

export function obtenerIngredientes(producto: ProductoCatalogo): string[] {
  if (producto.categoria === "Básico") return BASE_MASA

  if (producto.ingredientes) return [...BASE_MASA, ...producto.ingredientes]

  if (producto.descripcion && producto.descripcion !== "Sin ingredientes adicionales") {
    const extras = producto.descripcion
      .split(/,| y /i)
      .map((s) => s.trim())
      .filter(Boolean)
    return [...BASE_MASA, ...extras]
  }

  return BASE_MASA
}

function productosCaja(): ProductoCatalogo[] {
  const p = "cj"
  const tipo: TipoPan = "caja"
  return [
    // Básico
    { id: `${p}-basico`,          nombre: "Pan Tradicional",               descripcion: "Sin ingredientes adicionales",              categoria: "Básico",                    tipo_pan: tipo, precio: 65,  precio_integral: 70  },

    // Clásicos
    { id: `${p}-ajo`,             nombre: "Pan de Ajo", ingredientes: ["Ajo"],                                                                            categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajo-albahaca`,    nombre: "Pan de Ajo y Albahaca", ingredientes: ["Ajo", "Albahaca"],                                                               categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajo-mejorana`,    nombre: "Pan de Ajo y Mejorana", ingredientes: ["Ajo", "Mejorana"],                                                               categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajonjoli-b`,      nombre: "Pan de Ajonjolí Blanco", ingredientes: ["Ajonjolí blanco"],                                                                categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajonjoli-n`,      nombre: "Pan de Ajonjolí Negro", ingredientes: ["Ajonjolí negro"],                                                                 categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-avena`,           nombre: "Pan de Avena", ingredientes: ["Avena"],                                                                          categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-chia`,            nombre: "Pan de Chía", ingredientes: ["Chía"],                                                                           categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-linaza`,          nombre: "Pan de Linaza", ingredientes: ["Linaza"],                                                                         categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-mejorana`,        nombre: "Pan de Mejorana", ingredientes: ["Mejorana"],                                                                       categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-girasol`,         nombre: "Pan de Semillas de Girasol", ingredientes: ["Semillas de girasol"],                                                            categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },

    // Multigranos
    { id: `${p}-mg1`,             nombre: "Multigrano Tricolor", ingredientes: ["Ajonjolí negro", "Ajonjolí blanco", "Semillas de girasol"],                                           categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg2`,             nombre: "Multigrano Campestre", ingredientes: ["Avena", "Ajonjolí", "Semillas de girasol"],                                                     categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg3`,             nombre: "Multigrano Nutricia", ingredientes: ["Avena", "Chía", "Linaza"],                                                          categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg4`,             nombre: "Multigrano Andino", ingredientes: ["Avena", "Ajonjolí", "Linaza"],                                                      categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg5`,             nombre: "Multigrano Esencial", ingredientes: ["Chía", "Linaza", "Ajonjolí"],                                                       categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg6`,             nombre: "Multigrano Dorado", ingredientes: ["Linaza", "Ajonjolí", "Semillas de girasol"],                                                    categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },

    // Combinaciones y Especiales
    { id: `${p}-ajo-romero`,      nombre: "Pan de Hierbas Mediterráneo", ingredientes: ["Ajo", "Romero", "Albahaca"],                                                        categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80,  precio_integral: 85  },
    { id: `${p}-chia-linaza`,     nombre: "Pan de Semillas Doradas", ingredientes: ["Chía", "Linaza"],                                                                 categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80,  precio_integral: 85  },
    { id: `${p}-pepitas`,         nombre: "Pan de Pepita de Calabaza", ingredientes: ["Pepitas de calabaza"],                                                           categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 90,  precio_integral: 95  },
    { id: `${p}-queso`,           nombre: "Pan al Parmesano", ingredientes: ["Queso parmesano"],                                                               categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 100, precio_integral: 105 },

    // Línea Dulce — Frutales
    { id: `${p}-canela`,          nombre: "Pan de Canela", ingredientes: ["Canela", "Azúcar"],                                                               categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 80,  precio_integral: 85  },
    { id: `${p}-pasas-canela`,    nombre: "Pan de Pasas y Canela", ingredientes: ["Pasas", "Canela", "Azúcar"],                                                        categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-arandano-linaza`, nombre: "Pan de Arándano y Linaza", ingredientes: ["Arándano", "Linaza"],                                                             categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 90,  precio_integral: 95  },
    { id: `${p}-arandano-canela`, nombre: "Pan de Arándano y Canela", ingredientes: ["Arándano", "Canela", "Azúcar"],                                                     categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 95,  precio_integral: 100 },
    { id: `${p}-arandano-nuez`,   nombre: "Pan de Arándano, Nuez y Canela", ingredientes: ["Arándano", "Nuez", "Canela", "Azúcar"],                                               categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 110, precio_integral: 115 },

    // Línea Dulce — Chocolates
    { id: `${p}-choc-trad`,       nombre: "Pan de Chocolate", ingredientes: ["Chocolate"],                                                         categoria: "Línea Dulce — Chocolates",  tipo_pan: tipo, precio: 95,  precio_integral: 100 },
    { id: `${p}-choc-caca`,       nombre: "Pan de Chocolate y Cacahuate", ingredientes: ["Chocolate", "Cacahuate"],                                                         categoria: "Línea Dulce — Chocolates",  tipo_pan: tipo, precio: 105, precio_integral: 110 },
    { id: `${p}-choc-blanco`,     nombre: "Pan de Chocolate Blanco", ingredientes: ["Chocolate blanco"],                                                              categoria: "Línea Dulce — Chocolates",  tipo_pan: tipo, precio: 105, precio_integral: 110 },
    { id: `${p}-choc-almendra`,   nombre: "Pan de Chocolate y Almendra", ingredientes: ["Chocolate", "Almendra"],                                                          categoria: "Línea Dulce — Chocolates",  tipo_pan: tipo, precio: 125, precio_integral: 130 },

    // Línea Dulce — Gourmet
    { id: `${p}-nuez`,            nombre: "Pan de Nuez", ingredientes: ["Nuez", "Azúcar"],                                                                 categoria: "Línea Dulce — Gourmet",     tipo_pan: tipo, precio: 145, precio_integral: 150 },
    { id: `${p}-capricho`,        nombre: "Pan \"Capricho\"", ingredientes: ["Pasas", "Canela", "Arándano", "Nuez", "Pepitas de calabaza"], categoria: "Línea Dulce — Gourmet",     tipo_pan: tipo, precio: 145, precio_integral: 150 },
    { id: `${p}-fino`,            nombre: "El Fino 💅",      descripcion: "Cereza, chocolate blanco, almendra y mascabado", categoria: "Línea Dulce — Gourmet",   tipo_pan: tipo, precio: 150, precio_integral: 155 },
    { id: `${p}-antojo`,          nombre: "Pan \"Antojo\"", ingredientes: ["Nuez", "Almendra", "Chocolate", "Canela"], categoria: "Línea Dulce — Gourmet",     tipo_pan: tipo, precio: 145, precio_integral: 150 },
  ]
}

function productosHogaza(): ProductoCatalogo[] {
  const p = "hg"
  const tipo: TipoPan = "hogaza"
  return [
    // Básico
    { id: `${p}-basico`,          nombre: "Pan Tradicional",               descripcion: "Sin ingredientes adicionales",             categoria: "Básico",                    tipo_pan: tipo, precio: 65,  precio_integral: 70  },

    // Clásicos
    { id: `${p}-ajo`,             nombre: "Pan de Ajo", ingredientes: ["Ajo"],                                                                           categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajo-albahaca`,    nombre: "Pan de Ajo y Albahaca", ingredientes: ["Ajo", "Albahaca"],                                                              categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajo-mejorana`,    nombre: "Pan de Ajo y Mejorana", ingredientes: ["Ajo", "Mejorana"],                                                              categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajonjoli-b`,      nombre: "Pan de Ajonjolí Blanco", ingredientes: ["Ajonjolí blanco"],                                                               categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-ajonjoli-n`,      nombre: "Pan de Ajonjolí Negro", ingredientes: ["Ajonjolí negro"],                                                                categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-avena`,           nombre: "Pan de Avena", ingredientes: ["Avena"],                                                                         categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-chia`,            nombre: "Pan de Chía", ingredientes: ["Chía"],                                                                          categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-linaza`,          nombre: "Pan de Linaza", ingredientes: ["Linaza"],                                                                        categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-mejorana`,        nombre: "Pan de Mejorana", ingredientes: ["Mejorana"],                                                                      categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },
    { id: `${p}-girasol`,         nombre: "Pan de Semillas de Girasol", ingredientes: ["Semillas de girasol"],                                                           categoria: "Clásicos",                  tipo_pan: tipo, precio: 75,  precio_integral: 80  },

    // Multigranos
    { id: `${p}-mg1`,             nombre: "Multigrano Tricolor", ingredientes: ["Ajonjolí negro", "Ajonjolí blanco", "Semillas de girasol"],                                          categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg2`,             nombre: "Multigrano Campestre", ingredientes: ["Avena", "Ajonjolí", "Semillas de girasol"],                                                    categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg3`,             nombre: "Multigrano Nutricia", ingredientes: ["Avena", "Chía", "Linaza"],                                                         categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg4`,             nombre: "Multigrano Andino", ingredientes: ["Avena", "Ajonjolí", "Linaza"],                                                     categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg5`,             nombre: "Multigrano Esencial", ingredientes: ["Chía", "Linaza", "Ajonjolí"],                                                      categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-mg6`,             nombre: "Multigrano Dorado", ingredientes: ["Linaza", "Ajonjolí", "Semillas de girasol"],                                                   categoria: "Multigranos",               tipo_pan: tipo, precio: 85,  precio_integral: 90  },

    // Combinaciones y Especiales
    { id: `${p}-ajo-romero`,      nombre: "Pan de Hierbas Mediterráneo", ingredientes: ["Ajo", "Romero", "Albahaca"],                                                       categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80,  precio_integral: 85  },
    { id: `${p}-chia-linaza`,     nombre: "Pan de Semillas Doradas", ingredientes: ["Chía", "Linaza"],                                                                categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80,  precio_integral: 85  },
    { id: `${p}-pepitas`,         nombre: "Pan de Pepita de Calabaza", ingredientes: ["Pepitas de calabaza"],                                                          categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 90,  precio_integral: 95  },
    { id: `${p}-queso`,           nombre: "Pan al Parmesano", ingredientes: ["Queso parmesano"],                                                              categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 100, precio_integral: 105 },

    // Línea Dulce — Frutales
    { id: `${p}-canela`,          nombre: "Pan de Canela", ingredientes: ["Canela", "Azúcar"],                                                              categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 80,  precio_integral: 85  },
    { id: `${p}-pasas-canela`,    nombre: "Pan de Pasas y Canela", ingredientes: ["Pasas", "Canela", "Azúcar"],                                                       categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 85,  precio_integral: 90  },
    { id: `${p}-arandano-linaza`, nombre: "Pan de Arándano y Linaza", ingredientes: ["Arándano", "Linaza"],                                                            categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 90,  precio_integral: 95  },
    { id: `${p}-arandano-canela`, nombre: "Pan de Arándano y Canela", ingredientes: ["Arándano", "Canela", "Azúcar"],                                                    categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 95,  precio_integral: 100 },
    { id: `${p}-arandano-nuez`,   nombre: "Pan de Arándano, Nuez y Canela", ingredientes: ["Arándano", "Nuez", "Canela", "Azúcar"],                                              categoria: "Línea Dulce — Frutales",    tipo_pan: tipo, precio: 110, precio_integral: 115 },

    // Línea Dulce — Gourmet (sin chocolates)
    { id: `${p}-nuez`,            nombre: "Pan de Nuez", ingredientes: ["Nuez", "Azúcar"],                                                                categoria: "Línea Dulce — Gourmet",     tipo_pan: tipo, precio: 145, precio_integral: 150 },
    { id: `${p}-capricho`,        nombre: "Pan \"Capricho\"", ingredientes: ["Pasas", "Canela", "Arándano", "Nuez", "Pepitas de calabaza"], categoria: "Línea Dulce — Gourmet",     tipo_pan: tipo, precio: 145, precio_integral: 150 },
  ]
}

const baguette: ProductoCatalogo[] = [
  { id: "bg-basico",        nombre: "Pan Tradicional",                      descripcion: "Sin ingredientes adicionales", categoria: "Básico",           tipo_pan: "baguette", precio: 70,  precio_integral: 75  },
  { id: "bg-ajo",           nombre: "Pan de Ajo", ingredientes: ["Ajo"],                                                                      categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-ajo-albahaca",  nombre: "Pan de Ajo y Albahaca", ingredientes: ["Ajo", "Albahaca"],                                                         categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-ajo-mejorana",  nombre: "Pan de Ajo y Mejorana", ingredientes: ["Ajo", "Mejorana"],                                                         categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-ajonjoli-b",   nombre: "Pan de Ajonjolí Blanco", ingredientes: ["Ajonjolí blanco"],                                                          categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-ajonjoli-n",   nombre: "Pan de Ajonjolí Negro", ingredientes: ["Ajonjolí negro"],                                                           categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-avena",         nombre: "Pan de Avena", ingredientes: ["Avena"],                                                                    categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-chia",          nombre: "Pan de Chía", ingredientes: ["Chía"],                                                                     categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-linaza",        nombre: "Pan de Linaza", ingredientes: ["Linaza"],                                                                   categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-mejorana",      nombre: "Pan de Mejorana", ingredientes: ["Mejorana"],                                                                 categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-girasol",       nombre: "Pan de Semillas de Girasol", ingredientes: ["Semillas de girasol"],                                                      categoria: "Clásicos",         tipo_pan: "baguette", precio: 80,  precio_integral: 85  },
  { id: "bg-ajo-romero",    nombre: "Pan de Hierbas Mediterráneo", ingredientes: ["Ajo", "Romero", "Albahaca"],                                                   categoria: "Mezclas Especiales", tipo_pan: "baguette", precio: 85, precio_integral: 90 },
  { id: "bg-chia-linaza",   nombre: "Pan de Semillas Doradas", ingredientes: ["Chía", "Linaza"],                                                            categoria: "Mezclas Especiales", tipo_pan: "baguette", precio: 85, precio_integral: 90 },
  { id: "bg-mg1",           nombre: "Multigrano Tricolor", ingredientes: ["Ajonjolí negro", "Ajonjolí blanco", "Semillas de girasol"],                                      categoria: "Multigranos",      tipo_pan: "baguette", precio: 90,  precio_integral: 95  },
  { id: "bg-mg2",           nombre: "Multigrano Campestre", ingredientes: ["Avena", "Ajonjolí", "Semillas de girasol"],                                                categoria: "Multigranos",      tipo_pan: "baguette", precio: 90,  precio_integral: 95  },
  { id: "bg-mg3",           nombre: "Multigrano Esencial", ingredientes: ["Chía", "Linaza", "Ajonjolí"],                                                  categoria: "Multigranos",      tipo_pan: "baguette", precio: 90,  precio_integral: 95  },
  { id: "bg-mg4",           nombre: "Multigrano Dorado", ingredientes: ["Linaza", "Ajonjolí", "Semillas de girasol"],                                               categoria: "Multigranos",      tipo_pan: "baguette", precio: 90,  precio_integral: 95  },
  { id: "bg-pepitas",       nombre: "Pan de Pepita de Calabaza", ingredientes: ["Pepitas de calabaza"],                                                      categoria: "Gourmet",          tipo_pan: "baguette", precio: 100, precio_integral: 105 },
  { id: "bg-queso",         nombre: "Pan al Parmesano", ingredientes: ["Queso parmesano"],                                                          categoria: "Gourmet",          tipo_pan: "baguette", precio: 110, precio_integral: 115 },
]

const pizza: ProductoCatalogo[] = [
  { id: "pz-basico",      nombre: "Pan Tradicional",           descripcion: "Sin ingredientes adicionales", categoria: "Básico",   tipo_pan: "pizza", precio: 80, precio_integral: 85 },
  { id: "pz-ajo",         nombre: "Pan de Ajo", ingredientes: ["Ajo"],                                                            categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-albahaca",    nombre: "Pan de Albahaca", ingredientes: ["Albahaca"],                                                       categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-mejorana",    nombre: "Pan de Mejorana", ingredientes: ["Mejorana"],                                                       categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-romero",      nombre: "Pan de Romero", ingredientes: ["Romero"],                                                         categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-ajonjoli-b", nombre: "Pan de Ajonjolí Blanco", ingredientes: ["Ajonjolí blanco"],                                                categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-ajonjoli-n", nombre: "Pan de Ajonjolí Negro", ingredientes: ["Ajonjolí negro"],                                                 categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
]

export const SECCIONES_CATALOGO = [
  { tipo_pan: "caja"     as TipoPan, titulo: "Pan de Caja",    subtitulo: "900 gr aprox.",                  emoji: "🍞", productos: productosCaja()    },
  { tipo_pan: "hogaza"   as TipoPan, titulo: "Pan de Hogaza",  subtitulo: "900 gr aprox.",                  emoji: "🫓", productos: productosHogaza()  },
  { tipo_pan: "baguette" as TipoPan, titulo: "Baguette",       subtitulo: "3 piezas · 900 gr total · 30 cm", emoji: "🥖", productos: baguette           },
  { tipo_pan: "pizza"    as TipoPan, titulo: "Pan para Pizza", subtitulo: "2 piezas · 900 gr total · 30 cm", emoji: "🍕", productos: pizza              },
]

export const TODOS_LOS_PRODUCTOS: ProductoCatalogo[] = SECCIONES_CATALOGO.flatMap((s) => s.productos)

export function buscarProductoPorId(id: string): ProductoCatalogo | undefined {
  return TODOS_LOS_PRODUCTOS.find((p) => p.id === id)
}
