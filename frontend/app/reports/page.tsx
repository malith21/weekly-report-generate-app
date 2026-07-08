'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'

interface Report {
  _id: string
  weekStart: string
  weekEnd: string
  projectCategory: string
  tasksCompleted: string[]
  tasksPlanned: string[]
  blockers: string[]
  hoursWorked: number
  status: 'draft' | 'submitted'
  submittedAt?: string
}

export default function Reports() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchReports()
    }
  }, [user, loading, router])

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/my-reports')
      setReports(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] fade-in-up">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Reports</h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
              {reports.length} total
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Manage and submit your weekly progress updates.</p>
        </div>
        <Link href="/reports/new" className="btn-primary flex items-center gap-1.5 self-start sm:self-auto py-2.5 text-sm font-semibold">
          <span>✨</span> New Weekly Report
        </Link>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="glass-card p-12 text-center border border-slate-100/50 shadow-md">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-slate-800">No reports found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
            You haven't created any weekly reports yet. Click "New Weekly Report" above to log your first update.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div 
              key={report._id} 
              className="bg-white border border-slate-200/40 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-slate-800 text-lg leading-snug">{report.projectCategory}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      report.status === 'submitted' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'submitted' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <span>📅</span>
                    <span>{formatDate(report.weekStart)}</span>
                    <span className="text-slate-300">—</span>
                    <span>{formatDate(report.weekEnd)}</span>
                  </p>
                  
                  {/* Task counts */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1.5">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                      ✅ {report.tasksCompleted.length} Completed
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                      🎯 {report.tasksPlanned.length} Planned
                    </span>
                    {report.blockers.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 border border-red-100/50 rounded-md">
                        ⚠️ {report.blockers.length} Blockers
                      </span>
                    )}
                    {report.hoursWorked > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                        ⏱️ {report.hoursWorked} hrs
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 gap-3 self-stretch sm:self-auto">
                  <span className="text-xs text-slate-400">
                    {report.submittedAt ? `Submitted ${formatDate(report.submittedAt)}` : 'Last edited Draft'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/reports/${report._id}/edit`}
                      className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}