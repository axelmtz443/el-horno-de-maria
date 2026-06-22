"use client"

import { useState } from "react"

const PREGUNTAS = [
  {
    pregunta: "¿Cuánto dura el pan?",
    respuesta: "El pan de masa madre dura naturalmente 5 a 7 días a temperatura ambiente, bien envuelto. Si lo guardas en el refrigerador puede durar hasta 15 días. También puedes congelarlo — se conserva perfecto por 3–6 meses (Recomendable añadir papel entre las rebanadas para evitar que se peguen). No necesita conservadores porque la fermentación natural actúa como conservador.",
  },
  {
    pregunta: "¿Dónde realizan las entregas?",
    respuesta: "Actualmente entregamos en Guadalajara y zona metropolitana. Si tienes dudas sobre si llegamos a tu colonia, escríbenos por WhatsApp y con gusto lo confirmamos. Los pedidos se coordinan directamente y el punto de entrega se acuerda al momento del pedido.",
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

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(null)

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">Dudas frecuentes</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-pan-800)] mb-4">
          Preguntas frecuentes
        </h2>
        <p className="text-[var(--color-pan-500)] text-sm max-w-md mx-auto">
          Si tu pregunta no está aquí, escríbenos por WhatsApp — respondemos rápido.
        </p>
      </div>

      <div className="space-y-3">
        {PREGUNTAS.map((item, i) => (
          <div key={i}
            className="bg-white rounded-2xl border border-[var(--color-pan-200)] overflow-hidden
                       hover:border-[var(--color-pan-300)] transition-colors">
            <button
              onClick={() => setAbierto(abierto === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
            >
              <span className="font-serif font-semibold text-[var(--color-pan-800)] text-base">
                {item.pregunta}
              </span>
              <span className={`text-[var(--color-pan-500)] text-xl shrink-0 transition-transform duration-200
                ${abierto === i ? "rotate-45" : ""}`}>
                +
              </span>
            </button>

            {abierto === i && (
              <div className="px-6 pb-5 text-[var(--color-pan-600)] text-sm leading-relaxed border-t border-[var(--color-pan-100)] pt-4">
                {item.respuesta}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
