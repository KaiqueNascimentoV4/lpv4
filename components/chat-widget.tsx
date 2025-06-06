"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  const chatBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const webhookUrl = "https://webhook-n8n.v4companyamaral.com/webhook/Teste2"

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    // Inicializar sessão
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      await sendToWebhook("init", "Sessão iniciada")
      console.log("Sessão iniciada:", sessionId)
    } catch (error) {
      console.error("Erro ao inicializar sessão:", error)
    }
  }

  const sendToWebhook = async (type: string, message: string) => {
    const payload = {
      sessionId,
      type,
      message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    console.log("Enviando para webhook:", payload)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseText = await response.text()
    console.log("Resposta do webhook:", responseText)

    try {
      return JSON.parse(responseText)
    } catch (e) {
      return responseText
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const addMessage = (content: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const sendMessage = async () => {
    const message = inputValue.trim()
    if (!message) return

    // Adiciona mensagem do usuário
    addMessage(message, "user")
    setInputValue("")

    // Mostra indicador de digitação
    setIsTyping(true)

    try {
      // Envia para o webhook
      const response = await sendToWebhook("message", message)

      setIsTyping(false)

      // Processa a resposta do webhook
      if (response && (response.message || response.reply || response.response)) {
        const botMessage = response.message || response.reply || response.response || response.text
        addMessage(botMessage, "bot")
      } else if (typeof response === "string") {
        addMessage(response, "bot")
      } else {
        addMessage("Recebi sua mensagem! Como posso ajudar mais?", "bot")
      }
    } catch (error) {
      setIsTyping(false)
      addMessage("Desculpe, ocorreu um erro. Tente novamente.", "bot")
      console.error("Erro ao enviar mensagem:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 z-50 w-15 h-15 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? "rotate-45" : "animate-pulse"
        }`}
        style={{
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        }}
      >
        {isOpen ? (
          <X className="w-7 h-7 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-5 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl transition-all duration-300 transform ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          style={{
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-t-2xl relative">
            <div className="absolute top-4 right-5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold mb-1">Assistente Virtual</h3>
            <p className="text-sm opacity-90">Online agora</p>
          </div>

          {/* Chat Body */}
          <div
            ref={chatBodyRef}
            className="h-80 overflow-y-auto p-5 bg-gray-50 space-y-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
              >
                {message.sender === "bot" && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-gray-800 placeholder-gray-500"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 2.5rem);
            height: 70vh;
            bottom: 5rem;
            right: 1.25rem;
            left: 1.25rem;
          }
        }
      `}</style>
    </>
  )
}
