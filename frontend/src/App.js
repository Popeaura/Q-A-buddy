"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Send, RotateCcw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isChatActive, setIsChatActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  // Show welcome message on first render
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "1",
      sender: "bot",
      text: "👋 Welcome to TechBuddy!\n\nI can help you with:\n• AI and Machine Learning\n• Scratch Programming\n• Web Development\n• Robotics\n• EA Sports\n• MIT App Inventor\n\nTo quit, type 'quit', 'exit', or 'bye'.",
      timestamp: new Date(),
      status: "sent",
    }
    setMessages([welcomeMessage])
  }, [])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleSend = async () => {
    if (!isChatActive || !input.trim() || isLoading) return

    const userInput = input.trim()
    const userMessage: Message = {
      id: generateId(),
      sender: "user",
      text: userInput,
      timestamp: new Date(),
      status: "sent",
    }

    setInput("")
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Simulate typing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInput }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const botReply = await response.text()
      setIsTyping(false)

      const botMessage: Message = {
        id: generateId(),
        sender: "bot",
        text: botReply === "quit" ? "👋 Goodbye! Thanks for chatting with TechBuddy." : botReply,
        timestamp: new Date(),
        status: "sent",
      }

      setMessages((prev) => [...prev, botMessage])

      if (botReply === "quit") {
        setIsChatActive(false)
      }
    } catch (error) {
      setIsTyping(false)
      const errorMessage: Message = {
        id: generateId(),
        sender: "bot",
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
        status: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const restartChat = () => {
    setMessages([
      {
        id: generateId(),
        sender: "bot",
        text: "👋 Welcome back to TechBuddy! How can I help you today?",
        timestamp: new Date(),
        status: "sent",
      },
    ])
    setIsChatActive(true)
    setInput("")
    inputRef.current?.focus()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-500 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">TechBuddy</CardTitle>
                <p className="text-sm text-muted-foreground">{isChatActive ? "Online" : "Chat ended"}</p>
              </div>
            </div>
            {!isChatActive && (
              <Button onClick={restartChat} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300",
                    message.sender === "user" && "flex-row-reverse space-x-reverse",
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback
                      className={cn(message.sender === "user" ? "bg-green-500 text-white" : "bg-blue-500 text-white")}
                    >
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn("flex flex-col space-y-1 max-w-[80%]", message.sender === "user" && "items-end")}>
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm",
                        message.sender === "user" ? "bg-blue-500 text-white" : "bg-muted",
                      )}
                    >
                      {formatMessageText(message.text)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatTime(message.timestamp)}</span>
                      {message.status === "error" && (
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <Separator />

        <div className="p-4">
          {isChatActive ? (
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                The chat has ended. Click restart to begin a new conversation.
              </p>
              <Button onClick={restartChat} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
