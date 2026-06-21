"use client"

import { useState, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirect     = searchParams.get("redirect") ?? "/admin/imagenes"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json()
        setError(msg ?? "Error al iniciar sesión")
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError("Error de red, intenta de nuevo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-pan-900)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--color-pan-200)] mb-4 shadow-lg">
            <Image src="/logo.png" alt="El Horno de María" width={64} height={64} className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
          </div>
          <h1 className="font-serif text-xl font-bold text-white">El Horno de María</h1>
          <p className="text-[var(--color-pan-400)] text-xs mt-1">Panel de administración</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}
          className="bg-[var(--color-pan-800)] rounded-2xl p-8 shadow-2xl border border-[var(--color-pan-700)]">

          <h2 className="font-serif text-lg font-semibold text-white mb-6 text-center">Iniciar sesión</h2>

          {error && (
            <div className="bg-red-900/40 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[var(--color-pan-300)] text-xs font-medium mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-[var(--color-pan-900)] border border-[var(--color-pan-600)] rounded-xl
                           px-4 py-3 text-white text-sm placeholder-[var(--color-pan-500)]
                           focus:outline-none focus:border-[var(--color-pan-400)] transition-colors"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-[var(--color-pan-300)] text-xs font-medium mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[var(--color-pan-900)] border border-[var(--color-pan-600)] rounded-xl
                           px-4 py-3 text-white text-sm placeholder-[var(--color-pan-500)]
                           focus:outline-none focus:border-[var(--color-pan-400)] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[var(--color-pan-500)] hover:bg-[var(--color-pan-400)] disabled:opacity-60
                       text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Ingresando…" : "Entrar al panel"}
          </button>
        </form>

        <p className="text-center text-[var(--color-pan-600)] text-xs mt-6">
          Solo para administradores de El Horno de María
        </p>
      </div>
    </div>
  )
}
