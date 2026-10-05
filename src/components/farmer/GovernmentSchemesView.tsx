import React, { useState } from 'react';
import { Landmark, ExternalLink, CheckCircle, FileText, Phone, Search } from 'lucide-react';
import { GovernmentScheme } from '../../types';
import { db } from '../../services/mockBackendApi';

export const GovernmentSchemesView: React.FC = () => {
  const [schemes] = useState<GovernmentScheme[]>(() => db.getSchemes());
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const handleCheckEligibility = (scheme: GovernmentScheme) => {
    setSelectedScheme(scheme);
    setEligibilityResult(
      `Based on your registered 5.2 acres in Kalaburagi with active RTC, you appear broadly eligible for ${scheme.name}. Official sanction requires field physical verification by your Raitha Samparka Kendra officer.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#146B3A]" /> Karnataka Agriculture Support Schemes
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Verified state and central disaster relief programs, crop insurance subsidies, and farm pond grants.
          </p>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-4">
        {schemes.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs hover:border-[#146B3A] transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#E2E8E4]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#17211B]">{sch.name}</h3>
                <span className="text-xs text-[#146B3A] font-semibold">{sch.nameKn}</span>
                <p className="text-xs text-[#65736B] mt-0.5">Department: {sch.department}</p>
              </div>

              <button
                onClick={() => handleCheckEligibility(sch)}
                className="bg-[#EAF6EE] hover:bg-[#146B3A] text-[#146B3A] hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-[#146B3A]/30 cursor-pointer"
              >
                Check Eligibility
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-[#17211B] leading-relaxed">
                <strong>Purpose:</strong> {sch.purpose}
              </p>

              <div className="bg-[#F5FBF7] p-3 rounded-xl border border-[#146B3A]/20">
                <span className="font-bold text-[#146B3A] block mb-1">KEY FINANCIAL BENEFITS:</span>
                <p className="text-[#17211B]">{sch.benefits}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <span className="font-bold text-[#65736B] block mb-1">ELIGIBILITY CRITERIA:</span>
                  <ul className="list-disc list-inside space-y-1 text-[#17211B]">
                    {sch.eligibilityCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <span className="font-bold text-[#65736B] block mb-1">REQUIRED DOCUMENTS:</span>
                  <ul className="list-disc list-inside space-y-1 text-[#17211B]">
                    {sch.requiredDocuments.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#65736B] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#146B3A]" /> Helpline: <strong>{sch.helpline}</strong>
              </span>

              <a
                href={sch.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#146B3A] font-bold hover:underline flex items-center gap-1"
              >
                <span>Official Karnataka Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility Modal */}
      {eligibilityResult && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h3 className="text-base font-bold text-[#17211B] mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#146B3A]" /> Eligibility Assessment
            </h3>
            <p className="text-xs text-[#17211B] leading-relaxed mb-4 bg-[#F5FBF7] p-3 rounded-xl border border-[#146B3A]/20">
              {eligibilityResult}
            </p>
            <div className="text-right">
              <button
                onClick={() => setEligibilityResult(null)}
                className="bg-[#146B3A] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
