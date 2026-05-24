'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard/documents')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">AI Knowledge Assistant</h1>
            <p className="text-xl text-muted-foreground">
              Upload your documents and have AI conversations about your knowledge base
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">📄 Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Easily upload PDFs, documents, and files to build your knowledge base
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">🤖 AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get instant insights and analysis powered by advanced AI models
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">💬 Chat Interface</h3>
              <p className="text-sm text-muted-foreground">
                Natural conversations with AI, grounded in your documents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
