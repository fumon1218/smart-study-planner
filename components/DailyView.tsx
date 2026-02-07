
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
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight leading-tight">{dateStr}</h2>
          <p className="text-slate-500 text-sm md:text-base">오늘의 타임라인에 집중하세요</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-indigo-50 text-indigo-700 rounded-xl md:rounded-2xl border border-indigo-100 self-start md:self-center">
          <Clock className="w-4 h-4" />
          <span className="text-xs md:text-sm font-black whitespace-nowrap tracking-wide">24시간 플래너</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-2 md:col-span-2 p-3 md:p-4 text-center">시간</div>
          <div className="col-span-4 md:col-span-3 p-3 md:p-4">과목</div>
          <div className="col-span-6 md:col-span-7 p-3 md:p-4">상세 계획</div>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] md:max-h-[700px] overflow-y-auto">
          {plans.map((item) => (
            <div key={item.hour} className="grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors group">
              <div className="col-span-2 md:col-span-2 p-2 md:p-4 text-center font-mono text-[11px] md:text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                {String(item.hour).padStart(2, '0')}:00
              </div>
              <div className="col-span-4 md:col-span-3 p-1.5 md:p-2">
                <div className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <BookOpen className="w-3 h-3 text-slate-300 shrink-0" />
                  <input
                    type="text"
                    placeholder="과목"
                    value={item.subject}
                    onChange={(e) => handleUpdate(item.hour, 'subject', e.target.value)}
                    className="w-full bg-transparent text-[11px] md:text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-7 p-1.5 md:p-2">
                <div className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <Edit3 className="w-3 h-3 text-slate-300 shrink-0" />
                  <input
                    type="text"
                    placeholder="목표 작성"
                    value={item.plan}
                    onChange={(e) => handleUpdate(item.hour, 'plan', e.target.value)}
                    className="w-full bg-transparent text-[11px] md:text-sm font-medium text-slate-700 outline-none placeholder:text-slate-300 truncate"
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
