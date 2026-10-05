import React, { useState } from 'react';
import { Sprout, Plus, Calendar, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Crop } from '../../types';
import { db } from '../../services/mockBackendApi';

interface CropManagerProps {
  onOpenProtectionPlan: () => void;
}

export const CropManager: React.FC<CropManagerProps> = ({ onOpenProtectionPlan }) => {
  const [crops, setCrops] = useState<Crop[]>(() => db.getCrops());
  const [showAddModal, setShowAddModal] = useState(false);
  const [cropToDelete, setCropToDelete] = useState<Crop | null>(null);
  const [newCrop, setNewCrop] = useState<Partial<Crop>>({
    name: 'Tur (Pigeon Pea / ತೊಗರಿ)',
    variety: 'GRG-811',
    areaAcres: 2.5,
    sowingDate: '2026-07-01',
    expectedHarvestDate: '2026-11-20',
    growthStage: 'Flowering',
    irrigationMethod: 'Drip Irrigation',
    condition: 'Good',
  });

  const handleSaveCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.name) return;

    const crop: Crop = {
      id: `crop-${Date.now()}`,
      farmId: 'farm-1',
      name: newCrop.name || 'Crop',
      kannadaName: newCrop.name?.includes('ತೊಗರಿ') ? 'ತೊಗರಿ' : 'ಬೆಳೆ',
      variety: newCrop.variety || 'Local Desi',
      areaAcres: Number(newCrop.areaAcres) || 1.0,
      sowingDate: newCrop.sowingDate || new Date().toISOString().slice(0, 10),
      expectedHarvestDate: newCrop.expectedHarvestDate || '2026-12-01',
      growthStage: (newCrop.growthStage as any) || 'Vegetative',
      irrigationMethod: newCrop.irrigationMethod || 'Rainfed',
      condition: (newCrop.condition as any) || 'Good',
      vulnerabilityTo: ['Waterlogging', 'Pod Borer'],
    };

    db.saveCrop(crop);
    setCrops(db.getCrops());
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (!cropToDelete) return;
    db.deleteCrop(cropToDelete.id);
    setCrops((prev) => prev.filter((c) => c.id !== cropToDelete.id));
    setCropToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Sprout className="w-6 h-6 text-[#146B3A]" /> Standing Crop Register
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Register your crops to receive stage-specific advisories (e.g. flowering stage vulnerability during rainfall warnings).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Sown Crop
        </button>
      </div>

      {/* Crops Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#17211B]">{crop.name}</h3>
                    <span className="text-[11px] font-semibold text-[#146B3A] bg-[#EAF6EE] px-2 py-0.5 rounded-full">
                      {crop.variety}
                    </span>
                  </div>
                  <p className="text-xs text-[#65736B] mt-0.5">
                    Stage: <strong className="text-[#17211B]">{crop.growthStage}</strong> • Sown: {crop.sowingDate}
                  </p>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  MODERATE RISK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Cultivated Acreage</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{crop.areaAcres} Acres</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Target Harvest Date</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{crop.expectedHarvestDate}</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Irrigation System</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{crop.irrigationMethod}</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">General Condition</span>
                  <span className="font-bold text-[#146B3A] mt-0.5 block">{crop.condition}</span>
                </div>
              </div>

              {/* Specific Vulnerabilities */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-[#65736B] block mb-1">
                  DISASTER VULNERABILITIES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {crop.vulnerabilityTo?.map((v, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCropToDelete(crop)}
                className="text-xs text-red-500 hover:text-red-700 hover:underline cursor-pointer"
              >
                Delete Crop
              </button>

              <button
                onClick={onOpenProtectionPlan}
                className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Protect This Crop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Crop Modal */}
      {cropToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-[#17211B]">Remove Crop Record?</h3>
            <p className="text-xs text-[#65736B] mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong>{cropToDelete.name}</strong> ({cropToDelete.variety})?
            </p>
            <div className="flex items-center justify-end space-x-2 mt-5">
              <button
                type="button"
                onClick={() => setCropToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#65736B] hover:bg-[#F7F9F8] border border-[#E2E8E4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC4444] hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Add Standing Crop</h2>
            <p className="text-xs text-[#65736B] mb-4">
              Enter crop growth stage to calculate waterlogging & drought risk accurately.
            </p>

            <form onSubmit={handleSaveCrop} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Variety / Hybrid</label>
                  <input
                    type="text"
                    placeholder="e.g. GRG-811 / Maldandi"
                    value={newCrop.variety}
                    onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newCrop.areaAcres}
                    onChange={(e) => setNewCrop({ ...newCrop, areaAcres: parseFloat(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Current Growth Stage</label>
                  <select
                    value={newCrop.growthStage}
                    onChange={(e) => setNewCrop({ ...newCrop, growthStage: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Pod Formation">Pod Formation</option>
                    <option value="Maturity / Ready to Harvest">Maturity / Ready to Harvest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Sowing Date</label>
                  <input
                    type="date"
                    required
                    value={newCrop.sowingDate}
                    onChange={(e) => setNewCrop({ ...newCrop, sowingDate: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={newCrop.expectedHarvestDate}
                    onChange={(e) => setNewCrop({ ...newCrop, expectedHarvestDate: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E8E4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-[#65736B] hover:text-[#17211B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-5 py-2 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Register Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
