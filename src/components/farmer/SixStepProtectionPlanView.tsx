import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  CloudRain,
  Sprout,
  HeartHandshake,
  Warehouse,
  FileCheck,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { ProtectionStep } from '../../types';
import { db } from '../../services/mockBackendApi';

interface SixStepProtectionPlanViewProps {
  onBackToDashboard?: () => void;
}

export const SixStepProtectionPlanView: React.FC<SixStepProtectionPlanViewProps> = ({
  onBackToDashboard,
}) => {
  const [steps, setSteps] = useState<ProtectionStep[]>(() => db.getProtectionSteps());
  const [expandedStep, setExpandedStep] = useState<number>(2); // Default to Step 2

  const handleToggleSubtask = (stepNumber: number, taskId: string) => {
    const updated = steps.map((s) => {
      if (s.stepNumber === stepNumber) {
        const updatedChecklist = s.checklist.map((item) =>
          item.id === taskId ? { ...item, completed: !item.completed } : item
        );
        const completedTotal = updatedChecklist.filter((c) => c.completed).length;
        const pct = Math.round((completedTotal / updatedChecklist.length) * 100);
        const status =
          pct === 100 ? 'COMPLETED' : pct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

        return {
          ...s,
          checklist: updatedChecklist,
          progressPercentage: pct,
          status: status as 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED',
        };
      }
      return s;
    });

    setSteps(updated);
    db.saveProtectionSteps(updated);
  };

  const completedStepsCount = steps.filter((s) => s.status === 'COMPLETED').length;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'Warehouse':
        return <Warehouse className="w-5 h-5" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5" />;
      default:
        return <PhoneCall className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#146B3A]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B]">
              6-Step Farm Protection Plan
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            A comprehensive, field-tested preventive framework designed to safeguard crops, seeds, livestock, and machinery before natural disasters hit Karnataka.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#F5FBF7] p-3 rounded-xl border border-[#146B3A]/20">
          <div>
            <div className="text-2xl font-extrabold text-[#146B3A]">
              {completedStepsCount} / {steps.length}
            </div>
            <span className="text-[11px] font-semibold text-[#65736B]">Steps Completed</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#146B3A] flex items-center justify-center font-bold text-xs text-[#146B3A]">
            {Math.round((completedStepsCount / steps.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isExpanded = expandedStep === step.stepNumber;
          const isDone = step.status === 'COMPLETED';
          const isInProgress = step.status === 'IN_PROGRESS';

          return (
            <div
              key={step.stepNumber}
              className={`bg-white rounded-2xl border transition-all ${
                isDone
                  ? 'border-[#146B3A]/40 shadow-xs'
                  : isInProgress
                  ? 'border-amber-300 shadow-xs'
                  : 'border-[#E2E8E4]'
              }`}
            >
              {/* Step Header Accordion */}
              <div
                onClick={() => setExpandedStep(isExpanded ? 0 : step.stepNumber)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      isDone
                        ? 'bg-[#EAF6EE] text-[#146B3A]'
                        : isInProgress
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-[#65736B]'
                    }`}
                  >
                    0{step.stepNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#17211B] truncate">
                        {step.title}
                      </h3>
                      {step.titleKn && (
                        <span className="text-xs text-[#65736B] hidden sm:inline">
                          ({step.titleKn})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#65736B] mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isDone
                        ? 'bg-[#EAF6EE] text-[#146B3A]'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {step.status.replace('_', ' ')}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#65736B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#65736B]" />
                  )}
                </div>
              </div>

              {/* Step Details & Interactive Checklist */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E2E8E4]">
                  <p className="text-xs text-[#17211B] mb-3 font-medium">
                    {step.description}
                  </p>

                  <div className="space-y-2">
                    {step.checklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleSubtask(step.stepNumber, item.id)}
                        className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                          item.completed
                            ? 'bg-[#F5FBF7] border-[#146B3A]/30'
                            : 'bg-[#F7F9F8] border-[#E2E8E4] hover:border-[#146B3A]'
                        }`}
                      >
                        <button type="button" className="mt-0.5 shrink-0">
                          {item.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#146B3A]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#65736B]" />
                          )}
                        </button>

                        <div className="flex-1 flex items-center justify-between">
                          <span
                            className={`text-xs font-medium ${
                              item.completed ? 'line-through text-[#65736B]' : 'text-[#17211B]'
                            }`}
                          >
                            {item.text}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              item.importance === 'Essential'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.importance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-[#65736B]">
                    <span>
                      Progress: <strong>{step.progressPercentage}% completed</strong>
                    </span>
                    <button
                      onClick={() =>
                        setExpandedStep(
                          step.stepNumber < 6 ? step.stepNumber + 1 : 1
                        )
                      }
                      className="text-[#146B3A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
