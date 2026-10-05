import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, Radio, MapPin, Clock } from 'lucide-react';
import { DisasterAlert } from '../../types';

interface UrgentAlertBannerProps {
  alert: DisasterAlert | null;
  onStartProtectionPlan: () => void;
}

export const UrgentAlertBanner: React.FC<UrgentAlertBannerProps> = ({
  alert,
  onStartProtectionPlan,
}) => {
  if (!alert) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 via-white to-red-50/30 rounded-3xl border-2 border-red-500 shadow-xl p-6 sm:p-7 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
      {/* Background ambient red glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-red-200/80">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
                {alert.severity}
              </span>
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-ping text-red-600" /> Official KSNDMC Broadcast
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#17211B]">
                {alert.title}
              </h2>
            </div>
            <p className="text-xs text-[#55635C] mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-red-950">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                Target: {alert.districts.join(', ')} ({alert.taluks.join(', ')})
              </span>
              <span className="flex items-center gap-1 text-[#65736B]">
                <Clock className="w-3.5 h-3.5" />
                Issued: {new Date(alert.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Active 24-48h
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={onStartProtectionPlan}
          className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] cursor-pointer"
        >
          <span>EXECUTE PROTECTION PLAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-5 rounded-2xl border border-red-200/80 shadow-xs">
        {/* Left: Meteorological Impact */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-red-950 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Farm Vulnerability & Impact</span>
          </div>
          <p className="text-xs sm:text-sm text-[#17211B] leading-relaxed font-medium">
            {alert.farmImpact}
          </p>
          <div className="text-xs text-[#65736B] pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
            <span className="font-bold text-[#17211B]">Vulnerable Assets:</span>
            {alert.affectedResources.map((res, i) => (
              <span key={i} className="bg-red-50 text-red-900 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-red-100">
                {res}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Recommended Immediate Protection */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#146B3A] uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#146B3A]" />
            <span>Immediate Preventative Actions</span>
          </div>
          <ul className="space-y-2 text-xs text-[#17211B]">
            {alert.recommendedActions.slice(0, 4).map((action, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#F8FAF9] p-2 rounded-xl border border-[#E2E8E4] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#146B3A] shrink-0 mt-0.5" />
                <span className="leading-snug">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
