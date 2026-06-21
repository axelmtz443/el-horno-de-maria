export type TipoPan = "caja" | "hogaza" | "baguette" | "pizza"

export interface ProductoCatalogo {
  id: string
  nombre: string
  descripcion?: string
  categoria: string
  tipo_pan: TipoPan
  precio: number          // precio base (natural)
  precio_integral: number // +$5 siempre
}

function productosCaja(): ProductoCatalogo[] {
  const p = "cj"
  const tipo: TipoPan = "caja"
  return [
    // Básico
    { id: `${p}-basico`, nombre: "Básico", descripcion: "Sin ingredientes adicionales", categoria: "Básico", tipo_pan: tipo, precio: 65, precio_integral: 70 },

    // Clásicos
    { id: `${p}-ajo`, nombre: "Ajo", descripcion: "Solo, con albahaca o con mejorana", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-ajonjoli`, nombre: "Ajonjolí", descripcion: "Blanco o negro", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-avena`, nombre: "Avena", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-chia`, nombre: "Chía", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-linaza`, nombre: "Linaza", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-mejorana`, nombre: "Mejorana", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-girasol`, nombre: "Semillas de Girasol", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },

    // Multigranos
    { id: `${p}-mg1`, nombre: "Ajonjolí Negro y Blanco con Girasol", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg2`, nombre: "Avena, Ajonjolí y Girasol", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg3`, nombre: "Avena, Chía y Linaza", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg4`, nombre: "Avena, Ajonjolí y Linaza", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg5`, nombre: "Chía, Linaza y Ajonjolí", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg6`, nombre: "Linaza, Ajonjolí y Girasol", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },

    // Combinaciones y Especiales
    { id: `${p}-ajo-romero`, nombre: "Ajo, Romero y Albahaca", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80, precio_integral: 85 },
    { id: `${p}-chia-linaza`, nombre: "Chía y Linaza", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80, precio_integral: 85 },
    { id: `${p}-pepitas`, nombre: "Pepitas de Calabaza", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 90, precio_integral: 95 },
    { id: `${p}-queso`, nombre: "Queso Parmesano", descripcion: "Con o sin ajo", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 100, precio_integral: 105 },

    // Línea Dulce — Frutales
    { id: `${p}-canela`, nombre: "Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 80, precio_integral: 85 },
    { id: `${p}-pasas-canela`, nombre: "Pasas, Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-arandano-linaza`, nombre: "Arándano y Linaza", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 90, precio_integral: 95 },
    { id: `${p}-arandano-canela`, nombre: "Arándano, Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 95, precio_integral: 100 },
    { id: `${p}-arandano-nuez`, nombre: "Arándano, Nuez, Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 110, precio_integral: 115 },

    // Línea Dulce — Chocolates
    { id: `${p}-choc-trad`, nombre: "Chocolate Tradicional", categoria: "Línea Dulce — Chocolates", tipo_pan: tipo, precio: 95, precio_integral: 100 },
    { id: `${p}-choc-caca`, nombre: "Chocolate y Cacahuate", categoria: "Línea Dulce — Chocolates", tipo_pan: tipo, precio: 105, precio_integral: 110 },
    { id: `${p}-choc-blanco`, nombre: "Chocolate Blanco", categoria: "Línea Dulce — Chocolates", tipo_pan: tipo, precio: 105, precio_integral: 110 },
    { id: `${p}-choc-almendra`, nombre: "Chocolate y Almendra", categoria: "Línea Dulce — Chocolates", tipo_pan: tipo, precio: 125, precio_integral: 130 },

    // Línea Dulce — Gourmet
    { id: `${p}-nuez`, nombre: "Nuez y Azúcar", categoria: "Línea Dulce — Gourmet", tipo_pan: tipo, precio: 145, precio_integral: 150 },
    { id: `${p}-capricho`, nombre: "Capricho", descripcion: "Pasas, canela, arándano, nuez y pepitas de calabaza", categoria: "Línea Dulce — Gourmet", tipo_pan: tipo, precio: 145, precio_integral: 150 },
    { id: `${p}-fino`, nombre: "El Fino", descripcion: "Cereza, chocolate blanco, almendra y azúcar mascabado", categoria: "Línea Dulce — Gourmet", tipo_pan: tipo, precio: 150, precio_integral: 155 },
    { id: `${p}-antojo`, nombre: "Antojo", descripcion: "Nuez, almendra, chocolate y canela", categoria: "Línea Dulce — Gourmet", tipo_pan: tipo, precio: 145, precio_integral: 150 },
  ]
}

function productosHogaza(): ProductoCatalogo[] {
  const p = "hg"
  const tipo: TipoPan = "hogaza"
  return [
    // Básico
    { id: `${p}-basico`, nombre: "Básico", descripcion: "Sin ingredientes adicionales", categoria: "Básico", tipo_pan: tipo, precio: 65, precio_integral: 70 },

    // Clásicos
    { id: `${p}-ajo`, nombre: "Ajo", descripcion: "Solo, con albahaca o con mejorana", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-ajonjoli`, nombre: "Ajonjolí", descripcion: "Blanco o negro", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-avena`, nombre: "Avena", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-chia`, nombre: "Chía", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-linaza`, nombre: "Linaza", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-mejorana`, nombre: "Mejorana", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },
    { id: `${p}-girasol`, nombre: "Semillas de Girasol", categoria: "Clásicos", tipo_pan: tipo, precio: 75, precio_integral: 80 },

    // Multigranos
    { id: `${p}-mg1`, nombre: "Ajonjolí Negro y Blanco con Girasol", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg2`, nombre: "Avena, Ajonjolí y Girasol", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg3`, nombre: "Avena, Chía y Linaza", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg4`, nombre: "Avena, Ajonjolí y Linaza", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg5`, nombre: "Chía, Linaza y Ajonjolí", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-mg6`, nombre: "Linaza, Ajonjolí y Girasol", categoria: "Multigranos", tipo_pan: tipo, precio: 85, precio_integral: 90 },

    // Combinaciones y Especiales
    { id: `${p}-ajo-romero`, nombre: "Ajo, Romero y Albahaca", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80, precio_integral: 85 },
    { id: `${p}-chia-linaza`, nombre: "Chía y Linaza", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 80, precio_integral: 85 },
    { id: `${p}-pepitas`, nombre: "Pepitas de Calabaza", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 90, precio_integral: 95 },
    { id: `${p}-queso`, nombre: "Queso Parmesano", descripcion: "Con o sin ajo", categoria: "Combinaciones y Especiales", tipo_pan: tipo, precio: 100, precio_integral: 105 },

    // Línea Dulce — Frutales
    { id: `${p}-canela`, nombre: "Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 80, precio_integral: 85 },
    { id: `${p}-pasas-canela`, nombre: "Pasas, Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 85, precio_integral: 90 },
    { id: `${p}-arandano-linaza`, nombre: "Arándano y Linaza", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 90, precio_integral: 95 },
    { id: `${p}-arandano-canela`, nombre: "Arándano, Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 95, precio_integral: 100 },
    { id: `${p}-arandano-nuez`, nombre: "Arándano, Nuez, Canela y Azúcar", categoria: "Línea Dulce — Frutales", tipo_pan: tipo, precio: 110, precio_integral: 115 },

    // Línea Dulce — Gourmet (sin chocolates)
    { id: `${p}-nuez`, nombre: "Nuez y Azúcar", categoria: "Línea Dulce — Gourmet", tipo_pan: tipo, precio: 145, precio_integral: 150 },
    { id: `${p}-capricho`, nombre: "Capricho", descripcion: "Pasas, canela, arándano, nuez y pepitas de calabaza", categoria: "Línea Dulce — Gourmet", tipo_pan: tipo, precio: 145, precio_integral: 150 },
  ]
}

const baguette: ProductoCatalogo[] = [
  { id: "bg-basico", nombre: "Básico", descripcion: "Sin ingredientes adicionales", categoria: "Básico", tipo_pan: "baguette", precio: 70, precio_integral: 75 },
  { id: "bg-ajo", nombre: "Ajo", descripcion: "Solo, con albahaca o con mejorana", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-ajonjoli", nombre: "Ajonjolí", descripcion: "Blanco o negro", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-avena", nombre: "Avena", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-chia", nombre: "Chía", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-linaza", nombre: "Linaza", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-mejorana", nombre: "Mejorana", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-girasol", nombre: "Semillas de Girasol", categoria: "Clásicos", tipo_pan: "baguette", precio: 80, precio_integral: 85 },
  { id: "bg-ajo-romero", nombre: "Ajo, Romero y Albahaca", categoria: "Mezclas Especiales", tipo_pan: "baguette", precio: 85, precio_integral: 90 },
  { id: "bg-chia-linaza", nombre: "Chía y Linaza", categoria: "Mezclas Especiales", tipo_pan: "baguette", precio: 85, precio_integral: 90 },
  { id: "bg-mg1", nombre: "Ajonjolí Negro y Blanco con Girasol", categoria: "Multigranos", tipo_pan: "baguette", precio: 90, precio_integral: 95 },
  { id: "bg-mg2", nombre: "Avena, Ajonjolí y Girasol", categoria: "Multigranos", tipo_pan: "baguette", precio: 90, precio_integral: 95 },
  { id: "bg-mg3", nombre: "Chía, Linaza y Ajonjolí", categoria: "Multigranos", tipo_pan: "baguette", precio: 90, precio_integral: 95 },
  { id: "bg-mg4", nombre: "Linaza, Ajonjolí y Girasol", categoria: "Multigranos", tipo_pan: "baguette", precio: 90, precio_integral: 95 },
  { id: "bg-pepitas", nombre: "Pepitas de Calabaza", categoria: "Gourmet", tipo_pan: "baguette", precio: 100, precio_integral: 105 },
  { id: "bg-queso", nombre: "Queso Parmesano", descripcion: "Con o sin ajo", categoria: "Gourmet", tipo_pan: "baguette", precio: 110, precio_integral: 115 },
]

const pizza: ProductoCatalogo[] = [
  { id: "pz-basico", nombre: "Básico", descripcion: "Sin ingredientes adicionales", categoria: "Básico", tipo_pan: "pizza", precio: 80, precio_integral: 85 },
  { id: "pz-albahaca", nombre: "Albahaca", categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-mejorana", nombre: "Mejorana", categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-ajonjoli", nombre: "Ajonjolí", descripcion: "Blanco o negro", categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-romero", nombre: "Romero", categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
  { id: "pz-ajo", nombre: "Ajo", categoria: "Clásicos", tipo_pan: "pizza", precio: 90, precio_integral: 95 },
]

export const SECCIONES_CATALOGO = [
  { tipo_pan: "caja" as TipoPan, titulo: "Pan de Caja", subtitulo: "900 gr aprox.", emoji: "🍞", productos: productosCaja() },
  { tipo_pan: "hogaza" as TipoPan, titulo: "Pan de Hogaza", subtitulo: "900 gr aprox.", emoji: "🫓", productos: productosHogaza() },
  { tipo_pan: "baguette" as TipoPan, titulo: "Baguette", subtitulo: "3 piezas · 900 gr total · 30 cm", emoji: "🥖", productos: baguette },
  { tipo_pan: "pizza" as TipoPan, titulo: "Pan para Pizza", subtitulo: "2 piezas · 900 gr total · 30 cm", emoji: "🍕", productos: pizza },
]
