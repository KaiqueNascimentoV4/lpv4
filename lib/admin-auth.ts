// Sistema de autenticação para administradores

export interface AdminUser {
  email: string
  password: string
  name: string
  role: "super-admin" | "admin"
  createdAt: string
}

// Usuário super-admin padrão
const DEFAULT_SUPER_ADMIN: AdminUser = {
  email: "kaique.nascimento@v4company.com",
  password: "V4Piraju",
  name: "Kaique Nascimento",
  role: "super-admin",
  createdAt: new Date().toISOString(),
}

// Funções para gerenciar usuários admin
export function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return [DEFAULT_SUPER_ADMIN]

  try {
    const users = localStorage.getItem("v4_admin_users")
    if (!users) {
      // Se não existir, criar com o super-admin padrão
      setAdminUsers([DEFAULT_SUPER_ADMIN])
      return [DEFAULT_SUPER_ADMIN]
    }
    return JSON.parse(users)
  } catch (error) {
    console.error("Erro ao carregar usuários admin:", error)
    return [DEFAULT_SUPER_ADMIN]
  }
}

export function setAdminUsers(users: AdminUser[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("v4_admin_users", JSON.stringify(users))
  } catch (error) {
    console.error("Erro ao salvar usuários admin:", error)
  }
}

export function addAdminUser(user: Omit<AdminUser, "createdAt">): boolean {
  try {
    const users = getAdminUsers()

    // Verificar se o email já existe
    if (users.some((u) => u.email === user.email)) {
      return false
    }

    const newUser: AdminUser = {
      ...user,
      createdAt: new Date().toISOString(),
    }

    setAdminUsers([...users, newUser])
    return true
  } catch (error) {
    console.error("Erro ao adicionar usuário admin:", error)
    return false
  }
}

export function removeAdminUser(email: string): boolean {
  try {
    // Não permitir remover o super-admin padrão
    if (email === DEFAULT_SUPER_ADMIN.email) {
      return false
    }

    const users = getAdminUsers()
    const filteredUsers = users.filter((u) => u.email !== email)
    setAdminUsers(filteredUsers)
    return true
  } catch (error) {
    console.error("Erro ao remover usuário admin:", error)
    return false
  }
}

export function authenticateAdmin(email: string, password: string): AdminUser | null {
  try {
    const users = getAdminUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    return user || null
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return null
  }
}

// Funções para sessão atual
export function getCurrentAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null

  try {
    const user = localStorage.getItem("v4_current_admin")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Erro ao carregar usuário atual:", error)
    return null
  }
}

export function setCurrentAdminUser(user: AdminUser | null): void {
  if (typeof window === "undefined") return

  try {
    if (user) {
      localStorage.setItem("v4_current_admin", JSON.stringify(user))
    } else {
      localStorage.removeItem("v4_current_admin")
    }
  } catch (error) {
    console.error("Erro ao salvar usuário atual:", error)
  }
}
