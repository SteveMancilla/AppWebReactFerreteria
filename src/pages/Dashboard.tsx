import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { FaUsers, FaBoxOpen, FaMoneyBillWave } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface CardProps {
  icon: React.ReactNode
  title: string
  value: number
  color: string
}

function Card({ icon, title, value, color }: CardProps) {
  return (
    <div className={`rounded-xl p-5 text-white shadow-md ${color}`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [usersCount, setUsersCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, 'usuarios'))
      setUsersCount(usersSnap.size)

      const productsSnap = await getDocs(collection(db, 'productos'))
      setProductsCount(productsSnap.size)

      let total = 0

      for (const userDoc of usersSnap.docs) {
        const comprasRef = collection(userDoc.ref, 'compras')
        const comprasSnap = await getDocs(comprasRef)

        comprasSnap.forEach((c) => {
          const data = c.data()
          total += data.total || 0
        })
      }

      setTotalSales(total)
    }

    fetchData()
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-20 md:ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Bienvenido al panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card icon={<FaUsers />} title="Usuarios" value={usersCount} color="bg-blue-600" />
          <Card icon={<FaBoxOpen />} title="Productos" value={productsCount} color="bg-green-600" />
          <Card icon={<FaMoneyBillWave />} title="Ventas Totales" value={totalSales} color="bg-yellow-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard title="Gestión de productos" href="/productos" />
          <SectionCard title="Gestión de usuarios" href="/usuarios" />
          <SectionCard title="Reportes y ventas" href="/reportes" />
          <SectionCard title="Ajustes" href="/ajustes" />
        </div>
      </main>
    </div>
  )
}

function SectionCard({ title, href }: { title: string, href: string }) {
  return (
    <Link
      to={href}
      className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition cursor-pointer bg-white block"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">Ir a {title.toLowerCase()}.</p>
    </Link>
  )
}