"use client"

import type { TipoPan } from "@/lib/data/catalogo"
import type { Ingrediente } from "@/lib/data/configurador"

interface Props {
  tipoPan: TipoPan | null
  integral: boolean
  seleccionados: Ingrediente[]
}

const COLORES = {
  natural:  { masa: "#F5D58C", corteza: "#C8862A" },
  integral: { masa: "#C49A45", corteza: "#7A5120" },
}

function PanCaja({ masa, corteza }: { masa: string; corteza: string }) {
  return (
    <g>
      <ellipse cx="200" cy="315" rx="140" ry="14" fill="rgba(0,0,0,0.12)" />
      <rect x="60" y="148" width="280" height="162" rx="28" fill={corteza} />
      <rect x="72" y="160" width="256" height="138" rx="20" fill={masa} />
      <line x1="137" y1="160" x2="137" y2="298" stroke={corteza} strokeWidth="2.5" opacity="0.5" />
      <line x1="200" y1="160" x2="200" y2="298" stroke={corteza} strokeWidth="2.5" opacity="0.5" />
      <line x1="263" y1="160" x2="263" y2="298" stroke={corteza} strokeWidth="2.5" opacity="0.5" />
      <ellipse cx="200" cy="174" rx="90" ry="10" fill="rgba(255,255,255,0.18)" />
    </g>
  )
}

function PanHogaza({ masa, corteza }: { masa: string; corteza: string }) {
  return (
    <g>
      <ellipse cx="200" cy="312" rx="132" ry="18" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="200" cy="220" rx="132" ry="100" fill={corteza} />
      <ellipse cx="200" cy="215" rx="116" ry="88" fill={masa} />
      <path d="M158 190 Q200 164 242 190" stroke={corteza} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M148 216 Q200 196 252 216" stroke={corteza} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

function PanBaguette({ masa, corteza }: { masa: string; corteza: string }) {
  return (
    <g>
      <ellipse cx="200" cy="316" rx="155" ry="12" fill="rgba(0,0,0,0.12)" />
      {[{ y: 195, o: 0.65 }, { y: 222, o: 0.82 }, { y: 249, o: 1 }].map(({ y, o }, i) => (
        <g key={i} opacity={o}>
          <rect x="52" y={y - 14} width="296" height="28" rx="14" fill={corteza} />
          <rect x="62" y={y - 10} width="276" height="20" rx="10" fill={masa} />
          {[90, 145, 200, 255, 305].map((x) => (
            <line key={x} x1={x} y1={y - 10} x2={x + 16} y2={y + 10}
              stroke={corteza} strokeWidth="2" opacity="0.55" />
          ))}
        </g>
      ))}
    </g>
  )
}

function PanPizza({ masa, corteza }: { masa: string; corteza: string }) {
  return (
    <g>
      <ellipse cx="200" cy="316" rx="148" ry="14" fill="rgba(0,0,0,0.12)" />
      <g opacity="0.72">
        <ellipse cx="183" cy="238" rx="137" ry="70" fill={corteza} />
        <ellipse cx="183" cy="235" rx="120" ry="60" fill={masa} />
        <ellipse cx="183" cy="238" rx="137" ry="70" fill="none" stroke={corteza} strokeWidth="14" />
      </g>
      <ellipse cx="213" cy="252" rx="137" ry="70" fill={corteza} />
      <ellipse cx="213" cy="249" rx="120" ry="60" fill={masa} />
      <ellipse cx="213" cy="252" rx="137" ry="70" fill="none" stroke={corteza} strokeWidth="14" />
    </g>
  )
}

// Decoraciones visuales por ingrediente
const DECOR: Record<string, { s: string; pts: Array<[number, number]> }> = {
  ajonjoli:      { s: "·",  pts: [[168,207],[193,197],[216,210],[180,227],[205,230]] },
  avena:         { s: "〜", pts: [[163,208],[198,198],[222,215]] },
  chia:          { s: "•",  pts: [[170,205],[200,196],[222,212],[182,228]] },
  girasol:       { s: "✿",  pts: [[168,206],[200,196],[224,211]] },
  multigranos:   { s: "✦",  pts: [[165,205],[195,195],[222,210],[178,228]] },
  "choc-trad":   { s: "◆",  pts: [[170,205],[200,195],[225,210],[185,228]] },
  "choc-blanco": { s: "◇",  pts: [[170,205],[200,195],[225,210],[185,228]] },
  queso:         { s: "◉",  pts: [[170,205],[205,198],[225,218]] },
  pepitas:       { s: "▸",  pts: [[168,208],[198,200],[225,212],[182,230]] },
  nuez:          { s: "⬡",  pts: [[170,205],[205,196],[225,212]] },
  "nuez-azucar": { s: "⬡",  pts: [[170,205],[205,196],[225,212]] },
}

export default function VisualizadorPan({ tipoPan, integral, seleccionados }: Props) {
  const pal = integral ? COLORES.integral : COLORES.natural

  return (
    <div className="flex flex-col items-center">
      {!tipoPan && (
        <p className="text-[var(--color-pan-400)] text-sm mb-3 italic text-center">
          Elige el tipo de pan para ver la vista previa
        </p>
      )}

      <svg
        viewBox="0 0 400 360"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[260px] drop-shadow-lg transition-all duration-500"
        aria-label="Vista previa del pan"
      >
        <circle cx="200" cy="235" r="150" fill="rgba(245,230,200,0.2)" />

        {(!tipoPan || tipoPan === "caja") && <PanCaja masa={pal.masa} corteza={pal.corteza} />}
        {tipoPan === "hogaza"  && <PanHogaza  masa={pal.masa} corteza={pal.corteza} />}
        {tipoPan === "baguette" && <PanBaguette masa={pal.masa} corteza={pal.corteza} />}
        {tipoPan === "pizza"   && <PanPizza   masa={pal.masa} corteza={pal.corteza} />}

        {/* Decoraciones de ingredientes seleccionados */}
        {seleccionados.slice(0, 4).map((ing, idx) => {
          const d = DECOR[ing.id]
          if (!d) return null
          const [x, y] = d.pts[idx % d.pts.length]
          return (
            <text key={ing.id} x={x} y={y} fontSize="18" textAnchor="middle"
              dominantBaseline="middle" fill={pal.corteza} opacity="0.85" className="select-none">
              {d.s}
            </text>
          )
        })}
      </svg>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
        {tipoPan && (
          <span className="bg-[var(--color-pan-200)] text-[var(--color-pan-800)] text-xs px-3 py-1 rounded-full font-medium">
            {{caja:"Pan de Caja",hogaza:"Hogaza",baguette:"Baguette",pizza:"Pizza"}[tipoPan]}
          </span>
        )}
        {integral && (
          <span className="bg-[var(--color-pan-700)] text-white text-xs px-3 py-1 rounded-full font-medium">
            🌿 Integral
          </span>
        )}
        {seleccionados.map((i) => (
          <span key={i.id} className="bg-[var(--color-trigo-100)] text-[var(--color-pan-800)] text-xs px-2 py-1 rounded-full">
            {i.nombre.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  )
}
