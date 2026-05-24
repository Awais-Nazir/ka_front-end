'use client'

import { useChat } from '@/lib/chat-context'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export function SessionsList() {
  const { sessions, currentSessionId, fetchSessions, createSession, selectSession, deleteSession } = useChat()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleNewSession = async () => {
    const sessionId = await createSession()
    if (sessionId) {
      await selectSession(sessionId)
    }
  }

  return (
    <div className="h-full flex flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b">
        <Button onClick={handleNewSession} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No chat sessions yet
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group relative p-3 rounded-md cursor-pointer transition-colors',
                  currentSessionId === session.id
                    ? 'bg-primary/10 border border-primary/50'
                    : 'hover:bg-muted'
                )}
              >
                <button
                  onClick={() => selectSession(session.id)}
                  className="w-full text-left flex-1 min-w-0"
                >
                  <p className="font-medium text-sm truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                  </p>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
