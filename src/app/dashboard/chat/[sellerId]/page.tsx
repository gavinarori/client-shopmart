import { Suspense } from "react"
import ChatClient from "./chat-client"

export default async  function ChatPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params
  return (
    <div className="container mx-auto py-8">
    
      <Suspense fallback={<ChatSkeleton />}>
        <ChatClient sellerId={sellerId} />
      </Suspense>
    </div>
  )
}

function ChatSkeleton() {
  return (
    <div className="bg-white p-3 rounded-md shadow-md animate-pulse h-[calc(100vh-150px)]">
      <div className="w-full flex relative">
        <div className="hidden md:block w-[230px] bg-gray-200 h-full"></div>
        <div className="flex-1 pl-4">
          <div className="h-[50px] bg-gray-200 mb-4 rounded"></div>
          <div className="h-[calc(100%-120px)] w-full bg-gray-200 rounded-md"></div>
          <div className="h-[50px] bg-gray-200 mt-4 rounded"></div>
        </div>
      </div>
    </div>
  )
}
