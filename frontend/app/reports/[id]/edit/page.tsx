'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import ReportForm from '@/components/reports/ReportForm'

export default function EditReport() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [report, setReport] = useState<any>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user && id) {
      fetchReport()
    }
  }, [user, loading, id, router])

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`)
      setReport(response.data)
    } catch (err: any) {
      console.error('Error fetching report:', err)
      setError('Failed to load report data.')
    } finally {
      setIsLoadingReport(false)
    }
  }

  if (loading || isLoadingReport) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] fade-in-up">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Fetching report details...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4 fade-in-up">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-lg font-bold text-slate-800">Error Loading Report</h3>
        <p className="text-slate-500 text-sm">{error || 'Report could not be found or you do not have permission to edit it.'}</p>
        <button
          onClick={() => router.push('/reports')}
          className="btn-secondary"
        >
          Back to Reports
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-4 fade-in-up">
      <ReportForm initialData={report} reportId={id} />
    </div>
  )
}
