import React, { useState } from 'react';
import { History, Shield, Clock, FileText } from 'lucide-react';
import { AuditLog } from '../../types';
import { db } from '../../services/mockBackendApi';

export const AdminAuditLogView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => db.getAuditLogs());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <History className="w-6 h-6 text-[#146B3A]" /> Administrative Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Immutable system activity log recording all disaster alert broadcasts, loss report verifications, and financial subsidy approvals.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden shadow-xs">
        <div className="divide-y divide-[#E2E8E4]">
          {logs.map((l) => (
            <div key={l.id} className="p-4 sm:p-5 hover:bg-[#F5FBF7] transition-colors text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#146B3A] bg-[#EAF6EE] px-2.5 py-0.5 rounded-full border border-[#146B3A]/20">
                    {l.action}
                  </span>
                  <span className="font-bold text-[#17211B]">{l.adminName}</span>
                </div>

                <span className="text-[#65736B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#146B3A]" /> {l.timestamp}
                </span>
              </div>

              <p className="text-[#17211B] font-medium leading-relaxed pl-1">{l.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
