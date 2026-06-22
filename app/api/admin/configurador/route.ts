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

// GET — overrides de precios + ingredientes custom/ocultos
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const supabase = db()
    const [{ data: ingredientes }, { data: bases }] = await Promise.all([
      supabase
        .from("precios_ingredientes")
        .select("id, grupo, precio, disponible, is_custom, nombre, sabor"),
      supabase
        .from("precios_base_pan")
        .select("tipo_pan, precio_base, precio_integral"),
    ])
    return NextResponse.json({ ingredientes: ingredientes ?? [], bases: bases ?? [] })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 503 })
  }
}

// POST — agrega un ingrediente custom
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { nombre, grupo, precio, sabor } = await req.json()
  if (!nombre || !grupo || precio == null) {
    return NextResponse.json({ error: "nombre, grupo y precio son requeridos" }, { status: 400 })
  }

  const supabase = db()
  const id = `custom-${Date.now()}`
  const { error } = await supabase.from("precios_ingredientes").insert({
    id,
    grupo,
    nombre,
    precio:     Number(precio),
    sabor:      sabor ?? "todos",
    is_custom:  true,
    disponible: true,
    updated_at: new Date().toISOString(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id })
}

// PATCH — actualiza precio, disponible, nombre o precio_base
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body   = await req.json()
  const supabase = db()

  if (body.tipo === "ingrediente") {
    const { id, grupo, ...fields } = body
    if (!id || !grupo) return NextResponse.json({ error: "id y grupo requeridos" }, { status: 400 })
    const clean = Object.fromEntries(
      Object.entries(fields).filter(([k, v]) => k !== "tipo" && v != null)
    )
    const { error } = await supabase
      .from("precios_ingredientes")
      .upsert({ id, grupo, ...clean, updated_at: new Date().toISOString() }, { onConflict: "id,grupo" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (body.tipo === "base") {
    const { tipo_pan, precio_base, precio_integral } = body
    if (!tipo_pan) return NextResponse.json({ error: "tipo_pan requerido" }, { status: 400 })
    const { error } = await supabase.from("precios_base_pan").upsert(
      { tipo_pan, precio_base: Number(precio_base), precio_integral: Number(precio_integral), updated_at: new Date().toISOString() },
      { onConflict: "tipo_pan" }
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "tipo inválido" }, { status: 400 })
}

// DELETE — elimina permanentemente un ingrediente custom
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id, grupo } = await req.json()
  if (!id || !grupo) return NextResponse.json({ error: "id y grupo requeridos" }, { status: 400 })

  const supabase = db()
  const { error } = await supabase
    .from("precios_ingredientes")
    .delete()
    .eq("id", id)
    .eq("grupo", grupo)
    .eq("is_custom", true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
