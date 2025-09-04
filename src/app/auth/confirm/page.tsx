'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-auth'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function ConfirmEmailPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || type !== 'signup') {
          setError('Invalid confirmation link')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup'
        })

        if (error) {
          setError(error.message)
        } else {
          setSuccess(true)
          // Redirect to login after successful confirmation
          setTimeout(() => {
            router.push('/auth/login?confirmed=true')
          }, 3000)
        }
      } catch (error) {
        setError('An error occurred during confirmation')
      } finally {
        setLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [searchParams, supabase, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg border border-border p-8 text-center">
          
          {loading && (
            <>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Confirming Email</h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your email address...
              </p>
            </>
          )}

          {success && (
            <>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Email Confirmed!</h1>
              <p className="text-muted-foreground mb-4">
                Your email has been successfully confirmed. You can now log in to your account.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page in 3 seconds...
              </p>
            </>
          )}

          {error && (
            <>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Confirmation Failed</h1>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Register Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
