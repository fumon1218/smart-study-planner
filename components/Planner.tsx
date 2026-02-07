
import React, { useState } from 'react';
import { Task, Priority, Status } from '../types';
import { Plus, Trash2, Calendar, AlertCircle, Filter } from 'lucide-react';

interface PlannerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

const Planner: React.FC<PlannerProps> = ({ tasks, onAddTask, onDeleteTask, onUpdateTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '수학',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as Priority,
    estimatedHours: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    onAddTask({
      ...newTask,
      status: 'todo'
    });
    setIsAdding(false);
    setNewTask({ title: '', subject: '수학', dueDate: new Date().toISOString().split('T')[0], priority: 'medium', estimatedHours: 1 });
  };

  const getPriorityText = (p: Priority) => {
    switch(p) {
      case 'high': return '높음';
      case 'medium': return '중간';
      case 'low': return '낮음';
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'high': return 'bg-rose-100 text-rose-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-sky-100 text-sky-700';
    }
  };

  const subjects = ['수학', '과학', '역사', '언어', '컴퓨터공학', '미술', '기타'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">학습 계획</h2>
          <p className="text-slate-500">당신의 공부 세션을 조직하세요</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>새 작업 추가</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">과제명</label>
              <input 
                autoFocus
                type="text" 
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                placeholder="예: 미적분 3단원 퀴즈 준비"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">과목</label>
              <select 
                value={newTask.subject}
                onChange={e => setNewTask({...newTask, subject: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">마감일</label>
              <input 
                type="date" 
                value={newTask.dueDate}
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">우선순위</label>
              <select 
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
              >
                <option value="low">낮음</option>
                <option value="medium">중간</option>
                <option value="high">높음</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm"
            >
              플랜에 추가하기
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <Filter className="w-4 h-4" />
            <span className="text-sm">진행 중인 작업 ({tasks.filter(t => t.status !== 'completed').length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-50">
                <th className="px-6 py-4">상태</th>
                <th className="px-6 py-4">작업명</th>
                <th className="px-6 py-4">과목</th>
                <th className="px-6 py-4">기한</th>
                <th className="px-6 py-4">우선순위</th>
                <th className="px-6 py-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    등록된 작업이 없습니다. 첫 번째 학습 작업을 추가해 보세요!
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'completed'}
                        onChange={(e) => onUpdateTask(task.id, { status: e.target.checked ? 'completed' : 'todo' })}
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold text-slate-700 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {task.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        {task.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Planner;
