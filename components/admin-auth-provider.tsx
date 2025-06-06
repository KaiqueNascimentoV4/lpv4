"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  getAdminSession,
  clearAdminSession,
  createAdminSession,
  authenticateAdmin,
  initAdminAuthSystem,
  type AdminUser,
} from "@/lib/admin-auth"

type AdminAuthContextType = {
  user: Omit<AdminUser, "salt" | "hashedPassword"> | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
})

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<AdminUser, "salt" | "hashedPassword"> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Inicializar o sistema de autenticação
    initAdminAuthSystem()

    // Verificar se há uma sessão ativa
    const session = getAdminSession()
    if (session) {
      setUser(session.user)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = authenticateAdmin(email, password)

    if (user) {
      const session = createAdminSession(user)
      setUser(session.user)
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    clearAdminSession()
  }

  return <AdminAuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
