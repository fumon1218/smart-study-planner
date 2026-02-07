
import React, { useState } from 'react';
import { Task, Priority, View } from '../types';
import { X, Check, Clock, ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface WeeklyViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onViewChange?: (view: View) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, onViewChange }) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const subjects = ['수학', '과학', '역사', '언어', '컴퓨터공학', '미술', '기타', '직접 입력'];
  const hoursArr = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 80; // 1시간당 높이 (px)

  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayIdx = currentDate.getDay();

  const [addingDate, setAddingDate] = useState<string | null>(null);
  const [quickTask, setQuickTask] = useState({
    title: '',
    subject: '수학',
    customSubject: '',
    priority: 'medium' as Priority,
    startTime: '09:00',
    endTime: '10:00'
  });

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + (i - todayIdx));
    return d;
  });

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') newDate.setDate(currentDate.getDate() - 7);
    else if (direction === 'next') newDate.setDate(currentDate.getDate() + 7);
    else {
      setCurrentDate(new Date());
      return;
    }
    setCurrentDate(newDate);
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const handleGridDoubleClick = (date: Date, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    // 5분 단위 스냅 계산
    const totalMinutes = (offsetY / (HOUR_HEIGHT * 24)) * (24 * 60);
    const roundedMinutes = Math.floor(totalMinutes / 5) * 5;

    const h = Math.floor(roundedMinutes / 60);
    const m = roundedMinutes % 60;

    const startTimeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const nextH = Math.min(23, h + 1);
    const endTimeStr = `${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    setAddingDate(dateStr);
    setQuickTask({
      ...quickTask,
      startTime: startTimeStr,
      endTime: endTimeStr,
      title: '',
      subject: '수학',
      customSubject: ''
    });
  };

  const handleCancelAdd = () => {
    setAddingDate(null);
  };

  const handleSubmitQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.title || !addingDate) return;

    onAddTask({
      ...quickTask,
      subject: quickTask.subject === '직접 입력' ? quickTask.customSubject : quickTask.subject,
      dueDate: addingDate,
      status: 'todo',
      estimatedHours: 1
    });
    setAddingDate(null);
  };

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return { h: h || 0, m: m || 0 };
  };

  const updateTime = (type: 'start' | 'end', field: 'h' | 'm', val: string) => {
    const current = parseTime(type === 'start' ? quickTask.startTime : quickTask.endTime);
    let num = parseInt(val) || 0;

    if (field === 'h') num = Math.min(23, Math.max(0, num));
    if (field === 'm') num = Math.min(59, Math.max(0, num));

    const newTime = `${String(field === 'h' ? num : current.h).padStart(2, '0')}:${String(field === 'm' ? num : current.m).padStart(2, '0')}`;

    setQuickTask(prev => ({
      ...prev,
      [type === 'start' ? 'startTime' : 'endTime']: newTime
    }));
  };

  // 타임라인 위치 계산 로직
  const calculatePosition = (timeStr?: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h + m / 60) * HOUR_HEIGHT;
  };

  const calculateHeight = (start?: string, end?: string) => {
    if (!start || !end) return HOUR_HEIGHT;
    const s = parseTime(start);
    const e = parseTime(end);
    const startMin = s.h * 60 + s.m;
    const endMin = e.h * 60 + e.m;
    const diff = Math.max(30, endMin - startMin); // 최소 30분 높이 보장
    return (diff / 60) * HOUR_HEIGHT;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[800px] overflow-hidden">
      {/* Weekly Header */}
      <div
        className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0"
      >
        <div className="flex items-center gap-6">
          <div onClick={() => onViewChange?.('monthly')} className="cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-xl transition-colors">
            <h2 className="text-xl font-bold text-slate-800">주간 타임라인</h2>
            <p className="text-slate-500 text-sm">기능별 학습 일정 관리</p>
          </div>

          <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateWeek('today')}
              className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-sm font-bold text-slate-600 active:scale-95"
            >
              오늘
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-bold bg-white px-4 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-sm">
              {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 - {weekDates[6].getMonth() + 1}월 {weekDates[6].getDate()}일
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 shadow-sm">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest italic">Timeline Mode</span>
        </div>
      </div>

      {/* Scrollable Timeline Grid */}
      <div className="flex-1 overflow-auto bg-slate-50/20">
        <div className="min-w-[1000px] flex flex-col relative">

          {/* Days Header */}
          <div className="flex border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-30 shadow-sm">
            <div className="w-20 border-r border-slate-100 bg-slate-50 flex items-center justify-center">
              <span className="text-[10px] font-black text-slate-400">TIME</span>
            </div>
            <div className="flex-1 grid grid-cols-7">
              {weekDates.map((date, idx) => {
                const isToday = date.toDateString() === now.toDateString();
                return (
                  <div key={idx} className={`py-4 text-center border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-indigo-50/40' : ''}`}>
                    <p className={`text-[11px] font-bold uppercase mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {days[idx]}요일
                    </p>
                    <p className={`text-xl font-black ${isToday ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex relative">
            {/* Time Axis (Lefthand side) */}
            <div className="w-20 flex flex-col bg-slate-50/50 border-r border-slate-100 shrink-0 select-none">
              {hoursArr.map(hour => (
                <div key={hour} style={{ height: `${HOUR_HEIGHT}px` }} className="border-b border-slate-100 flex flex-col items-center justify-start pt-2">
                  <span className="text-[11px] font-black text-slate-400 leading-none">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Main Grid Content */}
            <div className="flex-1 grid grid-cols-7 relative" style={{ height: `${HOUR_HEIGHT * 24}px` }}>
              {/* Background Horizontal Lines */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {hoursArr.map(hour => (
                  <div key={hour} style={{ height: `${HOUR_HEIGHT}px` }} className="border-b border-slate-100 w-full relative">
                    <div className="absolute top-1/2 left-0 w-full border-b border-slate-100/50 border-dashed"></div>
                  </div>
                ))}
              </div>

              {weekDates.map((date, idx) => {
                const isToday = date.toDateString() === now.toDateString();
                const dayTasks = getTasksForDate(date);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const isAdding = addingDate === dateStr;

                return (
                  <div
                    key={idx}
                    onDoubleClick={(e) => handleGridDoubleClick(date, e)}
                    className={`relative border-r border-slate-100 last:border-r-0 group cursor-crosshair hover:bg-indigo-50/10 transition-colors ${isToday ? 'bg-indigo-50/5' : ''}`}
                  >
                    {/* Quick Add Form Modal */}
                    {isAdding && (
                      <div
                        className="absolute inset-x-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                        style={{ top: `${calculatePosition(quickTask.startTime)}px` }}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative bg-white rounded-[40px] border-[3px] border-indigo-500 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col gap-8 w-[280px] mx-auto ring-1 ring-black/5">

                          <div className="flex items-center justify-between">
                            <div className="bg-indigo-50 px-4 py-1.5 rounded-2xl">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">QUICK SCHEDULER</span>
                            </div>
                            <button onClick={handleCancelAdd} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                              <X className="w-5 h-5 text-slate-400" />
                            </button>
                          </div>

                          <form onSubmit={handleSubmitQuickAdd} className="flex flex-col gap-6">
                            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                              <input
                                autoFocus
                                type="text"
                                placeholder="할 일 입력..."
                                value={quickTask.title}
                                onChange={e => setQuickTask({ ...quickTask, title: e.target.value })}
                                className="w-full bg-transparent text-xl font-bold text-slate-700 placeholder:text-slate-300 outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-slate-400 ml-2">시작</label>
                                <div className="bg-slate-50 border border-slate-100 rounded-[28px] p-4 flex items-center justify-center gap-1 hover:bg-indigo-50 hover:border-indigo-100 transition-all focus-within:ring-2 focus-within:ring-indigo-200 focus-within:bg-white">
                                  <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={parseTime(quickTask.startTime).h}
                                    onChange={(e) => updateTime('start', 'h', e.target.value)}
                                    className="w-10 bg-transparent text-2xl font-black text-slate-700 text-center outline-none focus:text-indigo-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <span className="text-xl font-black text-slate-300">:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="5"
                                    value={parseTime(quickTask.startTime).m}
                                    onChange={(e) => updateTime('start', 'm', e.target.value)}
                                    className="w-10 bg-transparent text-2xl font-black text-slate-700 text-center outline-none focus:text-indigo-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-slate-400 ml-2">종료</label>
                                <div className="bg-slate-50 border border-slate-100 rounded-[28px] p-4 flex items-center justify-center gap-1 hover:bg-indigo-50 hover:border-indigo-100 transition-all focus-within:ring-2 focus-within:ring-indigo-200 focus-within:bg-white">
                                  <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={parseTime(quickTask.endTime).h}
                                    onChange={(e) => updateTime('end', 'h', e.target.value)}
                                    className="w-10 bg-transparent text-2xl font-black text-slate-700 text-center outline-none focus:text-indigo-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <span className="text-xl font-black text-slate-300">:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="5"
                                    value={parseTime(quickTask.endTime).m}
                                    onChange={(e) => updateTime('end', 'm', e.target.value)}
                                    className="w-10 bg-transparent text-2xl font-black text-slate-700 text-center outline-none focus:text-indigo-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4">
                              <div className="relative">
                                <select
                                  value={quickTask.subject}
                                  onChange={e => setQuickTask({ ...quickTask, subject: e.target.value })}
                                  className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-[24px] p-5 text-base font-bold text-slate-700 outline-none pr-12 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                                >
                                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                              </div>

                              {quickTask.subject === '직접 입력' && (
                                <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all animate-in slide-in-from-top-2 duration-200">
                                  <input
                                    autoFocus
                                    type="text"
                                    placeholder="과목명 입력..."
                                    value={quickTask.customSubject}
                                    onChange={e => setQuickTask({ ...quickTask, customSubject: e.target.value })}
                                    className="w-full bg-transparent text-base font-bold text-slate-700 placeholder:text-slate-300 outline-none"
                                  />
                                </div>
                              )}
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[28px] shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.96]"
                            >
                              <Check className="w-6 h-6 stroke-[3px]" />
                              <span className="text-xl font-black">일정 저장</span>
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Render Tasks as Timeline Blocks */}
                    <div className="absolute inset-0 z-10 pointer-events-none px-1">
                      {dayTasks.map(task => {
                        const top = calculatePosition(task.startTime);
                        const height = calculateHeight(task.startTime, task.endTime);

                        return (
                          <div
                            key={task.id}
                            style={{ top: `${top}px`, height: `${height}px` }}
                            onClick={() => onUpdateTask(task.id, { status: task.status === 'completed' ? 'todo' : 'completed' })}
                            className={`absolute inset-x-1.5 p-2 rounded-xl border shadow-sm transition-all pointer-events-auto cursor-pointer hover:shadow-md group/task overflow-hidden ${task.status === 'completed'
                              ? 'bg-slate-50 border-slate-100 opacity-60'
                              : 'bg-white border-indigo-100 border-l-4 border-l-indigo-500 hover:border-l-indigo-600'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md ${task.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'
                                }`}>
                                {task.subject}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                className="opacity-0 group-hover/task:opacity-100 p-0.5 hover:bg-rose-50 rounded transition-all"
                              >
                                <X className="w-2.5 h-2.5 text-rose-400" />
                              </button>
                            </div>
                            <p className={`text-[10px] font-bold text-slate-700 leading-tight truncate ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                              {task.title}
                            </p>
                            <span className="text-[8px] font-bold text-slate-400 mt-1 block">
                              {task.startTime} - {task.endTime}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-8 justify-center shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-widest italic">Double Click Grid to Add • Click Card to Complete • Synchronized with Monthly View</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
