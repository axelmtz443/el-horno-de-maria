import { Resend } from "resend"
import type { DatosCliente, ItemCarrito } from "@/types"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarEmailConfirmacion(
  cliente: DatosCliente,
  items: ItemCarrito[],
  total: number,
  pedidoId: string
) {
  if (!cliente.email) return

  const itemsHtml = items.map((item) => {
    if (item.tipo === "catalogo" && item.producto) {
      return `<tr>
        <td>${item.cantidad}x ${item.producto.nombre}</td>
        <td>$${(item.precio_unitario * item.cantidad).toFixed(2)}</td>
      </tr>`
    }
    if (item.tipo === "personalizado" && item.configuracion) {
      const cfg = item.configuracion
      return `<tr>
        <td>${item.cantidad}x Pan personalizado (${cfg.formato}, ${cfg.tipo_harina}, ${cfg.sabor})</td>
        <td>$${(item.precio_unitario * item.cantidad).toFixed(2)}</td>
      </tr>`
    }
    return ""
  }).join("")

  await resend.emails.send({
    from: "Panadería Artesanal <pedidos@tudominio.com>",
    to: cliente.email,
    subject: `✅ Confirmación de pedido #${pedidoId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3d2b1f;">
        <h1 style="color: #8b5e3c;">🥖 ¡Pedido recibido!</h1>
        <p>Hola <strong>${cliente.nombre}</strong>, tu pedido ha sido registrado con éxito.</p>
        <p><strong>Fecha de entrega:</strong> ${cliente.fecha_entrega}</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #f5e6d3;">
              <th style="text-align:left; padding: 8px;">Producto</th>
              <th style="text-align:left; padding: 8px;">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td style="padding: 8px;">Total estimado</td>
              <td style="padding: 8px;">$${total.toFixed(2)} MXN</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          El pago se coordina directamente con la panadería. Te contactaremos para confirmar.
        </p>
      </div>
    `,
  })
}
