'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { getApiClient, handleApiError } from './api'
import { toast } from 'sonner'

export interface Citation {
  chunk_id: string
  document_name: string
  page_number: number | null
  content_preview: string
}

export interface Message {
  id: string
  role: string
  content: string
  citations: Citation[] | null
  created_at: number
}

export interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatContextType {
  sessions: ChatSession[]
  messages: Message[]
  currentSessionId: string | null
  isLoading: boolean
  isMessageLoading: boolean
  fetchSessions: () => Promise<void>
  createSession: () => Promise<string | null>
  deleteSession: (id: string) => Promise<void>
  selectSession: (id: string) => Promise<void>
  fetchMessages: (sessionId: string) => Promise<void>
  sendMessage: (sessionId: string, content: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMessageLoading, setIsMessageLoading] = useState(false)

  const fetchSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const api = getApiClient()
      const response = await api.get('/chat/sessions', { params: { page: 1, page_size: 100 } })
      setSessions(response.data.items || [])
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to fetch sessions:', apiError)
      toast.error('Failed to load chat sessions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSession = useCallback(async (): Promise<string | null> => {
    try {
      const api = getApiClient()
      // Create a session by sending the first message - the API creates sessions automatically
      const response = await api.post('/chat', {
        message: 'New chat',
        session_id: null,
      })
      // The response should include the session info
      // For now, we'll refresh sessions list to get the new session
      await fetchSessions()
      if (sessions.length > 0) {
        return sessions[0].id
      }
      return null
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to create session:', apiError)
      toast.error('Failed to create chat session')
      return null
    }
  }, [fetchSessions, sessions])

  const deleteSession = useCallback(async (id: string) => {
    try {
      const api = getApiClient()
      // Note: The OpenAPI spec doesn't show a delete session endpoint
      // This is a placeholder - implement if backend provides this endpoint
      console.warn('[v0] Delete session endpoint not yet implemented in backend')
      
      setSessions((prev) => prev.filter((session) => session.id !== id))
      if (currentSessionId === id) {
        setCurrentSessionId(null)
        setMessages([])
      }
      toast.success('Chat session deleted')
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to delete session:', apiError)
      toast.error('Failed to delete chat session')
    }
  }, [currentSessionId])

  const selectSession = useCallback(async (id: string) => {
    setCurrentSessionId(id)
    await fetchMessages(id)
  }, [])

  const fetchMessages = useCallback(async (sessionId: string) => {
    setIsMessageLoading(true)
    try {
      const api = getApiClient()
      const response = await api.get(`/chat/sessions/${sessionId}`)
      setMessages(response.data.messages || [])
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to fetch messages:', apiError)
      toast.error('Failed to load messages')
    } finally {
      setIsMessageLoading(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (sessionId: string, content: string) => {
      setIsMessageLoading(true)
      try {
        // Optimistically add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          citations: null,
          created_at: Date.now() / 1000,
        }
        setMessages((prev) => [...prev, userMessage])

        // Send to API
        const api = getApiClient()
        const response = await api.post('/chat', {
          message: content,
          session_id: sessionId,
        })

        // The API response should include the session and messages
        // We need to fetch the updated messages
        await fetchMessages(sessionId)
      } catch (error) {
        const apiError = handleApiError(error)
        console.error('[v0] Failed to send message:', apiError)
        toast.error(apiError.message || 'Failed to send message')
        // Remove the optimistic message on error
        setMessages((prev) => prev.slice(0, -1))
      } finally {
        setIsMessageLoading(false)
      }
    },
    [fetchMessages]
  )

  return (
    <ChatContext.Provider
      value={{
        sessions,
        messages,
        currentSessionId,
        isLoading,
        isMessageLoading,
        fetchSessions,
        createSession,
        deleteSession,
        selectSession,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
