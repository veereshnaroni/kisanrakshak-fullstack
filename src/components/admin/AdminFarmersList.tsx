import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import { User, Farm } from '../../types';
import { DEMO_USERS, db, RegisteredFarmerEntry } from '../../services/mockBackendApi';

export const AdminFarmersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [farmers, setFarmers] = useState<RegisteredFarmerEntry[]>(() => db.getRegisteredFarmers());

  useEffect(() => {
    // Reload farmers on mount or tab focus
    setFarmers(db.getRegisteredFarmers());
  }, []);

  const filtered = farmers.filter(
    (f) =>
      (selectedDistrict === 'ALL' || f.district === selectedDistrict) &&
      (f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.mobile.includes(searchTerm) ||
        f.village.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#146B3A]" /> Registered Farmers Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Statewide farmer database linked with Karnataka Bhoomi (RTC) and FRUITS ID database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#65736B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, phone, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-[#E2E8E4] rounded-lg text-xs w-48 sm:w-64 focus:outline-[#146B3A]"
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="border border-[#E2E8E4] rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium"
          >
            <option value="ALL">All Districts ({farmers.length} Enrolled)</option>
            {Array.from(new Set(farmers.map((f) => f.district))).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E8E4] text-[#65736B] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Farmer ID & Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Holding Size</th>
                <th className="py-3 px-4">Main Crop</th>
                <th className="py-3 px-4">Risk Index</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4]">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-[#F5FBF7]">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#17211B] block">{f.name}</span>
                    <span className="text-[11px] text-[#65736B] block">
                      {f.id} • {f.mobile}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#17211B]">
                    {f.village}, {f.taluk}, {f.district}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#17211B]">
                    {f.areaAcres} Acres
                  </td>
                  <td className="py-3.5 px-4 text-[#146B3A] font-medium">
                    {f.mainCrop}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.risk.includes('HIGH')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#EAF6EE] text-[#146B3A]'
                      }`}
                    >
                      {f.risk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#EAF6EE] text-[#16834B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Opening official farmer dossier for ${f.name}`)}
                      className="text-[#146B3A] font-bold hover:underline"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
