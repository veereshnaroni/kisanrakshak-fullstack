import React, { useState } from 'react';
import { Warehouse, Plus, CheckCircle, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { StorageUnit } from '../../types';
import { db } from '../../services/mockBackendApi';

export const StorageManager: React.FC = () => {
  const [units, setUnits] = useState<StorageUnit[]>(() => db.getStorage());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState<Partial<StorageUnit>>({
    unitName: 'Secondary Godown',
    type: 'Seed Storage',
    elevationAboveGroundCm: 30,
    isWaterproofRoof: true,
    isPestProtected: true,
    isVentilated: true,
    readinessPercentage: 90,
  });

  const handleToggle = (id: string, field: 'isWaterproofRoof' | 'isPestProtected' | 'isVentilated') => {
    const updated = units.map((u) => {
      if (u.id === id) {
        const val = !u[field];
        const next = { ...u, [field]: val };
        const score =
          (next.isWaterproofRoof ? 35 : 0) +
          (next.isPestProtected ? 35 : 0) +
          (next.isVentilated ? 30 : 0);
        return { ...next, readinessPercentage: score };
      }
      return u;
    });
    setUnits(updated);
    updated.forEach((u) => db.saveStorage(u));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit.unitName) return;

    const u: StorageUnit = {
      id: `str-${Date.now()}`,
      farmId: 'farm-1',
      unitName: newUnit.unitName,
      type: (newUnit.type as any) || 'Seed Storage',
      elevationAboveGroundCm: Number(newUnit.elevationAboveGroundCm) || 30,
      isWaterproofRoof: true,
      isPestProtected: true,
      isVentilated: true,
      readinessPercentage: 100,
    };

    db.saveStorage(u);
    setUnits(db.getStorage());
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-[#146B3A]" /> Storage & Warehouse Readiness
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Audit elevation, waterproofing, and pest proofing for seed, fertilizer, and harvested grain storerooms.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Storage Unit
        </button>
      </div>

      {/* Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {units.map((u) => (
          <div
            key={u.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                <div>
                  <h3 className="text-base font-bold text-[#17211B]">{u.unitName}</h3>
                  <span className="text-xs text-[#65736B]">Type: {u.type}</span>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#146B3A]">
                    {u.readinessPercentage}%
                  </span>
                  <span className="text-[10px] text-[#65736B] block">Readiness</span>
                </div>
              </div>

              <div className="my-4 space-y-2 text-xs">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4] flex justify-between items-center">
                  <span className="text-[#65736B]">Elevation Above Ground</span>
                  <span className="font-bold text-[#17211B]">{u.elevationAboveGroundCm} cm</span>
                </div>

                {/* Interactive checks */}
                <div
                  onClick={() => handleToggle(u.id, 'isWaterproofRoof')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                >
                  <span className="text-[#17211B]">Waterproof Roofing & Seal</span>
                  {u.isWaterproofRoof ? (
                    <CheckCircle className="w-4 h-4 text-[#16834B]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#65736B]" />
                  )}
                </div>

                <div
                  onClick={() => handleToggle(u.id, 'isPestProtected')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                >
                  <span className="text-[#17211B]">Rodent & Pest Protection Mesh</span>
                  {u.isPestProtected ? (
                    <CheckCircle className="w-4 h-4 text-[#16834B]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#65736B]" />
                  )}
                </div>

                <div
                  onClick={() => handleToggle(u.id, 'isVentilated')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                >
                  <span className="text-[#17211B]">Adequate Cross-Ventilation</span>
                  {u.isVentilated ? (
                    <CheckCircle className="w-4 h-4 text-[#16834B]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#65736B]" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] text-[11px] text-[#65736B] flex items-center justify-between">
              <span>Status: {u.readinessPercentage > 85 ? 'Disaster Ready' : 'Needs Reinforcement'}</span>
              <span className="text-[#146B3A] font-bold">Verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Add Storage Unit</h2>
            <p className="text-xs text-[#65736B] mb-4">Register godowns to track moisture protection.</p>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Unit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Storage Shed"
                  value={newUnit.unitName}
                  onChange={(e) => setNewUnit({ ...newUnit, unitName: e.target.value })}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Storage Type</label>
                  <select
                    value={newUnit.type}
                    onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Seed Storage">Seed Storage</option>
                    <option value="Fertilizer Godown">Fertilizer Godown</option>
                    <option value="Harvested Grain Store">Harvested Grain Store</option>
                    <option value="Implement Shed">Implement Shed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Elevation (cm)</label>
                  <input
                    type="number"
                    value={newUnit.elevationAboveGroundCm}
                    onChange={(e) => setNewUnit({ ...newUnit, elevationAboveGroundCm: parseFloat(e.target.value) })}
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
                  Save Storage Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
