import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, ShieldAlert, CheckCircle, Droplets, Layers, AlertTriangle } from 'lucide-react';
import { Farm } from '../../types';
import { db } from '../../services/mockBackendApi';
import { useAuth } from '../../context/AuthContext';

export const FarmManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState<Farm[]>(() => db.getFarms());
  const [showAddModal, setShowAddModal] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);
  const [newFarm, setNewFarm] = useState<Partial<Farm>>({
    name: '',
    district: currentUser?.district || 'Kalaburagi',
    taluk: currentUser?.taluk || 'Kalaburagi',
    village: currentUser?.village || '',
    surveyNumber: '',
    areaAcres: 4.0,
    soilType: 'Black Soil',
    irrigationType: 'Borewell',
    waterSource: 'Borewell (350 ft)',
  });

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarm.name) return;

    const farm: Farm = {
      id: `farm-${Date.now()}`,
      userId: currentUser?.id || 'usr-farmer-1',
      name: newFarm.name || 'My Farmland',
      district: newFarm.district || currentUser?.district || 'Kalaburagi',
      taluk: newFarm.taluk || currentUser?.taluk || 'Kalaburagi',
      village: newFarm.village || currentUser?.village || 'Gram Panchayat',
      surveyNumber: newFarm.surveyNumber || 'Sy. No. Pending',
      areaAcres: Number(newFarm.areaAcres) || 3.0,
      soilType: (newFarm.soilType as any) || 'Black Soil',
      irrigationType: (newFarm.irrigationType as any) || 'Borewell',
      waterSource: newFarm.waterSource || 'Borewell',
      latitude: 17.3297,
      longitude: 76.8343,
      riskScore: 32,
      riskCategory: 'MODERATE',
    };

    db.saveFarm(farm);
    setFarms(db.getFarms());
    setShowAddModal(false);
    setNewFarm({
      name: '',
      district: currentUser?.district || 'Kalaburagi',
      taluk: currentUser?.taluk || 'Kalaburagi',
      village: currentUser?.village || '',
      surveyNumber: '',
      areaAcres: 4.0,
      soilType: 'Black Soil',
      irrigationType: 'Borewell',
      waterSource: '',
    });
  };

  const handleConfirmDelete = () => {
    if (!farmToDelete) return;
    db.deleteFarm(farmToDelete.id);
    setFarms((prev) => prev.filter((f) => f.id !== farmToDelete.id));
    setFarmToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#146B3A]" /> My Farm Holdings
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1">
            Registered agricultural lands, survey numbers, soil classifications, and water infrastructure.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Farmland
        </button>
      </div>

      {/* Farms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs hover:border-[#146B3A] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2E8E4]">
                <div>
                  <h3 className="text-base font-bold text-[#17211B]">{farm.name}</h3>
                  <p className="text-xs text-[#65736B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#146B3A]" />
                    {farm.village}, {farm.taluk}, {farm.district}
                  </p>
                </div>

                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#EAF6EE] text-[#146B3A] border border-[#146B3A]/20">
                  {farm.areaAcres} Acres
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Survey Number</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{farm.surveyNumber}</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Soil Type</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{farm.soilType}</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Irrigation Mode</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">{farm.irrigationType}</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Water Source</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block truncate">{farm.waterSource}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#146B3A] font-semibold">
                <ShieldAlert className="w-4 h-4" />
                Vulnerability: {farm.riskCategory} ({farm.riskScore}/100)
              </span>

              <button
                type="button"
                onClick={() => setFarmToDelete(farm)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete farm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {farmToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#DC4444] flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#17211B]">Delete Farmland Plot?</h3>
            <p className="text-xs text-[#65736B] mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong>{farmToDelete.name}</strong> ({farmToDelete.surveyNumber || `${farmToDelete.areaAcres} Acres`})? This will permanently remove it from your farm records.
            </p>
            <div className="flex items-center justify-end space-x-2 mt-5">
              <button
                type="button"
                onClick={() => setFarmToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#65736B] hover:bg-[#F7F9F8] border border-[#E2E8E4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC4444] hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Register New Farm Plot</h2>
            <p className="text-xs text-[#65736B] mb-4">
              Enter official details from your Pahani/RTC to calculate land risk accurately.
            </p>

            <form onSubmit={handleSaveFarm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Farm Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Canal Field / Sri Lakshmi Farm"
                  value={newFarm.name}
                  onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm focus:outline-[#146B3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">District</label>
                  <input
                    type="text"
                    value={newFarm.district}
                    onChange={(e) => setNewFarm({ ...newFarm, district: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Taluk</label>
                  <input
                    type="text"
                    value={newFarm.taluk}
                    onChange={(e) => setNewFarm({ ...newFarm, taluk: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Village</label>
                  <input
                    type="text"
                    required
                    placeholder="Village name"
                    value={newFarm.village}
                    onChange={(e) => setNewFarm({ ...newFarm, village: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Survey Number (Sy. No.)</label>
                  <input
                    type="text"
                    placeholder="e.g. 142/2B"
                    value={newFarm.surveyNumber}
                    onChange={(e) => setNewFarm({ ...newFarm, surveyNumber: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newFarm.areaAcres}
                    onChange={(e) => setNewFarm({ ...newFarm, areaAcres: parseFloat(e.target.value) })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Soil Type</label>
                  <select
                    value={newFarm.soilType}
                    onChange={(e) => setNewFarm({ ...newFarm, soilType: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Black Soil">Black Soil</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Laterite">Laterite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Irrigation Mode</label>
                  <select
                    value={newFarm.irrigationType}
                    onChange={(e) => setNewFarm({ ...newFarm, irrigationType: e.target.value as any })}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="Borewell">Borewell</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Canal">Canal</option>
                    <option value="Tank">Tank</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Water Source Details</label>
                <input
                  type="text"
                  placeholder="e.g. Deep Borewell (450 ft) + Krishi Honda 20x20m"
                  value={newFarm.waterSource}
                  onChange={(e) => setNewFarm({ ...newFarm, waterSource: e.target.value })}
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
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
