"use client"

import { useEffect, useRef, useState } from "react"

interface Mensaje {
  rol: "user" | "model"
  texto: string
}

const SALUDO = "¡Hola! 👋 ¿Qué pan se te antoja hoy? Platícame y te ayudo a decidir."

export default function ChatbotFAB() {
  const [abierto, setAbierto] = useState(false)
  const [mostrarSaludo, setMostrarSaludo] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [entrada, setEntrada] = useState("")
  const [cargando, setCargando] = useState(false)
  const finRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tMostrar = setTimeout(() => setMostrarSaludo(true), 4000)
    const tOcultar = setTimeout(() => setMostrarSaludo(false), 4000 + 6000)
    return () => { clearTimeout(tMostrar); clearTimeout(tOcultar) }
  }, [])

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, cargando])

  function abrir() {
    setAbierto(true)
    setMostrarSaludo(false)
    if (mensajes.length === 0) {
      setMensajes([{ rol: "model", texto: SALUDO }])
    }
  }

  async function enviar() {
    const texto = entrada.trim()
    if (!texto || cargando) return

    const historial = mensajes.map((m) => ({ rol: m.rol, texto: m.texto }))
    setMensajes((prev) => [...prev, { rol: "user", texto }])
    setEntrada("")
    setCargando(true)

    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto, historial }),
      })
      const data = await res.json()
      setMensajes((prev) => [
        ...prev,
        { rol: "model", texto: res.ok ? data.respuesta : "Lo siento, no pude responder. Intenta de nuevo en un momento 🙏" },
      ])
    } catch {
      setMensajes((prev) => [...prev, { rol: "model", texto: "Lo siento, no pude responder. Intenta de nuevo en un momento 🙏" }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {/* Globo de saludo */}
      {mostrarSaludo && !abierto && (
        <button
          onClick={abrir}
          className="max-w-[220px] text-left bg-white border border-[var(--color-pan-200)] shadow-lg
                     rounded-2xl rounded-br-sm px-4 py-3 text-sm text-[var(--color-pan-800)]
                     hover:border-[var(--color-pan-400)] transition-colors cursor-pointer"
        >
          {SALUDO}
        </button>
      )}

      {/* Panel de chat */}
      {abierto && (
        <div className="w-80 sm:w-96 h-[28rem] bg-white rounded-3xl border border-[var(--color-pan-200)]
                         shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-pan-700)] text-white">
            <span className="font-serif font-semibold text-sm">🍞 Asistente de pan</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar chat"
              className="hover:opacity-75 cursor-pointer text-lg leading-none">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.rol === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] text-sm px-3.5 py-2 rounded-2xl whitespace-pre-wrap
                  ${m.rol === "user"
                    ? "bg-[var(--color-pan-700)] text-white rounded-br-sm"
                    : "bg-[var(--color-pan-100)] text-[var(--color-pan-900)] rounded-bl-sm"}`}>
                  {m.texto}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-[var(--color-pan-100)] text-[var(--color-pan-500)] text-sm px-3.5 py-2 rounded-2xl rounded-bl-sm">
                  Pensando…
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); enviar() }}
            className="flex items-center gap-2 p-3 border-t border-[var(--color-pan-200)]"
          >
            <input
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Cuéntame qué se te antoja…"
              className="flex-1 text-sm px-3.5 py-2 rounded-full border border-[var(--color-pan-200)]
                         focus:outline-none focus:border-[var(--color-pan-400)]"
            />
            <button
              type="submit"
              disabled={!entrada.trim() || cargando}
              className="w-9 h-9 shrink-0 rounded-full bg-[var(--color-pan-700)] text-white
                         hover:bg-[var(--color-pan-800)] disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Enviar mensaje"
            >
              →
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante */}
      {!abierto && (
        <button
          onClick={abrir}
          aria-label="Abrir asistente de pan"
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg
                     bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-800)] active:scale-95
                     transition-all duration-200 hover:shadow-xl text-2xl"
        >
          🍞
        </button>
      )}
    </div>
  )
}
