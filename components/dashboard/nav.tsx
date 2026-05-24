'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, MessageSquare, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export function DashboardNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { label: 'Documents', href: '/dashboard/documents', icon: FileText },
    { label: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-muted rounded-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 border-r bg-muted/30 flex flex-col transition-all duration-200 ${
          isMobileOpen ? 'fixed left-0 top-0 h-screen z-30' : 'hidden md:flex'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden absolute top-4 right-4"
          >
            ✕
          </button>
          <h1 className="font-bold text-lg">Knowledge AI</h1>
          <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
