import { UploadArea } from '@/components/documents/upload-area'
import { DocumentsTable } from '@/components/documents/documents-table'

export const metadata = {
  title: 'Documents - AI Knowledge Assistant',
}

export default function DocumentsPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b bg-muted/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your documents for analysis
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Upload Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Upload New Document</h2>
              <UploadArea />
            </div>

            {/* Documents List */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
              <DocumentsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
