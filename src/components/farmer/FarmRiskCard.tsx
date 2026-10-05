import React from 'react';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { FarmRiskScore } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FarmRiskCardProps {
  riskScore: FarmRiskScore;
}

export const FarmRiskCard: React.FC<FarmRiskCardProps> = ({ riskScore }) => {
  const { t } = useLanguage();

  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case 'SEVERE':
        return 'bg-red-100 text-[#DC4444] border-red-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MODERATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-[#EAF6EE] text-[#146B3A] border-[#146B3A]/20';
    }
  };

  const getProgressColor = (val: number) => {
    if (val >= 70) return 'bg-[#DC4444]';
    if (val >= 40) return 'bg-[#F59E0B]';
    return 'bg-[#146B3A]';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#17211B] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#146B3A]" />
            {t('risk.title', 'Farm Risk Indicator')}
          </h2>
          <p className="text-xs text-[#65736B]">Composite vulnerability calculated for your holding</p>
        </div>

        <span
          className={`px-3 py-1 text-xs font-extrabold rounded-full border ${getBadgeColor(
            riskScore.overallCategory
          )}`}
        >
          {riskScore.overallCategory} RISK
        </span>
      </div>

      {/* Main Score Bar */}
      <div className="my-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#17211B]">
            {riskScore.overallScore}{' '}
            <span className="text-sm font-semibold text-[#65736B]">/ 100</span>
          </div>
          <span className="text-xs text-[#65736B]">Combined Agricultural Threat Index</span>
        </div>

        <div className="text-right max-w-xs">
          <p className="text-xs font-semibold text-[#17211B] leading-relaxed">
            {riskScore.explanation}
          </p>
        </div>
      </div>

      {/* Sub-Hazard Progress Breakdown */}
      <div className="space-y-3 pt-2">
        {/* Flood / Waterlogging */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#17211B] font-medium">Flood & Waterlogging Susceptibility</span>
            <span className="font-bold text-[#17211B]">{riskScore.breakdown.floodRisk}%</span>
          </div>
          <div className="w-full bg-[#F7F9F8] border border-[#E2E8E4] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                riskScore.breakdown.floodRisk
              )}`}
              style={{ width: `${riskScore.breakdown.floodRisk}%` }}
            ></div>
          </div>
        </div>

        {/* Drought */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#17211B] font-medium">Drought & Dry Spell Risk</span>
            <span className="font-bold text-[#17211B]">{riskScore.breakdown.droughtRisk}%</span>
          </div>
          <div className="w-full bg-[#F7F9F8] border border-[#E2E8E4] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                riskScore.breakdown.droughtRisk
              )}`}
              style={{ width: `${riskScore.breakdown.droughtRisk}%` }}
            ></div>
          </div>
        </div>

        {/* Heat Stress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#17211B] font-medium">Heat Stress & Evaporative Loss</span>
            <span className="font-bold text-[#17211B]">{riskScore.breakdown.heatStressRisk}%</span>
          </div>
          <div className="w-full bg-[#F7F9F8] border border-[#E2E8E4] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                riskScore.breakdown.heatStressRisk
              )}`}
              style={{ width: `${riskScore.breakdown.heatStressRisk}%` }}
            ></div>
          </div>
        </div>

        {/* Wind Damage */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#17211B] font-medium">Wind & Squall Lodging Hazard</span>
            <span className="font-bold text-[#17211B]">{riskScore.breakdown.windDamageRisk}%</span>
          </div>
          <div className="w-full bg-[#F7F9F8] border border-[#E2E8E4] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                riskScore.breakdown.windDamageRisk
              )}`}
              style={{ width: `${riskScore.breakdown.windDamageRisk}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Trust & Non-Guarantee Footnote */}
      <div className="mt-4 p-2.5 bg-[#F7F9F8] rounded-xl border border-[#E2E8E4] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#65736B] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#65736B] leading-relaxed">
          {t('risk.disclaimer', 'Risk indicator based on available weather/disaster data and the farm information you provided.')}
        </p>
      </div>
    </div>
  );
};
