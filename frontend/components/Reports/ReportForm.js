'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function ReportForm({ initialData = null, reportId = null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weekStart: initialData?.weekStart?.split('T')[0] || '',
    weekEnd: initialData?.weekEnd?.split('T')[0] || '',
    projectCategory: initialData?.projectCategory || '',
    tasksCompleted: initialData?.tasksCompleted?.join('\n') || '',
    tasksPlanned: initialData?.tasksPlanned?.join('\n') || '',
    blockers: initialData?.blockers?.join('\n') || '',
    hoursWorked: initialData?.hoursWorked || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'draft'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (status) => {
    setLoading(true)
    try {
      const data = {
        ...formData,
        tasksCompleted: formData.tasksCompleted.split('\n').filter(Boolean),
        tasksPlanned: formData.tasksPlanned.split('\n').filter(Boolean),
        blockers: formData.blockers.split('\n').filter(Boolean),
        hoursWorked: parseInt(formData.hoursWorked) || 0,
        status
      }

      if (reportId) {
        await api.put(`/reports/${reportId}`, data)
      } else {
        await api.post('/reports', data)
      }
      router.push('/reports')
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Error saving report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {reportId ? 'Edit Report' : 'New Weekly Report'}
      </h2>
      
      <div className="space-y-4">
        <div className="grid-2">
          <div>
            <label className="form-label">Week Start</label>
            <input
              type="date"
              name="weekStart"
              value={formData.weekStart}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="form-label">Week End</label>
            <input
              type="date"
              name="weekEnd"
              value={formData.weekEnd}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Project / Category</label>
          <input
            type="text"
            name="projectCategory"
            value={formData.projectCategory}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Client A, R&D, Marketing"
            required
          />
        </div>

        <div>
          <label className="form-label">Tasks Completed</label>
          <textarea
            name="tasksCompleted"
            value={formData.tasksCompleted}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Task 1&#10;Task 2&#10;Task 3"
          />
        </div>

        <div>
          <label className="form-label">Tasks Planned for Next Week</label>
          <textarea
            name="tasksPlanned"
            value={formData.tasksPlanned}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="Next week's tasks..."
          />
        </div>

        <div>
          <label className="form-label">Blockers / Challenges</label>
          <textarea
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="Any blockers..."
          />
        </div>

        <div className="grid-2">
          <div>
            <label className="form-label">Hours Worked</label>
            <input
              type="number"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="form-label">Notes / Links</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSubmit('submitted')}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  )
}