import React, { useState, useEffect } from 'react';
import {
  MapPin,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Droplets,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Warehouse,
  AlertTriangle,
  Film,
  Play,
  Bot,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { WeatherData, FarmRiskScore, PriorityAction, DisasterAlert, Farm, Crop } from '../../types';
import { WeatherCard } from './WeatherCard';
import { FarmRiskCard } from './FarmRiskCard';
import { UrgentAlertBanner } from './UrgentAlertBanner';
import { TodayActionsCard } from './TodayActionsCard';
import { FarmReadinessCard } from './FarmReadinessCard';
import { calculateFarmRisk, generatePriorityActions } from '../../services/riskEngine';
import { db } from '../../services/mockBackendApi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface FarmerDashboardProps {
  weather: WeatherData;
  isWeatherLoading: boolean;
  onRefreshWeather: () => void;
  onChangeLocation: () => void;
  onNavigate: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  weather,
  isWeatherLoading,
  onRefreshWeather,
  onChangeLocation,
  onNavigate,
}) => {
  const { currentUser, farmerProfile } = useAuth();
  const { t } = useLanguage();

  const [farms] = useState<Farm[]>(() => db.getFarms());
  const [crops] = useState<Crop[]>(() => db.getCrops());
  const [alerts, setAlerts] = useState<DisasterAlert[]>(() => db.getAlerts());

  useEffect(() => {
    const handleSync = () => {
      setAlerts(db.getAlerts());
    };
    window.addEventListener('kisan_alerts_updated', handleSync);
    return () => window.removeEventListener('kisan_alerts_updated', handleSync);
  }, []);

  const activeFarm = farms[0];

  // Normalize district names to handle spelling variations (e.g. Mysuru / Mysore, Kalaburagi / Gulbarga)
  const normalizeDistrict = (name: string = ''): string => {
    const n = name.trim().toLowerCase();
    if (n.includes('mysor') || n.includes('mysur')) return 'mysuru';
    if (n.includes('kalabur') || n.includes('gulbarg')) return 'kalaburagi';
    if (n.includes('belagav') || n.includes('belgaum')) return 'belagavi';
    if (n.includes('shivamogg') || n.includes('shimoga')) return 'shivamogga';
    if (n.includes('vijayapur') || n.includes('bijapur')) return 'vijayapura';
    if (n.includes('ballar') || n.includes('bellar')) return 'ballari';
    if (n.includes('bengalur') || n.includes('bangalor')) return 'bengaluru';
    if (n.includes('chikkamagal') || n.includes('chikmagal')) return 'chikkamagaluru';
    if (n.includes('haver')) return 'haveri';
    if (n.includes('raichur')) return 'raichur';
    if (n.includes('mandy')) return 'mandya';
    if (n.includes('hassan')) return 'hassan';
    if (n.includes('tumakur') || n.includes('tumkur')) return 'tumakuru';
    if (n.includes('bagalkot')) return 'bagalkote';
    if (n.includes('bidar')) return 'bidar';
    if (n.includes('yadgir') || n.includes('yadagiri')) return 'yadgir';
    if (n.includes('koppal')) return 'koppal';
    if (n.includes('gadag')) return 'gadag';
    if (n.includes('dharwad')) return 'dharwad';
    if (n.includes('uttara kannada') || n.includes('karwar')) return 'uttara kannada';
    if (n.includes('dakshina kannada') || n.includes('mangalore') || n.includes('mangaluru')) return 'dakshina kannada';
    if (n.includes('udupi')) return 'udupi';
    if (n.includes('kodagu') || n.includes('coorg')) return 'kodagu';
    if (n.includes('chamarajanagar')) return 'chamarajanagara';
    if (n.includes('davanagere') || n.includes('davangere')) return 'davanagere';
    if (n.includes('chitradurga')) return 'chitradurga';
    if (n.includes('kolar')) return 'kolar';
    if (n.includes('chikkaballapur')) return 'chikkaballapura';
    if (n.includes('ramanagar') || n.includes('ramanagara')) return 'ramanagara';
    return n;
  };

  const userDistrictNorm = normalizeDistrict(currentUser?.district || farmerProfile.district || 'Kalaburagi');
  const userTalukNorm = (currentUser?.taluk || farmerProfile.taluk || '').trim().toLowerCase();

  // 1. Check if admin published an active alert matching this farmer's district or taluk
  const adminAlert = alerts.find((a) => {
    if (!a.isActive) return false;
    
    // Check if alert applies to all Karnataka districts
    const isStatewide = a.districts.some(
      (d) =>
        d.toLowerCase().includes('all') ||
        d.toLowerCase().includes('statewide') ||
        d.toLowerCase().includes('karnataka')
    );
    if (isStatewide) return true;

    // Check district match
    const districtMatch = a.districts.some((d) => {
      const dNorm = normalizeDistrict(d);
      return (
        dNorm === userDistrictNorm ||
        d.toLowerCase().includes(userDistrictNorm) ||
        userDistrictNorm.includes(dNorm)
      );
    });

    // Check taluk match
    const talukMatch = a.taluks.some((t) => {
      const tNorm = t.trim().toLowerCase();
      return (
        tNorm === 'all' ||
        (userTalukNorm && (tNorm === userTalukNorm || tNorm.includes(userTalukNorm)))
      );
    });

    return districtMatch || talukMatch;
  });

  // 2. Weather-derived real dynamic alert
  let dynamicAlert: DisasterAlert | null = null;
  if (weather.rainfallMmNext24h >= 45 || weather.rainProbability >= 75) {
    dynamicAlert = {
      id: `dyn-rain-${Date.now()}`,
      title: 'Heavy Rainfall & Waterlogging Alert',
      titleKn: 'ಭಾರಿ ಮಳೆ ಮತ್ತು ಜಲಾವೃತ ಎಚ್ಚರಿಕೆ',
      disasterType: 'HEAVY_RAIN',
      severity: 'WARNING',
      districts: [farmerProfile.district || 'Kalaburagi'],
      taluks: [farmerProfile.taluk || 'Kalaburagi'],
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      description: `Meteorological radar forecasts ${weather.rainfallMmNext24h}mm precipitation with ${weather.rainProbability}% probability.`,
      farmImpact: 'Risk of furrow standing water and root collar rot in standing pulse crops.',
      affectedResources: ['Standing Crops', 'Field Furrows', 'Seed Storage'],
      recommendedActions: [
        'Open drainage trenches at lower field boundaries.',
        'Elevate all stored seed bags onto raised wooden pallets.',
        'Disconnect open electrical starters at borewells.',
      ],
      createdBy: 'KSNDMC Live Radar Automated Alert',
      isActive: true,
    };
  } else if (weather.temperature >= 38) {
    dynamicAlert = {
      id: `dyn-heat-${Date.now()}`,
      title: 'Extreme Heatwave & Moisture Stress Advisory',
      titleKn: 'ತೀವ್ರ ಶಾಖದ ಅಲೆ ಮತ್ತು ತೇವಾಂಶ ಒತ್ತಡದ ಸಲಹೆ',
      disasterType: 'HEATWAVE',
      severity: 'WATCH',
      districts: [farmerProfile.district || 'Kalaburagi'],
      taluks: [farmerProfile.taluk || 'Kalaburagi'],
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      description: `Sustained high temperatures reaching ${weather.temperature}°C with intense solar radiation.`,
      farmImpact: 'Accelerated soil moisture loss, potential flower drop in Tur, and cattle heat exhaustion.',
      affectedResources: ['Flowering Pulses', 'Topsoil Moisture', 'Livestock'],
      recommendedActions: [
        'Apply light micro-irrigation in early mornings or late evenings.',
        'Provide shaded water troughs with electrolytes for cattle.',
        'Avoid midday foliar chemical spraying.',
      ],
      createdBy: 'Karnataka Agrometeorology Unit',
      isActive: true,
    };
  } else if (weather.windSpeedKmh >= 35) {
    dynamicAlert = {
      id: `dyn-wind-${Date.now()}`,
      title: 'High Wind Velocity & Squall Advisory',
      titleKn: 'ಭಾರಿ ಗಾಳಿ ಮತ್ತು ಬಿರುಗಾಳಿ ಸಲಹೆ',
      disasterType: 'CYCLONIC_WINDS',
      severity: 'WATCH',
      districts: [farmerProfile.district || 'Kalaburagi'],
      taluks: [farmerProfile.taluk || 'Kalaburagi'],
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      description: `Surface wind gusts reaching ${weather.windSpeedKmh} km/h detected across the district.`,
      farmImpact: 'Risk of stalk lodging in tall sorghum and damage to thatched animal sheds.',
      affectedResources: ['Tall Crops (Jowar/Sugarcane)', 'Implement Sheds'],
      recommendedActions: [
        'Tie and prop tall crop clumps to prevent wind lodging.',
        'Check fasteners on metal roofing sheets on storage sheds.',
      ],
      createdBy: 'KSNDMC Wind Advisory',
      isActive: true,
    };
  }

  const activeAlert = adminAlert || dynamicAlert;

  // Calculated risk score & actions
  const riskScore: FarmRiskScore = calculateFarmRisk(weather, activeFarm, crops);
  const [actions, setActions] = useState<PriorityAction[]>(() =>
    generatePriorityActions(weather, riskScore, crops)
  );

  const handleToggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Greeting & Location Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-[#146B3A] bg-[#EAF6EE] px-3 py-1 rounded-full border border-[#146B3A]/20">
              🌾 {t('common.good_morning', 'Namaskara')}, {currentUser?.name || farmerProfile.name || 'Farmer'}
            </span>
            <span className="text-[11px] font-mono font-bold bg-[#F1F5F3] text-[#65736B] px-2.5 py-0.5 rounded-md border border-[#E2E8E4]">
              FID: KA-2026-FARM-01
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> FRUITS Active
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-[#17211B] tracking-tight">
            <span>{farmerProfile.village}, {farmerProfile.taluk}</span>
            <span className="text-sm font-bold text-[#65736B] ml-2">Karnataka</span>
          </h1>

          <p className="text-xs text-[#65736B] font-medium flex flex-wrap items-center gap-2 pt-0.5">
            <span>Holding: <strong className="text-[#17211B]">{activeFarm?.areaAcres || 5.2} Acres</strong> ({activeFarm?.soilType || 'Black Soil'})</span>
            <span>•</span>
            <span>Main Crops: <strong className="text-[#146B3A]">{crops.map(c => c.name.split(' ')[0]).join(', ') || 'Tur, Jowar'}</strong></span>
            <span>•</span>
            <span>Zone: <strong>North-Eastern Dry Zone (Zone 2)</strong></span>
          </p>
        </div>

        <div className="flex items-center space-x-2.5 z-10">
          <button
            onClick={() => onNavigate('emergency')}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
            <span>Emergency 1077</span>
          </button>

          <button
            onClick={() => onNavigate('protection_plan')}
            className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>6-Step Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Disaster Alert Banner or Favorable Conditions Notice */}
      {activeAlert ? (
        <UrgentAlertBanner
          alert={activeAlert}
          onStartProtectionPlan={() => onNavigate('protection_plan')}
        />
      ) : (
        <div className="bg-gradient-to-r from-[#F5FBF7] via-white to-[#F5FBF7] border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#146B3A] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#146B3A]">
                  Favorable Weather & Safe Operational Window
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ALL CLEAR
                </span>
              </div>
              <p className="text-xs text-[#55635C] mt-1 max-w-2xl font-medium">
                Doppler radar records {weather.rainfallMmNext24h}mm rainfall and {weather.temperature}°C with normal soil humidity across {farmerProfile.taluk || 'Kalaburagi'}. Ideal for regular weeding, irrigation, and pesticide application.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('protection_plan')}
            className="text-xs font-extrabold text-[#146B3A] bg-white border border-[#146B3A]/30 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            Review 6-Step Defense Readiness →
          </button>
        </div>
      )}

      {/* 3. Weather & Farm Risk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WeatherCard
            weather={weather}
            isLoading={isWeatherLoading}
            onRefresh={onRefreshWeather}
            onChangeLocation={onChangeLocation}
          />
        </div>

        <div className="lg:col-span-5">
          <FarmRiskCard riskScore={riskScore} />
        </div>
      </div>

      {/* 3.5 Live Ground Zero Disaster Reels Spotlight */}
      <div className="bg-gradient-to-r from-red-900/10 via-amber-900/5 to-emerald-900/10 rounded-2xl border border-red-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Film className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                LIVE REELS FEED
              </span>
              <span className="text-xs font-bold text-[#17211B]">
                Karnataka Ground-Zero Disaster Stories
              </span>
            </div>
            <p className="text-xs text-[#65736B] mt-0.5">
              Watch recent vertical video reports of river floods, hailstorms, and crop submergence across Karnataka or upload your farm report.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('reels')}
            className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Watch Ground Reels
          </button>
        </div>
      </div>

      {/* 4. Kisan Mitra AI (ChatGPT) Interactive Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#146B3A] to-emerald-800 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4 border border-emerald-600/30">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs text-white flex items-center justify-center shrink-0 border border-white/30 shadow-lg">
              <Bot className="w-7 h-7 text-emerald-300" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-900 rounded-full animate-ping" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                AI AGRI EXPERT (CHATGPT)
              </span>
              <span className="text-xs font-bold text-emerald-200">
                ರೈತ ಮಿತ್ರ ಚಾಟ್‌ಬಾಟ್
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 flex items-center gap-2">
              <span>Ask Kisan Mitra: Upload Crop Photo / Flood Video or Type Question</span>
              <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
            </h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Get instant crop disease diagnostics, exact spray dosages, water drainage recovery recipes, and SDRF/NDRF compensation claim assistance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('ai_chatbot')}
            className="bg-white hover:bg-emerald-50 text-[#146B3A] px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#146B3A]" />
            <span>Open AI Chatbot</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#146B3A]" />
          </button>
        </div>
      </div>

      {/* 5. Today's Actions & Farm Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TodayActionsCard
            actions={actions}
            onToggleAction={handleToggleAction}
            onViewAll={() => onNavigate('protection_plan')}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          {/* Quick Farm Holding Widget */}
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4] mb-3">
                <h3 className="text-sm font-bold text-[#17211B] flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-[#146B3A]" /> My Farm Summary
                </h3>
                <button
                  onClick={() => onNavigate('farms')}
                  className="text-xs text-[#146B3A] font-bold hover:underline"
                >
                  View Plot
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Registered Area</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">5.2 Acres</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Primary Crop</span>
                  <span className="font-bold text-[#146B3A] mt-0.5 block">Tur & Jowar</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Water Source</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">Borewell 420ft</span>
                </div>
                <div className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E2E8E4]">
                  <span className="text-[#65736B] block">Livestock</span>
                  <span className="font-bold text-[#17211B] mt-0.5 block">6 Cattle</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E2E8E4] flex items-center justify-between text-xs">
              <span className="text-[#65736B]">Seed Stock: 80 kg Tur</span>
              <span className="text-[#16834B] font-bold">Storage Safe & Dry</span>
            </div>
          </div>

          {/* Quick Disaster Help Bar */}
          <div className="bg-[#F5FBF7] rounded-2xl border border-[#146B3A]/30 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#146B3A] text-white flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#17211B]">Kisan Help Desk (Karnataka)</h4>
                <p className="text-[11px] text-[#65736B]">Immediate advisory for heavy rain</p>
              </div>
            </div>
            <a
              href="tel:18001801551"
              className="bg-white border border-[#146B3A] text-[#146B3A] font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#EAF6EE]"
            >
              1800-180-1551
            </a>
          </div>
        </div>
      </div>

      {/* 5. Overall Farm Readiness */}
      <FarmReadinessCard />

      {/* 6. 6-Step Protection Plan Quick Ribbon */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8E4] mb-4">
          <div>
            <h3 className="text-base font-bold text-[#17211B] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#146B3A]" /> Your 6-Step Protection Roadmap
            </h3>
            <p className="text-xs text-[#65736B]">Field-tested preventive stages to avoid crop and asset damage</p>
          </div>

          <button
            onClick={() => onNavigate('protection_plan')}
            className="text-xs font-bold text-[#146B3A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { num: '01', title: 'Weather Monitoring', status: 'Completed', color: 'text-[#16834B] bg-[#EAF6EE]' },
            { num: '02', title: 'Drainage & Crop', status: 'In Progress', color: 'text-amber-700 bg-amber-50' },
            { num: '03', title: 'Livestock Safety', status: 'In Progress', color: 'text-amber-700 bg-amber-50' },
            { num: '04', title: 'Secure Storage', status: 'Completed', color: 'text-[#16834B] bg-[#EAF6EE]' },
            { num: '05', title: 'Document Safety', status: 'Completed', color: 'text-[#16834B] bg-[#EAF6EE]' },
            { num: '06', title: 'Emergency Plan', status: 'In Progress', color: 'text-amber-700 bg-amber-50' },
          ].map((s, idx) => (
            <div key={idx} className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2E8E4] flex flex-col justify-between">
              <span className="text-xs font-extrabold text-[#65736B] block">{s.num}</span>
              <span className="text-xs font-bold text-[#17211B] my-1 block leading-tight">{s.title}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${s.color}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
