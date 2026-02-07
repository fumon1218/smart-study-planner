
import React from 'react';
import { View } from '../types';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Clock,
  BarChart3,
  Sparkles,
  GraduationCap,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isMobileMode?: boolean;
  onToggleMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onToggleMobile }) => {
  const navItems = [
    { id: 'dashboard' as View, label: '대시보드', icon: LayoutDashboard },
    { id: 'monthly' as View, label: '월간 계획', icon: Calendar },
    { id: 'weekly' as View, label: '주간 계획', icon: CalendarDays },
    { id: 'daily' as View, label: '일간 계획', icon: Clock },
    { id: 'stats' as View, label: '학습 통계', icon: BarChart3 },
    { id: 'ai-assistant' as View, label: 'AI 매니저', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            학습 플래너
          </h1>
          <p className="text-[10px] font-bold text-slate-400">v1.0.1</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-3">
        <button
          onClick={onToggleMobile}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-100"
        >
          <Smartphone className="w-4 h-4" />
          모바일 모드로 보기
        </button>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">진행 현황</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700">전체 목표</span>
            <span className="text-xs font-bold text-indigo-600">66%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full w-2/3"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
