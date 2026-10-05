import React from 'react';
import { CheckSquare, Square, ArrowRight, ListChecks, CheckCircle } from 'lucide-react';
import { PriorityAction } from '../../types';

interface TodayActionsCardProps {
  actions: PriorityAction[];
  onToggleAction: (id: string) => void;
  onViewAll: () => void;
}

export const TodayActionsCard: React.FC<TodayActionsCardProps> = ({
  actions,
  onToggleAction,
  onViewAll,
}) => {
  const completedCount = actions.filter((a) => a.completed).length;
  const totalCount = actions.length;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4] mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#17211B] flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#146B3A]" />
            TODAY'S PRIORITY ACTIONS
          </h2>
          <p className="text-xs text-[#65736B]">Preventive tasks generated from today's weather risk</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#146B3A] bg-[#EAF6EE] px-2.5 py-1 rounded-full border border-[#146B3A]/20">
            {completedCount} / {totalCount} completed
          </span>
        </div>
      </div>

      {/* Action items list */}
      <div className="space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => onToggleAction(act.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
              act.completed
                ? 'bg-[#F5FBF7] border-[#16834B]/30 opacity-90'
                : 'bg-white border-[#E2E8E4] hover:border-[#146B3A] hover:bg-[#F7F9F8]'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-lg shrink-0 cursor-pointer focus:outline-none"
            >
              {act.completed ? (
                <CheckCircle className="w-5 h-5 text-[#16834B]" />
              ) : (
                <Square className="w-5 h-5 text-[#65736B] hover:text-[#146B3A]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span
                  className={`text-sm font-bold ${
                    act.completed ? 'line-through text-[#65736B]' : 'text-[#17211B]'
                  }`}
                >
                  {act.title}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    act.urgency === 'HIGH'
                      ? 'bg-red-100 text-red-700'
                      : act.urgency === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {act.dueDate}
                </span>
              </div>

              <p className="text-xs text-[#65736B] mt-0.5 leading-relaxed">
                {act.description}
              </p>

              {!act.completed && (
                <p className="text-[11px] text-[#DC4444] mt-1 font-medium">
                  <strong>Risk if ignored:</strong> {act.impactIfIgnored}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <div className="mt-4 pt-3 border-t border-[#E2E8E4] flex items-center justify-between">
        <span className="text-xs text-[#65736B]">
          Completing actions raises your farm preparedness score
        </span>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#146B3A] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View 6-Step Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
