import { useState } from 'react'
import { db } from '../../firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import Sidebar from '../../components/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function NuevoProducto() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    caracteristicas: '',
    precio: '',
    cantidad: '',
    imagen_drive_id: '',
    descuento: '',
    disponible: true,
    destacado: false,
    oferta: false,
    reciente: false
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'productos'), {
        ...form,
        precio: parseFloat(form.precio),
        cantidad: parseInt(form.cantidad),
        descuento: parseFloat(form.descuento),
        disponible: Boolean(form.disponible),
        destacado: Boolean(form.destacado),
        oferta: Boolean(form.oferta),
        reciente: Boolean(form.reciente)
      })
      navigate('/productos')
    } catch (error) {
      console.error('Error al agregar producto:', error)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-20 md:ml-64 p-6 w-full min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Registrar nuevo producto</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
          
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Tipo</label>
            <input type="text" name="tipo" value={form.tipo} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Precio (S/)</label>
            <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Cantidad</label>
            <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Descuento (%)</label>
            <input type="number" step="0.01" name="descuento" value={form.descuento} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">ID de imagen de Drive</label>
            <input type="text" name="imagen_drive_id" value={form.imagen_drive_id} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-semibold">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-semibold">Características</label>
            <textarea name="caracteristicas" value={form.caracteristicas} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} />
            <label className="font-semibold">Disponible</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
            <label className="font-semibold">Destacado</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="oferta" checked={form.oferta} onChange={handleChange} />
            <label className="font-semibold">Oferta</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="reciente" checked={form.reciente} onChange={handleChange} />
            <label className="font-semibold">Reciente</label>
          </div>

          <div className="col-span-2 text-right">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Guardar producto
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}