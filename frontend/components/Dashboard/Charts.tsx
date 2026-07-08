'use client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

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
}

interface ChartsProps {
  reports: Report[]
}

export default function Charts({ reports }: ChartsProps) {
  // Tasks completed trend
  const tasksTrend = reports
    .filter(r => r.status === 'submitted')
    .sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime())
    .map(r => ({
      week: new Date(r.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks: r.tasksCompleted?.length || 0
    }));

  // Status distribution
  const statusData = [
    { name: 'Submitted', value: reports.filter(r => r.status === 'submitted').length },
    { name: 'Draft', value: reports.filter(r => r.status === 'draft').length }
  ];

  // Project distribution
  const projectData = reports.reduce((acc: { name: string; value: number }[], r) => {
    const existing = acc.find(item => item.name === r.projectCategory);
    if (existing) {
      existing.value += r.tasksCompleted?.length || 0;
    } else if (r.projectCategory) {
      acc.push({ name: r.projectCategory, value: r.tasksCompleted?.length || 0 });
    }
    return acc;
  }, []);

  // Theme-specific colors
  const PIE_COLORS = ['#7c3aed', '#f59e0b']; // Violet (submitted), Amber (draft)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Tasks Completed Trend */}
      <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <span>📈</span> Tasks Completed Trend
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tasksTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                name="Completed Tasks"
                stroke="#6366f1" 
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                dot={{ strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <span>🎯</span> Submission Status
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={statusData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                innerRadius={50}
                paddingAngle={4}
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Distribution */}
      <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm lg:col-span-2">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <span>📊</span> Workload by Project (Tasks Completed)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Tasks Completed"
                fill="#7c3aed" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
