'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Files, MessageSquareText, ScanText } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Brand } from '@/components/brand'
import { FieldFigure } from '@/components/field-figure'
import { WorkspaceExample } from '@/components/workspace-example'

const workflow = [
  { icon: Files, title: 'Build your library', text: 'Bring reports, papers, and notes together in one document workspace.' },
  { icon: MessageSquareText, title: 'Ask in plain language', text: 'Start a conversation with your files and follow up as you read.' },
  { icon: ScanText, title: 'Trace the source', text: 'Follow citations back to the passages behind each answer.' },
]
const questions = [
  ['Which files can I upload?', 'Upload PDF, DOCX, DOC, and plain text files from the document library.'],
  ['Where do the answers come from?', 'Folio uses the documents in your workspace to answer questions. When a response includes citations, you can inspect the supporting excerpt.'],
  ['Can I revisit a conversation?', 'Yes. Open Chats in your workspace and select a previous conversation to continue where you left off.'],
]

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard/documents')
  }, [isAuthenticated, isLoading, router])
  return <div className="site">
    <header className="site-header"><div className="site-wrap header-inner">
      <Brand/><nav aria-label="Main navigation"><a href="#workflow">How it works</a><a href="#questions">FAQ</a></nav>
      <div className="header-actions"><Link href="/auth/login">Sign in</Link><Button asChild className="header-cta"><Link href="/auth/register">Get started <ArrowUpRight/></Link></Button></div>
    </div></header>
    <main>
      <section className="site-wrap hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/>DOCUMENT INTELLIGENCE</div>
          <h1>Your documents,<br/><em>in conversation.</em></h1>
          <p>Bring your documents into one workspace. Ask questions, find connections, and get answers you can trace to the source.</p>
          <div className="hero-actions"><Button asChild className="hero-button"><Link href="/auth/register">Create workspace <ArrowRight/></Link></Button><WorkspaceExample/></div>
          <div className="file-types"><Files size={16}/> PDF <i/> DOCX <i/> DOC <i/> TXT</div>
        </div>
        <FieldFigure/>
      </section>
      <section className="workflow" id="workflow"><div className="site-wrap">
        <div className="section-intro"><div className="eyebrow"><span className="eyebrow-line"/>THE WORKFLOW</div><h2>From file to finding.</h2></div>
        <div className="workflow-grid">{workflow.map(({icon: Icon, title, text}, index) => <article key={title}><div className="step-top"><Icon size={21}/><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>
      <section className="site-wrap faq" id="questions"><h2>Common questions.</h2><Accordion type="single" collapsible>{questions.map(([q,a]) => <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion></section>
    </main>
    <footer className="site-footer"><div className="site-wrap"><Brand/><Link href="/auth/login">Sign in <ArrowUpRight size={14}/></Link></div></footer>
  </div>
}
