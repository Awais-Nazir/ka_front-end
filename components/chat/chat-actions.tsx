'use client'

import { useRef, useState } from 'react'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useChat, type ChatSession } from '@/lib/chat-context'

export function ChatActions({ chat }: { chat: ChatSession }) {
  const { renameSession, deleteSession } = useChat()
  const trigger = useRef<HTMLButtonElement>(null)
  const [action, setAction] = useState<'rename' | 'delete' | null>(null)
  const [title, setTitle] = useState(chat.title)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const renaming = action === 'rename'

  function open(next: 'rename' | 'delete') {
    setTitle(chat.title)
    setError('')
    setAction(next)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (busy || (renaming && !title.trim())) return
    setBusy(true)
    setError('')
    try {
      if (renaming) await renameSession(chat.id, title.trim())
      else await deleteSession(chat.id)
      setAction(null)
      toast.success(renaming ? 'Chat renamed' : 'Chat deleted')
    } catch {
      setError(renaming ? 'Could not rename this chat. Try again.' : 'Could not delete this chat. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button ref={trigger} type="button" aria-label={`Options for ${chat.title}`}
          className="chat-options grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted max-md:size-11">
          <Ellipsis size={16}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onCloseAutoFocus={event => { if (action) event.preventDefault() }}>
        <DropdownMenuItem onSelect={() => open('rename')}><Pencil/>Rename</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={() => open('delete')}><Trash2/>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={action !== null} onOpenChange={value => { if (!value && !busy) setAction(null) }}>
      <DialogContent {...(renaming ? { 'aria-describedby': undefined } : {})}
        onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus() }}>
        <DialogTitle>{renaming ? 'Rename chat' : 'Delete chat?'}</DialogTitle>
        <form onSubmit={submit} className="grid gap-4">
          {renaming ? <Input aria-label="Chat title" maxLength={500} value={title} disabled={busy}
            onFocus={event => event.target.select()} onChange={event => setTitle(event.target.value)}/>
            : <DialogDescription className="break-words">Deleting “{chat.title}” permanently removes this chat and its messages.</DialogDescription>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={busy} onClick={() => setAction(null)}>Cancel</Button>
            <Button type="submit" className={renaming ? undefined : 'bg-red-700 text-white hover:bg-red-800'}
              disabled={busy || (renaming && !title.trim())}>
              {renaming ? 'Save name' : 'Delete chat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </>
}
