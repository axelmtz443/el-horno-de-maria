import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const validUser = process.env.ADMIN_USERNAME ?? "admin"
  const validPass = process.env.ADMIN_PASSWORD ?? "contraseña123"
  const secret    = process.env.ADMIN_SECRET   ?? "horno-maria-secret-2025"

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("horno_admin", secret, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  })
  return res
}
