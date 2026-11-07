'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, SquarePen } from 'lucide-react'
import { Brand } from '@/components/brand'
import { ChatSearch } from '@/components/chat/chat-search'
import { SessionsList } from '@/components/chat/sessions-list'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/lib/auth-context'
import { useChat } from '@/lib/chat-context'

export function DashboardNav() {
  const { user, logout } = useAuth()
  const { fetchSessions, startDraft } = useChat()
  const pathname = usePathname()
  const router = useRouter()
  const mobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const compact = collapsed && !mobile
  const toggleLabel = compact ? "Expand sidebar" : "Collapse sidebar"
  const name = user?.full_name?.trim() || user?.email || 'Account'
  const initials = name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()

  useEffect(() => { void fetchSessions() }, [fetchSessions])

  function showChat() {
    setOpen(false)
    if (pathname !== '/dashboard/chat') router.push('/dashboard/chat')
  }

  const panel = <aside className="workspace-panel" data-compact={compact} aria-label="Workspace sidebar">
    <div className="panel-brand">
      {!compact && <Brand/>}
      {!mobile && <button className="panel-toggle" aria-label={toggleLabel} title={toggleLabel}
        aria-expanded={!compact} onClick={() => setCollapsed(value => !value)}>
        {compact ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}
      </button>}
    </div>
    <nav className="panel-links" aria-label="Workspace navigation">
      <button aria-label="New chat" title="New chat" onClick={() => { startDraft(); showChat() }}>
        <SquarePen size={17}/><span>New chat</span>
      </button>
      <ChatSearch onChoose={showChat}>
        <button aria-label="Chats" title="Search chats"><Search size={17}/><span>Chats</span></button>
      </ChatSearch>
      <Link aria-label="Document library" title="Document library" href="/dashboard/documents"
        onClick={() => setOpen(false)} aria-current={pathname === '/dashboard/documents' ? 'page' : undefined}>
        <BookOpen size={17}/><span>Document library</span>
      </Link>
    </nav>
    {!compact && <SessionsList onChoose={showChat} active={pathname === '/dashboard/chat'}/>}
    <footer className="panel-account">
      <span className="panel-avatar" aria-hidden="true">{initials}</span>
      <div><strong title={name}>{name}</strong>{user?.email && name !== user.email && <small title={user.email}>{user.email}</small>}</div>
      <Button variant="ghost" size="icon" className="panel-signout" aria-label="Sign out" title="Sign out"
        onClick={() => { logout(); router.replace('/auth/login') }}><LogOut size={16}/></Button>
    </footer>
  </aside>

  if (!mobile) return panel
  return <header className="panel-mobile-bar">
    <Brand/>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><Button variant="ghost" className="h-11 gap-2"><Menu/>Workspace</Button></SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="workspace-drawer">
        <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
        {panel}
      </SheetContent>
    </Sheet>
  </header>
}
