// Sistema de autenticação para administradores
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  obfuscateData,
  deobfuscateData,
  generateSessionToken,
  isTokenExpired,
} from "./crypto-utils"

export interface AdminUser {
  email: string
  name: string
  role: "super-admin" | "admin"
  createdAt: string
  salt: string
  hashedPassword: string
}

export interface AdminSession {
  user: Omit<AdminUser, "salt" | "hashedPassword">
  token: string
  createdAt: number
}

const STORAGE_KEY_USERS = "v4_admin_users_secure"
const STORAGE_KEY_SESSION = "v4_admin_session"
const SESSION_EXPIRATION_MINUTES = 120 // 2 horas

// Inicializar o super-admin padrão se não existir
function initializeDefaultAdmin(): void {
  if (typeof window === "undefined") return

  try {
    const users = getAdminUsers()

    // Se não houver usuários, criar o super-admin padrão
    if (users.length === 0) {
      const salt = generateSalt()
      const defaultAdmin: AdminUser = {
        email: "kaique.nascimento@v4company.com",
        name: "Kaique Nascimento",
        role: "super-admin",
        createdAt: new Date().toISOString(),
        salt: salt,
        hashedPassword: hashPassword("V4Piraju", salt),
      }

      setAdminUsers([defaultAdmin])
    }
  } catch (error) {
    console.error("Erro ao inicializar admin padrão:", error)
  }
}

// Funções para gerenciar usuários admin
export function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return []

  try {
    const encryptedData = localStorage.getItem(STORAGE_KEY_USERS)
    if (!encryptedData) {
      return []
    }
    return deobfuscateData<AdminUser[]>(encryptedData)
  } catch (error) {
    console.error("Erro ao carregar usuários admin:", error)
    return []
  }
}

export function setAdminUsers(users: AdminUser[]): void {
  if (typeof window === "undefined") return

  try {
    const encryptedData = obfuscateData(users)
    localStorage.setItem(STORAGE_KEY_USERS, encryptedData)
  } catch (error) {
    console.error("Erro ao salvar usuários admin:", error)
  }
}

export function addAdminUser(user: {
  email: string
  password: string
  name: string
  role: "super-admin" | "admin"
}): boolean {
  try {
    const users = getAdminUsers()

    // Verificar se o email já existe
    if (users.some((u) => u.email === user.email)) {
      return false
    }

    const salt = generateSalt()
    const newUser: AdminUser = {
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date().toISOString(),
      salt: salt,
      hashedPassword: hashPassword(user.password, salt),
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
    if (email === "kaique.nascimento@v4company.com") {
      return false
    }

    const users = getAdminUsers()
    const filteredUsers = users.filter((u) => u.email !== email)

    if (filteredUsers.length === users.length) {
      return false // Usuário não encontrado
    }

    setAdminUsers(filteredUsers)
    return true
  } catch (error) {
    console.error("Erro ao remover usuário admin:", error)
    return false
  }
}

export function authenticateAdmin(email: string, password: string): AdminUser | null {
  try {
    // Inicializar o admin padrão se necessário
    initializeDefaultAdmin()

    const users = getAdminUsers()
    const user = users.find((u) => u.email === email)

    if (!user) return null

    const isPasswordValid = verifyPassword(password, user.salt, user.hashedPassword)

    if (isPasswordValid) {
      return user
    }

    return null
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return null
  }
}

// Funções para sessão atual
export function createAdminSession(user: AdminUser): AdminSession {
  const sessionUser = {
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  }

  const session: AdminSession = {
    user: sessionUser,
    token: generateSessionToken(),
    createdAt: Date.now(),
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SESSION, obfuscateData(session))
  }

  return session
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null

  try {
    const encryptedSession = localStorage.getItem(STORAGE_KEY_SESSION)
    if (!encryptedSession) return null

    const session = deobfuscateData<AdminSession>(encryptedSession)

    // Verificar se a sessão expirou
    if (isTokenExpired(session.createdAt, SESSION_EXPIRATION_MINUTES)) {
      clearAdminSession()
      return null
    }

    return session
  } catch (error) {
    console.error("Erro ao obter sessão:", error)
    return null
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY_SESSION)
}

// Inicializar o sistema
export function initAdminAuthSystem(): void {
  initializeDefaultAdmin()
}
