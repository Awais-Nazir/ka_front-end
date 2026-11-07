'use client'

import { useState, type ReactElement } from 'react'
import { MessageSquare, Search } from 'lucide-react'
import { useChat } from '@/lib/chat-context'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ChatActions } from './chat-actions'

export function ChatSearch({ children, onChoose }: { children: ReactElement; onChoose: () => void }) {
  const { sessions, isLoading, selectSession, currentSessionId } = useChat()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const term = query.trim().toLocaleLowerCase()
  const matches = sessions.filter(chat => chat.title.toLocaleLowerCase().includes(term))

  return <Dialog open={open} onOpenChange={value => { setOpen(value); setQuery('') }}>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent aria-describedby={undefined} className="gap-3 sm:max-w-xl">
      <DialogTitle className="font-serif text-2xl">Chats</DialogTitle>
      <div className="relative">
        <Search aria-hidden="true" size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"/>
        <Input className="h-11 pl-9" value={query} onChange={event => setQuery(event.target.value)}
          aria-label="Search chats by title" placeholder="Search chats by title"/>
      </div>
      <div className="max-h-[50dvh] min-h-20 overflow-y-auto">
        {matches.map(chat => <div key={chat.id} className="chat-row flex items-center">
          <button title={chat.title}
          aria-current={chat.id === currentSessionId ? 'true' : undefined}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-md px-3 text-left text-sm hover:bg-muted aria-current:bg-secondary"
          onClick={() => { void selectSession(chat.id); setOpen(false); setQuery(''); onChoose() }}>
          <MessageSquare size={15} className="shrink-0 text-muted-foreground"/>
          <span className="truncate">{chat.title}</span>
          </button>
          <ChatActions chat={chat}/>
        </div>)}
        {!matches.length && <p role="status" className="p-3 text-sm text-muted-foreground">
          {isLoading ? 'Loading chats...' : term ? 'No matching chats.' : 'No saved chats yet.'}
        </p>}
      </div>
    </DialogContent>
  </Dialog>
}
