-- ─── Productos destacados ("Los más comprados") ──────────────────────────────
-- Referencia el id del catálogo estático (ej. "cj-ajo"), administrado manualmente
-- desde el panel de admin.
create table destacados (
  producto_id text primary key,
  orden       integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table destacados enable row level security;

create policy "Destacados visibles para todos"
  on destacados for select using (true);
