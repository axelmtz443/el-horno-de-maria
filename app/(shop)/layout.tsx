import Navbar from "@/components/ui/Navbar"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-[var(--color-pan-900)] text-[var(--color-pan-300)] text-center py-8 text-sm">
        <p className="font-serif text-base font-semibold text-[var(--color-pan-100)] mb-1">
          El Horno de María
        </p>
        <p className="text-[var(--color-pan-400)] text-xs mb-3">Pan artesanal de masa madre · Hecho a mano con amor</p>
        <p className="text-[var(--color-pan-500)] text-xs">
          Pedidos con 1 día de anticipación · Pago al recibir
        </p>
      </footer>
    </>
  )
}
