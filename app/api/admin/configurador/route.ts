import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

async function isAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get("horno_admin")?.value
  const secret  = process.env.ADMIN_SECRET ?? "horno-maria-secret-2025"
  return session === secret
}

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase no configurado")
  return createClient(url, key, { auth: { persistSession: false } })
}

// GET — devuelve overrides de precios de ingredientes y precios base por tipo
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const supabase = db()
    const [{ data: ingredientes }, { data: bases }] = await Promise.all([
      supabase.from("precios_ingredientes").select("id, grupo, precio"),
      supabase.from("precios_base_pan").select("tipo_pan, precio_base, precio_integral"),
    ])
    return NextResponse.json({ ingredientes: ingredientes ?? [], bases: bases ?? [] })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 503 })
  }
}

// PATCH — actualiza precio de un ingrediente o precio base de un tipo
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const supabase = db()

  // Ingrediente individual: { tipo: "ingrediente", id, grupo, precio }
  if (body.tipo === "ingrediente") {
    const { id, grupo, precio } = body
    if (!id || !grupo || precio == null) {
      return NextResponse.json({ error: "id, grupo y precio son requeridos" }, { status: 400 })
    }
    const { error } = await supabase
      .from("precios_ingredientes")
      .upsert({ id, grupo, precio: Number(precio), updated_at: new Date().toISOString() }, { onConflict: "id,grupo" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Precio base: { tipo: "base", tipo_pan, precio_base?, precio_integral? }
  if (body.tipo === "base") {
    const { tipo_pan, precio_base, precio_integral } = body
    if (!tipo_pan) return NextResponse.json({ error: "tipo_pan requerido" }, { status: 400 })
    const { error } = await supabase
      .from("precios_base_pan")
      .upsert(
        { tipo_pan, precio_base: Number(precio_base), precio_integral: Number(precio_integral), updated_at: new Date().toISOString() },
        { onConflict: "tipo_pan" }
      )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "tipo inválido" }, { status: 400 })
}
