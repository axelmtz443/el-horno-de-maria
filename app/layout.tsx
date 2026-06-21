import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import WhatsAppFAB from "@/components/ui/WhatsAppFAB"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "El Horno de María | Pan artesanal de masa madre",
  description:
    "Pan artesanal de masa madre, sin conservadores y hecho con amor. Caja, hogaza, baguette y pizza. Pedidos a domicilio con un día de anticipación.",
  openGraph: {
    title: "El Horno de María",
    description: "Pan artesanal de masa madre, sin conservadores y hecho con amor.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppFAB />
      </body>
    </html>
  )
}
