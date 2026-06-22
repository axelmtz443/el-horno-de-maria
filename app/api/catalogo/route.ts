import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("not configured")
  return createClient(url, key, { auth: { persistSession: false } })
}

// Devuelve solo los overrides (campos cambiados). El catálogo público los fusiona con datos estáticos.
export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data } = await db
      .from("productos_override")
      .select("id, nombre, descripcion, precio, precio_integral, imagen_url")

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([])
  }
}
