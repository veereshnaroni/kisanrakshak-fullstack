import React from 'react';
import { User, ShieldCheck, Phone, MapPin, Globe, Bell, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerProfileView: React.FC = () => {
  const { currentUser, farmerProfile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#146B3A] text-white flex items-center justify-center font-extrabold text-xl">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'RK'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
              {farmerProfile.name}
              <span className="text-xs bg-[#EAF6EE] text-[#146B3A] font-bold px-2 py-0.5 rounded-full border border-[#146B3A]/20">
                Verified Farmer
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#65736B] mt-0.5">
              Kisan ID: <strong>{farmerProfile.kisanId}</strong> • Mobile: {farmerProfile.mobile}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Farm & Land details */}
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#17211B] pb-3 border-b border-[#E2E8E4] mb-3">
            Agricultural Profile
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#F7F9F8]">
              <span className="text-[#65736B]">Location</span>
              <span className="font-bold text-[#17211B]">
                {farmerProfile.village}, {farmerProfile.taluk}, {farmerProfile.district}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F7F9F8]">
              <span className="text-[#65736B]">Total Registered Acreage</span>
              <span className="font-bold text-[#17211B]">{farmerProfile.totalAcreage} Acres</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F7F9F8]">
              <span className="text-[#65736B]">Registered Plots</span>
              <span className="font-bold text-[#17211B]">{farmerProfile.farmCount} Farm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F7F9F8]">
              <span className="text-[#65736B]">Primary Kharif Crops</span>
              <span className="font-bold text-[#146B3A]">{farmerProfile.mainCrops.join(', ')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#65736B]">Aadhaar / FRUITS Linked</span>
              <span className="font-bold text-[#16834B]">Yes (Verified)</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#17211B] pb-3 border-b border-[#E2E8E4] mb-3">
            Application Preferences
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#17211B] block">Language / ಭಾಷೆ</span>
                <span className="text-[#65736B]">Select preferred language for advisories</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#F7F9F8] p-1 rounded-lg border border-[#E2E8E4]">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    language === 'en' ? 'bg-white shadow-xs text-[#146B3A]' : 'text-[#65736B]'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('kn')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    language === 'kn' ? 'bg-white shadow-xs text-[#146B3A]' : 'text-[#65736B]'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E4]">
              <div>
                <span className="font-semibold text-[#17211B] block">SMS & WhatsApp Alerts</span>
                <span className="text-[#65736B]">Instant push notifications for rainfall warnings</span>
              </div>
              <span className="text-xs font-bold text-[#146B3A] bg-[#EAF6EE] px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E4]">
              <div>
                <span className="font-semibold text-[#17211B] block">Emergency Contact</span>
                <span className="text-[#65736B]">{farmerProfile.emergencyContact}</span>
              </div>
              <button className="text-xs text-[#146B3A] font-bold hover:underline">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
