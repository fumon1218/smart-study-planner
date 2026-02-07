
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import AIConsultant from './components/AIConsultant';
import MonthlyView from './components/MonthlyView';
import WeeklyView from './components/WeeklyView';
import DailyView from './components/DailyView';
import StatsView from './components/StatsView';
import BottomNav from './components/BottomNav';
import { View, Task } from './types';
import { Search, Bell, User, Heart, Edit2, RotateCw, Check, Camera, Monitor, Smartphone } from 'lucide-react';
import { getQuickAdvice } from './services/gemini';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // 모바일 모드 상태 (로컬 스토리지 저장 및 화면 너비 초기 감지)
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('is_mobile_mode');
    if (saved !== null) return saved === 'true';
    return window.innerWidth < 768;
  });

  const [cheer, setCheer] = useState<string>("동기 부여를 불러오는 중...");
  const [isEditingCheer, setIsEditingCheer] = useState(false);
  const [tempCheer, setTempCheer] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 사용자 정보 상태
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('user_name') || '홍길동');
  const [userProfileImage, setUserProfileImage] = useState<string | null>(() => localStorage.getItem('user_profile_image'));
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('study_tasks');
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = String(now.getMonth() + 1).padStart(2, '0');
    
    return saved ? JSON.parse(saved) : [
      { id: '1', title: '미적분 과제 1', subject: '수학', dueDate: `${curYear}-${curMonth}-10`, priority: 'high', status: 'todo', estimatedHours: 2 },
      { id: '2', title: '역사 4단원 읽기', subject: '역사', dueDate: `${curYear}-${curMonth}-12`, priority: 'medium', status: 'completed', estimatedHours: 1 },
      { id: '3', title: 'UI 디자인 실습', subject: '미술', dueDate: `${curYear}-${curMonth}-15`, priority: 'low', status: 'in-progress', estimatedHours: 4 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('is_mobile_mode', String(isMobileMode));
  }, [isMobileMode]);

  useEffect(() => {
    localStorage.setItem('user_name', userName);
  }, [userName]);

  useEffect(() => {
    if (userProfileImage) {
      localStorage.setItem('user_profile_image', userProfileImage);
    }
  }, [userProfileImage]);

  const fetchCheer = async () => {
    setIsRefreshing(true);
    try {
      const msg = await getQuickAdvice("새로운 것을 배우는 오늘의 나를 위한 응원");
      const cleanMsg = msg.replace(/\*/g, '');
      setCheer(cleanMsg);
    } catch (error) {
      setCheer("오늘도 당신의 성장을 응원합니다!");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCheer();
  }, []);

  const handleStartEdit = () => {
    setTempCheer(cheer);
    setIsEditingCheer(true);
  };

  const handleSaveCheer = () => {
    if (tempCheer.trim()) {
      setCheer(tempCheer);
    }
    setIsEditingCheer(false);
  };

  const handleStartNameEdit = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName);
    }
    setIsEditingName(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveCheer();
    if (e.key === 'Escape') setIsEditingCheer(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') setIsEditingName(false);
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} />;
      case 'monthly': return (
        <MonthlyView 
          tasks={tasks} 
          onAddTask={addTask} 
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
          isMobileMode={isMobileMode}
        />
      );
      case 'weekly': return (
        <WeeklyView 
          tasks={tasks} 
          onAddTask={addTask} 
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onViewChange={setCurrentView}
        />
      );
      case 'daily': return <DailyView />;
      case 'stats': return <StatsView />;
      case 'ai-assistant': return <AIConsultant />;
      default: return <Dashboard tasks={tasks} />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex ${isMobileMode ? 'flex-col' : ''}`}>
      {!isMobileMode && (
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isMobileMode={isMobileMode} 
          onToggleMobile={() => setIsMobileMode(true)}
        />
      )}
      
      <main className={`flex-1 ${!isMobileMode ? 'ml-64' : 'ml-0'} p-4 md:p-8 overflow-y-auto pb-24 md:pb-8`}>
        {/* Top Header */}
        <div className={`flex flex-col md:flex-row gap-4 justify-between items-center mb-6 md:mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-200`}>
          <div className="flex items-center justify-between w-full md:w-auto md:flex-1 gap-4">
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="검색..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {isMobileMode && (
               <button 
                onClick={() => setIsMobileMode(false)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md"
              >
                <Monitor className="w-4 h-4" />
                PC 버전 전환
              </button>
            )}
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center px-4">
             <div className="flex items-center gap-2 py-1.5 px-4 bg-rose-50 border border-rose-100 rounded-full group max-w-lg transition-all hover:shadow-sm">
               <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
               {isEditingCheer ? (
                 <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                   <input 
                    autoFocus
                    type="text"
                    value={tempCheer}
                    onChange={(e) => setTempCheer(e.target.value)}
                    onBlur={handleSaveCheer}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none text-xs font-bold text-rose-700 placeholder:text-rose-300"
                    placeholder="응원의 한마디..."
                   />
                   <Check className="w-3 h-3 text-rose-400 cursor-pointer" onClick={handleSaveCheer} />
                 </div>
               ) : (
                 <div className="flex items-center gap-2 cursor-pointer flex-1 overflow-hidden" onClick={handleStartEdit}>
                   <p className="text-xs font-bold text-rose-700 italic truncate">{cheer}</p>
                   <Edit2 className="w-3 h-3 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                 </div>
               )}
               <button onClick={(e) => { e.stopPropagation(); fetchCheer(); }} disabled={isRefreshing} className={`p-1 hover:bg-rose-100 rounded-full ${isRefreshing ? 'animate-spin' : ''}`}>
                 <RotateCw className="w-3 h-3 text-rose-400" />
               </button>
             </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 self-end md:self-auto">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                {isEditingName ? (
                  <input autoFocus type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={handleSaveName} onKeyDown={handleNameKeyDown} className="text-sm font-bold text-slate-700 border-b border-indigo-300 outline-none w-20 bg-transparent" />
                ) : (
                  <div className="flex flex-col items-end group/name" onClick={handleStartNameEdit}>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-slate-700">{userName}</p>
                      <Edit2 className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
              </div>
              <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform" onClick={handleImageClick}>
                {userProfileImage ? <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white"><User className="w-5 h-5" /></div>}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-3 h-3 text-white" /></div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {isMobileMode && <BottomNav currentView={currentView} onViewChange={setCurrentView} />}
    </div>
  );
};

export default App;
