
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Plus, Trash2, CheckCircle2, Circle, List, Grid } from 'lucide-react';
import { Task, Priority } from '../types';

interface MonthlyViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  isMobileMode?: boolean;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ tasks, onAddTask, onDeleteTask, onUpdateTask, isMobileMode }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [newQuickTask, setNewQuickTask] = useState("");
  const [isListView, setIsListView] = useState(isMobileMode); // 모바일일 때 기본 리스트뷰

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const handleGoToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => null);

  const isToday = (day: number | null) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setEditingDate(dateStr);
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickTask.trim() || !editingDate) return;

    onAddTask({
      title: newQuickTask,
      subject: '기타',
      dueDate: editingDate,
      priority: 'medium',
      status: 'todo',
      estimatedHours: 1
    });
    setNewQuickTask("");
  };

  const currentDayTasks = editingDate 
    ? tasks.filter(task => task.dueDate === editingDate)
    : [];

  return (
    <div className="relative space-y-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 shrink-0">
              {year}년 {monthNames[month]}
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                onClick={() => setIsListView(false)}
                className={`p-1.5 rounded-lg transition-all ${!isListView ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                title="그리드 보기"
               >
                 <Grid className="w-4 h-4" />
               </button>
               <button 
                onClick={() => setIsListView(true)}
                className={`p-1.5 rounded-lg transition-all ${isListView ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                title="리스트 보기"
               >
                 <List className="w-4 h-4" />
               </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={handleGoToday} className="px-4 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-600 transition-colors">오늘</button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        
        {!isListView ? (
          <>
            <div className="grid grid-cols-7 border-b border-slate-100">
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} className={`py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider border-r border-slate-50 last:border-r-0 ${day === '일' ? 'text-rose-500' : day === '토' ? 'text-blue-500' : 'text-slate-400'}`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[120px]">
              {padding.concat(days as any).map((day, idx) => (
                <div 
                  key={idx} 
                  onClick={() => day && handleDayClick(day)}
                  className={`p-2 md:p-3 border-r border-b border-slate-50 last:border-r-0 hover:bg-indigo-50/30 transition-colors cursor-pointer group relative ${!day ? 'bg-slate-50/30' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`text-xs md:text-sm font-semibold ${isToday(day) ? 'bg-indigo-600 text-white w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-sm' : 'text-slate-600'}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5 md:space-y-1 overflow-hidden">
                        {getTasksForDate(day).slice(0, 3).map(task => (
                          <div 
                            key={task.id} 
                            className={`text-[8px] md:text-[10px] px-1 py-0.5 rounded border truncate transition-opacity ${
                              task.status === 'completed' 
                                ? 'bg-slate-50 text-slate-400 border-slate-100 line-through' 
                                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {getTasksForDate(day).length > 3 && (
                          <div className="text-[8px] text-slate-400 text-center">+{getTasksForDate(day).length - 3}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
            {days.map(day => {
              const dayTasks = getTasksForDate(day);
              if (dayTasks.length === 0) return null;
              return (
                <div key={day} className="space-y-2">
                   <div className="flex items-center gap-2">
                     <span className={`text-sm font-bold ${isToday(day) ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {month + 1}월 {day}일
                     </span>
                     <div className="h-px flex-1 bg-slate-100"></div>
                   </div>
                   <div className="grid gap-2">
                      {dayTasks.map(task => (
                        <div key={task.id} onClick={() => handleDayClick(day)} className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm active:bg-slate-50">
                           <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                           <div className="flex-1">
                              <p className={`text-sm font-bold text-slate-700 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                              <p className="text-[10px] text-slate-400">{task.subject}</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      ))}
                   </div>
                </div>
              );
            })}
            {days.every(day => getTasksForDate(day).length === 0) && (
              <div className="py-20 text-center">
                 <p className="text-slate-400 text-sm font-medium">이번 달에는 아직 일정이 없습니다.</p>
                 <p className="text-xs text-slate-300 mt-1">그리드 뷰에서 날짜를 클릭해 일정을 추가해보세요!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 일일 상세 편집 모달 */}
      {editingDate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{editingDate}</h3>
                <p className="text-indigo-100 text-sm">일정 관리 및 추가</p>
              </div>
              <button 
                onClick={() => setEditingDate(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[400px] overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">등록된 일정 ({currentDayTasks.length})</h4>
              
              <div className="space-y-3 mb-6">
                {currentDayTasks.length > 0 ? (
                  currentDayTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <button 
                        onClick={() => onUpdateTask(task.id, { status: task.status === 'completed' ? 'todo' : 'completed' })}
                        className="shrink-0"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                        )}
                      </button>
                      <span className={`flex-1 text-sm font-medium text-slate-700 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 italic text-sm">
                    등록된 일정이 없습니다.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <form onSubmit={handleQuickAdd} className="relative">
                  <input 
                    autoFocus
                    type="text"
                    value={newQuickTask}
                    onChange={(e) => setNewQuickTask(e.target.value)}
                    placeholder="새 일정을 입력하세요..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 border-none transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => setEditingDate(null)}
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyView;
