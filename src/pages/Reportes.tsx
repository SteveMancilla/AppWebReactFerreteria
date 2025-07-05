import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import Sidebar from '../components/Sidebar'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList,
} from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // CORRECTO aquí

interface Usuario {
  id: string
  nombres: string
  apellidos: string
  correo: string
  compras: any[]
}

interface ProductoResumen {
  nombre: string
  cantidad: number
}

const colores = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0ea5e9', '#9333ea', '#e11d48', '#22c55e', '#f97316']

export default function Reportes() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [totalVentas, setTotalVentas] = useState(0)
  const [totalIGV, setTotalIGV] = useState(0)
  const [productosResumen, setProductosResumen] = useState<ProductoResumen[]>([])
  const [usuarioTop, setUsuarioTop] = useState<string>('')
  const [filtro, setFiltro] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const usuariosSnap = await getDocs(collection(db, 'usuarios'))
      const usuariosData: Usuario[] = []
      let total = 0
      let igv = 0
      const productosMap: Record<string, number> = {}
      let maxCompras = 0
      let topUsuario = ''

      for (const userDoc of usuariosSnap.docs) {
        const data = userDoc.data()
        const comprasSnap = await getDocs(collection(userDoc.ref, 'compras'))
        const compras: any[] = []
        let totalUsuario = 0

        comprasSnap.forEach((doc) => {
          const compra = doc.data()
          compras.push(compra)

          total += compra.total || 0
          igv += compra.igv || 0
          totalUsuario += compra.total || 0

          if (Array.isArray(compra.productos)) {
            compra.productos.forEach((prod: any) => {
              productosMap[prod.nombre] = (productosMap[prod.nombre] || 0) + (prod.cantidad || 1)
            })
          }
        })

        if (totalUsuario > maxCompras) {
          maxCompras = totalUsuario
          topUsuario = `${data.nombres} ${data.apellidos}`
        }

        usuariosData.push({
          id: userDoc.id,
          nombres: data.nombres,
          apellidos: data.apellidos,
          correo: data.correo || '-',
          compras,
        })
      }

      setUsuarios(usuariosData)
      setTotalVentas(total)
      setTotalIGV(igv)
      setUsuarioTop(topUsuario)

      const productosArray = Object.entries(productosMap).map(([nombre, cantidad]) => ({ nombre, cantidad }))
      setProductosResumen(productosArray)
    }

    fetchData()
  }, [])

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.text('Reporte de Ventas', 14, 16)

    const rows = usuarios
      .filter((u) => `${u.nombres} ${u.apellidos}`.toLowerCase().includes(filtro.toLowerCase()))
      .map((u) => [
        `${u.nombres} ${u.apellidos}`,
        u.correo || '-',
        u.compras.length,
        `S/ ${u.compras.reduce((s, c) => s + (c.total || 0), 0).toFixed(2)}`,
      ])

    autoTable(doc, {
      head: [['Nombre', 'Correo', 'N° Compras', 'Total S/']],
      body: rows,
      startY: 22,
    })

    doc.save('reporte_ventas.pdf')
  }

  return (
    <div className="flex">
      <Sidebar onToggle={setSidebarOpen} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 w-full min-h-screen bg-gray-100`}>
        <h1 className="text-3xl font-bold mb-6">Panel de Reportes</h1>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
            <p className="text-sm">Usuarios registrados</p>
            <p className="text-2xl font-bold">{usuarios.length}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-xl shadow">
            <p className="text-sm">Total Ventas</p>
            <p className="text-2xl font-bold">S/ {totalVentas.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-xl shadow">
            <p className="text-sm">Total IGV</p>
            <p className="text-2xl font-bold">S/ {totalIGV.toFixed(2)}</p>
          </div>
          <div className="bg-purple-600 text-white p-6 rounded-xl shadow">
            <p className="text-sm">Top comprador</p>
            <p className="text-lg font-semibold">{usuarioTop || 'Sin datos'}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Productos más vendidos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productosResumen}>
                <XAxis dataKey="nombre" stroke="#555" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#2563eb" barSize={50}>
                  <LabelList dataKey="cantidad" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Distribución de ventas por producto</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productosResumen}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {productosResumen.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '12px' }}/>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filtro y botón */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Filtrar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border px-4 py-2 rounded w-full max-w-xs"
          />
          <button onClick={exportarPDF} className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Exportar PDF
          </button>
        </div>

        {/* Tabla detallada */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Correo</th>
                <th className="text-left p-2">Compras</th>
                <th className="text-left p-2">Total gastado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios
                .filter(u => `${u.nombres} ${u.apellidos}`.toLowerCase().includes(filtro.toLowerCase()))
                .map((usuario, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{usuario.nombres} {usuario.apellidos}</td>
                    <td className="p-2">{usuario.correo}</td>
                    <td className="p-2">{usuario.compras.length}</td>
                    <td className="p-2">S/ {usuario.compras.reduce((s, c) => s + (c.total || 0), 0).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}