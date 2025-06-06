"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/components/admin-auth-provider"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const router = useRouter()
  const { login } = useAdminAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Verificar tentativas de login
      if (loginAttempts >= 5) {
        setError("Muitas tentativas de login. Tente novamente mais tarde.")
        setIsLoading(false)
        return
      }

      const success = await login(email, password)

      if (success) {
        router.push("/config")
      } else {
        setLoginAttempts((prev) => prev + 1)
        setError("Email ou senha incorretos.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao formulário
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Acesso Administrativo</CardTitle>
            <CardDescription className="text-gray-100 text-center">Login para acessar as configurações</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="mb-6 w-24 h-24">
              <Image
                src="/v4-rondina-logo.png"
                alt="V4 Rondina Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-white text-sm text-center w-full flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@v4company.com"
                  className="bg-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || loginAttempts >= 5}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-400 hover:text-gray-300 underline">
                ← Voltar ao formulário principal
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
