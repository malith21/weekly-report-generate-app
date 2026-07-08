'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Charts = ({ reports }) => {
  // Tasks completed trend
  const tasksTrend = reports
    .filter(r => r.status === 'submitted')
    .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart))
    .map(r => ({
      week: new Date(r.weekStart).toLocaleDateString(),
      tasks: r.tasksCompleted?.length || 0
    }));

  // Status distribution
  const statusData = [
    { name: 'Submitted', value: reports.filter(r => r.status === 'submitted').length },
    { name: 'Draft', value: reports.filter(r => r.status === 'draft').length }
  ];

  // Project distribution
  const projectData = reports.reduce((acc, r) => {
    const existing = acc.find(item => item.name === r.projectCategory);
    if (existing) {
      existing.value += r.tasksCompleted?.length || 0;
    } else if (r.projectCategory) {
      acc.push({ name: r.projectCategory, value: r.tasksCompleted?.length || 0 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Tasks Completed Trend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Tasks Completed Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={tasksTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Submission Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Project Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Workload by Project</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;