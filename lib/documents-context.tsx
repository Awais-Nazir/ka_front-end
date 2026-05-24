'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { getApiClient, handleApiError } from './api'
import { toast } from 'sonner'

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'

export interface Document {
  id: string
  filename: string
  original_name: string
  mime_type: string
  file_size: number
  status: DocumentStatus
  error_message: string | null
  chunk_count: number
  created_at: string
  updated_at: string
}

export interface DocumentsContextType {
  documents: Document[]
  isLoading: boolean
  fetchDocuments: () => Promise<void>
  uploadDocument: (file: File) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true)
    try {
      const api = getApiClient()
      const response = await api.get('/documents', { params: { page: 1, page_size: 100 } })
      setDocuments(response.data.items || [])
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to fetch documents:', apiError)
      toast.error('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadDocument = useCallback(async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const api = getApiClient()
      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const newDocument: Document = response.data
      setDocuments((prev) => [newDocument, ...prev])
      toast.success(`${file.name} uploaded successfully`)
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to upload document:', apiError)
      toast.error(apiError.message || 'Failed to upload document')
    }
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    try {
      const api = getApiClient()
      await api.delete(`/documents/${id}`)

      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
      toast.success('Document deleted')
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('[v0] Failed to delete document:', apiError)
      toast.error(apiError.message || 'Failed to delete document')
    }
  }, [])

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        isLoading,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (!context) {
    throw new Error('useDocuments must be used within DocumentsProvider')
  }
  return context
}
