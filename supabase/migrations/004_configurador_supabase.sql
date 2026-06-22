-- ─── "Crea tu propio pan" — fuente de verdad en Supabase ──────────────────────
-- Antes, los ingredientes y precios base del configurador vivían hardcodeados
-- en lib/data/configurador.ts y el panel /admin/precios escribía en tablas que
-- la tienda pública nunca leía (cambios sin efecto real). Ahora ambas tablas
-- son la fuente de verdad: la tienda las consume vía /api/configurador y el
-- admin puede agregar, editar y eliminar (DELETE real, no solo ocultar).
--
-- Se reemplaza el esquema de 001_schema_inicial.sql (formato/tipo_harina),
-- que nunca llegó a usarse desde el código de la app. precios_ingredientes
-- también se recrea: el panel de admin la usaba antes de esta migración pero
-- nunca estuvo conectada a la tienda real, así que no tiene datos que valga
-- la pena conservar.
drop table if exists precios_base_pan cascade;
drop table if exists ingredientes_extra cascade;
drop table if exists precios_ingredientes cascade;

create table precios_base_pan (
  tipo_pan        text primary key check (tipo_pan in ('caja', 'hogaza', 'baguette', 'pizza')),
  precio_base     numeric(10, 2) not null,
  precio_integral numeric(10, 2) not null,
  updated_at      timestamptz not null default now()
);

create table precios_ingredientes (
  id          text not null,
  grupo       text not null check (grupo in ('caja_hogaza', 'baguette', 'pizza')),
  nombre      text not null,
  precio      numeric(10, 2) not null default 0,
  sabor       text not null default 'todos' check (sabor in ('salado', 'dulce', 'todos')),
  disponible  boolean not null default true,
  is_custom   boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (id, grupo)
);

alter table precios_base_pan enable row level security;
alter table precios_ingredientes enable row level security;

create policy "Precios base visibles para todos"
  on precios_base_pan for select using (true);

create policy "Ingredientes visibles para todos"
  on precios_ingredientes for select using (disponible = true);

-- ─── Seed: precios base ────────────────────────────────────────────────────────
insert into precios_base_pan (tipo_pan, precio_base, precio_integral) values
  ('caja',     65, 70),
  ('hogaza',   65, 70),
  ('baguette', 70, 75),
  ('pizza',    80, 85);

-- ─── Seed: ingredientes — Caja / Hogaza ───────────────────────────────────────
insert into precios_ingredientes (id, grupo, nombre, precio, sabor) values
  ('ajo',             'caja_hogaza', 'Ajo',                                                            10, 'salado'),
  ('albahaca',        'caja_hogaza', 'Albahaca',                                                       10, 'salado'),
  ('ajonjoli-b',      'caja_hogaza', 'Ajonjolí Blanco',                                                10, 'salado'),
  ('ajonjoli-n',      'caja_hogaza', 'Ajonjolí Negro',                                                 10, 'salado'),
  ('avena',           'caja_hogaza', 'Avena',                                                          10, 'salado'),
  ('chia',            'caja_hogaza', 'Chía',                                                           10, 'salado'),
  ('linaza',          'caja_hogaza', 'Linaza',                                                         10, 'salado'),
  ('mejorana',        'caja_hogaza', 'Mejorana',                                                       10, 'salado'),
  ('girasol',         'caja_hogaza', 'Semillas de Girasol',                                            10, 'salado'),
  ('pepitas',         'caja_hogaza', 'Pepitas de Calabaza',                                            25, 'salado'),
  ('queso',           'caja_hogaza', 'Queso Parmesano',                                                35, 'salado'),
  ('ajo-romero',      'caja_hogaza', 'Ajo, Romero y Albahaca',                                         15, 'salado'),
  ('chia-linaza',     'caja_hogaza', 'Chía y Linaza',                                                  15, 'salado'),
  ('canela-azucar',   'caja_hogaza', 'Canela y Azúcar',                                                15, 'dulce'),
  ('pasas-canela',    'caja_hogaza', 'Pasas, Canela y Azúcar',                                         20, 'dulce'),
  ('arandano-linaza', 'caja_hogaza', 'Arándano y Linaza',                                              25, 'dulce'),
  ('arandano-canela', 'caja_hogaza', 'Arándano, Canela y Azúcar',                                      30, 'dulce'),
  ('choc-trad',       'caja_hogaza', 'Chocolate Tradicional',                                          30, 'dulce'),
  ('choc-caca',       'caja_hogaza', 'Chocolate y Cacahuate',                                          40, 'dulce'),
  ('choc-blanco',     'caja_hogaza', 'Chocolate Blanco',                                               40, 'dulce'),
  ('arandano-nuez',   'caja_hogaza', 'Arándano, Nuez, Canela y Azúcar',                                45, 'dulce'),
  ('choc-almendra',   'caja_hogaza', 'Chocolate y Almendra',                                           60, 'dulce'),
  ('nuez-azucar',     'caja_hogaza', 'Nuez y Azúcar',                                                  80, 'dulce'),
  ('capricho',        'caja_hogaza', 'Capricho — Pasas, Canela, Arándano, Nuez y Pepitas',             80, 'dulce'),
  ('antojo',          'caja_hogaza', 'Antojo — Nuez, Almendra, Chocolate y Canela',                    80, 'dulce'),
  ('fino',            'caja_hogaza', 'El Fino 💅 — Cereza, Chocolate Blanco, Almendra y Mascabado',     85, 'dulce');

-- ─── Seed: ingredientes — Baguette ────────────────────────────────────────────
insert into precios_ingredientes (id, grupo, nombre, precio, sabor) values
  ('ajo',         'baguette', 'Ajo',                   10, 'todos'),
  ('albahaca',    'baguette', 'Albahaca',               10, 'todos'),
  ('ajonjoli-b',  'baguette', 'Ajonjolí Blanco',        10, 'todos'),
  ('ajonjoli-n',  'baguette', 'Ajonjolí Negro',         10, 'todos'),
  ('avena',       'baguette', 'Avena',                  10, 'todos'),
  ('chia',        'baguette', 'Chía',                   10, 'todos'),
  ('linaza',      'baguette', 'Linaza',                 10, 'todos'),
  ('mejorana',    'baguette', 'Mejorana',               10, 'todos'),
  ('girasol',     'baguette', 'Semillas de Girasol',    10, 'todos'),
  ('pepitas',     'baguette', 'Pepitas de Calabaza',    30, 'todos'),
  ('queso',       'baguette', 'Queso Parmesano',        40, 'todos'),
  ('ajo-romero',  'baguette', 'Ajo, Romero y Albahaca', 15, 'todos'),
  ('chia-linaza', 'baguette', 'Chía y Linaza',          15, 'todos');

-- ─── Seed: ingredientes — Pizza ───────────────────────────────────────────────
insert into precios_ingredientes (id, grupo, nombre, precio, sabor) values
  ('ajo',        'pizza', 'Ajo',              10, 'todos'),
  ('albahaca',   'pizza', 'Albahaca',          10, 'todos'),
  ('mejorana',   'pizza', 'Mejorana',          10, 'todos'),
  ('romero',     'pizza', 'Romero',            10, 'todos'),
  ('ajonjoli-b', 'pizza', 'Ajonjolí Blanco',  10, 'todos'),
  ('ajonjoli-n', 'pizza', 'Ajonjolí Negro',   10, 'todos');
