import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/ui/Navbar"
import PanesDestacados from "@/components/home/PanesDestacados"
import TiposDeUso from "@/components/home/TiposDeUso"
import FAQ from "@/components/home/FAQ"

// ─── Datos ────────────────────────────────────────────────────────────────────

const BENEFICIOS = [
  { emoji: "🌱", titulo: "Sabes exactamente qué estás comiendo", desc: "Solo cuatro ingredientes: harina, agua, sal y tiempo. Nada más. Lo que ves es lo que comes." },
  { emoji: "💚", titulo: "Lo comes y no te pesa", desc: "Ese malestar que sientes después del pan de caja aquí no existe. Tu cuerpo lo recibe como si fuera un amigo." },
  { emoji: "⚡", titulo: "Energía estable, sin bajones", desc: "No te caerás de sueño a media mañana. Este pan te mantiene activo y con energía mucho más tiempo." },
  { emoji: "😌", titulo: "Tu barriga te lo agradece", desc: "El proceso de fermentación viva hace que tu digestión trabaje mejor — menos hinchazón, más comodidad en tu día." },
  { emoji: "🌾", titulo: "Sin químicos, sin trucos", desc: "No necesita conservadores porque está hecho para durar de forma natural. Fresco de verdad, sin nada que esconder." },
  { emoji: "✨", titulo: "Tu cuerpo aprovecha más", desc: "El tiempo y el cuidado que le ponemos hace que cada mordida te aporte más. Lo sientes en cómo te mantienes satisfecho." },
]

const COMPARACION = [
  { aspecto: "Qué lleva",          madre: "Harina, agua, sal y una pizca de aceite de soya si lo requiere",  tienda: "Ingredientes que no reconoces" },
  { aspecto: "Cómo se hace",       madre: "A mano, con paciencia",        tienda: "Proceso industrial acelerado" },
  { aspecto: "Conservadores",      madre: "Ninguno",                      tienda: "Sí — para durar semanas en anaquel" },
  { aspecto: "Cómo te cae",        madre: "Ligero, sin malestar",         tienda: "Pesado, puede hinchar" },
  { aspecto: "Aceite de soya",      madre: "Depende del pan — algunos llevan",                                            tienda: "Sí — presente en la mayoría" },
  { aspecto: "Energía que te da",  madre: "Duradera y estable",                                                          tienda: "Rápida y con bajón después" },
  { aspecto: "Sabor",              madre: "Profundo, con carácter",                                                       tienda: "Igual siempre, sin personalidad" },
  { aspecto: "Cuánto dura fresco", madre: "hasta 15 días refrigerado · 3–6 meses en congelador",      tienda: "Semanas gracias a conservadores" },
]

// ─── Página ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative min-h-[88vh] flex flex-col md:flex-row overflow-hidden bg-[var(--color-pan-900)]">

          {/* Móvil: imagen como fondo con overlay */}
          <div className="absolute inset-0 md:hidden">
            <Image
              src="/fotohero.png"
              alt="Pan de masa madre artesanal"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[var(--color-pan-900)]/72" />
          </div>

          {/* Texto */}
          <div className="relative z-10 flex flex-col justify-center flex-1 px-6 py-16 md:px-10 lg:px-16 md:py-24">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] text-white mb-5">
              <span className="block">Alimenta tu vida</span>
              <span className="block text-[var(--color-pan-300)]">con lo que merece</span>
            </h1>

            <p className="text-[var(--color-pan-200)] text-sm md:text-base lg:text-lg max-w-sm md:max-w-md leading-relaxed mb-7">
              Pan artesanal de masa madre viva y fermentación natural.
              Sin procesos industriales, directo a tu mesa.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["Fermentación de 24 hrs", "Fácil digestión", "100% Natural"].map((tag) => (
                <span key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--color-pan-500)]/50
                             text-[var(--color-pan-300)] bg-[var(--color-pan-800)]/60">
                  ✦ {tag}
                </span>
              ))}
            </div>

            <div>
              <Link href="/catalogo"
                className="inline-block bg-[var(--color-pan-400)] hover:bg-[var(--color-pan-300)] text-[var(--color-pan-900)]
                           font-bold px-8 py-3.5 rounded-full text-base transition-all hover:scale-105 shadow-lg">
                Ver catálogo
              </Link>
            </div>
          </div>

          {/* Desktop: fotografía en panel derecho */}
          <div className="hidden md:block relative md:w-[60%] shrink-0">
            <Image
              src="/fotohero.png"
              alt="Pan de masa madre artesanal"
              fill
              priority
              className="object-cover object-center"
              sizes="60vw"
            />
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[var(--color-pan-900)] via-[var(--color-pan-900)]/40 to-transparent" />
          </div>
        </section>

        {/* ── Panes más comprados (justo bajo el Hero) ── */}
        <PanesDestacados />

        {/* ── Beneficios del pan de masa madre ── */}
        <section className="py-12 md:py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">Salud y bienestar</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-pan-800)] mb-4">
              ¿Por qué comer pan de masa madre?
            </h2>
            <p className="text-[var(--color-pan-500)] max-w-xl mx-auto text-sm">
              Lo que comes todos los días te define más de lo que crees.
              Un pequeño cambio en tu pan puede hacer una diferencia real en cómo te sientes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFICIOS.map(({ emoji, titulo, desc }) => (
              <div key={titulo}
                className="bg-white rounded-2xl p-6 border border-[var(--color-pan-200)]
                           hover:shadow-md hover:border-[var(--color-pan-300)] transition-all">
                <span className="text-4xl mb-4 block">{emoji}</span>
                <h3 className="font-serif text-lg font-semibold text-[var(--color-pan-800)] mb-2">{titulo}</h3>
                <p className="text-[var(--color-pan-500)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Masa madre vs tienda ── */}
        <section className="py-12 md:py-20 px-6 bg-[var(--color-pan-900)]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[var(--color-pan-400)] text-xs uppercase tracking-widest font-semibold mb-2">La diferencia importa</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                Pan de masa madre vs pan de tienda
              </h2>
              <p className="text-[var(--color-pan-300)] max-w-xl mx-auto text-sm">
                No tienes que estudiar nutrición para notar la diferencia.
                Solo prueba uno y luego el otro. Tu cuerpo te va a decir cuál prefiere.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[var(--color-pan-700)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-pan-800)]">
                    <th className="text-left px-5 py-4 text-[var(--color-pan-300)] font-semibold w-1/3">Aspecto</th>
                    <th className="text-center px-5 py-4 text-[var(--color-pan-200)] font-semibold">🏠 Masa madre artesanal</th>
                    <th className="text-center px-5 py-4 text-[var(--color-pan-400)] font-semibold">🏭 Pan de supermercado</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARACION.map((row, i) => (
                    <tr key={row.aspecto} className={i % 2 === 0 ? "bg-[var(--color-pan-800)]/40" : "bg-[var(--color-pan-800)]/20"}>
                      <td className="px-5 py-3.5 text-[var(--color-pan-300)] font-medium">{row.aspecto}</td>
                      <td className="px-5 py-3.5 text-center text-green-400 font-medium">{row.madre}</td>
                      <td className="px-5 py-3.5 text-center text-[var(--color-pan-400)]">{row.tienda}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Historia de Martes ── */}
        <section className="py-12 md:py-20 px-6 bg-[var(--color-pan-200)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="relative w-40 h-40">
                  <div className="w-40 h-40 rounded-full bg-[var(--color-pan-100)] border-4 border-[var(--color-pan-500)]
                                  shadow-xl flex flex-col items-center justify-center gap-1">
                    <span className="text-5xl">🫙</span>
                    <p className="font-serif font-bold text-[var(--color-pan-800)] text-sm">«Martes»</p>
                    <p className="text-[var(--color-pan-400)] text-[10px] italic">Desde: 6-05-25</p>
                  </div>
                  <span className="absolute -top-1 -right-1 text-lg animate-bounce">✨</span>
                </div>
                <p className="text-[var(--color-pan-600)] text-xs text-center max-w-[140px] italic">
                  Nuestro fermento vivo que da sabor a cada pan
                </p>
              </div>

              <div>
                <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">Nuestra historia</p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-pan-800)] mb-6">
                  El origen de un sueño<br />que se amasa cada día
                </h2>
                <div className="space-y-4 text-[var(--color-pan-700)] leading-relaxed text-sm">
                  <p>
                    Esta historia comienza con la llegada de nuestro querido <strong className="text-[var(--color-pan-900)]">«Martes»</strong> —
                    el nombre de nuestra primera masa madre, un fermento vivo que guarda el alma de El Horno de María.
                    Su nombre nació en un día de tranquilidad y felicidad, con la emoción de compartir con nuestra familia
                    y vecinos una nueva opción: un pan saludable, delicioso y, sobre todo, hecho con un amor inmenso.
                  </p>
                  <p>
                    En «Martes» no solo vive una fermentación natural, libre de conservadores. En él vive el amor
                    y la dedicación de una madre de familia que lo cuida como a un miembro más, para después compartir
                    su magia con sus seres queridos y con cada persona dispuesta a unirse a este bonito círculo.
                  </p>
                  <p>
                    Cada pan que sale de nuestro horno lleva consigo la esencia de «Martes» y el corazón de nuestra
                    familia. No es solo un alimento, es un lazo que se crea. Gracias por permitirnos llegar a tu mesa,
                    por valorar lo hecho en casa y por formar parte de este sueño que se amasa cada día.
                  </p>
                  <p className="font-serif text-base font-semibold text-[var(--color-pan-800)] pt-2 border-t border-[var(--color-pan-300)]">
                    Bienvenido a la familia de El Horno de María. 🍞
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tipos de uso ── */}
        <TiposDeUso />

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── CTA Configurador ── */}
        <section className="py-12 md:py-20 px-6 bg-[var(--color-pan-800)]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Diseña el pan de tus sueños 🍞
            </h2>
            <p className="text-[var(--color-pan-300)] text-base mb-8 max-w-xl mx-auto">
              Elige el tipo, los ingredientes y mira cómo queda en tiempo real.
              Caja, hogaza, baguette o pizza — tú decides.
            </p>
            <Link href="/configurador"
              className="inline-block bg-[var(--color-pan-400)] hover:bg-[var(--color-pan-300)] text-[var(--color-pan-900)]
                         font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg">
              Empezar a crear →
            </Link>
          </div>
        </section>

        {/* ── ¿Cómo hacer tu pedido? ── */}
        <section className="py-12 md:py-20 px-6 max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center text-[var(--color-pan-800)] mb-10 md:mb-14">
            ¿Cómo hacer tu pedido?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { paso: "1", emoji: "🛒", texto: "Elige del catálogo o crea tu pan personalizado" },
              { paso: "2", emoji: "📋", texto: "Revisa tu selección en Mi Pedido" },
              { paso: "3", emoji: "💬", texto: "Envíanos el pedido por WhatsApp con un clic" },
              { paso: "4", emoji: "🎉", texto: "Tu pan recién horneado en 24 a 36 horas — gastos de envío no incluidos" },
            ].map(({ paso, emoji, texto }) => (
              <div key={paso} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[var(--color-pan-700)] text-white font-serif
                                text-2xl font-bold flex items-center justify-center shadow">
                  {paso}
                </div>
                <span className="text-3xl">{emoji}</span>
                <p className="text-[var(--color-pan-600)] text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="bg-[var(--color-pan-900)] text-[var(--color-pan-300)] text-center py-8 text-sm">
        <p className="font-serif text-base font-semibold text-[var(--color-pan-100)] mb-1">El Horno de María</p>
        <p className="text-[var(--color-pan-400)] text-xs mb-2">Pan artesanal de masa madre · Hecho a mano con amor</p>
        <p className="text-[var(--color-pan-500)] text-xs mb-6">Anticipación de 24 a 36 horas · Gastos de envío no incluidos · Pago al recibir</p>

        <div className="pt-5 border-t border-[var(--color-pan-700)]/60 max-w-xs mx-auto">
          <a
            href="https://weprommarketing.mx/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-pan-400)] hover:text-[var(--color-pan-200)]
                       text-xs transition-colors group"
          >
            <span>
              © Sitio elaborado por <span className="font-medium underline-offset-2 group-hover:underline">WeProm® Marketing</span>
            </span>
          </a>
        </div>
      </footer>
    </>
  )
}
