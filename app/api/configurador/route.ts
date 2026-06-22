import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase no configurado")
  return createClient(url, key, { auth: { persistSession: false } })
}

// Datos de "Crea tu propio pan" para la tienda: ingredientes disponibles y
// precios base por tipo de pan. Único punto de lectura — el admin escribe
// en las mismas tablas desde /api/admin/configurador.
export async function GET() {
  try {
    const supabase = db()
    const [{ data: ingredientes }, { data: bases }] = await Promise.all([
      supabase
        .from("precios_ingredientes")
        .select("id, grupo, nombre, precio, sabor")
        .eq("disponible", true),
      supabase
        .from("precios_base_pan")
        .select("tipo_pan, precio_base, precio_integral"),
    ])
    return NextResponse.json({ ingredientes: ingredientes ?? [], bases: bases ?? [] })
  } catch {
    return NextResponse.json({ ingredientes: [], bases: [] })
  }
}
