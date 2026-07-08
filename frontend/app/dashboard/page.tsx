'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import Charts from '@/components/Dashboard/Charts'

interface Report {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
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

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role !== 'manager') {
      router.push('/reports')
      return
    }

    if (user) {
      fetchReports()
    }
  }, [user, loading, router])

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/all')
      setReports(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] fade-in-up">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Loading team metrics...</p>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalReports = reports.length
  const submittedReports = reports.filter(r => r.status === 'submitted').length
  const complianceRate = totalReports > 0 ? Math.round((submittedReports / totalReports) * 100) : 0
  const totalBlockers = reports.reduce((sum, r) => sum + r.blockers.length, 0)
  const uniqueUsers = new Set(reports.map(r => r.userId?._id).filter(Boolean)).size

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8 fade-in-up max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Team <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time overview of team weekly reports, blocker challenges, and workload distribution.</p>
        </div>
        <div className="text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto flex items-center gap-2">
          <span>📅</span>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reports</p>
            <p className="text-3xl font-extrabold text-slate-800">{totalReports}</p>
            <p className="text-xs text-emerald-600 font-medium">✨ {submittedReports} submitted reports</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-sm shadow-indigo-100">
            📄
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1 w-full">
            <div className="flex justify-between items-center pr-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance</p>
              <p className="text-3xl font-extrabold text-slate-800">{complianceRate}%</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div 
                className="gradient-bg rounded-full h-2 transition-all duration-700"
                style={{ width: `${complianceRate}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium pt-1">Percent of submitted status</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold shadow-sm shadow-emerald-100 shrink-0 ml-4">
            ✅
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Blockers</p>
            <p className="text-3xl font-extrabold text-slate-800">{totalBlockers}</p>
            <p className="text-xs text-red-500 font-medium">⚠️ Needs immediate attention</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold shadow-sm shadow-red-100">
            🛑
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reporters</p>
            <p className="text-3xl font-extrabold text-slate-800">{uniqueUsers}</p>
            <p className="text-xs text-slate-500 font-medium">👥 Active team members</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-bold shadow-sm shadow-violet-100">
            👥
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      {reports.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Visual Insights</h2>
          <Charts reports={reports} />
        </div>
      )}

      {/* Recent Reports Table */}
      {reports.length > 0 && (
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Submissions</h3>
            <span className="text-xs text-slate-400">Showing up to 10 latest logs</span>
          </div>
          
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                  <th className="py-3 px-4 font-semibold text-slate-500">Team Member</th>
                  <th className="py-3 px-4 font-semibold text-slate-500">Project / Category</th>
                  <th className="py-3 px-4 font-semibold text-slate-500">Tasks Completed</th>
                  <th className="py-3 px-4 font-semibold text-slate-500">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-right">Week Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.slice(0, 10).map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold flex items-center justify-center border border-violet-100">
                        {report.userId?.name ? report.userId.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span>{report.userId?.name || 'Unknown'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{report.projectCategory}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200/50 font-semibold text-xs text-slate-600">
                        📋 {report.tasksCompleted.length} Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        report.status === 'submitted' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${report.status === 'submitted' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-sm text-right font-medium">
                      {formatDate(report.weekStart)} — {formatDate(report.weekEnd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reports.length === 0 && (
        <div className="glass-card text-center py-16 border border-slate-100/50 shadow-md">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-slate-800">No reports logged</h3>
          <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
            Once team members start submitting their weekly updates, they will appear here.
          </p>
        </div>
      )}
    </div>
  )
}