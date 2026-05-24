import { ProtectedRoute } from '@/lib/protected-route'
import { DashboardNav } from '@/components/dashboard/nav'

export const metadata = {
  title: 'Dashboard - AI Knowledge Assistant',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <DashboardNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
