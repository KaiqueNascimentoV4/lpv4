"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Users, Target, Palette, Clock } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { NavBar } from "@/components/nav-bar"
import {
  getEmails,
  getClients,
  getCreativeTypes,
  getCompetitiveDifferentials,
  getTriggers,
  getIntentions,
  getToneOfVoices,
  getAwarenessLevels,
} from "@/lib/local-storage"
import { ChatWidget } from "@/components/chat-widget"

export default function CreativeRequestForm() {
  const [formData, setFormData] = useState({
    email: "",
    taskName: "",
    client: "",
    creativeType: "",
    briefing: "",
    location: "",
    product: "",
    commercialTriggers: "",
    competitiveDifferentials: [],
    triggers: [],
    intention: "",
    toneOfVoice: "",
    awarenessLevel: "",
    cta: "",
    startDate: "",
    references: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dados dinâmicos dos campos de seleção
  const [emails, setEmailsList] = useState<string[]>([])
  const [clients, setClientsList] = useState<string[]>([])
  const [creativeTypes, setCreativeTypesList] = useState<string[]>([])
  const [competitiveDifferentials, setCompetitiveDifferentialsList] = useState<string[]>([])
  const [triggers, setTriggersList] = useState<string[]>([])
  const [intentions, setIntentionsList] = useState<string[]>([])
  const [toneOfVoices, setToneOfVoicesList] = useState<string[]>([])
  const [awarenessLevels, setAwarenessLevelsList] = useState<string[]>([])

  // Carregar dados do localStorage
  useEffect(() => {
    setEmailsList(getEmails())
    setClientsList(getClients())
    setCreativeTypesList(getCreativeTypes())
    setCompetitiveDifferentialsList(getCompetitiveDifferentials())
    setTriggersList(getTriggers())
    setIntentionsList(getIntentions())
    setToneOfVoicesList(getToneOfVoices())
    setAwarenessLevelsList(getAwarenessLevels())
  }, [])

  const handleCheckboxChange = (value: string, field: "competitiveDifferentials" | "triggers") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica dos campos obrigatórios
    if (
      !formData.email ||
      !formData.taskName ||
      !formData.client ||
      !formData.creativeType ||
      !formData.briefing ||
      !formData.intention ||
      !formData.toneOfVoice ||
      !formData.awarenessLevel ||
      !formData.cta ||
      !formData.startDate
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Enviando dados:", formData)

      const response = await fetch("https://hook.us1.make.celonis.com/hxx2svkvaek4sbp8caaiwtuqylyatxqd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          competitiveDifferentials: formData.competitiveDifferentials.join(", "),
          triggers: formData.triggers.join(", "),
          userName: formData.email.split("@")[0] || "",
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (response.ok) {
        alert("Solicitação enviada com sucesso!")
        // Reset form
        setFormData({
          email: "",
          taskName: "",
          client: "",
          creativeType: "",
          briefing: "",
          location: "",
          product: "",
          commercialTriggers: "",
          competitiveDifferentials: [],
          triggers: [],
          intention: "",
          toneOfVoice: "",
          awarenessLevel: "",
          cta: "",
          startDate: "",
          references: "",
        })
      } else {
        const errorText = await response.text()
        console.error("Erro na resposta:", errorText)
        alert("Erro ao enviar solicitação. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      alert("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <NavBar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">Solicitação de Criativos</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Preencha o formulário abaixo com todas as informações necessárias para criarmos o melhor criativo para seu
            projeto.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Formulário de Solicitação
            </CardTitle>
            <CardDescription className="text-gray-100">Campos marcados com * são obrigatórios</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-100">Informações Básicas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Seu e-mail *
                    </Label>
                    <Combobox
                      value={formData.email}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                      placeholder="Buscar e selecionar e-mail..."
                      options={emails.map((email) => ({ value: email, label: email }))}
                      className="bg-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskName" className="text-sm font-medium text-gray-300">
                      Nome da tarefa *
                    </Label>
                    <Input
                      id="taskName"
                      className="bg-gray-700 text-white"
                      value={formData.taskName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, taskName: e.target.value }))}
                      placeholder="Digite o nome da tarefa"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-medium text-gray-300">
                      Cliente *
                    </Label>
                    <Combobox
                      value={formData.client}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, client: value }))}
                      placeholder="Buscar e selecionar cliente..."
                      options={clients.map((client) => ({ value: client, label: client }))}
                      className="bg-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creativeType" className="text-sm font-medium text-gray-300">
                      Tipo de criativo *
                    </Label>
                    <Combobox
                      value={formData.creativeType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, creativeType: value }))}
                      placeholder="Buscar e selecionar tipo..."
                      options={creativeTypes.map((type) => ({ value: type, label: type }))}
                      className="bg-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Briefing e Detalhes */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-100">Briefing e Detalhes</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="briefing" className="text-sm font-medium text-gray-300">
                    Briefing do criativo *
                  </Label>
                  <Textarea
                    id="briefing"
                    className="bg-gray-700 text-white min-h-[120px]"
                    value={formData.briefing}
                    onChange={(e) => setFormData((prev) => ({ ...prev, briefing: e.target.value }))}
                    placeholder="Descreva detalhadamente o que você precisa..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-300">
                      Localização ou área de atuação
                    </Label>
                    <Input
                      id="location"
                      className="bg-gray-700 text-white"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: São Paulo, Brasil"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product" className="text-sm font-medium text-gray-300">
                      Produto
                    </Label>
                    <Input
                      id="product"
                      className="bg-gray-700 text-white"
                      value={formData.product}
                      onChange={(e) => setFormData((prev) => ({ ...prev, product: e.target.value }))}
                      placeholder="Nome do produto/serviço"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commercialTriggers" className="text-sm font-medium text-gray-300">
                    Gatilhos comerciais
                  </Label>
                  <Textarea
                    id="commercialTriggers"
                    className="bg-gray-700 text-white min-h-[80px]"
                    value={formData.commercialTriggers}
                    onChange={(e) => setFormData((prev) => ({ ...prev, commercialTriggers: e.target.value }))}
                    placeholder="Ex: Diferenciais do produto, percentual de desconto, frete grátis..."
                  />
                </div>
              </div>

              {/* Diferenciais e Gatilhos */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-100">Diferenciais e Gatilhos</h3>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-300">Diferenciais competitivos do produto *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {competitiveDifferentials.map((differential) => (
                      <div key={differential} className="flex items-center space-x-2">
                        <Checkbox
                          id={differential}
                          className="border-white data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          checked={formData.competitiveDifferentials.includes(differential)}
                          onCheckedChange={() => handleCheckboxChange(differential, "competitiveDifferentials")}
                        />
                        <Label htmlFor={differential} className="text-sm text-gray-300 cursor-pointer">
                          {differential}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-300">Gatilhos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {triggers.map((trigger) => (
                      <div key={trigger} className="flex items-center space-x-2">
                        <Checkbox
                          id={trigger}
                          className="border-white data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          checked={formData.triggers.includes(trigger)}
                          onCheckedChange={() => handleCheckboxChange(trigger, "triggers")}
                        />
                        <Label htmlFor={trigger} className="text-sm text-gray-300 cursor-pointer">
                          {trigger}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estratégia e Tom */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-100">Estratégia e Tom</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="intention" className="text-sm font-medium text-gray-300">
                      Intenção do criativo *
                    </Label>
                    <Combobox
                      value={formData.intention}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, intention: value }))}
                      placeholder="Buscar e selecionar intenção..."
                      options={intentions.map((intention) => ({ value: intention, label: intention }))}
                      className="bg-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toneOfVoice" className="text-sm font-medium text-gray-300">
                      Tom de voz *
                    </Label>
                    <Combobox
                      value={formData.toneOfVoice}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, toneOfVoice: value }))}
                      placeholder="Buscar e selecionar tom..."
                      options={toneOfVoices.map((tone) => ({ value: tone, label: tone }))}
                      className="bg-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="awarenessLevel" className="text-sm font-medium text-gray-300">
                      Nível de consciência do cliente *
                    </Label>
                    <Combobox
                      value={formData.awarenessLevel}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, awarenessLevel: value }))}
                      placeholder="Buscar e selecionar nível..."
                      options={awarenessLevels.map((level) => ({ value: level, label: level }))}
                      className="bg-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta" className="text-sm font-medium text-gray-300">
                      CTA do criativo *
                    </Label>
                    <Input
                      id="cta"
                      className="bg-gray-700 text-white"
                      value={formData.cta}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cta: e.target.value }))}
                      placeholder="Ex: Compre Agora, Saiba Mais, Entre em Contato"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cronograma e Referências */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-100">Cronograma e Referências</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-300">
                      Data de início da tarefa *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      className="bg-gray-700 text-white"
                      value={formData.startDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references" className="text-sm font-medium text-gray-300">
                      Referência e inspirações
                    </Label>
                    <Input
                      id="references"
                      className="bg-gray-700 text-white"
                      value={formData.references}
                      onChange={(e) => setFormData((prev) => ({ ...prev, references: e.target.value }))}
                      placeholder="Cole o link do arquivo de referência"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-300">© 2025 V4 Rondina. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
