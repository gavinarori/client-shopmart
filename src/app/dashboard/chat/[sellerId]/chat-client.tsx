"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { io } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, MoreVertical, Phone, Video, ShoppingBag } from "lucide-react"
import { add_friend, send_message, updateMessage, messageClear } from "@/store/reducers/chatReducer"

// Initialize socket outside component to prevent multiple connections
let socket: any

export default function ChatClient({ sellerId }: { sellerId: string }) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<any>()
  const router = useRouter()

  // Local state
  const [text, setText] = useState("")
  const [receverMessage, setReceverMessage] = useState<any>(null)
  const [activeSeller, setActiveSeller] = useState<any[]>([])
  const [socketInitialized, setSocketInitialized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Redux state
  const { userInfo } = useSelector((state: any) => state.auth)
  const { fd_messages, currentFd, my_friends, successMessage } = useSelector((state: any) => state.chat)

  // Initialize socket connection
  useEffect(() => {
    if (!socketInitialized && userInfo?.id) {
      // Initialize socket
      socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")

      // Add user to socket
      socket.emit("add_user", userInfo.id, userInfo)

      // Listen for messages and active sellers
      socket.on("seller_message", (msg: any) => {
        setReceverMessage(msg)
      })

      socket.on("activeSeller", (sellers: any[]) => {
        setActiveSeller(sellers)
      })

      setSocketInitialized(true)

      // Clean up socket on unmount
      return () => {
        socket.disconnect()
      }
    }
  }, [userInfo, socketInitialized])

  // Add friend when sellerId changes
  useEffect(() => {
    if (sellerId && userInfo?.id) {
      dispatch(
        add_friend({
          sellerId: sellerId,
          userId: userInfo.id,
        }),
      )
    }
  }, [sellerId, userInfo, dispatch])

  // Send message to socket when message is sent successfully
  useEffect(() => {
    if (successMessage && fd_messages.length > 0) {
      socket.emit("send_customer_message", fd_messages[fd_messages.length - 1])
      dispatch(messageClear())
    }
  }, [successMessage, fd_messages, dispatch])

  // Handle received messages
  useEffect(() => {
    if (receverMessage) {
      if (sellerId === receverMessage.senderId && userInfo?.id === receverMessage.receverId) {
        dispatch(updateMessage(receverMessage))
      } else {
        toast.success(receverMessage.senderName + " " + "sent a message")
        dispatch(messageClear())
      }
    }
  }, [receverMessage, sellerId, userInfo, dispatch])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [fd_messages])

  // Send message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (text && userInfo?.id && currentFd) {
      dispatch(
        send_message({
          userId: userInfo.id,
          text,
          sellerId: currentFd.fdId,
          name: userInfo.name,
        }),
      )
      setText("")
    }
  }

  // Share product handler (placeholder)
  const handleShareProduct = () => {
    toast.info("Product sharing feature coming soon!")
  }

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo?.id) {
      router.push("/login")
    }
  }, [userInfo, router])

  if (!userInfo?.id) {
    return <div className="text-center py-8">Please log in to chat with sellers</div>
  }

  // Format friends for display
  const formattedFriends = my_friends.map((friend: any) => ({
    id: friend.fdId,
    name: friend.name,
    avatar: "/placeholder.svg",
    lastMessage: "Click to view conversation",
    time: "Now",
    unread: 0,
    online: activeSeller.some((seller) => seller.sellerId === friend.fdId),
    role: "Seller", 
  }))

  return (
    <div className="flex h-[calc(100vh-150px)] bg-background rounded-lg border shadow-sm">
      {/* Sidebar with conversations */}
      <div className="hidden md:flex md:w-80 flex-col border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1" onClick={() => setActiveTab("all")}>
                All
              </TabsTrigger>
              <TabsTrigger value="sellers" className="flex-1" onClick={() => setActiveTab("sellers")}>
                Sellers
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <div className="space-y-1 p-2">
              {formattedFriends.length > 0 ? (
                formattedFriends.map((friend:any) => (
                  <Link href={`/dashboard/chat/${friend.id}`} key={`friend-${friend.id}`}>
                    <div
                      className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-blue-500 ${
                        currentFd?.fdId === friend.id ? "bg-background" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        {friend.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{friend.name}</h3>
                          <span className="text-xs ">{friend.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm  truncate">{friend.lastMessage}</p>
                          {friend.unread > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {friend.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center ">No conversations yet</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sellers" className="m-0">
            <div className="space-y-1 p-2">
              {formattedFriends.filter((f:any) => f.role === "Seller").length > 0 ? (
                formattedFriends
                  .filter((f:any) => f.role === "Seller")
                  .map((friend:any) => (
                    <Link href={`/dashboard/chat/${friend.id}`} key={`seller-${friend.id}`}>
                      <div
                        className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-blue-500 ${
                          currentFd?.fdId === friend.id ? "bg-background" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                          </Avatar>
                          {friend.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{friend.name}</h3>
                            <span className="text-xs ">{friend.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm  truncate">{friend.lastMessage}</p>
                            {friend.unread > 0 && (
                              <Badge variant="destructive" className="ml-auto">
                                {friend.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <div className="p-4 text-center ">No sellers found</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-background">
        {currentFd ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b bg-background">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={currentFd.name} />
                  <AvatarFallback>{currentFd.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{currentFd.name}</h2>
                  <div className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        activeSeller.some((seller) => seller.sellerId === currentFd.fdId)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span className="text-xs ">
                      {activeSeller.some((seller) => seller.sellerId === currentFd.fdId) ? "Online" : "Offline"}
                    </span>
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
            <div className="flex-1 overflow-y-auto p-4 bg-background">
              <div className="space-y-4">
                {fd_messages.map((message: any, index: number) => {
                  const isSender = currentFd?.fdId === message.receverId
                  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

                  return (
                    <div
                      key={`${message._id || message.senderId}-${index}`}
                      className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                    >
                      {!isSender && (
                        <Avatar className="mr-2 mt-1">
                          <AvatarImage src="/placeholder.svg" alt={currentFd.name} />
                          <AvatarFallback>{currentFd.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isSender ? "bg-blue-500 text-white" : "bg-white border"
                        }`}
                      >
                        <p>{message.message}</p>
                        <div className={`text-xs mt-1 ${isSender ? "text-blue-100" : ""}`}>
                          {timestamp} {isSender && "✓✓"}
                        </div>
                      </div>
                      {isSender && (
                        <Avatar className="ml-2 mt-1">
                          <AvatarImage src="/placeholder.svg" alt={userInfo.name} />
                          <AvatarFallback>{userInfo.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="mr-2 mt-1">
                      <AvatarImage src="/placeholder.svg" alt={currentFd.name} />
                      <AvatarFallback>{currentFd.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-lg p-3 bg-white border">
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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="">Choose a seller from the sidebar to start chatting</p>
              {formattedFriends.length === 0 && (
                <div className="mt-4">
                  <p className=" mb-2">No conversations yet</p>
                  <Button onClick={() => router.push("/")}>Browse Products</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
