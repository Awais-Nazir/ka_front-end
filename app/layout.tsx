import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import './editorial.css'
import { AuthProvider } from '@/lib/auth-context'
import { DocumentsProvider } from '@/lib/documents-context'
import { ChatProvider } from '@/lib/chat-context'

export const metadata: Metadata = {
  title: 'Folio — Your document workspace',
  description: 'Ask questions about your documents and trace answers to their source.',
  icons: { icon: '/folio.svg' },
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="font-sans antialiased">
    <AuthProvider><DocumentsProvider><ChatProvider>{children}<Toaster /></ChatProvider></DocumentsProvider></AuthProvider>
    {process.env.NODE_ENV === 'production' && <Analytics />}
  </body></html>
}
