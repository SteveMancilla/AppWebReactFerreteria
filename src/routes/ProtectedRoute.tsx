// src/routes/ProtectedRoute.tsx
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/useAuth' // NO pongas `.tsx`

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/" replace />
  return children
}
