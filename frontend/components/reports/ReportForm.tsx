'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface ReportData {
  weekStart: string
  weekEnd: string
  projectCategory: string
  tasksCompleted: string[]
  tasksPlanned: string[]
  blockers: string[]
  hoursWorked: number
  notes?: string
  status: 'draft' | 'submitted'
}

interface ReportFormProps {
  initialData?: any
  reportId?: string | null
}

export default function ReportForm({ initialData = null, reportId = null }: ReportFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [weekStart, setWeekStart] = useState(initialData?.weekStart?.split('T')[0] || '')
  const [weekEnd, setWeekEnd] = useState(initialData?.weekEnd?.split('T')[0] || '')
  const [projectCategory, setProjectCategory] = useState(initialData?.projectCategory || '')
  const [tasksCompleted, setTasksCompleted] = useState<string[]>(initialData?.tasksCompleted || [])
  const [tasksPlanned, setTasksPlanned] = useState<string[]>(initialData?.tasksPlanned || [])
  const [blockers, setBlockers] = useState<string[]>(initialData?.blockers || [])
  const [hoursWorked, setHoursWorked] = useState(initialData?.hoursWorked?.toString() || '')
  const [notes, setNotes] = useState(initialData?.notes || '')

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    if (!weekStart || !weekEnd || !projectCategory) {
      setError('Please fill in all required fields (Week Start, Week End, Project Category).')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data: ReportData = {
        weekStart,
        weekEnd,
        projectCategory,
        tasksCompleted,
        tasksPlanned,
        blockers,
        hoursWorked: parseInt(hoursWorked) || 0,
        notes,
        status
      }

      if (reportId) {
        await api.put(`/reports/${reportId}`, data)
      } else {
        await api.post('/reports', data)
      }
      router.push('/reports')
    } catch (error: any) {
      console.error('Error saving report:', error)
      setError(error.response?.data?.message || 'Error saving report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 sm:p-8 border border-slate-100/50 shadow-xl shadow-slate-100/30">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {reportId ? '📝 Edit Weekly Report' : '✨ New Weekly Report'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Week Start & End Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Week Start *</label>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="form-label">Week End *</label>
            <input
              type="date"
              value={weekEnd}
              onChange={(e) => setWeekEnd(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Project Category */}
        <div>
          <label className="form-label">Project / Category *</label>
          <input
            type="text"
            value={projectCategory}
            onChange={(e) => setProjectCategory(e.target.value)}
            className="input-field"
            placeholder="e.g., Client A, Internal R&D, Marketing"
            required
          />
        </div>

        {/* Dynamic Lists */}
        <ListInput
          label="Tasks Completed"
          items={tasksCompleted}
          setItems={setTasksCompleted}
          placeholder="Type completed task and press Enter..."
        />

        <ListInput
          label="Tasks Planned for Next Week"
          items={tasksPlanned}
          setItems={setTasksPlanned}
          placeholder="Type planned task and press Enter..."
        />

        <ListInput
          label="Blockers & Challenges"
          items={blockers}
          setItems={setBlockers}
          placeholder="Type blocker and press Enter (or leave empty)..."
        />

        {/* Hours Worked & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Hours Worked</label>
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="input-field"
              placeholder="e.g., 40"
              min="0"
            />
          </div>
          <div>
            <label className="form-label">Notes & Links</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              placeholder="Optional notes or repository links..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="w-full sm:w-auto btn-secondary"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('submitted')}
            disabled={loading}
            className="w-full sm:w-auto btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/reports')}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

interface ListInputProps {
  label: string
  items: string[]
  setItems: React.Dispatch<React.SetStateAction<string[]>>
  placeholder: string
}

function ListInput({ label, items, setItems, placeholder }: ListInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (!inputValue.trim()) return

    // If multi-line (e.g. pasted text)
    if (inputValue.includes('\n') || inputValue.includes('\r')) {
      const lines = inputValue.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
      setItems(prev => [...prev, ...lines])
    } else {
      setItems(prev => [...prev, inputValue.trim()])
    }
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="form-label">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-2 mt-2 bg-slate-50 border border-slate-100 p-3 rounded-lg max-h-48 overflow-y-auto">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-start gap-2 text-sm text-slate-700 bg-white border border-slate-100/60 pl-3 pr-2 py-1.5 rounded-md shadow-sm">
              <span className="break-all pt-0.5">{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="list-item-btn flex items-center justify-center cursor-pointer shrink-0 mt-0.5"
                title="Remove item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
