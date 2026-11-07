'use client'

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react'
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
  fetchSessions: () => Promise<ChatSession[]>
  draftVersion: number
  startDraft: () => void
  renameSession: (id: string, title: string) => Promise<void>
  deleteSession: (id: string) => Promise<void>

  selectSession: (id: string) => Promise<void>
  fetchMessages: (sessionId: string) => Promise<void>
  sendMessage: (sessionId: string | null, content: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMessageLoading, setIsMessageLoading] = useState(false)

  const [draftVersion, setDraftVersion] = useState(0)
  const messageRequest = useRef(0)
  const selectedId = useRef<string | null>(null)

  const fetchSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const api = getApiClient()
      const items: ChatSession[] = []
      let page = 1
      while (true) {
        const { data } = await api.get('/chat/sessions', { params: { page, page_size: 100 } })
        items.push(...data.items)
        const hasMore = data.has_next ?? items.length < data.total
        if (!hasMore || !data.items.length) break
        page += 1
      }
      setSessions(items)
      return items
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to fetch sessions:', apiError)
      toast.error('Failed to load chat sessions')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startDraft = useCallback(() => {
    messageRequest.current++
    selectedId.current = null
    setCurrentSessionId(null)
    setMessages([])
    setIsMessageLoading(false)
    setDraftVersion(version => version + 1)
  }, [])

  const selectSession = useCallback(async (id: string) => {
    if (id === currentSessionId) return
    messageRequest.current++
    selectedId.current = id
    setMessages([])
    setCurrentSessionId(id)
  }, [currentSessionId])

  async function renameSession(id: string, title: string) {
    const { data } = await getApiClient().patch<ChatSession>(`/chat/sessions/${id}`, { title })
    setSessions(items => items.map(item => item.id === id ? data : item))
  }

  async function deleteSession(id: string) {
    await getApiClient().delete(`/chat/sessions/${id}`)
    setSessions(items => items.filter(item => item.id !== id))
    if (selectedId.current === id) startDraft()
  }

  const fetchMessages = useCallback(async (sessionId: string) => {
    const request = ++messageRequest.current
    setIsMessageLoading(true)
    try {
      const api = getApiClient()
      const response = await api.get(`/chat/sessions/${sessionId}`)
      if (request === messageRequest.current) setMessages(response.data.messages || [])
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to fetch messages:', apiError)
      if (request === messageRequest.current) toast.error('Failed to load messages')
    } finally {
      if (request === messageRequest.current) setIsMessageLoading(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (sessionId: string | null, content: string) => {
      const request = messageRequest.current
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
        await api.post('/chat', {
          message: content,
          session_id: sessionId,
        })

        if (sessionId) {
          if (request === messageRequest.current) await fetchMessages(sessionId)
        } else {
          // The stream has no session ID. Reconcile the new entry from history.
          const existing = new Set(sessions.map(session => session.id))
          const refreshed = await fetchSessions()
          if (request !== messageRequest.current) return
          const created = refreshed.filter(session => !existing.has(session.id))
          if (created.length === 1) {
            selectedId.current = created[0].id
            setCurrentSessionId(created[0].id)
          } else {
            startDraft()
            toast.info('Message sent. Open the conversation from Recent chats.')
          }
        }
      } catch (error) {
        const apiError = handleApiError(error)
        console.error('[v0] Failed to send message:', apiError)
        toast.error(apiError.message || 'Failed to send message')
        // Remove the optimistic message on error
        if (request === messageRequest.current) setMessages((prev) => prev.slice(0, -1))
        throw error
      } finally {
        if (request === messageRequest.current) setIsMessageLoading(false)
      }
    },
    [fetchMessages, fetchSessions, sessions, startDraft]
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
        draftVersion,
        startDraft,
        renameSession,
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
