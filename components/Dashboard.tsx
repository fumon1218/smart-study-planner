
import React, { useMemo } from 'react';
import { Task } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    const subjectData = tasks.reduce((acc: any, task) => {
      acc[task.subject] = (acc[task.subject] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(subjectData).map(name => ({
      name,
      value: subjectData[name]
    }));

    const statusData = [
      { name: '대기 중', value: todo, color: '#94a3b8' },
      { name: '진행 중', value: tasks.filter(t => t.status === 'in-progress').length, color: '#6366f1' },
      { name: '완료', value: completed, color: '#10b981' }
    ];

    return { total, completed, progress, chartData, statusData };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">학습 대시보드</h2>
          <p className="text-slate-500">당신의 학습 이정표를 추적하세요</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-slate-700">오늘도 꾸준히 발전하고 있어요!</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '전체 작업', value: stats.total, icon: ListTodo, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: '완료된 작업', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '작업 완료율', value: `${stats.progress}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '평균 공부 시간', value: '4.2시간', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase">{item.label}</p>
              <p className="text-xl font-bold text-slate-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">과목별 작업 현황</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">작업 진행 상태</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={stats.statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
