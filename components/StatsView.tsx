
import React, { useState } from 'react';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const StatsView: React.FC = () => {
  const [dailyGoal, setDailyGoal] = useState(6);
  
  const data = [
    { day: '월', hours: 4.5 },
    { day: '화', hours: 6.2 },
    { day: '수', hours: 5.8 },
    { day: '목', hours: 8.0 },
    { day: '금', hours: 4.0 },
    { day: '토', hours: 7.5 },
    { day: '일', hours: 2.0 },
  ];

  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);
  const avgHours = (totalHours / 7).toFixed(1);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">학습 통계 분석</h2>
        <p className="text-slate-500 text-sm">성장을 수치로 확인하고 목표를 달성하세요</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">주간 학습 활동</h3>
            <div className="flex gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 학습 시간
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  labelFormatter={(label) => `${label}요일`}
                  formatter={(value) => [`${value}시간`, '학습 시간']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-700">일일 목표</h3>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <input 
                type="number" 
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-16 text-3xl font-black text-indigo-600 outline-none"
              />
              <span className="text-slate-400 font-bold mb-1">시간 / 일</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-medium">현재 4.5시간 공부했습니다. 조금만 더 힘내세요!</p>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5" />
              <h3 className="font-bold">학습 요약</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] opacity-70 uppercase font-bold">총 학습 시간</p>
                <p className="text-xl font-bold">{totalHours}시간</p>
              </div>
              <div>
                <p className="text-[10px] opacity-70 uppercase font-bold">일일 평균</p>
                <p className="text-xl font-bold">{avgHours}시간</p>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> 부스트 세션 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
