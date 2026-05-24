'use client'

import { Message, Citation } from '@/lib/chat-context'
import { cn } from '@/lib/utils'

interface MessageProps {
  message: Message
}

export function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-4 mb-6', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? 'Y' : 'A'}
      </div>

      {/* Content */}
      <div className={cn('max-w-2xl', !isUser && 'w-full')}>
        <div
          className={cn(
            'rounded-lg px-4 py-3 whitespace-pre-wrap break-words',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-foreground'
          )}
        >
          {message.content}
        </div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.citations.map((citation: Citation, idx: number) => (
              <button
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
                title={citation.content_preview}
              >
                <span className="text-muted-foreground">📄</span>
                <span className="truncate max-w-[120px]">{citation.document_name}</span>
                {citation.page_number && <span className="text-muted-foreground">p{citation.page_number}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
