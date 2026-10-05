import React, { useState } from 'react';
import { Wrench, Plus, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { FarmAsset } from '../../types';
import { db } from '../../services/mockBackendApi';

export const AssetManager: React.FC = () => {
  const [assets, setAssets] = useState<FarmAsset[]>(() => db.getAssets());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<FarmAsset>>({
    name: '',
    category: 'Submersible Pump',
    quantity: 1,
    storageLocation: 'Implement Shed',
    estimatedValueInr: 35000,
    protectionStatus: 'SAFE',
    securedAgainstFlood: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) return;

    const ast: FarmAsset = {
      id: `ast-${Date.now()}`,
      farmId: 'farm-1',
      name: newAsset.name,
      category: (newAsset.category as any) || 'Submersible Pump',
      quantity: Number(newAsset.quantity) || 1,
      storageLocation: newAsset.storageLocation || 'Shed',
      estimatedValueInr: Number(newAsset.estimatedValueInr) || 20000,
      protectionStatus: (newAsset.protectionStatus as any) || 'SAFE',
      securedAgainstFlood: true,
    };

    db.saveAsset(ast);
    setAssets(db.getAssets());
    setShowAddModal(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = assets.map((a) => {
      if (a.id === id) {
        const next =
          a.protectionStatus === 'SAFE'
            ? 'AT RISK'
            : a.protectionStatus === 'AT RISK'
            ? 'PROTECTED'
            : 'SAFE';
        return { ...a, protectionStatus: next as any };
      }
      return a;
    });
    setAssets(updated);
    updated.forEach((a) => db.saveAsset(a));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#146B3A]" /> Farm Machinery & Asset Protection
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Safeguard valuable tractors, submersible pumps, sprayers, and fertilizer stocks against flash flood submersion.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Farm Asset
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                <div>
                  <h3 className="text-base font-bold text-[#17211B]">{item.name}</h3>
                  <span className="text-xs text-[#65736B]">Category: {item.category}</span>
                </div>

                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    item.protectionStatus === 'PROTECTED'
                      ? 'bg-[#EAF6EE] text-[#146B3A] border border-[#146B3A]/20'
                      : item.protectionStatus === 'SAFE'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                  title="Click to toggle status: SAFE -> AT RISK -> PROTECTED"
                >
                  {item.protectionStatus} (Toggle)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Quantity</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{item.quantity} Units</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Approx. Value</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">
                    ₹{item.estimatedValueInr?.toLocaleString() || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs text-[#65736B]">
              <span className="truncate">Storage: {item.storageLocation}</span>
              <span className="text-[#146B3A] font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Flood Anchored
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Add Farm Asset</h2>
            <p className="text-xs text-[#65736B] mb-4">Track machinery location to protect before flood warnings.</p>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 HP Electric Motor & Starter"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Category</label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="Submersible Pump">Submersible Pump</option>
                    <option value="Sprayer Equipment">Sprayer Equipment</option>
                    <option value="Solar Panel / Pump">Solar Panel / Pump</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Fertilizer Stock">Fertilizer Stock</option>
                    <option value="Tool Set">Tool Set</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={newAsset.estimatedValueInr}
                    onChange={(e) => setNewAsset({ ...newAsset, estimatedValueInr: parseFloat(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Storage Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete Pump Chamber / Elevated Shed"
                  value={newAsset.storageLocation}
                  onChange={(e) => setNewAsset({ ...newAsset, storageLocation: e.target.value })}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                />
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
