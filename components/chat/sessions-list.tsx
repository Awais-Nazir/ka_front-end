'use client'

import { Clock3, MessageSquare } from 'lucide-react'
import { useChat } from '@/lib/chat-context'
import { ChatActions } from './chat-actions'

const dateFormat = new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric'})

export function SessionsList({ onChoose, active }: { onChoose: () => void; active: boolean }) {
  const { sessions, currentSessionId, isLoading, selectSession } = useChat()
  return <section className="panel-history" aria-label="Chat history">
    <h2 className="panel-history-title"><Clock3 size={13}/> Recent chats</h2>
    <div className="panel-history-scroll">
      {sessions.length === 0 && <p className="panel-empty">{isLoading ? 'Loading chats...' : 'Your chats will appear here.'}</p>}
      {sessions.slice(0, 12).map(session => {
        const updated = new Date(session.updated_at || session.created_at)
        return <div key={session.id} className="chat-row flex items-center">
          <button type="button" className="panel-thread min-w-0 flex-1"
          title={session.title} aria-current={active && session.id === currentSessionId ? 'true' : undefined}
          onClick={() => { void selectSession(session.id); onChoose() }}>
          <MessageSquare size={14}/><span>{session.title}</span>
          <time dateTime={updated.toISOString()}>{dateFormat.format(updated)}</time>
          </button>
          <ChatActions chat={session}/>
        </div>
      })}
    </div>
  </section>
}
