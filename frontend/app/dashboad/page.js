'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import StatsCards from '../../components/Dashboard/StatsCards';
import Charts from '../../components/Dashboard/Charts';
import Filters from '../../components/Dashboard/Filters';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    weekStart: '',
    weekEnd: '',
    userId: '',
    project: ''
  });

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'manager') {
      router.push('/reports');
      return;
    }
    fetchReports();
  }, [user, filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/reports/all?${params}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard metrics
  const submittedThisWeek = reports.filter(r => r.status === 'submitted').length;
  const total = reports.length;
  const complianceRate = total > 0 ? Math.round((submittedThisWeek / total) * 100) : 0;
  const openBlockers = reports.filter(r => r.blockers?.length > 0).length;

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>
      
      {/* Summary Cards */}
      <StatsCards 
        submitted={submittedThisWeek}
        total={total}
        complianceRate={complianceRate}
        blockers={openBlockers}
      />

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Charts */}
      <Charts reports={reports} />

      {/* Reports Table */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id}>
                <td className="px-6 py-4 whitespace-nowrap">{report.userId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{report.projectCategory}</td>
                <td className="px-6 py-4">{report.tasksCompleted?.length || 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    report.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}