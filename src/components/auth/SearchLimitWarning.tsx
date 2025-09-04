'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AlertTriangle, Search } from 'lucide-react'

export default function SearchLimitWarning() {
  const { searchCount, canSearch } = useAuth()

  if (canSearch && searchCount < 4) return null

  return (
    <div className={`p-4 rounded-lg border ${
      !canSearch 
        ? 'bg-destructive/10 border-destructive/20 text-destructive' 
        : 'bg-warning/10 border-warning/20 text-warning'
    }`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <div className="flex-1">
          <h3 className="font-medium">
            {!canSearch ? 'Search Limit Reached' : 'Search Limit Warning'}
          </h3>
          <p className="text-sm mt-1">
            {!canSearch 
              ? 'You have used all 5 of your free searches. Please contact support to continue.'
              : `You have ${5 - searchCount} search${5 - searchCount === 1 ? '' : 'es'} remaining.`
            }
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Search className="w-4 h-4" />
          <span className="text-sm font-medium">{searchCount}/5</span>
        </div>
      </div>
    </div>
  )
}
