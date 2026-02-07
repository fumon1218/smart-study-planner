
import React, { useState } from 'react';
import { Clock, BookOpen, Edit3 } from 'lucide-react';
import { DayPlan, HourlyPlan } from '../types';

const DailyView: React.FC = () => {
  const [plans, setPlans] = useState<HourlyPlan[]>(
    Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      subject: '',
      plan: ''
    }))
  );

  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  });

  const handleUpdate = (hour: number, field: 'subject' | 'plan', value: string) => {
    setPlans(plans.map(p => p.hour === hour ? { ...p, [field]: value } : p));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{dateStr}</h2>
          <p className="text-slate-500">오늘의 타임라인에 집중하세요</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-bold">24시간 플래너</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2 p-4 text-center">시간</div>
          <div className="col-span-3 p-4">과목</div>
          <div className="col-span-7 p-4">상세 계획</div>
        </div>
        <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
          {plans.map((item) => (
            <div key={item.hour} className="grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors group">
              <div className="col-span-2 p-4 text-center font-mono text-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                {String(item.hour).padStart(2, '0')}:00
              </div>
              <div className="col-span-3 p-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <BookOpen className="w-3 h-3 text-slate-300" />
                  <input 
                    type="text"
                    placeholder="과목 입력"
                    value={item.subject}
                    onChange={(e) => handleUpdate(item.hour, 'subject', e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="col-span-7 p-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <Edit3 className="w-3 h-3 text-slate-300" />
                  <input 
                    type="text"
                    placeholder="이 시간의 목표는 무엇인가요?"
                    value={item.plan}
                    onChange={(e) => handleUpdate(item.hour, 'plan', e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyView;
