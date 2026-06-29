// ─── Productos del catálogo ───────────────────────────────────────────────────

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  ingredientes: string[]
  precio: number
  imagen_url: string
  valor_nutrimental: ValorNutrimental
  disponible: boolean
  created_at: string
  tipo_pan?: string
}

export interface ValorNutrimental {
  calorias: number
  proteinas: number
  carbohidratos: number
  grasas: number
  fibra: number
  sodio: number
}

// ─── Configurador "Arma tu pan" ───────────────────────────────────────────────

export type Formato = "caja" | "hogaza" | "pizza"
export type TipoHarina = "integral" | "natural"
export type Sabor = "dulce" | "salado"

export interface IngredienteExtra {
  id: string
  nombre: string
  imagen_capa_url: string  // PNG/SVG para superposición visual
  precio_adicional: number
  categoria: "topping" | "relleno"
  compatible_con: Sabor[]
}

export interface ConfiguracionPan {
  formato: Formato | null
  tipo_harina: TipoHarina | null
  sabor: Sabor | null
  ingredientes_extra: IngredienteExtra[]
  precio_base: number
}

// ─── Carrito y pedidos ────────────────────────────────────────────────────────

export interface ItemCarrito {
  id: string  // uuid local
  tipo: "catalogo" | "personalizado"
  // Si es de catálogo:
  producto?: Producto
  // Si es personalizado:
  configuracion?: ConfiguracionPan
  cantidad: number
  precio_unitario: number
  notas?: string
}

export interface DatosCliente {
  nombre: string
  telefono: string
  email?: string
  fecha_entrega: string  // YYYY-MM-DD
  hora_entrega?: string
  notas_generales?: string
}

export interface Pedido {
  id: string
  cliente: DatosCliente
  items: ItemCarrito[]
  total: number
  estado: "pendiente" | "confirmado" | "en_proceso" | "listo" | "entregado" | "cancelado"
  created_at: string
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface Promocion {
  id: string
  nombre: string
  descripcion: string
  tipo: "porcentaje" | "monto_fijo"
  valor: number
  activa: boolean
  fecha_inicio: string
  fecha_fin: string
  aplica_a: "catalogo" | "personalizado" | "todo"
}
