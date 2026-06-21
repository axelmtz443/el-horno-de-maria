const USOS = [
  {
    emoji: "🍓",
    titulo: "Con mermelada artesanal",
    desc: "La corteza crujiente con mermelada de fresa es el desayuno que no vas a querer cambiar.",
  },
  {
    emoji: "🥑",
    titulo: "Con aguacate y sal de mar",
    desc: "Simple, nutritivo y delicioso. La miga esponjosa aguanta perfectamente sin deshacerse.",
  },
  {
    emoji: "🧀",
    titulo: "Con queso fresco",
    desc: "El sabor ácido de la masa madre equilibra perfectamente cualquier queso fresco o madurado.",
  },
  {
    emoji: "🥪",
    titulo: "En sándwich gourmet",
    desc: "Rellénalo con lo que quieras — el pan aguanta sin aplastarse y sin perder su sabor.",
  },
  {
    emoji: "🍯",
    titulo: "Con miel de abeja",
    desc: "Un toque dulce natural sobre el pan tibio. La combinación favorita de nuestra familia.",
  },
  {
    emoji: "☕",
    titulo: "Al desayuno con café",
    desc: "Tostado ligeramente, con mantequilla. La forma más sencilla y más satisfactoria de empezar el día.",
  },
]

export default function TiposDeUso() {
  return (
    <section className="py-20 px-6 bg-[var(--color-pan-100)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[var(--color-pan-500)] text-xs uppercase tracking-widest font-semibold mb-2">Versatilidad</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-pan-800)] mb-4">
            ¿Cómo lo comes tú?
          </h2>
          <p className="text-[var(--color-pan-500)] max-w-md mx-auto text-sm">
            Este pan va bien con todo. Aquí van algunas ideas para que le saques el máximo provecho.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USOS.map(({ emoji, titulo, desc }) => (
            <div key={titulo}
              className="bg-white rounded-2xl p-6 border border-[var(--color-pan-200)]
                         hover:shadow-md hover:border-[var(--color-pan-300)] transition-all flex gap-4 items-start">
              <span className="text-4xl shrink-0 mt-0.5">{emoji}</span>
              <div>
                <h3 className="font-serif font-semibold text-[var(--color-pan-800)] text-base mb-1">{titulo}</h3>
                <p className="text-[var(--color-pan-500)] text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
