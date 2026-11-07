'use client'

import { useDocuments } from '@/lib/documents-context'
import { useEffect, useState } from 'react'
import { StatusBadge } from './status-badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function DocumentsTable() {
  const { documents, isLoading, deleteDocument, fetchDocuments } = useDocuments()
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null)


  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Poll for document status updates
  useEffect(() => {
    if (!documents.some(doc => doc.status === 'PENDING' || doc.status === 'PROCESSING')) return
    const interval = setInterval(fetchDocuments, 3000)
    return () => clearInterval(interval)
  }, [documents, fetchDocuments])
  const handleDelete = async (id: string) => {
    await deleteDocument(id)
    setDeleteDocId(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (isLoading && documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-center py-10">
        <p className="text-muted-foreground">No documents uploaded yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your first document using the form above
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="document-table w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold">Filename</th>
                <th className="text-left p-4 font-semibold">Size</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Uploaded</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium [overflow-wrap:anywhere]">{doc.original_name || doc.filename}</td>
                  <td className="p-4 text-muted-foreground">
                    {formatFileSize(doc.file_size)}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={doc.status} errorMessage={doc.error_message ?? undefined} />
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Delete ${doc.original_name || doc.filename}`}
                      onClick={() => setDeleteDocId(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteDocId} onOpenChange={(open) => !open && setDeleteDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 text-white hover:bg-red-800"
              onClick={() => deleteDocId && handleDelete(deleteDocId)}
            >
              Delete document
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
