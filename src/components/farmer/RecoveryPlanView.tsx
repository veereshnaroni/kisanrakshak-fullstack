import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Circle, Sprout, Wrench, Shield, ArrowRight } from 'lucide-react';
import { RecoveryTask } from '../../types';
import { db } from '../../services/mockBackendApi';

export const RecoveryPlanView: React.FC = () => {
  const [tasks, setTasks] = useState<RecoveryTask[]>(() => db.getRecoveryTasks());

  const handleToggle = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    setTasks(updated);
    db.saveRecoveryTasks(updated);
  };

  const completed = tasks.filter((t) => t.isCompleted).length;
  const progressPct = Math.round((completed / tasks.length) * 100);

  const phases = ['Immediate (0-7 Days)', 'Rebuilding (1-4 Weeks)', 'Long Term Restructure'] as const;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-purple-600" /> Post-Disaster Farm Recovery Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Phased agronomic roadmap: soil desalinization/drainage, replanting with short-duration varieties, borewell desilting, and input subsidy tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-xl border border-purple-200">
          <div>
            <div className="text-2xl font-extrabold text-purple-700">
              {progressPct}%
            </div>
            <span className="text-[11px] font-semibold text-[#65736B]">Recovery Progress</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-purple-600 flex items-center justify-center font-bold text-xs text-purple-700">
            {completed}/{tasks.length}
          </div>
        </div>
      </div>

      {/* Task categories by phase */}
      <div className="space-y-5">
        {phases.map((phase, idx) => {
          const phaseTasks = tasks.filter((t) => t.phase === phase);
          return (
            <div key={idx} className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4] mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#17211B]">{phase}</h3>
                </div>
                <span className="text-xs font-semibold text-[#65736B]">
                  {phaseTasks.filter((t) => t.isCompleted).length} / {phaseTasks.length} Done
                </span>
              </div>

              <div className="space-y-3">
                {phaseTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleToggle(t.id)}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                      t.isCompleted
                        ? 'bg-[#F5FBF7] border-[#146B3A]/30'
                        : 'bg-[#F7F9F8] border-[#E2E8E4] hover:border-purple-300'
                    }`}
                  >
                    <button type="button" className="mt-0.5 shrink-0">
                      {t.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16834B]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#65736B]" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            t.isCompleted ? 'line-through text-[#65736B]' : 'text-[#17211B]'
                          }`}
                        >
                          {t.taskTitle}
                        </span>
                        <span className="text-[10px] font-semibold bg-white border border-[#E2E8E4] px-2 py-0.5 rounded text-[#65736B]">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#65736B] mt-1 leading-relaxed">{t.guidance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
