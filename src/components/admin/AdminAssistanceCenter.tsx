import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Clock, Phone, AlertTriangle, UserCheck } from 'lucide-react';
import { AssistanceRequest } from '../../types';
import { db } from '../../services/mockBackendApi';

export const AdminAssistanceCenter: React.FC = () => {
  const [requests, setRequests] = useState<AssistanceRequest[]>(() => db.getAssistanceRequests());

  const handleAssign = (id: string) => {
    const officer = prompt('Enter designated field officer name (e.g. Basavaraj AAO):', 'Basavaraj AAO');
    if (!officer) return;

    const updated = requests.map((r) =>
      r.id === id ? { ...r, assignedOfficer: officer, status: 'DISPATCHED' as const } : r
    );
    setRequests(updated);
    updated.forEach((r) => db.saveAssistanceRequest(r));
    alert('Emergency response dispatched to farmer!');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-[#146B3A]" /> Field Disaster Assistance Centre
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Dispatch de-watering diesel pumps, emergency livestock fodder, and field assessment teams to distressed farmers.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                <div>
                  <h3 className="text-base font-bold text-[#17211B]">{req.farmerName}</h3>
                  <p className="text-xs text-[#65736B]">
                    {req.village ? `${req.village}, ` : ''}{req.taluk}, {req.district} • Mob: {req.mobile}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                    req.priority === 'EMERGENCY'
                      ? 'bg-red-600 text-white'
                      : req.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {req.priority} PRIORITY
                </span>
              </div>

              <div className="my-3 space-y-2 text-xs">
                <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <span className="font-bold text-[#65736B] block">REPORTED EMERGENCY:</span>
                  <p className="text-[#17211B] mt-0.5">{req.problem}</p>
                </div>

                <div className="flex justify-between items-center bg-[#F5FBF7] p-2.5 rounded-xl border border-[#146B3A]/20">
                  <span className="text-[#65736B]">Required Assistance:</span>
                  <span className="font-bold text-[#146B3A]">{req.requiredHelp}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
              <span className="text-[#65736B]">
                Officer: <strong>{req.assignedOfficer || 'Not Assigned'}</strong>
              </span>

              <button
                onClick={() => handleAssign(req.id)}
                className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{req.assignedOfficer ? 'Re-assign' : 'Assign Officer'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
