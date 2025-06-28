import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { FiMail, FiLock } from 'react-icons/fi'
import { FaGoogle, FaApple, FaTimes } from 'react-icons/fa'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, correo, clave)
      navigate('/dashboard')
    } catch (err: any) {
      setError('Correo o contraseña inválidos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="bg-[#111827] text-white w-full max-w-sm p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-5">
          <img src="/vite.svg" alt="logo" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Don’t have an account?{' '}
          <span className="text-blue-400 hover:underline cursor-pointer">Sign up</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center bg-[#1f2937] rounded-md px-3 py-2">
            <FiMail className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email address"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center bg-[#1f2937] rounded-md px-3 py-2">
            <FiLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors p-2 rounded-md text-white font-semibold"
          >
            Login
          </button>
        </form>

        <div className="my-4 flex items-center justify-center text-gray-400 text-sm">
          <span className="border-b border-gray-600 w-1/4"></span>
          <span className="px-3">Or</span>
          <span className="border-b border-gray-600 w-1/4"></span>
        </div>

        <div className="flex justify-between space-x-2">
          <button className="flex-1 bg-[#1e293b] hover:bg-[#334155] p-2 rounded-md flex items-center justify-center">
            <FaApple />
          </button>
          <button className="flex-1 bg-[#1e293b] hover:bg-[#334155] p-2 rounded-md flex items-center justify-center">
            <FaGoogle />
          </button>
          <button className="flex-1 bg-[#1e293b] hover:bg-[#334155] p-2 rounded-md flex items-center justify-center">
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  )
}