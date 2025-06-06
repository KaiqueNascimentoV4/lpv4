"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentAdminUser, setCurrentAdminUser, type AdminUser } from "@/lib/admin-auth"

type AdminAuthContextType = {
  user: AdminUser | null
  login: (user: AdminUser) => void
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
})

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentAdminUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = (userData: AdminUser) => {
    setUser(userData)
    setCurrentAdminUser(userData)
  }

  const logout = () => {
    setUser(null)
    setCurrentAdminUser(null)
  }

  return <AdminAuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
