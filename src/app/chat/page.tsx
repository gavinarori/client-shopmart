"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, MoreVertical, Phone, Video, ShoppingBag } from "lucide-react"


// Mock data for conversations
const conversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Buyer",
    lastMessage: "Is the red dress still available in size M?",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Mike's Electronics",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Seller",
    lastMessage: "We can offer free shipping on your order",
    time: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Fashion Outlet",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Seller",
    lastMessage: "Thank you for your purchase!",
    time: "2d ago",
    unread: 0,
    online: false,
  },
]

// Mock data for messages
const initialMessages = [
  {
    id: "1",
    sender: "buyer",
    content: "Hi there! I'm interested in the wireless headphones you have listed. Are they still available?",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: "2",
    sender: "seller",
    content: "Hello! Yes, the wireless headphones are still available. They come in black and white colors.",
    timestamp: "10:32 AM",
    read: true,
  },
  {
    id: "3",
    sender: "buyer",
    content: "Great! I'd like to get the black ones. Do they have noise cancellation?",
    timestamp: "10:35 AM",
    read: true,
  },
  {
    id: "4",
    sender: "seller",
    content:
      "Yes, they feature active noise cancellation and have up to 20 hours of battery life. They're one of our most popular items!",
    timestamp: "10:38 AM",
    read: true,
  },
  {
    id: "5",
    sender: "seller",
    content: "I can also offer you a 10% discount if you purchase today.",
    timestamp: "10:39 AM",
    read: true,
  },
]

// Product mock data
const product = {
  id: "p1",
  name: "Premium Wireless Headphones",
  price: "$129.99",
  image: "/placeholder.svg?height=80&width=80",
  description: "Noise cancelling, 20hr battery life, premium sound quality",
}

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Add new message to the chat
    const message = {
      id: Date.now().toString(),
      sender: "buyer",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate seller typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate seller response
      const response = {
        id: (Date.now() + 1).toString(),
        sender: "seller",
        content: "Thanks for your message! I'll get back to you shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const handleShareProduct = () => {
    const productMessage = {
      id: Date.now().toString(),
      sender: "buyer",
      content: `I'm interested in this product: ${product.name} - ${product.price}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      product: product,
    }

    setMessages([...messages, productMessage])

  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with conversations */}
      <div className="hidden md:flex md:w-80 flex-col border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="buyers" className="flex-1">
                Buyers
              </TabsTrigger>
              <TabsTrigger value="sellers" className="flex-1">
                Sellers
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer  ${
                    activeConversation.id === conversation.id ? "bg-blue-500" : ""
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 "></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs ">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm  truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="buyers" className="m-0">
            <div className="space-y-1 p-2">
              {conversations
                .filter((c) => c.role === "Buyer")
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-gray-100 ${
                      activeConversation.id === conversation.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs ">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm  truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="sellers" className="m-0">
            <div className="space-y-1 p-2">
              {conversations
                .filter((c) => c.role === "Seller")
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-gray-100 ${
                      activeConversation.id === conversation.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs ">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm  truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
              <AvatarFallback>{activeConversation.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{activeConversation.name}</h2>
              <div className="flex items-center gap-1">
                <span
                  className={`h-2 w-2 rounded-full ${activeConversation.online ? "bg-green-500" : "bg-gray-300"}`}
                ></span>
                <span className="text-xs ">{activeConversation.online ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 ">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "buyer" ? "bg-blue-500 text-white" : "bg-background  border"
                  }`}
                >
                  {/* If message contains product info */}
                  {"product" in message && (
                    <Card className="mb-2 ">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm ">{product.description}</p>
                            <p className="font-bold">{product.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${message.sender === "buyer" ? "text-blue-100" : ""}`}>
                    {message.timestamp} {message.read && message.sender === "buyer" && "✓✓"}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">800
                <div className="max-w-[80%] rounded-lg p-3 bg-background border">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" onClick={handleShareProduct}>
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

