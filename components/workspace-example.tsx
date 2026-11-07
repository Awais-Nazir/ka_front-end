'use client'

import { useState } from 'react'
import { ArrowUpRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const examples = [
  { question: 'Which ridge changed the most?', answer: 'The northern ridge showed the largest change in elevation across the survey area.', page: 12, quote: 'The northern ridge records the greatest change in elevation.' },
  { question: 'How was elevation recorded?', answer: 'The team took elevation readings at marked stations along the ridge and compared them with the previous survey.', page: 4, quote: 'Elevation was recorded at each marked station and checked against the previous survey.' },
]

export function WorkspaceExample() {
  const [active, setActive] = useState(0)
  const example = examples[active]
  return <Dialog>
    <DialogTrigger asChild><Button variant="outline" className="hero-button">View example <ArrowUpRight/></Button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
      <DialogHeader><DialogTitle className="text-2xl">Alpine field notes</DialogTitle>
        <DialogDescription>Choose a question to explore this sample report.</DialogDescription></DialogHeader>
      <div className="grid gap-2">{examples.map((item, index) => <Button key={item.question} variant={active === index ? 'secondary' : 'outline'} aria-pressed={active === index} onClick={() => setActive(index)} className="h-auto min-h-11 justify-start whitespace-normal text-left">{item.question}</Button>)}</div>
      <div aria-live="polite" className="space-y-4"><p>{example.answer}</p><blockquote className="border-l-2 border-primary bg-muted p-4 text-sm"><p>“{example.quote}”</p><footer className="mt-3 flex items-center gap-2 text-muted-foreground"><FileText size={14}/>Alpine field notes · p. {example.page}</footer></blockquote></div>
    </DialogContent>
  </Dialog>
}
