"use client"

import { useState, useEffect } from "react"
import { RequireAdminAuth } from "@/components/require-admin-auth"
import { NavBar } from "@/components/nav-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X, Save, RefreshCw, Users, UserPlus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getEmails,
  setEmails,
  getClients,
  setClients,
  getCreativeTypes,
  setCreativeTypes,
  getCompetitiveDifferentials,
  setCompetitiveDifferentials,
  getTriggers,
  setTriggers,
  getIntentions,
  setIntentions,
  getToneOfVoices,
  setToneOfVoices,
  getAwarenessLevels,
  setAwarenessLevels,
} from "@/lib/local-storage"
import { getAdminUsers, addAdminUser, removeAdminUser, type AdminUser } from "@/lib/admin-auth"
import { useAdminAuth } from "@/components/admin-auth-provider"
import { ChatWidget } from "@/components/chat-widget"

export default function ConfigPage() {
  return (
    <RequireAdminAuth>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-100">Configurações</h2>
            <p className="text-lg text-gray-300 mt-2">
              Gerencie os dados disponíveis nos campos de seleção do formulário de solicitação e usuários
              administrativos.
            </p>
          </div>

          <Tabs defaultValue="emails" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="emails">E-mails</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="creative">Tipos de Criativo</TabsTrigger>
              <TabsTrigger value="other">Outros Campos</TabsTrigger>
              <TabsTrigger value="users">Usuários Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="emails">
              <ListEditor
                title="E-mails"
                description="Gerencie a lista de e-mails disponíveis no formulário."
                getItems={getEmails}
                setItems={setEmails}
                placeholder="nome@v4company.com"
                validateItem={(email) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  return emailRegex.test(email) ? null : "E-mail inválido"
                }}
              />
            </TabsContent>

            <TabsContent value="clients">
              <ListEditor
                title="Clientes"
                description="Gerencie a lista de clientes disponíveis no formulário."
                getItems={getClients}
                setItems={setClients}
                placeholder="Nome do cliente"
              />
            </TabsContent>

            <TabsContent value="creative">
              <ListEditor
                title="Tipos de Criativo"
                description="Gerencie os tipos de criativo disponíveis no formulário."
                getItems={getCreativeTypes}
                setItems={setCreativeTypes}
                placeholder="Tipo de criativo"
              />
            </TabsContent>

            <TabsContent value="other">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListEditor
                  title="Diferenciais Competitivos"
                  description="Gerencie os diferenciais competitivos disponíveis."
                  getItems={getCompetitiveDifferentials}
                  setItems={setCompetitiveDifferentials}
                  placeholder="Diferencial competitivo"
                  compact
                />

                <ListEditor
                  title="Gatilhos"
                  description="Gerencie os gatilhos disponíveis."
                  getItems={getTriggers}
                  setItems={setTriggers}
                  placeholder="Gatilho"
                  compact
                />

                <ListEditor
                  title="Intenções"
                  description="Gerencie as intenções disponíveis."
                  getItems={getIntentions}
                  setItems={setIntentions}
                  placeholder="Intenção"
                  compact
                />

                <ListEditor
                  title="Tom de Voz"
                  description="Gerencie os tons de voz disponíveis."
                  getItems={getToneOfVoices}
                  setItems={setToneOfVoices}
                  placeholder="Tom de voz"
                  compact
                />

                <ListEditor
                  title="Níveis de Consciência"
                  description="Gerencie os níveis de consciência disponíveis."
                  getItems={getAwarenessLevels}
                  setItems={setAwarenessLevels}
                  placeholder="Nível de consciência"
                  compact
                />
              </div>
            </TabsContent>

            <TabsContent value="users">
              <UserManager />
            </TabsContent>
          </Tabs>
        </main>

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </RequireAdminAuth>
  )
}

function UserManager() {
  const { user: currentUser } = useAdminAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin" as "admin" | "super-admin",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setUsers(getAdminUsers())
  }, [])

  const handleAddUser = () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      setError("Todos os campos são obrigatórios")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      setError("E-mail inválido")
      return
    }

    if (newUser.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    const success = addAdminUser(newUser)
    if (success) {
      setUsers(getAdminUsers())
      setNewUser({ email: "", password: "", name: "", role: "admin" })
      setError(null)
      setSuccess("Usuário adicionado com sucesso!")
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError("Este e-mail já está cadastrado")
    }
  }

  const handleRemoveUser = (email: string) => {
    if (email === "kaique.nascimento@v4company.com") {
      setError("Não é possível remover o super-admin principal")
      return
    }

    if (confirm("Tem certeza que deseja remover este usuário?")) {
      const success = removeAdminUser(email)
      if (success) {
        setUsers(getAdminUsers())
        setSuccess("Usuário removido com sucesso!")
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  const isSuperAdmin = currentUser?.role === "super-admin"

  return (
    <Card className="shadow-xl border-0 bg-gray-800/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gerenciar Usuários Administrativos
        </CardTitle>
        <CardDescription className="text-gray-100">
          {isSuperAdmin
            ? "Adicione ou remova usuários que podem acessar as configurações."
            : "Visualize os usuários administrativos (apenas super-admins podem gerenciar)."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Adicionar novo usuário - apenas para super-admin */}
          {isSuperAdmin && (
            <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-green-500" />
                <h4 className="text-lg font-semibold text-gray-100">Adicionar Novo Usuário</h4>
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-white text-sm">{error}</div>
              )}

              {success && (
                <div className="p-3 bg-green-900/50 border border-green-700 rounded-md text-white text-sm">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserName" className="text-sm font-medium text-gray-300">
                    Nome completo
                  </Label>
                  <Input
                    id="newUserName"
                    value={newUser.name}
                    onChange={(e) => {
                      setNewUser((prev) => ({ ...prev, name: e.target.value }))
                      setError(null)
                    }}
                    placeholder="Nome do usuário"
                    className="bg-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newUserEmail" className="text-sm font-medium text-gray-300">
                    E-mail
                  </Label>
                  <Input
                    id="newUserEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => {
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                      setError(null)
                    }}
                    placeholder="email@v4company.com"
                    className="bg-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newUserPassword" className="text-sm font-medium text-gray-300">
                    Senha
                  </Label>
                  <Input
                    id="newUserPassword"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => {
                      setNewUser((prev) => ({ ...prev, password: e.target.value }))
                      setError(null)
                    }}
                    placeholder="Mínimo 6 caracteres"
                    className="bg-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newUserRole" className="text-sm font-medium text-gray-300">
                    Nível de acesso
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "super-admin") => setNewUser((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          )}

          {/* Lista de usuários */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Usuários Cadastrados</h4>
            <div className="border rounded-md border-gray-700 bg-gray-900/50">
              {users.length === 0 ? (
                <div className="p-4 text-gray-400 text-center">Nenhum usuário cadastrado</div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-gray-200 font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.role === "super-admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role === "super-admin" ? "Super Admin" : "Admin"}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          Criado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>

                      {isSuperAdmin && user.email !== "kaique.nascimento@v4company.com" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.email)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ListEditorProps {
  title: string
  description: string
  getItems: () => string[]
  setItems: (items: string[]) => void
  placeholder: string
  validateItem?: (item: string) => string | null
  compact?: boolean
}

function ListEditor({
  title,
  description,
  getItems,
  setItems,
  placeholder,
  validateItem,
  compact = false,
}: ListEditorProps) {
  const [items, setItemsState] = useState<string[]>([])
  const [newItem, setNewItem] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    setItemsState(getItems())
  }, [getItems])

  const handleAddItem = () => {
    if (!newItem.trim()) {
      setError("O campo não pode estar vazio")
      return
    }

    if (validateItem) {
      const validationError = validateItem(newItem)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    if (items.includes(newItem)) {
      setError("Este item já existe na lista")
      return
    }

    setItemsState([...items, newItem])
    setNewItem("")
    setError(null)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItemsState(newItems)
  }

  const handleSave = () => {
    setIsSaving(true)
    setItems(items)

    setTimeout(() => {
      setIsSaving(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)
    }, 500)
  }

  const handleReset = () => {
    setItemsState(getItems())
    setNewItem("")
    setError(null)
  }

  return (
    <Card className="shadow-xl border-0 bg-gray-800/90 backdrop-blur-sm mb-6">
      <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-gray-100">{description}</CardDescription>
      </CardHeader>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newItem}
                onChange={(e) => {
                  setNewItem(e.target.value)
                  setError(null)
                }}
                placeholder={placeholder}
                className="bg-gray-700 text-white"
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
            <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Adicionar</span>
            </Button>
          </div>

          <div
            className="border rounded-md border-gray-700 bg-gray-900/50 overflow-y-auto"
            style={{ maxHeight: compact ? "200px" : "300px" }}
          >
            {items.length === 0 ? (
              <div className="p-4 text-gray-400 text-center">Nenhum item na lista</div>
            ) : (
              <ul className="divide-y divide-gray-700">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center justify-between p-3">
                    <span className="text-gray-200">{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={handleReset} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restaurar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Salvo!
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
