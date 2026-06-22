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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase no configurado")
  return createClient(url, key, { auth: { persistSession: false } })
}

const DEFAULTS = [
  { posicion: 1, producto_id: "hg-basico"   },
  { posicion: 2, producto_id: "cj-capricho" },
  { posicion: 3, producto_id: "cj-fino"     },
]

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const db = supabaseAdmin()
    const { data } = await db.from("mas_comprados").select("posicion, producto_id").order("posicion")
    if (data && data.length === 3) return NextResponse.json(data)
  } catch {}

  return NextResponse.json(DEFAULTS)
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const items = await req.json() // [{ posicion: 1, producto_id: "..." }, ...]

  try {
    const db = supabaseAdmin()
    const { error } = await db
      .from("mas_comprados")
      .upsert(items, { onConflict: "posicion" })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error"
    return NextResponse.json({ error: msg }, { status: 503 })
  }
}
