'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ReportForm from '@/components/reports/ReportForm'

export default function NewReport() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] fade-in-up">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-4 fade-in-up">
      <ReportForm />
    </div>
  )
}
