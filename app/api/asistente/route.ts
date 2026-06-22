import { NextResponse } from "next/server"
import { obtenerIngredientes, TODOS_LOS_PRODUCTOS } from "@/lib/data/catalogo"
import { CONFIGURADOR_TIPOS_INFO } from "@/lib/data/configurador"

// Asistente del catálogo: ayuda al cliente a decidir qué pan pedir.
// El contexto (catálogo + configurador) se ancla en cada llamada para que el
// modelo no invente productos ni precios. La clave de Gemini vive solo aquí
// (server-side) — nunca se expone al cliente.

interface TurnoChat { rol: "user" | "model"; texto: string }

function construirContextoCatalogo(): string {
  const lineas = TODOS_LOS_PRODUCTOS.map((p) => {
    const ing = obtenerIngredientes(p)
    return `- [${p.tipo_pan}] ${p.nombre} — $${p.precio} (integral $${p.precio_integral})${ing.length ? ` · ${ing.join(", ")}` : ""}`
  })
  return lineas.join("\n")
}

function construirContextoConfigurador(): string {
  return CONFIGURADOR_TIPOS_INFO.map(
    (t) => `- ${t.titulo} (${t.subtitulo}): base personalizable, el cliente elige ingredientes extra y si lo quiere integral.`
  ).join("\n")
}

const INSTRUCCION_SISTEMA = `Eres el asistente virtual de "El Horno de María", una panadería artesanal mexicana.
Tu única tarea es ayudar al cliente a decidir qué pan pedir, basándote ÚNICAMENTE en el catálogo y el configurador que se te dan abajo.

Reglas:
- Responde siempre en español, de forma breve, cálida y cercana (máximo 3-4 oraciones).
- Si recomiendas un producto del catálogo, usa su nombre exacto y su precio.
- Si lo que pide el cliente no está en el catálogo pero podría armarse a su gusto, sugiérele "Arma tu propio pan" en /configurador.
- Nunca inventes productos, ingredientes ni precios que no aparezcan en la lista.
- Si preguntan algo que no tiene relación con pan, panadería o su pedido, redirige amablemente la conversación al pan.

CATÁLOGO:
${construirContextoCatalogo()}

CONFIGURADOR (Arma tu propio pan):
${construirContextoConfigurador()}`

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Asistente no configurado" }, { status: 503 })
  }

  let mensaje: string
  let historial: TurnoChat[]
  try {
    const body = await req.json()
    mensaje = String(body.mensaje ?? "").trim().slice(0, 500)
    historial = Array.isArray(body.historial) ? body.historial.slice(-10) : []
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }

  if (!mensaje) {
    return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 })
  }

  const contents = [
    ...historial
      .filter((t) => t && typeof t.texto === "string" && (t.rol === "user" || t.rol === "model"))
      .map((t) => ({ role: t.rol, parts: [{ text: t.texto.slice(0, 500) }] })),
    { role: "user", parts: [{ text: mensaje }] },
  ]

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: INSTRUCCION_SISTEMA }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      }
    )

    const data = await resp.json()

    if (!resp.ok) {
      console.error("Gemini API error:", data)
      return NextResponse.json({ error: "El asistente no pudo responder" }, { status: 502 })
    }

    const respuesta: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!respuesta) {
      console.error("Gemini API respuesta vacía:", data)
      return NextResponse.json({ error: "El asistente no pudo responder" }, { status: 502 })
    }

    return NextResponse.json({ respuesta })
  } catch (err) {
    console.error("Error en asistente:", err)
    return NextResponse.json({ error: "El asistente no pudo responder" }, { status: 502 })
  }
}
