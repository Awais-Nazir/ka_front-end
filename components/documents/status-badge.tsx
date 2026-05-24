'use client'

import { DocumentStatus } from '@/lib/documents-context'
import { AlertCircle, Clock, CheckCircle, Loader } from 'lucide-react'

interface StatusBadgeProps {
  status: DocumentStatus
  errorMessage?: string
}

export function StatusBadge({ status, errorMessage }: StatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    PROCESSING: {
      label: 'Processing',
      icon: Loader,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    },
    READY: {
      label: 'Ready',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    FAILED: {
      label: 'Failed',
      icon: AlertCircle,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.className}`}>
        <Icon className="w-4 h-4" />
        {status === 'PROCESSING' && (
          <Icon className="w-4 h-4 animate-spin ml-1" />
        )}
        <span>{config.label}</span>
      </div>
      {errorMessage && (
        <span className="text-xs text-red-600 dark:text-red-400" title={errorMessage}>
          {errorMessage.slice(0, 30)}...
        </span>
      )}
    </div>
  )
}
