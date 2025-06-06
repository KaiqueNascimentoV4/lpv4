// Utilitários para criptografia e segurança

// Função simples para gerar um salt aleatório
export function generateSalt(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Função para hash de senha usando SHA-256 com salt
export function hashPassword(password: string, salt: string): string {
  // Implementação simples de hash usando TextEncoder e SubtleCrypto
  // Em um ambiente real, usaríamos bcrypt ou Argon2
  return btoa(password + salt) // Esta é uma implementação simplificada e NÃO segura
}

// Função para verificar senha
export function verifyPassword(password: string, salt: string, hashedPassword: string): boolean {
  const calculatedHash = hashPassword(password, salt)
  return calculatedHash === hashedPassword
}

// Função para ofuscar dados antes de armazenar
export function obfuscateData(data: any): string {
  const jsonString = JSON.stringify(data)
  // Implementação simples de ofuscação - não é criptografia real
  return btoa(jsonString)
}

// Função para desobfuscar dados
export function deobfuscateData<T>(obfuscatedData: string): T {
  try {
    const jsonString = atob(obfuscatedData)
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Erro ao desobfuscar dados:", error)
    throw new Error("Dados inválidos")
  }
}

// Gerar token de sessão
export function generateSessionToken(): string {
  const randomBytes = new Uint8Array(32)
  window.crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Verificar se um token de sessão expirou
export function isTokenExpired(timestamp: number, expirationMinutes = 60): boolean {
  const now = Date.now()
  const expirationTime = timestamp + expirationMinutes * 60 * 1000
  return now > expirationTime
}
