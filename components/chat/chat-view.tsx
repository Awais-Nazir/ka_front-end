'use client'

import { useChat } from '@/lib/chat-context'
import { useEffect, useRef } from 'react'
import { ChatMessage } from './message'
import { MessageInput } from './message-input'

export function ChatView() {
  const { messages, currentSessionId, isMessageLoading, sendMessage, fetchMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId)
    }
  }, [currentSessionId, fetchMessages])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (currentSessionId) {
      await sendMessage(currentSessionId, content)
    }
  }

  if (!currentSessionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No chat selected</h2>
          <p className="text-muted-foreground">Create or select a chat to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Start a conversation by asking a question about your documents</p>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}

          {isMessageLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                A
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} isLoading={isMessageLoading} />
    </div>
  )
}
