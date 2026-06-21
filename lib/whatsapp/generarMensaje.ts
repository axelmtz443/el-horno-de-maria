import type { ItemCarrito } from "@/types"

export const TELEFONO_PANADERIA = process.env.NEXT_PUBLIC_WHATSAPP_TELEFONO ?? "523313285457"

export function generarLinkWhatsApp(items: ItemCarrito[], total: number): string {
  const lineasItems = items.map((item) => {
    if (item.tipo === "catalogo" && item.producto) {
      return `- ${item.cantidad}x ${item.producto.nombre} - $${(item.precio_unitario * item.cantidad).toFixed(2)}`
    }

    if (item.tipo === "personalizado" && item.configuracion) {
      const cfg = item.configuracion
      const extras = cfg.ingredientes_extra.map((e) => e.nombre).join(", ") || "ninguno"
      return [
        `- ${item.cantidad}x Pan personalizado - $${(item.precio_unitario * item.cantidad).toFixed(2)}`,
        `  Formato: ${cfg.formato} | Harina: ${cfg.tipo_harina} | Sabor: ${cfg.sabor}`,
        `  Extras: ${extras}`,
      ].join("\n")
    }

    return ""
  }).filter(Boolean).join("\n")

  const mensaje = `
*Pedido - El Horno de Maria*

*Mi pedido:*
${lineasItems}

*Total estimado:* $${total.toFixed(2)} MXN

_Enviado desde la web_
`.trim()

  return `https://wa.me/${TELEFONO_PANADERIA}?text=${encodeURIComponent(mensaje)}`
}
