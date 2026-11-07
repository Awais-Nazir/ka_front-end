'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSend: (message: string) => Promise<void>
  isLoading: boolean
}

export function MessageInput({ onSend, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending || isLoading) return

    setIsSending(true)
    try {
      await onSend(message)
      setMessage('')
    } catch {
      // The provider displays the error. Keep the draft available for retry.
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-muted/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Message"
            placeholder="Ask a question about your documents..."
            disabled={isSending || isLoading}
            rows={1}
            className="min-w-0 max-h-[200px] field-sizing-content flex-1 overflow-y-auto rounded-lg border bg-background px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!message.trim() || isSending || isLoading}
            className="size-11 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="hidden sm:block text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </form>
  )
}
