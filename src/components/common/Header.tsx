import React, { useState } from 'react';
import {
  ShieldCheck,
  Sprout,
  Bell,
  MapPin,
  RefreshCw,
  Globe,
  UserCheck,
  LogOut,
  ChevronDown,
  Activity,
  Sparkles,
  Layers,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { KARNATAKA_LOCATIONS } from '../../services/weatherService';

interface HeaderProps {
  onRefreshWeather: () => void;
  isWeatherLoading: boolean;
  alertCount: number;
  onNavigateToAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefreshWeather,
  isWeatherLoading,
  alertCount,
  onNavigateToAlerts,
}) => {
  const { currentUser, farmerProfile, role, isFarmer, isAdmin, switchUser, updateLocation, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState(currentUser?.district || 'Kalaburagi');
  const [selectedTaluk, setSelectedTaluk] = useState(currentUser?.taluk || 'Kalaburagi');

  const filteredTaluks = KARNATAKA_LOCATIONS.filter((l) => l.district === selectedDistrict);

  const getInitials = (name?: string) => {
    if (!name) return 'KR';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleApplyLocation = () => {
    updateLocation(selectedDistrict, selectedTaluk);
    setShowLocationModal(false);
    onRefreshWeather();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8E4] shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#146B3A] to-[#0D4B27] shadow-xs flex items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
                <Sprout className="w-3.5 h-3.5 text-amber-300 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#146B3A]">
                  KisanRakshak
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#EAF6EE] text-[#146B3A] px-2 py-0.5 rounded-md border border-[#146B3A]/20">
                  Karnataka
                </span>
                {isAdmin ? (
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-purple-600" /> Admin Command
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex text-[10px] font-semibold text-[#65736B] items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live KSNDMC Sync
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#65736B] hidden sm:block font-medium">
                State Disaster-Resilient Agriculture Command Platform
              </p>
            </div>
          </div>

          {/* Center: Location & Live Telemetry Widget */}
          <div className="hidden md:flex items-center space-x-2 bg-[#F8FAF9] border border-[#E2E8E4] px-3.5 py-1.5 rounded-xl text-xs font-medium shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#17211B]">
              <MapPin className="w-3.5 h-3.5 text-[#146B3A]" />
              <span className="font-bold">
                {currentUser?.taluk || 'Kalaburagi'}, {currentUser?.district || 'Kalaburagi'}
              </span>
            </div>
            <button
              onClick={() => setShowLocationModal(true)}
              className="text-[#146B3A] hover:text-[#1F8A4C] hover:underline font-bold text-[11px] cursor-pointer ml-0.5"
            >
              ({t('common.change_location', 'Change')})
            </button>
            <span className="text-[#D0D7D3]">|</span>
            <button
              onClick={onRefreshWeather}
              disabled={isWeatherLoading}
              title="Sync Live KSNDMC Weather Telemetry"
              className="text-[#65736B] hover:text-[#146B3A] flex items-center gap-1.5 font-semibold text-[11px] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin text-[#146B3A]' : 'text-emerald-700'}`} />
              <span className="hidden lg:inline">{isWeatherLoading ? 'Syncing...' : 'Live Radar'}</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="bg-[#F8FAF9] hover:bg-[#EAF6EE] hover:border-[#146B3A]/30 border border-[#E2E8E4] px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#17211B] flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Toggle English / ಕನ್ನಡ"
            >
              <Globe className="w-3.5 h-3.5 text-[#146B3A]" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Alerts Bell */}
            <button
              onClick={onNavigateToAlerts}
              className="relative p-2 text-[#65736B] hover:text-[#17211B] rounded-xl hover:bg-[#F8FAF9] border border-transparent hover:border-[#E2E8E4] transition-all cursor-pointer"
              title="View Regional Early Warnings"
            >
              <Bell className="w-5 h-5 text-[#17211B]" />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#DC4444] text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white animate-pulse">
                  {alertCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 pl-2 border-l border-[#E2E8E4] cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                  isAdmin ? 'bg-purple-700 text-white' : 'bg-[#146B3A] text-white'
                }`}>
                  {isAdmin ? 'AD' : getInitials(currentUser?.name || farmerProfile?.name)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-[#17211B] leading-tight">
                    {currentUser?.name || farmerProfile?.name || 'Farmer Account'}
                  </div>
                  <div className="text-[10px] text-[#65736B] leading-tight font-medium">
                    {isAdmin ? 'State Disaster Officer' : (farmerProfile?.kisanId || 'Verified Landholder')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#65736B] group-hover:text-[#17211B]" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8E4] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[#E2E8E4] bg-[#F8FAF9] rounded-t-2xl">
                    <p className="text-xs font-extrabold text-[#17211B]">
                      {currentUser?.name || farmerProfile?.name || 'Farmer Account'}
                    </p>
                    <p className="text-[11px] text-[#65736B] mt-0.5">
                      📱 {currentUser?.mobile || '9845012345'} • {role === 'ROLE_ADMIN' ? 'State Officer' : 'Enrolled Farmer'}
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-[#146B3A] bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#146B3A]" />
                      <span>{currentUser?.village ? `${currentUser.village}, ` : ''}{currentUser?.taluk}, {currentUser?.district}</span>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs text-[#65736B]">
                      <div className="font-bold text-[#17211B]">Access Permission</div>
                      <div className="text-[11px] text-[#55635C] mt-0.5">
                        {isAdmin
                          ? '🏛️ Full Disaster Control & Statewide Farmer Database Access'
                          : '👨‍🌾 Farmer Command Dashboard & 6-Step Defense Plan'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E2E8E4] p-2">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#DC4444] hover:bg-red-50 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout from Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-extrabold text-[#17211B] flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[#146B3A]" /> Select Karnataka District & Taluk
            </h3>
            <p className="text-xs text-[#65736B] mb-4">
              Real-time weather radar data and localized flood/drought warnings will adjust according to your agricultural taluk.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17211B] mb-1.5">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const dist = e.target.value;
                    setSelectedDistrict(dist);
                    const matching = KARNATAKA_LOCATIONS.filter((l) => l.district === dist);
                    if (matching.length > 0) setSelectedTaluk(matching[0].taluk);
                  }}
                  className="w-full border border-[#E2E8E4] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#146B3A]"
                >
                  {Array.from(new Set(KARNATAKA_LOCATIONS.map((l) => l.district))).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17211B] mb-1.5">Taluk / Block</label>
                <select
                  value={selectedTaluk}
                  onChange={(e) => setSelectedTaluk(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#146B3A]"
                >
                  {filteredTaluks.map((t) => (
                    <option key={t.taluk} value={t.taluk}>
                      {t.taluk}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-[#E2E8E4]">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-[#65736B] hover:text-[#17211B] hover:bg-[#F8FAF9] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLocation}
                className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Apply & Sync Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
