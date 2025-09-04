'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut, Search, AlertCircle, Key, Mail } from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const { user, signOut, searchCount, canSearch, resetPassword } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleResetPassword = async () => {
    if (!user?.email) return
    
    setResetLoading(true)
    setResetError('')
    setResetMessage('')
    
    try {
      const { error } = await resetPassword(user.email)
      
      if (error) {
        setResetError(error.message)
      } else {
        setResetMessage('Password reset email sent! Check your inbox.')
        setShowResetForm(false)
      }
    } catch {
      setResetError('Failed to send reset email')
    } finally {
      setResetLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent transition-colors"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span className="hidden md:block text-sm font-medium text-foreground">
          {user.user_metadata?.full_name || user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Search Usage</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {searchCount} / 5 searches used
              </span>
              {!canSearch && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">Limit reached</span>
                </div>
              )}
            </div>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  searchCount >= 5 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((searchCount / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          {resetMessage && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400">
              <p className="text-green-800 text-sm">{resetMessage}</p>
            </div>
          )}

          {resetError && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-800 text-sm">{resetError}</p>
            </div>
          )}

          <div className="p-2">
            <button
              onClick={() => setShowResetForm(!showResetForm)}
              className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-900 dark:text-white"
            >
              <Key className="w-4 h-4" />
              <span className="text-sm">Reset Password</span>
            </button>

            {showResetForm && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Reset Password
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  We&apos;ll send a reset link to: <span className="font-medium">{user?.email}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    className="flex-1 bg-primary text-primary-foreground py-1.5 px-3 rounded text-xs hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Email'}
                  </button>
                  <button
                    onClick={() => setShowResetForm(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-900 dark:text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
