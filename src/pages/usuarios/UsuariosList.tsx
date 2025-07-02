import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Sidebar from '../../components/Sidebar'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

interface Usuario {
  id: string
  nombres: string
  apellidos: string
  correo: string
  telefono: string
  imagenUrl?: string | null
}

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchUsuarios = async () => {
      const snap = await getDocs(collection(db, 'usuarios'))
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Usuario[]
      setUsuarios(data)
    }

    fetchUsuarios()
  }, [])

  return (
    <div className="flex">
      <Sidebar onToggle={setSidebarOpen} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 w-full min-h-screen bg-gray-100`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Usuarios registrados</h1>
          <Link to="/usuarios/nuevo" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2">
            <FaPlus /> Nuevo usuario
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">#</th>
                <th className="px-6 py-3 font-semibold">Nombre completo</th>
                <th className="px-6 py-3 font-semibold">Correo</th>
                <th className="px-6 py-3 font-semibold">Teléfono</th>
                <th className="px-6 py-3 font-semibold">Imagen</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{usuario.nombres} {usuario.apellidos}</td>
                  <td className="px-6 py-4">{usuario.correo || <span className="italic text-gray-400">null</span>}</td>
                  <td className="px-6 py-4">{usuario.telefono || <span className="italic text-gray-400">null</span>}</td>
                  <td className="px-6 py-4">{usuario.imagenUrl || <span className="italic text-gray-400">null</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}