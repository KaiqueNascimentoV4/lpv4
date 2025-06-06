"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X, Save, RefreshCw } from "lucide-react"
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
import { ChatWidget } from "@/components/chat-widget"

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100">Configurações</h2>
          <p className="text-lg text-gray-300 mt-2">
            Gerencie os dados disponíveis nos campos de seleção do formulário de solicitação.
          </p>
        </div>

        <Tabs defaultValue="emails" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="emails">E-mails</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="creative">Tipos de Criativo</TabsTrigger>
            <TabsTrigger value="other">Outros Campos</TabsTrigger>
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
        </Tabs>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
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
