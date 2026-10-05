import React, { useState } from 'react';
import { FileSpreadsheet, Plus, CheckCircle, Clock, Upload, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { LossReport } from '../../types';
import { db } from '../../services/mockBackendApi';
import { useAuth } from '../../context/AuthContext';

export const LossReportWizard: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const [reports, setReports] = useState<LossReport[]>(() => db.getLossReports());
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Form states
  const [disasterType, setDisasterType] = useState('Heavy Downpour & Flash Waterlogging');
  const [affectedResource, setAffectedResource] = useState<LossReport['affectedResource']>('Crops');
  const [resourceDetails, setResourceDetails] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [estimatedLossInr, setEstimatedLossInr] = useState(35000);
  const [affectedUnits, setAffectedUnits] = useState('2.0 Acres');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportId = `rep-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newReport: LossReport = {
      id: reportId,
      farmerId: currentUser?.id || 'usr-farmer-1',
      farmerName: currentUser?.name || farmerProfile.name || 'Farmer',
      mobile: currentUser?.mobile || farmerProfile.mobile || '',
      district: currentUser?.district || farmerProfile.district || 'Kalaburagi',
      taluk: currentUser?.taluk || farmerProfile.taluk || 'Kalaburagi',
      village: currentUser?.village || farmerProfile.village || '',
      farmName: `${currentUser?.name || farmerProfile.name || 'Farmer'}'s Farm`,
      disasterType,
      affectedResource,
      resourceDetails: resourceDetails || `${affectedResource} in holding plot`,
      damageDescription,
      estimatedLossInr,
      affectedAcreageOrUnits: affectedUnits,
      photosUploaded: [
        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80',
      ],
      reportedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };

    db.saveLossReport(newReport);
    setReports(db.getLossReports());
    setSubmittedId(reportId);
    setStep(7); // success step
  };

  const getStatusBadge = (status: LossReport['status']) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-[#EAF6EE] text-[#146B3A] border-[#146B3A]/20';
      case 'SUPPORT_PROCESSING':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#146B3A]" /> Post-Disaster Loss Reporting & Claims
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            If damage occurs despite preventive action, submit an official photo-verified claim for SDRF input subsidy and PMFBY assessment.
          </p>
        </div>

        <button
          onClick={() => {
            setIsWizardOpen(true);
            setStep(1);
            setSubmittedId(null);
          }}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> File New Loss Report
        </button>
      </div>

      {/* Reports History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#17211B]">Your Submitted Loss Reports</h3>
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8E4]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#17211B]">{rep.id}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      rep.status
                    )}`}
                  >
                    {rep.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-[#65736B] mt-0.5">
                  Disaster: <strong className="text-[#17211B]">{rep.disasterType}</strong> • Reported on: {new Date(rep.reportedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#65736B] block">Claimed Loss</span>
                <span className="text-lg font-extrabold text-[#17211B]">
                  ₹{rep.estimatedLossInr.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                <span className="text-[#65736B] block">Damaged Resource</span>
                <span className="font-bold text-[#17211B] mt-0.5 block">{rep.affectedResource}</span>
                <span className="text-[#65736B] mt-0.5 block">{rep.resourceDetails}</span>
              </div>
              <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                <span className="text-[#65736B] block">Extent of Damage</span>
                <span className="font-bold text-[#17211B] mt-0.5 block">{rep.affectedAcreageOrUnits}</span>
              </div>
              <div className="bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                <span className="text-[#65736B] block">Sanctioned Relief</span>
                <span className="font-extrabold text-[#146B3A] mt-0.5 block">
                  {rep.compensationSanctionedInr ? `₹${rep.compensationSanctionedInr.toLocaleString()}` : 'Under Review'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#17211B] leading-relaxed bg-[#F5FBF7] p-3 rounded-xl border border-[#146B3A]/20">
              <strong>Damage Description:</strong> {rep.damageDescription}
            </p>

            {rep.officialRemarks && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                <strong>AAO Field Inspection Remarks:</strong> {rep.officialRemarks}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 6-Step Loss Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            {step < 7 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B3A]">
                      Step {step} of 6
                    </span>
                    <h3 className="text-base font-bold text-[#17211B]">
                      {step === 1 && '1. Select Natural Disaster Event'}
                      {step === 2 && '2. Select Affected Farm Resource'}
                      {step === 3 && '3. Extent of Affected Acreage or Units'}
                      {step === 4 && '4. Describe Actual Damage Incurred'}
                      {step === 5 && '5. Estimate Financial Loss (₹)'}
                      {step === 6 && '6. Upload Geotagged Photos / Evidence'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(false)}
                    className="text-xs text-[#65736B] hover:text-[#17211B]"
                  >
                    Close
                  </button>
                </div>

                {/* Step 1 */}
                {step === 1 && (
                  <div className="space-y-2 text-xs">
                    <p className="text-[#65736B]">Select the natural calamity that caused damage:</p>
                    {[
                      'Heavy Downpour & Flash Waterlogging',
                      'Severe Drought & Borewell Depletion',
                      'Cyclonic Surface Wind & Lodging',
                      'Hailstorm & Physical Defoliation',
                      'Heatwave & Blossom Desiccation',
                      'Pest Swarm / Pod Borer Surge',
                    ].map((d) => (
                      <label
                        key={d}
                        className={`flex items-center p-3 rounded-xl border cursor-pointer ${
                          disasterType === d
                            ? 'bg-[#EAF6EE] border-[#146B3A] text-[#146B3A] font-bold'
                            : 'hover:bg-[#F7F9F8] border-[#E2E8E4]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="disaster"
                          checked={disasterType === d}
                          onChange={() => setDisasterType(d)}
                          className="mr-3"
                        />
                        {d}
                      </label>
                    ))}
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="space-y-2 text-xs">
                    <p className="text-[#65736B]">Select which resource sustained damage:</p>
                    {[
                      'Crops',
                      'Seed Stock',
                      'Livestock',
                      'Farm Machinery',
                      'Storage / Godown',
                      'Borewell / Water Infrastructure',
                    ].map((res) => (
                      <label
                        key={res}
                        className={`flex items-center p-3 rounded-xl border cursor-pointer ${
                          affectedResource === res
                            ? 'bg-[#EAF6EE] border-[#146B3A] text-[#146B3A] font-bold'
                            : 'hover:bg-[#F7F9F8] border-[#E2E8E4]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="resource"
                          checked={affectedResource === res}
                          onChange={() => setAffectedResource(res as any)}
                          className="mr-3"
                        />
                        {res}
                      </label>
                    ))}
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#17211B] mb-1">
                        Affected Resource Particulars
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tur GRG-811 / Submersible Motor"
                        value={resourceDetails}
                        onChange={(e) => setResourceDetails(e.target.value)}
                        className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#17211B] mb-1">
                        Acreage or Head Count Affected
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1.5 Acres or 2 Cattle"
                        value={affectedUnits}
                        onChange={(e) => setAffectedUnits(e.target.value)}
                        className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div className="space-y-3 text-xs">
                    <label className="block font-semibold text-[#17211B] mb-1">
                      Detailed Damage Description
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe water stagnation hours, root rot symptoms, crop lodging percentage, or equipment submersion..."
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      className="w-full border border-[#E2E8E4] rounded-lg p-3 text-sm focus:outline-[#146B3A]"
                    />
                  </div>
                )}

                {/* Step 5 */}
                {step === 5 && (
                  <div className="space-y-3 text-xs">
                    <label className="block font-semibold text-[#17211B] mb-1">
                      Estimated Financial Loss in Indian Rupees (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-base font-bold text-[#65736B]">₹</span>
                      <input
                        type="number"
                        required
                        value={estimatedLossInr}
                        onChange={(e) => setEstimatedLossInr(parseFloat(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-[#E2E8E4] rounded-lg text-lg font-bold text-[#17211B]"
                      />
                    </div>
                    <p className="text-[#65736B] text-[11px]">
                      Estimate seed cost, fertilizers used, irrigation charges, and anticipated yield loss.
                    </p>
                  </div>
                )}

                {/* Step 6 */}
                {step === 6 && (
                  <div className="space-y-3 text-xs">
                    <p className="text-[#65736B]">
                      Upload photos showing waterlogged field or damaged structures for official validation:
                    </p>
                    <div className="border-2 border-dashed border-[#146B3A]/40 rounded-xl p-6 text-center bg-[#F5FBF7]">
                      <Camera className="w-8 h-8 text-[#146B3A] mx-auto mb-2" />
                      <span className="font-bold text-[#146B3A] block">field_waterlogging_proof.jpg</span>
                      <span className="text-[11px] text-[#65736B]">Geotagged with coordinates (17.3297, 76.8343)</span>
                    </div>
                  </div>
                )}

                {/* Wizard navigation buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8E4]">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 text-xs font-semibold text-[#65736B] hover:text-[#17211B]"
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 6 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Submit Official Claim
                    </button>
                  )}
                </div>
              </form>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EAF6EE] text-[#146B3A] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-lg font-bold text-[#17211B]">
                  Loss Report Submitted Successfully
                </h3>
                <p className="text-xs text-[#65736B] max-w-sm mx-auto">
                  Your reference ID is <strong>{submittedId}</strong>. The Taluk Assistant Agriculture Officer (AAO) has been notified for joint field enumeration.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className="bg-[#146B3A] text-white px-6 py-2 rounded-xl text-xs font-bold"
                  >
                    Done & View Reports
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
