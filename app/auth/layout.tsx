import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Brand } from '@/components/brand'
import { FieldFigure } from '@/components/field-figure'

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return <>
    <header className="site-header"><div className="site-wrap header-inner justify-between"><Brand/><Link href="/" className="inline-flex items-center gap-2 py-3 text-sm"><ArrowLeft size={15}/> Back to home</Link></div></header>
    <main className="auth-shell site-wrap"><div className="auth-form">{children}</div><FieldFigure/></main>
  </>
}
