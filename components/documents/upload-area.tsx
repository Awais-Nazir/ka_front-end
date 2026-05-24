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
      className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 bg-muted/30'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />

      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />

      <h3 className="font-semibold mb-2">Upload a document</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Drag and drop your file here, or click to browse
      </p>

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        variant="outline"
      >
        {isUploading ? 'Uploading...' : 'Choose File'}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Supported formats: PDF, TXT, DOCX, DOC
      </p>
    </div>
  )
}
