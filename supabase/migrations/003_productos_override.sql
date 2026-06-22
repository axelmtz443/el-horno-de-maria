-- ─── productos_override ───────────────────────────────────────────────────────
-- Tabla usada por app/api/catalogo y app/api/admin/productos para fusionar
-- ediciones del admin con el catálogo estático (lib/data/catalogo.ts).
-- No existía migración para ella — sólo se creaba fila por fila, de forma
-- parcial, la primera vez que se editaba un producto desde el admin. Eso
-- dejaba columnas como `categoria` en NULL y rompía el filtro de categorías
-- en el catálogo público.
create table if not exists productos_override (
  id text primary key
);

-- La tabla ya existía (se creaba fila por fila desde el admin, antes de esta
-- migración) con un esquema parcial e inconsistente entre instalaciones —
-- por eso se agregan columnas una por una en vez de asumir un CREATE TABLE
-- limpio. `ingredientes` se normaliza a jsonb porque así la creó Supabase
-- cuando se insertó la primera fila desde la app.
alter table productos_override add column if not exists nombre          text;
alter table productos_override add column if not exists descripcion     text;
alter table productos_override add column if not exists ingredientes    jsonb;
alter table productos_override add column if not exists precio          numeric(10, 2);
alter table productos_override add column if not exists precio_integral numeric(10, 2);
alter table productos_override add column if not exists imagen_url      text;
alter table productos_override add column if not exists disponible      boolean not null default true;
alter table productos_override add column if not exists tipo_pan        text;
alter table productos_override add column if not exists categoria      text;
alter table productos_override add column if not exists is_custom      boolean not null default false;
alter table productos_override add column if not exists updated_at     timestamptz not null default now();

alter table productos_override enable row level security;

drop policy if exists "Overrides visibles para todos" on productos_override;
create policy "Overrides visibles para todos"
  on productos_override for select using (true);

-- ─── Seed: precarga todos los productos estáticos completos ──────────────────
-- Usa COALESCE para no pisar ediciones que ya hayas hecho desde el admin
-- (precio, nombre, etc.) — sólo rellena lo que falte.
insert into productos_override (id, nombre, descripcion, ingredientes, precio, precio_integral, tipo_pan, categoria, is_custom)
values
  -- ── Pan de Caja ──
  ('cj-basico',          'Pan Tradicional',                       'Sin ingredientes adicionales', null, 65,  70,  'caja', 'Básico', false),
  ('cj-ajo',              'Pan de Ajo',                             null, to_jsonb(array['Ajo']),                                                              75,  80,  'caja', 'Clásicos', false),
  ('cj-ajo-albahaca',     'Pan de Ajo y Albahaca',                  null, to_jsonb(array['Ajo','Albahaca']),                                                   75,  80,  'caja', 'Clásicos', false),
  ('cj-ajo-mejorana',     'Pan de Ajo y Mejorana',                  null, to_jsonb(array['Ajo','Mejorana']),                                                   75,  80,  'caja', 'Clásicos', false),
  ('cj-ajonjoli-b',       'Pan de Ajonjolí Blanco',                 null, to_jsonb(array['Ajonjolí blanco']),                                                  75,  80,  'caja', 'Clásicos', false),
  ('cj-ajonjoli-n',       'Pan de Ajonjolí Negro',                  null, to_jsonb(array['Ajonjolí negro']),                                                   75,  80,  'caja', 'Clásicos', false),
  ('cj-avena',            'Pan de Avena',                           null, to_jsonb(array['Avena']),                                                            75,  80,  'caja', 'Clásicos', false),
  ('cj-chia',             'Pan de Chía',                            null, to_jsonb(array['Chía']),                                                             75,  80,  'caja', 'Clásicos', false),
  ('cj-linaza',           'Pan de Linaza',                          null, to_jsonb(array['Linaza']),                                                           75,  80,  'caja', 'Clásicos', false),
  ('cj-mejorana',         'Pan de Mejorana',                        null, to_jsonb(array['Mejorana']),                                                         75,  80,  'caja', 'Clásicos', false),
  ('cj-girasol',          'Pan de Semillas de Girasol',             null, to_jsonb(array['Semillas de girasol']),                                               75,  80,  'caja', 'Clásicos', false),
  ('cj-mg1',              'Multigrano Tricolor',                    null, to_jsonb(array['Ajonjolí negro','Ajonjolí blanco','Semillas de girasol']),          85,  90,  'caja', 'Multigranos', false),
  ('cj-mg2',              'Multigrano Campestre',                   null, to_jsonb(array['Avena','Ajonjolí','Semillas de girasol']),                          85,  90,  'caja', 'Multigranos', false),
  ('cj-mg3',              'Multigrano Nutricia',                    null, to_jsonb(array['Avena','Chía','Linaza']),                                            85,  90,  'caja', 'Multigranos', false),
  ('cj-mg4',              'Multigrano Andino',                      null, to_jsonb(array['Avena','Ajonjolí','Linaza']),                                        85,  90,  'caja', 'Multigranos', false),
  ('cj-mg5',              'Multigrano Esencial',                    null, to_jsonb(array['Chía','Linaza','Ajonjolí']),                                         85,  90,  'caja', 'Multigranos', false),
  ('cj-mg6',              'Multigrano Dorado',                      null, to_jsonb(array['Linaza','Ajonjolí','Semillas de girasol']),                          85,  90,  'caja', 'Multigranos', false),
  ('cj-ajo-romero',       'Pan de Hierbas Mediterráneo',            null, to_jsonb(array['Ajo','Romero','Albahaca']),                                          80,  85,  'caja', 'Combinaciones y Especiales', false),
  ('cj-chia-linaza',      'Pan de Semillas Doradas',                null, to_jsonb(array['Chía','Linaza']),                                                    80,  85,  'caja', 'Combinaciones y Especiales', false),
  ('cj-pepitas',          'Pan de Pepita de Calabaza',              null, to_jsonb(array['Pepitas de calabaza']),                                               90,  95,  'caja', 'Combinaciones y Especiales', false),
  ('cj-queso',            'Pan al Parmesano',                       null, to_jsonb(array['Queso parmesano']),                                                  100, 105, 'caja', 'Combinaciones y Especiales', false),
  ('cj-canela',           'Pan de Canela',                          null, to_jsonb(array['Canela','Azúcar']),                                                  80,  85,  'caja', 'Línea Dulce — Frutales', false),
  ('cj-pasas-canela',     'Pan de Pasas y Canela',                  null, to_jsonb(array['Pasas','Canela','Azúcar']),                                          85,  90,  'caja', 'Línea Dulce — Frutales', false),
  ('cj-arandano-linaza',  'Pan de Arándano y Linaza',               null, to_jsonb(array['Arándano','Linaza']),                                                90,  95,  'caja', 'Línea Dulce — Frutales', false),
  ('cj-arandano-canela',  'Pan de Arándano y Canela',               null, to_jsonb(array['Arándano','Canela','Azúcar']),                                       95,  100, 'caja', 'Línea Dulce — Frutales', false),
  ('cj-arandano-nuez',    'Pan de Arándano, Nuez y Canela',         null, to_jsonb(array['Arándano','Nuez','Canela','Azúcar']),                                110, 115, 'caja', 'Línea Dulce — Frutales', false),
  ('cj-choc-trad',        'Pan de Chocolate',                       null, to_jsonb(array['Chocolate']),                                                        95,  100, 'caja', 'Línea Dulce — Chocolates', false),
  ('cj-choc-caca',        'Pan de Chocolate y Cacahuate',           null, to_jsonb(array['Chocolate','Cacahuate']),                                            105, 110, 'caja', 'Línea Dulce — Chocolates', false),
  ('cj-choc-blanco',      'Pan de Chocolate Blanco',                null, to_jsonb(array['Chocolate blanco']),                                                 105, 110, 'caja', 'Línea Dulce — Chocolates', false),
  ('cj-choc-almendra',    'Pan de Chocolate y Almendra',            null, to_jsonb(array['Chocolate','Almendra']),                                             125, 130, 'caja', 'Línea Dulce — Chocolates', false),
  ('cj-nuez',             'Pan de Nuez',                            null, to_jsonb(array['Nuez','Azúcar']),                                                    145, 150, 'caja', 'Línea Dulce — Gourmet', false),
  ('cj-capricho',         'Pan "Capricho"',                         null, to_jsonb(array['Pasas','Canela','Arándano','Nuez','Pepitas de calabaza']),          145, 150, 'caja', 'Línea Dulce — Gourmet', false),
  ('cj-fino',             'El Fino 💅',                             'Cereza, chocolate blanco, almendra y mascabado', null,                          150, 155, 'caja', 'Línea Dulce — Gourmet', false),
  ('cj-antojo',           'Pan "Antojo"',                           null, to_jsonb(array['Nuez','Almendra','Chocolate','Canela']),                             145, 150, 'caja', 'Línea Dulce — Gourmet', false),

  -- ── Pan de Hogaza ──
  ('hg-basico',          'Pan Tradicional',                       'Sin ingredientes adicionales', null, 65,  70,  'hogaza', 'Básico', false),
  ('hg-ajo',              'Pan de Ajo',                             null, to_jsonb(array['Ajo']),                                                              75,  80,  'hogaza', 'Clásicos', false),
  ('hg-ajo-albahaca',     'Pan de Ajo y Albahaca',                  null, to_jsonb(array['Ajo','Albahaca']),                                                   75,  80,  'hogaza', 'Clásicos', false),
  ('hg-ajo-mejorana',     'Pan de Ajo y Mejorana',                  null, to_jsonb(array['Ajo','Mejorana']),                                                   75,  80,  'hogaza', 'Clásicos', false),
  ('hg-ajonjoli-b',       'Pan de Ajonjolí Blanco',                 null, to_jsonb(array['Ajonjolí blanco']),                                                  75,  80,  'hogaza', 'Clásicos', false),
  ('hg-ajonjoli-n',       'Pan de Ajonjolí Negro',                  null, to_jsonb(array['Ajonjolí negro']),                                                   75,  80,  'hogaza', 'Clásicos', false),
  ('hg-avena',            'Pan de Avena',                           null, to_jsonb(array['Avena']),                                                            75,  80,  'hogaza', 'Clásicos', false),
  ('hg-chia',             'Pan de Chía',                            null, to_jsonb(array['Chía']),                                                             75,  80,  'hogaza', 'Clásicos', false),
  ('hg-linaza',           'Pan de Linaza',                          null, to_jsonb(array['Linaza']),                                                           75,  80,  'hogaza', 'Clásicos', false),
  ('hg-mejorana',         'Pan de Mejorana',                        null, to_jsonb(array['Mejorana']),                                                         75,  80,  'hogaza', 'Clásicos', false),
  ('hg-girasol',          'Pan de Semillas de Girasol',             null, to_jsonb(array['Semillas de girasol']),                                               75,  80,  'hogaza', 'Clásicos', false),
  ('hg-mg1',              'Multigrano Tricolor',                    null, to_jsonb(array['Ajonjolí negro','Ajonjolí blanco','Semillas de girasol']),          85,  90,  'hogaza', 'Multigranos', false),
  ('hg-mg2',              'Multigrano Campestre',                   null, to_jsonb(array['Avena','Ajonjolí','Semillas de girasol']),                          85,  90,  'hogaza', 'Multigranos', false),
  ('hg-mg3',              'Multigrano Nutricia',                    null, to_jsonb(array['Avena','Chía','Linaza']),                                            85,  90,  'hogaza', 'Multigranos', false),
  ('hg-mg4',              'Multigrano Andino',                      null, to_jsonb(array['Avena','Ajonjolí','Linaza']),                                        85,  90,  'hogaza', 'Multigranos', false),
  ('hg-mg5',              'Multigrano Esencial',                    null, to_jsonb(array['Chía','Linaza','Ajonjolí']),                                         85,  90,  'hogaza', 'Multigranos', false),
  ('hg-mg6',              'Multigrano Dorado',                      null, to_jsonb(array['Linaza','Ajonjolí','Semillas de girasol']),                          85,  90,  'hogaza', 'Multigranos', false),
  ('hg-ajo-romero',       'Pan de Hierbas Mediterráneo',            null, to_jsonb(array['Ajo','Romero','Albahaca']),                                          80,  85,  'hogaza', 'Combinaciones y Especiales', false),
  ('hg-chia-linaza',      'Pan de Semillas Doradas',                null, to_jsonb(array['Chía','Linaza']),                                                    80,  85,  'hogaza', 'Combinaciones y Especiales', false),
  ('hg-pepitas',          'Pan de Pepita de Calabaza',              null, to_jsonb(array['Pepitas de calabaza']),                                               90,  95,  'hogaza', 'Combinaciones y Especiales', false),
  ('hg-queso',            'Pan al Parmesano',                       null, to_jsonb(array['Queso parmesano']),                                                  100, 105, 'hogaza', 'Combinaciones y Especiales', false),
  ('hg-canela',           'Pan de Canela',                          null, to_jsonb(array['Canela','Azúcar']),                                                  80,  85,  'hogaza', 'Línea Dulce — Frutales', false),
  ('hg-pasas-canela',     'Pan de Pasas y Canela',                  null, to_jsonb(array['Pasas','Canela','Azúcar']),                                          85,  90,  'hogaza', 'Línea Dulce — Frutales', false),
  ('hg-arandano-linaza',  'Pan de Arándano y Linaza',               null, to_jsonb(array['Arándano','Linaza']),                                                90,  95,  'hogaza', 'Línea Dulce — Frutales', false),
  ('hg-arandano-canela',  'Pan de Arándano y Canela',               null, to_jsonb(array['Arándano','Canela','Azúcar']),                                       95,  100, 'hogaza', 'Línea Dulce — Frutales', false),
  ('hg-arandano-nuez',    'Pan de Arándano, Nuez y Canela',         null, to_jsonb(array['Arándano','Nuez','Canela','Azúcar']),                                110, 115, 'hogaza', 'Línea Dulce — Frutales', false),
  ('hg-nuez',             'Pan de Nuez',                            null, to_jsonb(array['Nuez','Azúcar']),                                                    145, 150, 'hogaza', 'Línea Dulce — Gourmet', false),
  ('hg-capricho',         'Pan "Capricho"',                         null, to_jsonb(array['Pasas','Canela','Arándano','Nuez','Pepitas de calabaza']),          145, 150, 'hogaza', 'Línea Dulce — Gourmet', false),

  -- ── Baguette ──
  ('bg-basico',         'Pan Tradicional',                'Sin ingredientes adicionales', null, 70,  75,  'baguette', 'Básico', false),
  ('bg-ajo',            'Pan de Ajo',                      null, to_jsonb(array['Ajo']),                                                     80,  85,  'baguette', 'Clásicos', false),
  ('bg-ajo-albahaca',   'Pan de Ajo y Albahaca',           null, to_jsonb(array['Ajo','Albahaca']),                                          80,  85,  'baguette', 'Clásicos', false),
  ('bg-ajo-mejorana',   'Pan de Ajo y Mejorana',           null, to_jsonb(array['Ajo','Mejorana']),                                          80,  85,  'baguette', 'Clásicos', false),
  ('bg-ajonjoli-b',     'Pan de Ajonjolí Blanco',          null, to_jsonb(array['Ajonjolí blanco']),                                         80,  85,  'baguette', 'Clásicos', false),
  ('bg-ajonjoli-n',     'Pan de Ajonjolí Negro',           null, to_jsonb(array['Ajonjolí negro']),                                          80,  85,  'baguette', 'Clásicos', false),
  ('bg-avena',          'Pan de Avena',                    null, to_jsonb(array['Avena']),                                                   80,  85,  'baguette', 'Clásicos', false),
  ('bg-chia',           'Pan de Chía',                     null, to_jsonb(array['Chía']),                                                    80,  85,  'baguette', 'Clásicos', false),
  ('bg-linaza',         'Pan de Linaza',                   null, to_jsonb(array['Linaza']),                                                  80,  85,  'baguette', 'Clásicos', false),
  ('bg-mejorana',       'Pan de Mejorana',                 null, to_jsonb(array['Mejorana']),                                                80,  85,  'baguette', 'Clásicos', false),
  ('bg-girasol',        'Pan de Semillas de Girasol',      null, to_jsonb(array['Semillas de girasol']),                                     80,  85,  'baguette', 'Clásicos', false),
  ('bg-ajo-romero',     'Pan de Hierbas Mediterráneo',     null, to_jsonb(array['Ajo','Romero','Albahaca']),                                 85,  90,  'baguette', 'Mezclas Especiales', false),
  ('bg-chia-linaza',    'Pan de Semillas Doradas',         null, to_jsonb(array['Chía','Linaza']),                                           85,  90,  'baguette', 'Mezclas Especiales', false),
  ('bg-mg1',            'Multigrano Tricolor',             null, to_jsonb(array['Ajonjolí negro','Ajonjolí blanco','Semillas de girasol']), 90,  95,  'baguette', 'Multigranos', false),
  ('bg-mg2',            'Multigrano Campestre',            null, to_jsonb(array['Avena','Ajonjolí','Semillas de girasol']),                 90,  95,  'baguette', 'Multigranos', false),
  ('bg-mg3',            'Multigrano Esencial',             null, to_jsonb(array['Chía','Linaza','Ajonjolí']),                                90,  95,  'baguette', 'Multigranos', false),
  ('bg-mg4',            'Multigrano Dorado',               null, to_jsonb(array['Linaza','Ajonjolí','Semillas de girasol']),                90,  95,  'baguette', 'Multigranos', false),
  ('bg-pepitas',        'Pan de Pepita de Calabaza',       null, to_jsonb(array['Pepitas de calabaza']),                                     100, 105, 'baguette', 'Gourmet', false),
  ('bg-queso',          'Pan al Parmesano',                null, to_jsonb(array['Queso parmesano']),                                        110, 115, 'baguette', 'Gourmet', false),

  -- ── Pan para Pizza ──
  ('pz-basico',     'Pan Tradicional',          'Sin ingredientes adicionales', null, 80, 85, 'pizza', 'Básico', false),
  ('pz-ajo',         'Pan de Ajo',                null, to_jsonb(array['Ajo']),                  90, 95, 'pizza', 'Clásicos', false),
  ('pz-albahaca',    'Pan de Albahaca',           null, to_jsonb(array['Albahaca']),             90, 95, 'pizza', 'Clásicos', false),
  ('pz-mejorana',    'Pan de Mejorana',           null, to_jsonb(array['Mejorana']),             90, 95, 'pizza', 'Clásicos', false),
  ('pz-romero',      'Pan de Romero',             null, to_jsonb(array['Romero']),               90, 95, 'pizza', 'Clásicos', false),
  ('pz-ajonjoli-b', 'Pan de Ajonjolí Blanco',    null, to_jsonb(array['Ajonjolí blanco']),      90, 95, 'pizza', 'Clásicos', false),
  ('pz-ajonjoli-n', 'Pan de Ajonjolí Negro',     null, to_jsonb(array['Ajonjolí negro']),       90, 95, 'pizza', 'Clásicos', false)

on conflict (id) do update set
  nombre          = coalesce(productos_override.nombre,          excluded.nombre),
  descripcion     = coalesce(productos_override.descripcion,     excluded.descripcion),
  ingredientes    = coalesce(productos_override.ingredientes,    excluded.ingredientes),
  precio          = coalesce(productos_override.precio,          excluded.precio),
  precio_integral = coalesce(productos_override.precio_integral, excluded.precio_integral),
  tipo_pan        = coalesce(productos_override.tipo_pan,        excluded.tipo_pan),
  categoria       = coalesce(productos_override.categoria,       excluded.categoria);
