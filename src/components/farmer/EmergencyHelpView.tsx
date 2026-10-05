import React from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake, Droplets, MapPin, Ambulance } from 'lucide-react';

export const EmergencyHelpView: React.FC = () => {
  const hotlines = [
    {
      title: 'Disaster Emergency Control (KSNDMC / SDRF)',
      subtitle: '24/7 State Disaster Helpline for Floods, Cyclones & Evacuations',
      phone: '1077',
      altPhone: '080-22340676',
      icon: ShieldAlert,
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      btnBg: 'bg-[#DC4444] hover:bg-red-700',
    },
    {
      title: 'Taluk Agriculture Officer (Kalaburagi)',
      subtitle: 'Field flood drainage, pest outbreaks & seed rescue',
      phone: '08472-220199',
      altPhone: '1800-180-1551 (Kisan Call Centre)',
      icon: PhoneCall,
      bg: 'bg-[#EAF6EE]',
      border: 'border-[#146B3A]/30',
      text: 'text-[#146B3A]',
      btnBg: 'bg-[#146B3A] hover:bg-[#1F8A4C]',
    },
    {
      title: 'Veterinary / Animal Husbandry Emergency',
      subtitle: 'Livestock flood rescue, feed supply & emergency epidemic care',
      phone: '1962',
      altPhone: '080-23417100',
      icon: HeartHandshake,
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      title: 'Irrigation & Water Emergency Desk',
      subtitle: 'Canal breach, reservoir outflow warnings & pump de-watering',
      phone: '08472-224488',
      altPhone: '1912 (KPTCL Electricity Desk)',
      icon: Droplets,
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      btnBg: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-2 border-red-300 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-[#DC4444] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
            24x7 EMERGENCY RESPONSE
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] mt-2 flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-[#DC4444]" /> Disaster Emergency Help Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-xl">
            Direct high-priority contacts for life safety, livestock evacuation, and rapid agricultural officer assistance.
          </p>
        </div>
      </div>

      {/* Grid of Large Touch Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotlines.map((h, i) => {
          const Icon = h.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-2xl border-2 ${h.border} p-6 shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${h.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${h.text}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#17211B]">{h.title}</h3>
                    <p className="text-xs text-[#65736B]">{h.subtitle}</p>
                  </div>
                </div>

                <div className="my-4 bg-[#F7F9F8] p-3 rounded-xl border border-[#E2E8E4]">
                  <span className="text-xs text-[#65736B] block">Emergency Toll-Free / Hotlines</span>
                  <div className="text-xl font-extrabold text-[#17211B] mt-0.5">
                    {h.phone}
                  </div>
                  <span className="text-xs text-[#65736B] block mt-0.5">Alt: {h.altPhone}</span>
                </div>
              </div>

              <a
                href={`tel:${h.phone.replace(/[^0-9]/g, '')}`}
                className={`w-full ${h.btnBg} text-white font-bold py-3.5 rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px]`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {h.phone} Immediately</span>
              </a>
            </div>
          );
        })}
      </div>

      {/* Nearby Gram Panchayat Support */}
      <div className="bg-[#F5FBF7] rounded-2xl border border-[#146B3A]/30 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-[#146B3A]" />
          <div>
            <h4 className="text-sm font-bold text-[#17211B]">
              Sultanpur Gram Panchayat Emergency Taskforce
            </h4>
            <p className="text-xs text-[#65736B]">
              Village Accountant: Sri Mallikarjun (Mob: 94481-55021) • RSK Officer: Basavaraj (Mob: 94482-11440)
            </p>
          </div>
        </div>
        <a
          href="tel:9448155021"
          className="bg-white border border-[#146B3A] text-[#146B3A] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#EAF6EE] transition-colors"
        >
          Call Panchayat Lead
        </a>
      </div>
    </div>
  );
};
