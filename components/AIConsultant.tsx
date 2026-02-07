
import React, { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, Check, Info } from 'lucide-react';
import { generateStudyPlan } from '../services/gemini';
import { GeneratedPlan } from '../types';

const AIConsultant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [inputs, setInputs] = useState({
    subject: '',
    goal: '',
    duration: 7
  });

  const handleGenerate = async () => {
    if (!inputs.subject || !inputs.goal) return;
    setLoading(true);
    try {
      const result = await generateStudyPlan(inputs.subject, inputs.goal, inputs.duration);
      setPlan(result);
    } catch (error) {
      console.error(error);
      alert('플랜 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <div className="inline-flex p-3 bg-indigo-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">AI 학습 전략가</h2>
        <p className="text-slate-500 mt-2">제미나이 AI가 제안하는 맞춤형 학습 경로</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">무엇을 공부하시나요?</label>
            <input 
              type="text" 
              placeholder="예: 유기화학, UI 디자인, 수능"
              value={inputs.subject}
              onChange={e => setInputs({...inputs, subject: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">주요 목표가 무엇인가요?</label>
            <input 
              type="text" 
              placeholder="예: 기말고사 통과, 기초 마스터"
              value={inputs.goal}
              onChange={e => setInputs({...inputs, goal: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">학습 기간 (일): {inputs.duration}일</label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={inputs.duration}
              onChange={e => setInputs({...inputs, duration: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>단기 집중 (1일)</span>
              <span>심화 학습 (30일)</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !inputs.subject || !inputs.goal}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <BrainCircuit className="w-6 h-6" />
              <span>나만의 학습 전략 생성</span>
            </>
          )}
        </button>
      </div>

      {plan && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <p className="opacity-90 flex items-center gap-2">
                <Check className="w-5 h-5" /> 핵심 목표: {plan.goal}
              </p>
            </div>

            <div className="p-8">
              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-slate-800 font-bold mb-6 text-lg">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-sm italic">S</span>
                  제안된 학습 일정
                </h4>
                <div className="space-y-4">
                  {plan.schedule.map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="w-24 shrink-0 font-bold text-slate-400 text-sm py-1 group-hover:text-indigo-600 transition-colors">
                        {item.time}
                      </div>
                      <div className="flex-1 pb-4 border-b border-slate-50 last:border-0">
                        <p className="font-bold text-slate-700 mb-1">{item.activity}</p>
                        <p className="text-sm text-slate-500">{item.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-slate-800 font-bold mb-4 text-lg">
                  <Info className="w-5 h-5 text-indigo-500" />
                  전문가 팁
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.tips.map((tip, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 border border-slate-100 leading-relaxed">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConsultant;
