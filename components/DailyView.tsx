
import React, { useState } from 'react';
import { Clock, BookOpen, Edit3, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { DayPlan, HourlyPlan, View } from '../types';

interface DailyViewProps {
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: View) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ selectedDate, onDateChange, onViewChange }) => {
  const [plans, setPlans] = useState<HourlyPlan[]>(
    Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      subject: '',
      plan: ''
    }))
  );

  const dateStr = selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'prev' ? -1 : 1));
    onDateChange?.(newDate);
  };

  const handleUpdate = (hour: number, field: 'subject' | 'plan', value: string) => {
    setPlans(plans.map(p => p.hour === hour ? { ...p, [field]: value } : p));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3 md:space-y-6">
      <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4">
            <button
              onClick={() => navigateDay('prev')}
              className="p-1.5 md:p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h2 className="text-base md:text-3xl font-bold text-slate-800 tracking-tight leading-tight flex-1 text-center md:text-left whitespace-nowrap">
              {dateStr}
            </h2>
            <button
              onClick={() => navigateDay('next')}
              className="p-1.5 md:p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600 active:scale-90"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 md:ml-2">
            <p className="text-slate-500 text-[11px] md:text-base text-center md:text-left">오늘의 타임라인에 집중하세요</p>
            <button
              onClick={() => onViewChange?.('weekly')}
              className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors group"
            >
              <CalendarDays className="w-3 h-3 group-hover:scale-110 transition-transform" />
              주간 계획으로 이동
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-indigo-50 text-indigo-700 rounded-xl md:rounded-2xl border border-indigo-100 self-center md:self-auto">
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="text-[10px] md:text-sm font-black whitespace-nowrap tracking-wide">24시간 플래너</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-safe">
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-2 p-3 md:p-4 text-center">시간</div>
          <div className="col-span-4 md:col-span-3 p-3 md:p-4">과목</div>
          <div className="col-span-6 md:col-span-7 p-3 md:p-4">상세 계획</div>
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] md:max-h-[700px] overflow-y-auto">
          {plans.map((item) => (
            <div key={item.hour} className="grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors group">
              <div className="col-span-2 p-1.5 md:p-4 text-center font-mono text-[10px] md:text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                {String(item.hour).padStart(2, '0')}:00
              </div>
              <div className="col-span-4 md:col-span-3 p-1 md:p-2 text-center">
                <div className="flex items-center gap-1.5 px-1.5 py-1.5 md:px-3 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <input
                    type="text"
                    placeholder="과목"
                    value={item.subject}
                    onChange={(e) => handleUpdate(item.hour, 'subject', e.target.value)}
                    className="w-full bg-transparent text-[10px] md:text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300 text-center"
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-7 p-1 md:p-2">
                <div className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                  <input
                    type="text"
                    placeholder="목표 작성"
                    value={item.plan}
                    onChange={(e) => handleUpdate(item.hour, 'plan', e.target.value)}
                    className="w-full bg-transparent text-[10px] md:text-sm font-medium text-slate-700 outline-none placeholder:text-slate-300 truncate"
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
