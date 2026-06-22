import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

async function isAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get("horno_admin")?.value
  const secret  = process.env.ADMIN_SECRET ?? "horno-maria-secret-2025"
  return session === secret
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 })

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 })

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const filename = `pan-${Date.now()}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  const { data, error } = await supabase.storage
    .from("imagenes-panes")
    .upload(filename, buffer, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from("imagenes-panes")
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
