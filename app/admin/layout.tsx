"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const NAV = [
  { href: "/admin/imagenes",   label: "Imágenes",       icon: "🖼️"  },
  { href: "/admin/pedidos",    label: "Pedidos",        icon: "📋"  },
  { href: "/admin/productos",  label: "Productos",      icon: "🥖"  },
  { href: "/admin/destacados", label: "Más comprados",  icon: "⭐"  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-[var(--color-pan-900)] flex flex-col">
        {/* Marca */}
        <div className="px-5 py-5 border-b border-[var(--color-pan-700)]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-pan-200)] shrink-0">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            </div>
            <div className="leading-tight">
              <p className="font-serif font-bold text-white text-xs">El Horno de María</p>
              <p className="text-[var(--color-pan-500)] text-[9px] uppercase tracking-wider">Admin</p>
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${pathname.startsWith(href)
                  ? "bg-[var(--color-pan-700)] text-white"
                  : "text-[var(--color-pan-300)] hover:bg-[var(--color-pan-800)] hover:text-white"}`}>
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="px-3 py-4 border-t border-[var(--color-pan-700)] space-y-2">
          <Link href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-[var(--color-pan-400)] hover:text-white text-xs rounded-xl hover:bg-[var(--color-pan-800)] transition-colors">
            🏠 Ver tienda
          </Link>
          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-[var(--color-pan-400)] hover:text-red-400 text-xs rounded-xl hover:bg-[var(--color-pan-800)] transition-colors text-left">
            🚪 {loggingOut ? "Saliendo…" : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
