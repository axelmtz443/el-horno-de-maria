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

// Mismas preguntas y respuestas que se muestran en la sección FAQ del home,
// para que el asistente conteste lo mismo que el cliente vería ahí.
const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Cuánto dura el pan?",
    respuesta: "El pan de masa madre dura naturalmente 5 a 7 días a temperatura ambiente, bien envuelto. Si lo guardas en el refrigerador puede durar hasta 15 días. También puedes congelarlo — se conserva perfecto por 3–6 meses (Recomendable añadir papel entre las rebanadas para evitar que se peguen). No necesita conservadores porque la fermentación natural actúa como conservador.",
  },
  {
    pregunta: "¿Dónde realizan las entregas?",
    respuesta: "Actualmente entregamos en Tlaquepaque, cerca de Santa Cruz del Valle. Si tienes dudas sobre si llegamos a tu colonia, escríbenos por WhatsApp y con gusto lo confirmamos. Los pedidos se coordinan directamente y el punto de entrega se acuerda al momento del pedido.",
  },
  {
    pregunta: "¿Cómo funciona el proceso de compra?",
    respuesta: "Es muy sencillo: elige tus panes del catálogo (o crea uno personalizado), revisa tu pedido y presiona 'Enviar por WhatsApp'. Se abre directamente un mensaje para nosotros con todo tu pedido. Coordinamos la entrega por ese mismo chat y el pago lo realizas al recibir tu pan.",
  },
  {
    pregunta: "¿Con cuánto tiempo de anticipación debo pedir?",
    respuesta: "Lo ideal es pedir con al menos 1 día de anticipación, ya que el pan de masa madre lleva un proceso de fermentación largo (entre 12 y 24 horas). Para pedidos grandes o panes especiales, recomendamos avisarnos con 2 días de anticipación.",
  },
  {
    pregunta: "¿Por qué el pan de masa madre es diferente al industrial?",
    respuesta: "La masa madre es un cultivo vivo de levaduras naturales y bacterias beneficiosas. Este proceso de fermentación largo cambia la estructura del gluten, hace el pan más fácil de digerir, da un sabor más profundo y lo conserva de forma natural. Sin levadura comercial, sin conservadores, sin aditivos.",
  },
  {
    pregunta: "¿Puedo pedir panes personalizados?",
    respuesta: "Sí. Desde la sección 'Arma tu pan' puedes elegir el formato (caja, hogaza, baguette o pizza), el tipo de harina, el sabor y los ingredientes extras. Si tienes alguna idea específica que no esté en el menú, escríbenos — lo que más podemos es decirte que sí.",
  },
]

function construirContextoFAQ(): string {
  return PREGUNTAS_FRECUENTES.map((f) => `P: ${f.pregunta}\nR: ${f.respuesta}`).join("\n\n")
}

const INSTRUCCION_SISTEMA = `Eres el asistente virtual de "El Horno de María", una panadería artesanal mexicana.
Tu única tarea es ayudar al cliente a decidir qué pan pedir y resolver sus dudas, basándote ÚNICAMENTE en el catálogo, el configurador y las preguntas frecuentes que se te dan abajo.

Reglas:
- Responde siempre en español, de forma breve, cálida y cercana (máximo 3-4 oraciones).
- Si recomiendas un producto del catálogo, usa su nombre exacto y su precio.
- Si lo que pide el cliente no está en el catálogo pero podría armarse a su gusto, sugiérele "Arma tu propio pan" en /configurador.
- Si la pregunta coincide con una de las preguntas frecuentes, responde con esa misma información.
- Nunca inventes productos, ingredientes, precios ni políticas que no aparezcan en la información de abajo.
- Si preguntan algo que no tiene relación con pan, panadería o su pedido, redirige amablemente la conversación al pan.

CATÁLOGO:
${construirContextoCatalogo()}

CONFIGURADOR (Arma tu propio pan):
${construirContextoConfigurador()}

PREGUNTAS FRECUENTES:
${construirContextoFAQ()}`

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
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 },
          },
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
