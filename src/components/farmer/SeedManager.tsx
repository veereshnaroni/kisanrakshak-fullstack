import React, { useState } from 'react';
import { Package, Plus, CheckCircle, ShieldCheck, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { SeedStock } from '../../types';
import { db } from '../../services/mockBackendApi';

export const SeedManager: React.FC = () => {
  const [seeds, setSeeds] = useState<SeedStock[]>(() => db.getSeeds());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSeed, setNewSeed] = useState<Partial<SeedStock>>({
    crop: 'Tur (GRG-811)',
    seedType: 'Foundation Seed',
    quantityKg: 60,
    season: 'Kharif',
    storageLocation: 'Farm Store Room (Elevated Wooden Pallet)',
    storageCondition: 'Safe & Dry',
  });

  const handleToggleChecklist = (seedId: string, key: keyof SeedStock['checklist']) => {
    const updated = seeds.map((s) => {
      if (s.id === seedId) {
        const nextCheck = { ...s.checklist, [key]: !s.checklist[key] };
        const allChecked = Object.values(nextCheck).every(Boolean);
        return {
          ...s,
          checklist: nextCheck,
          storageCondition: allChecked ? ('Safe & Dry' as const) : ('Needs Check' as const),
          lastCheckedDate: new Date().toISOString().slice(0, 10),
        };
      }
      return s;
    });

    setSeeds(updated);
    updated.forEach((s) => db.saveSeed(s));
  };

  const handleSaveSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeed.crop) return;

    const seed: SeedStock = {
      id: `seed-${Date.now()}`,
      farmId: 'farm-1',
      crop: newSeed.crop || 'Crop Seeds',
      seedType: newSeed.seedType || 'Certified',
      quantityKg: Number(newSeed.quantityKg) || 50,
      season: (newSeed.season as any) || 'Kharif',
      storageLocation: newSeed.storageLocation || 'Store Room',
      storageCondition: 'Safe & Dry',
      lastCheckedDate: new Date().toISOString().slice(0, 10),
      checklist: {
        dryStorage: true,
        elevatedPlatform: true,
        waterproofCover: true,
        rodentProof: true,
        wellVentilated: true,
      },
    };

    db.saveSeed(seed);
    setSeeds(db.getSeeds());
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#146B3A]" /> Seed Stock & Protection Checklist
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Protect your next-season foundation seeds from floor dampness, heavy rains, and storage pests.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Seed Lot
        </button>
      </div>

      {/* Seed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seeds.map((seed) => {
          const isSafe = seed.storageCondition === 'Safe & Dry';

          return (
            <div
              key={seed.id}
              className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                  <div>
                    <h3 className="text-base font-bold text-[#17211B]">{seed.crop}</h3>
                    <p className="text-xs text-[#65736B] mt-0.5">
                      Type: {seed.seedType} • Season: {seed.season}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                      isSafe
                        ? 'bg-[#EAF6EE] text-[#146B3A] border-[#146B3A]/20'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {seed.storageCondition}
                  </span>
                </div>

                <div className="my-4 flex items-baseline justify-between bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <div>
                    <span className="text-xs text-[#65736B] block">Stored Stock</span>
                    <span className="text-2xl font-extrabold text-[#17211B]">{seed.quantityKg} kg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#65736B] block">Storage Location</span>
                    <span className="text-xs font-bold text-[#17211B]">{seed.storageLocation}</span>
                  </div>
                </div>

                {/* 5-Point Protection Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-[#65736B] block">
                    SEED STORAGE DISASTER CHECKLIST (CLICK TO VERIFY):
                  </span>

                  {[
                    { key: 'dryStorage', label: 'Dry room environment (No ceiling leakage)' },
                    { key: 'elevatedPlatform', label: 'Kept above floor on wooden pallets (min 30cm)' },
                    { key: 'waterproofCover', label: 'Heavy polythene / tarpaulin waterproof wrap' },
                    { key: 'rodentProof', label: 'Rodent & pest mesh protection installed' },
                    { key: 'wellVentilated', label: 'Air circulation to avoid fungal heating' },
                  ].map((chk) => {
                    const isChecked = seed.checklist[chk.key as keyof SeedStock['checklist']];
                    return (
                      <div
                        key={chk.key}
                        onClick={() => handleToggleChecklist(seed.id, chk.key as any)}
                        className="flex items-center space-x-2 text-xs cursor-pointer select-none py-1 hover:text-[#146B3A]"
                      >
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4 text-[#16834B] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[#65736B] shrink-0" />
                        )}
                        <span className={isChecked ? 'text-[#17211B] font-medium' : 'text-[#65736B]'}>
                          {chk.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#E2E8E4] flex items-center justify-between text-xs text-[#65736B]">
                <span>Last inspected: {seed.lastCheckedDate}</span>
                <span className="text-[#146B3A] font-bold">
                  {Object.values(seed.checklist).filter(Boolean).length}/5 Checks Passed
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Add Seed Inventory</h2>
            <p className="text-xs text-[#65736B] mb-4">Register seed lots to maintain flood and moisture protection.</p>

            <form onSubmit={handleSaveSeed} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Crop & Variety</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tur Seeds (GRG-811)"
                  value={newSeed.crop}
                  onChange={(e) => setNewSeed({ ...newSeed, crop: e.target.value })}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={newSeed.quantityKg}
                    onChange={(e) => setNewSeed({ ...newSeed, quantityKg: parseFloat(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Season</label>
                  <select
                    value={newSeed.season}
                    onChange={(e) => setNewSeed({ ...newSeed, season: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Storage Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farm Store Room (Elevated Wooden Pallet)"
                  value={newSeed.storageLocation}
                  onChange={(e) => setNewSeed({ ...newSeed, storageLocation: e.target.value })}
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
                  Save Seed Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
