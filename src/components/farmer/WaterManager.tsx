import React, { useState } from 'react';
import { Droplets, Plus, ShieldCheck, AlertTriangle, ArrowUpRight, Gauge } from 'lucide-react';
import { WaterResource } from '../../types';
import { db } from '../../services/mockBackendApi';

export const WaterManager: React.FC = () => {
  const [waters, setWaters] = useState<WaterResource[]>(() => db.getWater());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWater, setNewWater] = useState<Partial<WaterResource>>({
    sourceName: '',
    sourceType: 'Borewell',
    capacityLiters: 150000,
    currentAvailabilityPercent: 80,
    irrigatedAreaAcres: 3.0,
    depthFeet: 400,
    status: 'Adequate',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWater.sourceName) return;

    const res: WaterResource = {
      id: `wat-${Date.now()}`,
      farmId: 'farm-1',
      sourceName: newWater.sourceName,
      sourceType: (newWater.sourceType as any) || 'Borewell',
      capacityLiters: Number(newWater.capacityLiters) || 100000,
      currentAvailabilityPercent: Number(newWater.currentAvailabilityPercent) || 80,
      irrigatedAreaAcres: Number(newWater.irrigatedAreaAcres) || 2.5,
      depthFeet: Number(newWater.depthFeet) || 350,
      lastCheckedDate: new Date().toISOString().slice(0, 10),
      status: (newWater.status as any) || 'Adequate',
      rechargeStructureWorking: true,
    };

    db.saveWater(res);
    setWaters(db.getWater());
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-600" /> Water Resources & Drought Defense
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Track borewell depth, open wells, and Krishi Honda farm ponds to plan emergency dry spell mitigation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Water Source
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {waters.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                <div>
                  <h3 className="text-base font-bold text-[#17211B]">{w.sourceName}</h3>
                  <span className="text-xs text-[#65736B]">Type: {w.sourceType}</span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    w.status === 'Abundant' || w.status === 'Adequate'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {w.status}
                </span>
              </div>

              <div className="my-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#65736B]">Current Water Volume</span>
                  <span className="font-extrabold text-[#17211B] text-sm">
                    {w.currentAvailabilityPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#F7F9F8] border border-[#E2E8E4] h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${w.currentAvailabilityPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Capacity</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">
                    {w.capacityLiters.toLocaleString()} Liters
                  </span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Command Area</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">
                    {w.irrigatedAreaAcres} Acres Irrigated
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs text-[#65736B]">
              <span>Depth: {w.depthFeet ? `${w.depthFeet} ft` : 'Surface Pond'}</span>
              <span className="text-[#146B3A] font-semibold">
                Recharge Structure: {w.rechargeStructureWorking ? 'Functional' : 'Needs Desilting'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Add Water Resource</h2>
            <p className="text-xs text-[#65736B] mb-4">Register irrigation sources for drought planning.</p>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Borewell #2"
                  value={newWater.sourceName}
                  onChange={(e) => setNewWater({ ...newWater, sourceName: e.target.value })}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Source Type</label>
                  <select
                    value={newWater.sourceType}
                    onChange={(e) => setNewWater({ ...newWater, sourceType: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Borewell">Borewell</option>
                    <option value="Open Well">Open Well</option>
                    <option value="Farm Pond (Krishi Honda)">Farm Pond (Krishi Honda)</option>
                    <option value="Canal">Canal</option>
                    <option value="Rainwater Storage Tank">Rainwater Storage Tank</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Depth (Feet)</label>
                  <input
                    type="number"
                    value={newWater.depthFeet}
                    onChange={(e) => setNewWater({ ...newWater, depthFeet: parseFloat(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Capacity (Liters)</label>
                  <input
                    type="number"
                    value={newWater.capacityLiters}
                    onChange={(e) => setNewWater({ ...newWater, capacityLiters: parseFloat(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Availability %</label>
                  <input
                    type="number"
                    value={newWater.currentAvailabilityPercent}
                    onChange={(e) => setNewWater({ ...newWater, currentAvailabilityPercent: parseFloat(e.target.value) })}
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
                  Save Water Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
