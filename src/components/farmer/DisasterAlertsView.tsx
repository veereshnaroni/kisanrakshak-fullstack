import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { DisasterAlert } from '../../types';
import { db } from '../../services/mockBackendApi';

interface DisasterAlertsViewProps {
  onStartProtectionPlan: () => void;
}

export const DisasterAlertsView: React.FC<DisasterAlertsViewProps> = ({ onStartProtectionPlan }) => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>(() => db.getAlerts());
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  useEffect(() => {
    const handleSync = () => {
      setAlerts(db.getAlerts());
    };
    window.addEventListener('kisan_alerts_updated', handleSync);
    return () => window.removeEventListener('kisan_alerts_updated', handleSync);
  }, []);

  const filtered = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'EMERGENCY':
        return 'bg-red-600 text-white';
      case 'WARNING':
        return 'bg-[#DC4444] text-white';
      case 'WATCH':
        return 'bg-[#F59E0B] text-white';
      default:
        return 'bg-[#146B3A] text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#DC4444]" /> Disaster & Meteorological Warnings
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Official early warnings issued by the Karnataka State Natural Disaster Monitoring Centre (KSNDMC) and Directorate of Agriculture.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center space-x-1 bg-[#F7F9F8] p-1.5 rounded-xl border border-[#E2E8E4]">
          {['ALL', 'EMERGENCY', 'WARNING', 'WATCH'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-white text-[#17211B] shadow-xs'
                  : 'text-[#65736B] hover:text-[#17211B]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#E2E8E4] p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#146B3A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#17211B]">No Active Warnings</h3>
            <p className="text-xs text-[#65736B] max-w-md mx-auto">
              There are currently no active disaster warnings in your region. All previous advisories have been resolved or withdrawn by State Control.
            </p>
          </div>
        ) : (
          filtered.map((alt) => (
          <div
            key={alt.id}
            className="bg-white rounded-2xl border-2 border-red-200 p-5 sm:p-6 shadow-xs hover:border-red-400 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8E4]">
              <div className="flex items-center space-x-3">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${getSeverityBadge(
                    alt.severity
                  )}`}
                >
                  {alt.severity}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#17211B]">{alt.title}</h3>
              </div>

              <span className="text-xs text-[#65736B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#146B3A]" /> Issued: {new Date(alt.issuedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="my-4">
              <p className="text-xs sm:text-sm text-[#17211B] leading-relaxed mb-3">
                {alt.description}
              </p>

              <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-200/60 mb-3">
                <span className="text-xs font-bold text-red-900 block mb-0.5">
                  FARM IMPACT:
                </span>
                <p className="text-xs text-[#17211B] font-medium leading-relaxed">
                  {alt.farmImpact}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <span className="font-bold text-[#65736B] block mb-1">AFFECTED REGIONS:</span>
                  <div className="flex items-center gap-1.5 text-[#17211B] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#146B3A]" />
                    Districts: {alt.districts.join(', ')} ({alt.taluks.join(', ')})
                  </div>
                </div>

                <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <span className="font-bold text-[#65736B] block mb-1">AFFECTED CROPS & ASSETS:</span>
                  <div className="flex flex-wrap gap-1">
                    {alt.affectedResources.map((res, i) => (
                      <span key={i} className="bg-white px-2 py-0.5 rounded border border-[#E2E8E4] font-medium">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Protection Plan Trigger */}
            <div className="pt-3 border-t border-[#E2E8E4] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#65736B]">
                Authority: <strong>{alt.createdBy}</strong>
              </span>

              <button
                onClick={onStartProtectionPlan}
                className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Follow Protection Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
