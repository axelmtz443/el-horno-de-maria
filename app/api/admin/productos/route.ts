import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

async function isAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get("horno_admin")?.value
  const secret  = process.env.ADMIN_SECRET ?? "horno-maria-secret-2025"
  return session === secret
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
           ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { data, error } = await supabaseAdmin()
    .from("productos")
    .select("id, nombre, descripcion, precio, imagen_url, disponible")
    .order("nombre")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id, imagen_url } = await req.json()
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 })

  const { error } = await supabaseAdmin()
    .from("productos")
    .update({ imagen_url })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
