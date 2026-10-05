import React from 'react';
import { Home, ShieldAlert, Sprout, CheckCircle2, User, Film, Bot } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  alertCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  alertCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'ai_chatbot', label: 'AI Bot', icon: Bot, isAi: true },
    { id: 'reels', label: 'Reels', icon: Film, isLive: true },
    { id: 'alerts', label: 'Alerts', icon: ShieldAlert, count: alertCount },
    { id: 'farms', label: 'My Farm', icon: Sprout },
    { id: 'farmer_profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8E4] px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center py-1.5 px-2 min-w-[50px] min-h-[44px] justify-center transition-colors cursor-pointer ${
                isActive ? 'text-[#146B3A] font-bold' : 'text-[#65736B]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#146B3A]' : 'text-[#65736B]'} ${(item as any).isAi ? 'text-emerald-700' : ''}`} />
                {item.count && item.count > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-[#DC4444] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.count}
                  </span>
                ) : null}
                {item.isLive ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-extrabold rounded-full px-1 flex items-center justify-center animate-pulse">
                    •
                  </span>
                ) : null}
                {(item as any).isAi ? (
                  <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[7px] font-extrabold rounded-full px-1 flex items-center justify-center animate-pulse">
                    AI
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#146B3A] mt-0.5"></span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

