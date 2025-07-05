import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Sidebar from '../../components/Sidebar'

export default function EditarUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [usuario, setUsuario] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    imagenUrl: ''
  })

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!id) return
      const docRef = doc(db, 'usuarios', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUsuario(docSnap.data() as any)
      }
    }

    fetchUsuario()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const docRef = doc(db, 'usuarios', id)
    await updateDoc(docRef, usuario)
    navigate(`/usuarios/${id}`)
  }

  return (
    <div className="flex">
      <Sidebar onToggle={setSidebarOpen} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 w-full min-h-screen bg-gray-100`}>
        <h1 className="text-3xl font-bold mb-6">Editar usuario</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Nombres</label>
            <input type="text" name="nombres" value={usuario.nombres} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Apellidos</label>
            <input type="text" name="apellidos" value={usuario.apellidos} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Correo</label>
            <input type="email" name="correo" value={usuario.correo} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Teléfono</label>
            <input type="text" name="telefono" value={usuario.telefono} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Imagen (URL)</label>
            <input type="text" name="imagenUrl" value={usuario.imagenUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Guardar cambios</button>
        </form>
      </main>
    </div>
  )
}