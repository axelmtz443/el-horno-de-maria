import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { SECCIONES_CATALOGO } from "@/lib/data/catalogo"

const ALL = SECCIONES_CATALOGO.flatMap((s) =>
  s.productos.map((p) => ({ ...p, imagen_url: null as string | null }))
)

const DEFAULT_IDS = ["hg-basico", "cj-capricho", "cj-fino"]

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("not configured")
  return createClient(url, key, { auth: { persistSession: false } })
}

function buildFeatured(ids: string[], overrideMap: Map<string, Record<string, unknown>>) {
  return ids.map((id) => {
    const base = ALL.find((p) => p.id === id)
    if (!base) return null
    const ov = overrideMap.get(id)
    return ov ? { ...base, ...ov } : base
  }).filter(Boolean)
}

export async function GET() {
  try {
    const db = supabaseAdmin()

    const [{ data: mc }, { data: overrides }] = await Promise.all([
      db.from("mas_comprados").select("posicion, producto_id").order("posicion"),
      db.from("productos_override").select("id, nombre, descripcion, precio, precio_integral, imagen_url"),
    ])

    const ids = mc && mc.length === 3
      ? mc.map((r: { producto_id: string }) => r.producto_id)
      : DEFAULT_IDS

    const overrideMap = new Map(
      (overrides ?? []).map((o: Record<string, unknown>) => [o.id as string, o])
    )

    return NextResponse.json(buildFeatured(ids, overrideMap))
  } catch {
    const overrideMap = new Map<string, Record<string, unknown>>()
    return NextResponse.json(buildFeatured(DEFAULT_IDS, overrideMap))
  }
}
