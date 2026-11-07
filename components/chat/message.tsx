'use client'

import { Message, Citation } from '@/lib/chat-context'
import { FileText } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
      <div className={cn('min-w-0 max-w-2xl', !isUser && 'w-full')}>
        <div
          className={cn(
            'rounded-lg px-4 py-3 break-words',
            isUser
              ? 'whitespace-pre-wrap bg-primary text-primary-foreground'
              : 'chat-markdown bg-muted/50 text-foreground'
          )}
        >
          {isUser ? message.content : (
            <Markdown remarkPlugins={[remarkGfm]} components={{
              table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div>,
            }}>
              {message.content}
            </Markdown>
          )}
        </div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.citations.map((citation: Citation, idx: number) => (
              <Popover key={idx}><PopoverTrigger asChild><button
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
                aria-label={`Read citation from ${citation.document_name}`}
              >
                <FileText size={13}/>
                <span className="truncate max-w-[120px]">{citation.document_name}</span>
                {citation.page_number && <span className="text-muted-foreground">p{citation.page_number}</span>}
              </button></PopoverTrigger><PopoverContent className="max-w-[85vw] text-sm"><strong className="break-words">{citation.document_name}</strong><p className="mt-2 break-words">{citation.content_preview}</p></PopoverContent></Popover>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
