"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useCarritoStore } from "@/lib/store/carritoStore"

export default function Navbar() {
  const totalItems = useCarritoStore((s) => s.totalItems())
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-pan-900)] text-[var(--color-pan-100)] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">

        {/* Logo + nombre */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-pan-200)] flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="El Horno de María"
              width={40}
              height={40}
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
          </div>
          <div className="leading-tight">
            <p className="font-serif font-bold text-base tracking-wide">El Horno de María</p>
            <p className="text-[var(--color-pan-400)] text-[10px] uppercase tracking-widest">Pan de masa madre</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/catalogo" className="hover:text-[var(--color-pan-300)] transition-colors">
            Catálogo
          </Link>
          <Link href="/configurador" className="hover:text-[var(--color-pan-300)] transition-colors">
            Arma tu pan
          </Link>
        </nav>

        <Link
          href="/pedido"
          className="relative flex items-center gap-2 bg-[var(--color-pan-500)] hover:bg-[var(--color-pan-400)]
                     text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0"
        >
          <span>🛒</span>
          <span className="hidden sm:inline">Mi pedido</span>
          {mounted && totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--color-trigo-500)] text-white
                             text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
