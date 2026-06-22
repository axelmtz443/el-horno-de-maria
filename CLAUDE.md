# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Next.js 16 — read this first.** This project runs **Next.js 16.2.9** with **React 19**. APIs and conventions differ from older Next.js. Before writing framework code, read the relevant guide in `node_modules/next/dist/docs/` (requires `npm install` first — `node_modules` is not checked in). Most visible break: **`proxy.ts` replaces `middleware.ts`** (see `proxy.ts` at the repo root).

## Commands

```bash
npm install          # required first — node_modules is not committed
npm run dev          # dev server on PORT 3001 (not 3000)
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint (flat config in eslint.config.mjs)
```

There is no test runner configured.

## Domain & language

"El Horno de María" is an artisan-bakery (panadería) storefront for the Mexican market. **All domain code — identifiers, types, comments, table names — is in Spanish.** Match that convention; do not introduce English names for domain concepts (`producto`, `pedido`, `carrito`, `destacados`, `precio_integral`, etc.).

## Architecture

### Catalog: static source of truth + DB overrides
The product catalog is **hardcoded** in `lib/data/catalogo.ts` (`SECCIONES_CATALOGO`), not stored in the database. The admin panel edits a Supabase table `productos_override` keyed by the static product `id`; API routes **merge** static products with overrides at request time (`app/api/catalogo/route.ts`, `app/api/admin/productos/route.ts`). Override rows with `is_custom: true` are admin-created products that have no static counterpart. When merging, null override fields are stripped so they don't clobber static values.

The "Arma tu pan" configurator data (formats, flours, extra ingredients and prices) is likewise static in `lib/data/configurador.ts`.

### Cart & checkout: client-side, no server orders
The cart is a **Zustand store with `persist`** (`lib/store/carritoStore.ts`, localStorage key `panaderia-carrito`) — entirely client-side. There is no server-side order/checkout flow. "Placing an order" generates a **WhatsApp deep link** (`lib/whatsapp/generarMensaje.ts`) and optionally sends a confirmation email via **Resend** (`lib/resend/emailConfirmacion.ts`). Custom-bread pricing is computed client-side in `calcularPrecioPersonalizado`.

### Supabase: three client flavors
- `lib/supabase/client.ts` — browser (anon key), for client components.
- `lib/supabase/server.ts` — SSR with cookie handling (anon key), for server components.
- `lib/supabase/admin.ts` — **service-role key**, server-only, bypasses RLS. API route handlers under `app/api/admin/` define their own inline `supabaseAdmin()` helper rather than importing this one — keep that in mind when changing the pattern.

### Admin auth: cookie + secret, not Supabase Auth
Admin access is a simple shared-secret cookie, **not** Supabase Auth:
- `app/api/admin/login/route.ts` checks `ADMIN_USERNAME` / `ADMIN_PASSWORD`, then sets an httpOnly cookie `horno_admin` = `ADMIN_SECRET`.
- `proxy.ts` (the Next 16 middleware replacement) guards `/admin/*` and redirects to `/login` when the cookie doesn't match `ADMIN_SECRET`.
- API routes re-check the same cookie via a local `isAdmin()` helper.

### Routing
- `app/(shop)/` — public storefront route group (`catalogo`, `configurador`, `pedido`) plus the shop `layout.tsx`.
- `app/admin/` — admin panel with its own sidebar `layout.tsx`.
- `app/api/` — route handlers; `app/api/admin/` are auth-gated.

## Gotchas

- **Migrations are out of date with the running schema.** `supabase/migrations/` defines `productos`, `pedidos`, `promociones`, etc., but the live API code reads/writes `productos_override` and `destacados` — and `productos_override` has **no migration**. Treat the static catalog + override table as the real model; don't assume the SQL migrations reflect production.
- **Default secrets are hardcoded fallbacks** (`ADMIN_SECRET`, `ADMIN_PASSWORD`, etc. fall back to literals when env vars are unset). These are dev defaults — never rely on them in production.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY        # server-only, admin API + catalog merge
ADMIN_USERNAME / ADMIN_PASSWORD  # admin login (dev fallbacks exist)
ADMIN_SECRET                     # admin cookie value (dev fallback exists)
RESEND_API_KEY                   # order confirmation emails
NEXT_PUBLIC_WHATSAPP_TELEFONO    # WhatsApp order destination number
NEXT_PUBLIC_SITE_URL             # metadataBase / OG URLs
```

Remote images are restricted to Unsplash and Cloudinary hosts (`next.config.ts`); image uploads go through `next-cloudinary` (`app/api/admin/upload/route.ts`).
