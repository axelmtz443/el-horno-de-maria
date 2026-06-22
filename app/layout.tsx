import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import WhatsAppFAB from "@/components/ui/WhatsAppFAB"
import ChatbotFAB from "@/components/ui/ChatbotFAB"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "El Horno de María | Pan artesanal de masa madre",
  description:
    "Pan artesanal de masa madre, sin conservadores y hecho con amor. Caja, hogaza, baguette y pizza. Pedidos a domicilio con un día de anticipación.",
  openGraph: {
    title: "El Horno de María — Pan artesanal de masa madre",
    description:
      "Pan artesanal hecho con masa madre, sin conservadores. Caja, hogaza, baguette y pizza. Pide con un día de anticipación.",
    url: SITE_URL,
    siteName: "El Horno de María",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "El Horno de María — Pan artesanal de masa madre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Horno de María | Pan artesanal de masa madre",
    description: "Pan artesanal hecho con masa madre, sin conservadores.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ChatbotFAB />
        <WhatsAppFAB />
      </body>
    </html>
  )
}
