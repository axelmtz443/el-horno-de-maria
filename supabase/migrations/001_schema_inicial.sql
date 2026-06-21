-- ─── Extensiones ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Productos del catálogo ───────────────────────────────────────────────────
create table productos (
  id            uuid primary key default uuid_generate_v4(),
  nombre        text not null,
  descripcion   text,
  ingredientes  text[] not null default '{}',
  precio        numeric(10, 2) not null,
  imagen_url    text,
  valor_nutrimental jsonb not null default '{}',
  disponible    boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─── Ingredientes extra (para el configurador) ────────────────────────────────
create table ingredientes_extra (
  id                  uuid primary key default uuid_generate_v4(),
  nombre              text not null,
  imagen_capa_url     text,               -- PNG/SVG para la capa visual
  precio_adicional    numeric(10, 2) not null default 0,
  categoria           text not null check (categoria in ('topping', 'relleno')),
  compatible_con      text[] not null default '{"dulce","salado"}',
  activo              boolean not null default true
);

-- ─── Configuración de precios base del configurador ──────────────────────────
create table precios_base_pan (
  id          uuid primary key default uuid_generate_v4(),
  formato     text not null check (formato in ('caja', 'hogaza', 'pizza')),
  tipo_harina text not null check (tipo_harina in ('integral', 'natural')),
  precio      numeric(10, 2) not null,
  unique (formato, tipo_harina)
);

-- Precios base iniciales
insert into precios_base_pan (formato, tipo_harina, precio) values
  ('caja',   'natural',  85.00),
  ('caja',   'integral', 95.00),
  ('hogaza', 'natural',  70.00),
  ('hogaza', 'integral', 80.00),
  ('pizza',  'natural',  90.00),
  ('pizza',  'integral', 100.00);

-- ─── Pedidos ──────────────────────────────────────────────────────────────────
create table pedidos (
  id              uuid primary key default uuid_generate_v4(),
  cliente_nombre  text not null,
  cliente_telefono text not null,
  cliente_email   text,
  fecha_entrega   date not null,
  hora_entrega    time,
  notas_generales text,
  items           jsonb not null default '[]',   -- ItemCarrito[] serializado
  total           numeric(10, 2) not null,
  estado          text not null default 'pendiente'
                    check (estado in ('pendiente','confirmado','en_proceso','listo','entregado','cancelado')),
  created_at      timestamptz not null default now()
);

-- ─── Promociones ──────────────────────────────────────────────────────────────
create table promociones (
  id           uuid primary key default uuid_generate_v4(),
  nombre       text not null,
  descripcion  text,
  tipo         text not null check (tipo in ('porcentaje', 'monto_fijo')),
  valor        numeric(10, 2) not null,
  activa       boolean not null default true,
  fecha_inicio date not null,
  fecha_fin    date not null,
  aplica_a     text not null default 'todo' check (aplica_a in ('catalogo','personalizado','todo'))
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table productos       enable row level security;
alter table ingredientes_extra enable row level security;
alter table precios_base_pan  enable row level security;
alter table pedidos         enable row level security;
alter table promociones     enable row level security;

-- Lectura pública para el catálogo
create policy "Productos visibles para todos"
  on productos for select using (true);

create policy "Ingredientes visibles para todos"
  on ingredientes_extra for select using (activo = true);

create policy "Precios base visibles para todos"
  on precios_base_pan for select using (true);

create policy "Promociones activas visibles"
  on promociones for select using (activa = true and fecha_inicio <= current_date and fecha_fin >= current_date);

-- Inserción de pedidos desde el cliente (anónimo)
create policy "Crear pedido sin autenticación"
  on pedidos for insert with check (true);

-- Solo admin puede ver/editar pedidos y gestionar catálogo
-- (aplica cuando se configura autenticación admin)
create policy "Admin puede todo en pedidos"
  on pedidos for all using (auth.role() = 'authenticated');

create policy "Admin puede todo en productos"
  on productos for all using (auth.role() = 'authenticated');

create policy "Admin puede todo en ingredientes"
  on ingredientes_extra for all using (auth.role() = 'authenticated');

create policy "Admin puede todo en precios"
  on precios_base_pan for all using (auth.role() = 'authenticated');

create policy "Admin puede todo en promociones"
  on promociones for all using (auth.role() = 'authenticated');
