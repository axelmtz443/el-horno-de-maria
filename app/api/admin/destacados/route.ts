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
    .from("destacados")
    .select("producto_id, orden")
    .order("orden")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Reemplaza la lista completa de destacados con el arreglo de ids recibido,
// en el orden en que vienen.
export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { ids } = await req.json()
  if (!Array.isArray(ids)) return NextResponse.json({ error: "ids debe ser un arreglo" }, { status: 400 })

  const admin = supabaseAdmin()

  const { error: delError } = await admin.from("destacados").delete().neq("producto_id", "")
  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

  if (ids.length > 0) {
    const filas = ids.map((producto_id: string, i: number) => ({ producto_id, orden: i }))
    const { error: insError } = await admin.from("destacados").insert(filas)
    if (insError) return NextResponse.json({ error: insError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
