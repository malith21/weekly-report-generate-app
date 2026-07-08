'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalReports = reports.length
  const submittedReports = reports.filter(r => r.status === 'submitted').length
  const draftReports = reports.filter(r => r.status === 'draft').length
  const complianceRate = totalReports > 0 ? Math.round((submittedReports / totalReports) * 100) : 0
  const totalBlockers = reports.reduce((sum, r) => sum + r.blockers.length, 0)
  const uniqueUsers = new Set(reports.map(r => r.userId?._id)).size

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Team Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of team performance and reports</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-green-600">↑ {submittedReports} submitted</span>
          </div>
        </div>

        <div className="glass-card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{complianceRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Blockers</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlockers}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-gray-500">Across {uniqueUsers} team members</span>
          </div>
        </div>

        <div className="glass-card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-gray-500">Active reporters</span>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      {reports.length > 0 && (
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Team Member</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Project</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Tasks</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Week</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 10).map((report) => (
                  <tr key={report._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {report.userId?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{report.projectCategory}</td>
                    <td className="py-3 px-4 text-gray-600">{report.tasksCompleted.length}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'submitted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {new Date(report.weekStart).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reports.length === 0 && (
        <div className="glass-card text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700">No Reports Yet</h3>
          <p className="text-gray-500 mt-2">Team members haven't submitted any reports yet.</p>
        </div>
      )}
    </div>
  )
}