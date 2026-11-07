import { UploadArea } from '@/components/documents/upload-area'
import { DocumentsTable } from '@/components/documents/documents-table'

export const metadata = {title: 'Document library · Folio'}
export default function DocumentsPage() {
  return <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-10 sm:py-12">
    <header className="space-y-3"><div className="eyebrow"><span className="eyebrow-line"/>WORKSPACE</div>
      <h1 className="library-title">Document library.</h1>
      <p className="text-muted-foreground">Add the files you want to use in your conversations.</p>
    </header>
    <UploadArea/>
    <section><h2 className="mb-4 text-xl font-medium">Your documents</h2><DocumentsTable/></section>
  </div>
}
