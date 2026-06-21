"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Producto {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  imagen_url: string | null
  disponible: boolean
}

function EditModal({
  producto,
  onSave,
  onClose,
}: {
  producto: Producto
  onSave: (id: string, url: string) => Promise<void>
  onClose: () => void
}) {
  const [url,     setUrl]     = useState(producto.imagen_url ?? "")
  const [saving,  setSaving]  = useState(false)
  const [preview, setPreview] = useState(producto.imagen_url ?? "")
  const [imgErr,  setImgErr]  = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(producto.id, url.trim())
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--color-pan-900)]">{producto.nombre}</h2>
            <p className="text-[var(--color-pan-400)] text-xs mt-0.5">${producto.precio.toFixed(2)} MXN</p>
          </div>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Preview imagen */}
        <div className="relative h-48 rounded-xl overflow-hidden bg-[var(--color-pan-100)] mb-5 border border-[var(--color-pan-200)]">
          {preview && !imgErr ? (
            <Image src={preview} alt={producto.nombre} fill className="object-cover"
              onError={() => setImgErr(true)} unoptimized />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-pan-300)] gap-2">
              <span className="text-4xl">🖼️</span>
              <p className="text-xs">{imgErr ? "URL no válida o sin acceso" : "Sin imagen"}</p>
            </div>
          )}
        </div>

        {/* Input URL */}
        <label className="block text-[var(--color-pan-600)] text-xs font-medium mb-1.5">
          URL de la imagen
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setImgErr(false) }}
          onBlur={() => setPreview(url.trim())}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full border border-[var(--color-pan-300)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-pan-900)]
                     focus:outline-none focus:border-[var(--color-pan-500)] transition-colors mb-2"
        />
        <p className="text-[var(--color-pan-400)] text-xs mb-5">
          Pega la URL de Unsplash, Cloudinary o cualquier imagen pública. Haz clic afuera del campo para previsualizar.
        </p>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-[var(--color-pan-700)] hover:bg-[var(--color-pan-600)] text-white
                       font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? "Guardando…" : "Guardar imagen"}
          </button>
          <button onClick={onClose}
            className="px-5 border border-[var(--color-pan-300)] text-[var(--color-pan-600)] hover:bg-[var(--color-pan-100)]
                       font-medium py-2.5 rounded-xl text-sm transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminImagenesPage() {
  const [productos,   setProductos]   = useState<Producto[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState("")
  const [editando,    setEditando]    = useState<Producto | null>(null)
  const [busqueda,    setBusqueda]    = useState("")
  const [savedId,     setSavedId]     = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProductos(data)
        else setError(data.error ?? "Error al cargar productos")
      })
      .catch(() => setError("No se pudo conectar con el servidor"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(id: string, imagen_url: string) {
    const res = await fetch("/api/admin/productos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, imagen_url: imagen_url || null }),
    })
    if (res.ok) {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, imagen_url: imagen_url || null } : p))
      )
      setSavedId(id)
      setTimeout(() => setSavedId(null), 2500)
    }
  }

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const conImagen    = productos.filter((p) => p.imagen_url).length
  const sinImagen    = productos.length - conImagen

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[var(--color-pan-900)] mb-1">
          Gestión de imágenes
        </h1>
        <p className="text-[var(--color-pan-500)] text-sm">
          Administra la imagen de cada producto en el catálogo.
        </p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total productos", value: productos.length, color: "text-[var(--color-pan-800)]" },
            { label: "Con imagen",      value: conImagen,        color: "text-green-700" },
            { label: "Sin imagen",      value: sinImagen,        color: "text-orange-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Buscador */}
      {!loading && !error && (
        <div className="relative mb-6">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full max-w-sm pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm
                       focus:outline-none focus:border-[var(--color-pan-400)] transition-colors"
          />
        </div>
      )}

      {/* Estados */}
      {loading && (
        <div className="text-center py-20 text-[var(--color-pan-400)]">
          <p className="text-4xl mb-3 animate-pulse">🥖</p>
          <p className="text-sm">Cargando productos…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm">
          <p className="font-semibold mb-1">Error al cargar</p>
          <p>{error}</p>
          {error.includes("Service Role") && (
            <p className="mt-2 text-xs text-red-500">
              Agrega <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> en tu <code>.env.local</code> para activar el admin completo.
            </p>
          )}
        </div>
      )}

      {/* Grid de productos */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtrados.map((producto) => (
            <div key={producto.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden group transition-all
                ${savedId === producto.id ? "ring-2 ring-green-400 border-green-300" : "border-gray-200 hover:shadow-md"}`}>
              {/* Imagen */}
              <div className="relative h-36 bg-[var(--color-pan-100)]">
                {producto.imagen_url ? (
                  <Image src={producto.imagen_url} alt={producto.nombre} fill
                    className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-pan-300)]">
                    <span className="text-3xl">🍞</span>
                  </div>
                )}

                {/* Overlay editar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => setEditando(producto)}
                    className="opacity-0 group-hover:opacity-100 bg-white text-[var(--color-pan-900)] text-xs
                               font-semibold px-3 py-1.5 rounded-full transition-opacity shadow-md">
                    ✏️ Editar
                  </button>
                </div>

                {/* Badge sin imagen */}
                {!producto.imagen_url && (
                  <span className="absolute top-2 left-2 bg-orange-100 text-orange-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    Sin imagen
                  </span>
                )}

                {/* Badge guardado */}
                {savedId === producto.id && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                    ✓ Guardado
                  </span>
                )}
              </div>

              {/* Nombre + precio */}
              <div className="p-3">
                <p className="text-[var(--color-pan-900)] text-xs font-semibold leading-tight line-clamp-2 mb-1">
                  {producto.nombre}
                </p>
                <p className="text-[var(--color-pan-400)] text-[10px]">${producto.precio.toFixed(2)}</p>
              </div>
            </div>
          ))}

          {filtrados.length === 0 && busqueda && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">Sin resultados para "{busqueda}"</p>
            </div>
          )}

          {productos.length === 0 && !loading && (
            <div className="col-span-full text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🥖</p>
              <p className="text-sm font-medium text-gray-600 mb-1">Sin productos en la base de datos</p>
              <p className="text-xs">Importa los productos desde el catálogo para gestionar sus imágenes.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de edición */}
      {editando && (
        <EditModal
          producto={editando}
          onSave={handleSave}
          onClose={() => setEditando(null)}
        />
      )}
    </div>
  )
}
