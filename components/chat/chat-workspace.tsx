'use client'

import { MessagesSquare } from 'lucide-react'
import { useChat } from '@/lib/chat-context'
import { ChatView } from './chat-view'

export function ChatWorkspace() {
  const { sessions, currentSessionId } = useChat()
  const session = sessions.find(item => item.id === currentSessionId)
  return <div className="flex h-full min-h-0 flex-col">
    <header className="thread-header">
      <MessagesSquare size={17}/>
      {session ? <><span>Chats</span><i aria-hidden="true">/</i><h1>{session.title}</h1></> : <h1>Document chat</h1>}
    </header>
    <ChatView/>
  </div>
}
