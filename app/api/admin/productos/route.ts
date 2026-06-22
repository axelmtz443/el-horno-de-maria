import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { SECCIONES_CATALOGO } from "@/lib/data/catalogo"

async function isAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get("horno_admin")?.value
  const secret  = process.env.ADMIN_SECRET ?? "horno-maria-secret-2025"
  return session === secret
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase no configurado")
  return createClient(url, key, { auth: { persistSession: false } })
}

// Todos los productos del catálogo estático (fuente de verdad)
function getStaticProducts() {
  return SECCIONES_CATALOGO.flatMap((s) =>
    s.productos.map((p) => ({
      id:               p.id,
      nombre:           p.nombre,
      descripcion:      p.descripcion ?? null,
      precio:           p.precio,
      precio_integral:  p.precio_integral,
      imagen_url:       null as string | null,
      disponible:       true,
      tipo_pan:         p.tipo_pan,
      categoria:        p.categoria,
    }))
  )
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const base = getStaticProducts()

  try {
    const db = supabaseAdmin()
    const { data: overrides } = await db
      .from("productos_override")
      .select("id, nombre, descripcion, precio, precio_integral, imagen_url, disponible")

    if (overrides && overrides.length > 0) {
      const map = new Map(overrides.map((o: Record<string, unknown>) => [o.id as string, o]))
      return NextResponse.json(
        base.map((p) => {
          const o = map.get(p.id)
          return o ? { ...p, ...o } : p
        })
      )
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("no configurado")) {
      return NextResponse.json(
        { error: "Supabase no configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel." },
        { status: 503 }
      )
    }
    // otro error de Supabase → retornar datos estáticos igual
  }

  return NextResponse.json(base)
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 })

  const db = supabaseAdmin()
  const { error } = await db
    .from("productos_override")
    .upsert({ id, ...fields, updated_at: new Date().toISOString() }, { onConflict: "id" })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
