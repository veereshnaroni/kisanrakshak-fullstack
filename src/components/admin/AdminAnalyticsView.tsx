import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Sprout, Droplets } from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const districtStats = [
    { district: 'Kalaburagi', farmers: 4210, highRiskPct: 62, rainfallMm: 84 },
    { district: 'Belagavi', farmers: 5890, highRiskPct: 44, rainfallMm: 62 },
    { district: 'Vijayapura', farmers: 3450, highRiskPct: 58, rainfallMm: 72 },
    { district: 'Raichur', farmers: 3120, highRiskPct: 38, rainfallMm: 35 },
    { district: 'Shivamogga', farmers: 4100, highRiskPct: 18, rainfallMm: 45 },
    { district: 'Ballari', farmers: 2800, highRiskPct: 29, rainfallMm: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#146B3A]" /> Statewide Agricultural Disaster Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Real-time monitoring of crop vulnerability indexes, cumulative precipitation across taluks, and SDRF claim disbursements.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E4] shadow-xs">
          <span className="text-xs text-[#65736B] block">Total Enrolled Farmers</span>
          <span className="text-2xl font-extrabold text-[#17211B] mt-1 block">23,570</span>
          <span className="text-[11px] text-[#16834B] font-semibold mt-1 block">
            ↑ 12% registration this Kharif
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E4] shadow-xs">
          <span className="text-xs text-[#65736B] block">Active Disaster Advisories</span>
          <span className="text-2xl font-extrabold text-[#DC4444] mt-1 block">2 Active</span>
          <span className="text-[11px] text-[#DC4444] font-semibold mt-1 block">
            Covers 4 northern districts
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E4] shadow-xs">
          <span className="text-xs text-[#65736B] block">Average Farm Readiness</span>
          <span className="text-2xl font-extrabold text-[#146B3A] mt-1 block">78.4%</span>
          <span className="text-[11px] text-[#146B3A] font-semibold mt-1 block">
            High seed & drainage compliance
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E4] shadow-xs">
          <span className="text-xs text-[#65736B] block">Disbursed SDRF Relief</span>
          <span className="text-2xl font-extrabold text-purple-700 mt-1 block">₹4.82 Cr</span>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            Direct Benefit Transfer (DBT)
          </span>
        </div>
      </div>

      {/* Regional Table & Progress bars */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#17211B] mb-4">
          Karnataka District Vulnerability Distribution
        </h3>

        <div className="space-y-4">
          {districtStats.map((d, i) => (
            <div key={i} className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E2E8E4]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-sm font-bold text-[#17211B]">{d.district}</span>
                  <span className="text-xs text-[#65736B] ml-2">
                    {d.farmers.toLocaleString()} Registered Farmers • 24h Rain: {d.rainfallMm} mm
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    d.highRiskPct > 50
                      ? 'bg-red-100 text-red-700'
                      : d.highRiskPct > 30
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {d.highRiskPct}% Farmers at Risk
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    d.highRiskPct > 50 ? 'bg-[#DC4444]' : d.highRiskPct > 30 ? 'bg-[#F59E0B]' : 'bg-[#146B3A]'
                  }`}
                  style={{ width: `${d.highRiskPct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
