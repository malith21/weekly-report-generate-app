'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

const ReportForm = ({ initialData = null, reportId = null }) => {
  const router = useRouter();
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
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (status) => {
    setLoading(true);
    try {
      const data = {
        ...formData,
        tasksCompleted: formData.tasksCompleted.split('\n').filter(Boolean),
        tasksPlanned: formData.tasksPlanned.split('\n').filter(Boolean),
        blockers: formData.blockers.split('\n').filter(Boolean),
        hoursWorked: parseInt(formData.hoursWorked) || 0,
        status
      };

      if (reportId) {
        await api.put(`/reports/${reportId}`, data);
      } else {
        await api.post('/reports', data);
      }
      router.push('/reports');
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {reportId ? 'Edit Report' : 'New Weekly Report'}
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Week Start</label>
            <input
              type="date"
              name="weekStart"
              value={formData.weekStart}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Week End</label>
            <input
              type="date"
              name="weekEnd"
              value={formData.weekEnd}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project / Category</label>
          <input
            type="text"
            name="projectCategory"
            value={formData.projectCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Client A, R&D, Marketing"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tasks Completed</label>
          <textarea
            name="tasksCompleted"
            value={formData.tasksCompleted}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Task 1&#10;Task 2&#10;Task 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tasks Planned for Next Week</label>
          <textarea
            name="tasksPlanned"
            value={formData.tasksPlanned}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Next week's tasks..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Blockers / Challenges</label>
          <textarea
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Any blockers..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hours Worked (optional)</label>
            <input
              type="number"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes / Links</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSubmit('submitted')}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;