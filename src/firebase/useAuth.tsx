// src/firebase/useAuth.tsx
import { onAuthStateChanged, type User } from 'firebase/auth'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import { auth } from './config'

interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
