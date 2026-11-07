'use client'

import { useRef, useState } from 'react'
import { useDocuments } from '@/lib/documents-context'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export function UploadArea() {
  const { uploadDocument } = useDocuments()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    setIsUploading(true)
    try {
      await uploadDocument(file)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`rounded-lg border border-dashed px-4 py-8 sm:p-10 text-center transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 bg-card'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.docx,.doc"
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />

      <Upload className="w-9 h-9 mx-auto text-primary mb-4" />

      <h3 className="font-semibold mb-2">Upload a document</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Drop a file here or choose one from your device.
      </p>

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        variant="outline"
      >
        {isUploading ? 'Uploading...' : 'Choose file'}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Supported formats: PDF, TXT, DOCX, DOC
      </p>
    </div>
  )
}
