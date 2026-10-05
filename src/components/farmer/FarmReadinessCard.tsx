import React from 'react';
import { ShieldCheck, Sprout, Package, Droplets, HeartHandshake, Wrench, Warehouse, FileText, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ReadinessMetrics {
  overall: number;
  crops: number;
  seeds: number;
  water: number;
  livestock: number;
  assets: number;
  storage: number;
  documents: number;
  emergencyPlan: number;
}

interface FarmReadinessCardProps {
  metrics?: Partial<ReadinessMetrics>;
}

export const FarmReadinessCard: React.FC<FarmReadinessCardProps> = ({ metrics }) => {
  const { t } = useLanguage();

  const data: ReadinessMetrics = {
    overall: metrics?.overall ?? 76,
    crops: metrics?.crops ?? 85,
    seeds: metrics?.seeds ?? 92,
    water: metrics?.water ?? 64,
    livestock: metrics?.livestock ?? 80,
    assets: metrics?.assets ?? 70,
    storage: metrics?.storage ?? 88,
    documents: metrics?.documents ?? 95,
    emergencyPlan: metrics?.emergencyPlan ?? 55,
  };

  const categories = [
    { label: 'Crops Safety', value: data.crops, icon: Sprout },
    { label: 'Seed Stock', value: data.seeds, icon: Package },
    { label: 'Water Reserve', value: data.water, icon: Droplets },
    { label: 'Livestock Care', value: data.livestock, icon: HeartHandshake },
    { label: 'Machinery & Assets', value: data.assets, icon: Wrench },
    { label: 'Storage Godown', value: data.storage, icon: Warehouse },
    { label: 'Land Documents', value: data.documents, icon: FileText },
    { label: 'Emergency Readiness', value: data.emergencyPlan, icon: PhoneCall },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E2E8E4] mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#17211B] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#146B3A]" />
            {t('readiness.overall', 'Overall Farm Readiness')}
          </h2>
          <p className="text-xs text-[#65736B]">Proactive preparedness status before disasters</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#146B3A]">
            {data.overall}%
          </span>
          <span className="text-[11px] font-bold bg-[#EAF6EE] text-[#146B3A] px-2.5 py-1 rounded-full border border-[#146B3A]/20">
            PROTECTED
          </span>
        </div>
      </div>

      {/* Grid of micro indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E8E4] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#17211B] flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5 text-[#146B3A]" />
                  <span className="truncate">{cat.label}</span>
                </span>
                <span className="text-xs font-bold text-[#17211B]">{cat.value}%</span>
              </div>

              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    cat.value >= 80 ? 'bg-[#146B3A]' : cat.value >= 60 ? 'bg-[#F59E0B]' : 'bg-[#DC4444]'
                  }`}
                  style={{ width: `${cat.value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
