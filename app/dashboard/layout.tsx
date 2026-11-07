import { ProtectedRoute } from '@/lib/protected-route'
import { DashboardNav } from '@/components/dashboard/nav'

export const metadata = {title: 'Workspace · Folio'}
export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return <ProtectedRoute><div className="flex h-dvh flex-col md:flex-row"><DashboardNav/><main className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</main></div></ProtectedRoute>
}
