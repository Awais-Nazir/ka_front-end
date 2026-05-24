import { SessionsList } from '@/components/chat/sessions-list'
import { ChatView } from '@/components/chat/chat-view'

export const metadata = {
  title: 'Chat - AI Knowledge Assistant',
}

export default function ChatPage() {
  return (
    <div className="flex h-full">
      <div className="w-64 hidden lg:flex">
        <SessionsList />
      </div>
      <ChatView />
    </div>
  )
}
