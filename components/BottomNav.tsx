
import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Sparkles, 
  BarChart3,
  Clock
} from 'lucide-react';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard' as View, icon: LayoutDashboard, label: '홈' },
    { id: 'weekly' as View, icon: CalendarDays, label: '주간' },
    { id: 'daily' as View, icon: Clock, label: '일일' },
    { id: 'ai-assistant' as View, icon: Sparkles, label: 'AI' },
    { id: 'stats' as View, icon: BarChart3, label: '통계' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
              isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-50' : ''}`}>
              <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
