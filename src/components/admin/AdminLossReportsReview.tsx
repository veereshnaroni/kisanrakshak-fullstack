import React, { useState } from 'react';
import { FileSpreadsheet, CheckCircle, XCircle, Clock, Eye, Shield } from 'lucide-react';
import { LossReport } from '../../types';
import { db } from '../../services/mockBackendApi';

export const AdminLossReportsReview: React.FC = () => {
  const [reports, setReports] = useState<LossReport[]>(() => db.getLossReports());
  const [selectedReport, setSelectedReport] = useState<LossReport | null>(null);
  const [sanctionAmount, setSanctionAmount] = useState<number>(18500);
  const [remarks, setRemarks] = useState('');

  const handleUpdateStatus = (status: LossReport['status']) => {
    if (!selectedReport) return;

    const updated: LossReport = {
      ...selectedReport,
      status,
      officialRemarks: remarks || selectedReport.officialRemarks,
      compensationSanctionedInr: status === 'VERIFIED' ? sanctionAmount : selectedReport.compensationSanctionedInr,
    };

    db.saveLossReport(updated);
    db.addAuditLog({
      adminName: 'Dr. Siddharamaiah M.',
      action: `REVIEW_LOSS_REPORT_${status}`,
      entityType: 'LOSS_REPORT',
      entityId: selectedReport.id,
      details: `Processed claim ${selectedReport.id} for farmer ${selectedReport.farmerName} with status ${status}.`,
    });

    setReports(db.getLossReports());
    setSelectedReport(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#146B3A]" /> Disaster Loss Claim Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Review ground-truth damage assessments, verify geotagged photos, and sanction State Disaster Response Fund (SDRF) input subsidies.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E8E4] text-[#65736B] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Claim ID & Date</th>
                <th className="py-3 px-4">Farmer Details</th>
                <th className="py-3 px-4">Disaster Event</th>
                <th className="py-3 px-4">Resource & Extent</th>
                <th className="py-3 px-4">Claimed Loss (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4]">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#F5FBF7]">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#17211B] block">{rep.id}</span>
                    <span className="text-[10px] text-[#65736B]">
                      {new Date(rep.reportedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#17211B] block">{rep.farmerName}</span>
                    <span className="text-[10px] text-[#65736B] block">
                      {rep.village}, {rep.taluk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#17211B] font-medium">
                    {rep.disasterType}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#17211B] block">{rep.affectedResource}</span>
                    <span className="text-[10px] text-[#65736B] block">{rep.affectedAcreageOrUnits}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#17211B]">
                    ₹{rep.estimatedLossInr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        rep.status === 'VERIFIED'
                          ? 'bg-[#EAF6EE] text-[#146B3A]'
                          : rep.status === 'SUBMITTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedReport(rep);
                        setSanctionAmount(rep.compensationSanctionedInr || Math.round(rep.estimatedLossInr * 0.45));
                        setRemarks(rep.officialRemarks || '');
                      }}
                      className="bg-[#146B3A] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#1F8A4C] cursor-pointer"
                    >
                      Review Claim
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dialog */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4] mb-3">
              <div>
                <span className="text-[10px] font-bold text-[#146B3A] uppercase tracking-wider">
                  Field Enumeration Dossier
                </span>
                <h3 className="text-base font-bold text-[#17211B]">{selectedReport.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-xs text-[#65736B] hover:text-[#17211B]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4] space-y-1">
                <div>
                  <strong>Farmer:</strong> {selectedReport.farmerName} (Mob: {selectedReport.mobile})
                </div>
                <div>
                  <strong>Holding Location:</strong> {selectedReport.village}, {selectedReport.taluk}, {selectedReport.district}
                </div>
                <div>
                  <strong>Calamity Event:</strong> {selectedReport.disasterType}
                </div>
                <div>
                  <strong>Damaged Resource:</strong> {selectedReport.affectedResource} ({selectedReport.affectedAcreageOrUnits})
                </div>
                <div>
                  <strong>Damage Notes:</strong> {selectedReport.damageDescription}
                </div>
                <div>
                  <strong>Claimed Amount:</strong> ₹{selectedReport.estimatedLossInr.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">
                  Sanctioned SDRF Input Subsidy (₹)
                </label>
                <input
                  type="number"
                  value={sanctionAmount}
                  onChange={(e) => setSanctionAmount(parseFloat(e.target.value))}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">
                  Official Verification Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter crop loss % verified, joint enumeration remarks, or reason for sanction..."
                  className="w-full border border-[#E2E8E4] rounded-lg p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-[#E2E8E4]">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('SUBMITTED')}
                  className="px-3 py-2 text-xs font-semibold text-[#65736B] hover:bg-gray-100 rounded-lg"
                >
                  Mark Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('VERIFIED')}
                  className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Approve & Sanction Subsidy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
