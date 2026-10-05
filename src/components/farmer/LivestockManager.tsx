import React, { useState } from 'react';
import { HeartHandshake, Plus, ShieldCheck, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Livestock } from '../../types';
import { db } from '../../services/mockBackendApi';

export const LivestockManager: React.FC = () => {
  const [animals, setAnimals] = useState<Livestock[]>(() => db.getLivestock());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnimal, setNewAnimal] = useState<Partial<Livestock>>({
    animalType: 'Cattle (Cow/Ox)',
    breed: 'Khillari',
    count: 4,
    shelterType: 'Pukka Shed',
    feedStockDays: 20,
    waterAvailabilityLitersDaily: 250,
    safetyStatus: 'SAFE',
    vaccinated: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Livestock = {
      id: `live-${Date.now()}`,
      farmId: 'farm-1',
      animalType: (newAnimal.animalType as any) || 'Cattle (Cow/Ox)',
      breed: newAnimal.breed || 'Indigenous',
      count: Number(newAnimal.count) || 2,
      shelterType: (newAnimal.shelterType as any) || 'Pukka Shed',
      feedStockDays: Number(newAnimal.feedStockDays) || 15,
      waterAvailabilityLitersDaily: Number(newAnimal.waterAvailabilityLitersDaily) || 100,
      safetyStatus: (newAnimal.safetyStatus as any) || 'SAFE',
      vaccinated: true,
    };

    db.saveLivestock(item);
    setAnimals(db.getLivestock());
    setShowAddModal(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = animals.map((a) => {
      if (a.id === id) {
        const nextStatus =
          a.safetyStatus === 'SAFE'
            ? 'AT RISK'
            : a.safetyStatus === 'AT RISK'
            ? 'EVACUATED'
            : 'SAFE';
        return { ...a, safetyStatus: nextStatus as any };
      }
      return a;
    });
    setAnimals(updated);
    updated.forEach((a) => db.saveLivestock(a));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-[#146B3A]" /> Livestock Safety & Shelter
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Keep track of cattle, fodder reserves, vaccination history, and evacuation status before heavy rains.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Livestock
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animals.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E8E4]">
                <div>
                  <h3 className="text-base font-bold text-[#17211B]">{item.animalType}</h3>
                  <p className="text-xs text-[#65736B]">Breed: {item.breed}</p>
                </div>

                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    item.safetyStatus === 'SAFE'
                      ? 'bg-[#EAF6EE] text-[#146B3A] border border-[#146B3A]/20'
                      : item.safetyStatus === 'AT RISK'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                  title="Click to toggle status: SAFE -> AT RISK -> EVACUATED"
                >
                  {item.safetyStatus} (Click to toggle)
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 my-4 text-xs text-center">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Head Count</span>
                  <span className="text-xl font-bold text-[#17211B] mt-0.5 block">{item.count}</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Dry Fodder</span>
                  <span className="text-xl font-bold text-[#146B3A] mt-0.5 block">
                    {item.feedStockDays} Days
                  </span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Shelter Type</span>
                  <span className="font-bold text-[#17211B] mt-1 block truncate text-[11px]">
                    {item.shelterType}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs text-[#65736B]">
              <span className="flex items-center gap-1 text-[#16834B] font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> FMD Vaccinated
              </span>
              <span>Water: {item.waterAvailabilityLitersDaily} L/day</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Add Livestock</h2>
            <p className="text-xs text-[#65736B] mb-4">Register domestic animals for emergency shelter planning.</p>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Animal Type</label>
                  <select
                    value={newAnimal.animalType}
                    onChange={(e) => setNewAnimal({ ...newAnimal, animalType: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Cattle (Cow/Ox)">Cattle (Cow/Ox)</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Poultry">Poultry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Count (Head)</label>
                  <input
                    type="number"
                    required
                    value={newAnimal.count}
                    onChange={(e) => setNewAnimal({ ...newAnimal, count: parseInt(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Breed / Variety</label>
                  <input
                    type="text"
                    placeholder="e.g. Khillari / Hallikar / Murrah"
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Shelter Type</label>
                  <select
                    value={newAnimal.shelterType}
                    onChange={(e) => setNewAnimal({ ...newAnimal, shelterType: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Pukka Shed">Pukka Shed</option>
                    <option value="Thatched Roof">Thatched Roof</option>
                    <option value="Open Enclosure">Open Enclosure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Fodder Stock (Days)</label>
                  <input
                    type="number"
                    value={newAnimal.feedStockDays}
                    onChange={(e) => setNewAnimal({ ...newAnimal, feedStockDays: parseInt(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Daily Water (Liters)</label>
                  <input
                    type="number"
                    value={newAnimal.waterAvailabilityLitersDaily}
                    onChange={(e) => setNewAnimal({ ...newAnimal, waterAvailabilityLitersDaily: parseInt(e.target.value) })}
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
                  Save Animal Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
