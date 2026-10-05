import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  MapPin,
  Sprout,
  Package,
  Droplets,
  HeartHandshake,
  Wrench,
  Warehouse,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Landmark,
  FileText,
  PhoneCall,
  Users,
  Building,
  BarChart3,
  Sliders,
  History,
  AlertTriangle,
  Film,
  Bot,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  urgentAlertCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
  urgent?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, urgentAlertCount }) => {
  const { isFarmer, isAdmin } = useAuth();
  const { t } = useLanguage();

  const farmerNavItems: NavItem[] = [
    { id: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    {
      id: 'ai_chatbot',
      label: 'Kisan Mitra AI (ChatGPT)',
      icon: Bot,
      badge: 'AI BOT',
      badgeColor: 'bg-emerald-600 text-white font-bold animate-pulse',
      highlight: true,
    },
    {
      id: 'reels',
      label: t('nav.reels', 'Disaster Reels (Ground Zero)'),
      icon: Film,
      badge: 'LIVE',
      badgeColor: 'bg-red-500 text-white font-bold',
    },
    {
      id: 'alerts',
      label: t('nav.risk_alerts', 'Risk & Alerts'),
      icon: ShieldAlert,
      badge: urgentAlertCount > 0 ? `${urgentAlertCount}` : undefined,
      badgeColor: 'bg-[#DC4444] text-white',
    },
    { id: 'protection_plan', label: t('nav.protection_plan', '6-Step Protection Plan'), icon: CheckCircle2, highlight: true },
    { id: 'farms', label: t('nav.my_farms', 'My Farms'), icon: MapPin },
    { id: 'crops', label: t('nav.crops', 'Crops'), icon: Sprout },
    { id: 'seeds', label: t('nav.seeds', 'Seeds'), icon: Package },
    { id: 'water', label: t('nav.water', 'Water'), icon: Droplets },
    { id: 'livestock', label: t('nav.livestock', 'Livestock'), icon: HeartHandshake },
    { id: 'assets', label: t('nav.assets', 'Farm Assets'), icon: Wrench },
    { id: 'storage', label: t('nav.storage', 'Storage'), icon: Warehouse },
    { id: 'loss_report', label: t('nav.loss_report', 'Report Loss'), icon: FileSpreadsheet },
    { id: 'recovery', label: t('nav.recovery', 'Recovery Plan'), icon: RefreshCw },
    { id: 'schemes', label: t('nav.schemes', 'Government Schemes'), icon: Landmark },
    { id: 'documents', label: t('nav.documents', 'Farm Documents'), icon: FileText },
    { id: 'emergency', label: t('nav.emergency', 'Emergency Help'), icon: PhoneCall, urgent: true },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin_dashboard', label: 'Disaster Control Centre', icon: ShieldAlert },
    {
      id: 'ai_chatbot',
      label: 'Kisan Mitra AI (ChatGPT)',
      icon: Bot,
      badge: 'AI BOT',
      badgeColor: 'bg-emerald-600 text-white font-bold animate-pulse',
      highlight: true,
    },
    {
      id: 'reels',
      label: 'Ground Reels & Video Feed',
      icon: Film,
      badge: 'LIVE',
      badgeColor: 'bg-red-500 text-white font-bold',
    },
    { id: 'admin_farmers', label: 'Farmers Directory', icon: Users },
    { id: 'admin_farms', label: 'Farms Monitor', icon: Building },
    { id: 'admin_loss', label: 'Loss Reports Review', icon: FileSpreadsheet },
    { id: 'admin_assistance', label: 'Assistance Centre', icon: HeartHandshake },
    { id: 'admin_analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'admin_schemes', label: 'Manage Schemes', icon: Sliders },
    { id: 'admin_audit', label: 'System Audit Log', icon: History },
  ];

  const navList = isAdmin ? adminNavItems : farmerNavItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8E4] sticky top-16 h-[calc(100vh-64px)] shrink-0 py-4 px-3 z-30">
      {/* Section Indicator */}
      <div className="px-3 mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#65736B]">
          {isAdmin ? 'Karnataka Disaster Admin' : 'Farmer Preparedness'}
        </span>
        <span className="w-2 h-2 rounded-full bg-[#16834B] animate-pulse"></span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navList.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EAF6EE] text-[#146B3A] border-l-4 border-[#146B3A]'
                  : item.highlight
                  ? 'bg-[#F5FBF7] text-[#146B3A] hover:bg-[#EAF6EE]'
                  : item.urgent
                  ? 'text-[#DC4444] hover:bg-red-50'
                  : 'text-[#17211B] hover:bg-[#F7F9F8]'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#146B3A]' : item.urgent ? 'text-[#DC4444]' : 'text-[#65736B]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Helpline Banner */}
      <div className="mt-4 p-3 bg-[#F5FBF7] rounded-xl border border-[#E2E8E4]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#146B3A] mb-1">
          <PhoneCall className="w-3.5 h-3.5 text-[#146B3A]" />
          <span>Kisan Call Centre</span>
        </div>
        <p className="text-[11px] text-[#65736B] leading-relaxed mb-1.5">
          Toll-Free Agricultural Support & Disaster Advisory
        </p>
        <a
          href="tel:18001801551"
          className="block text-center text-xs font-bold bg-white text-[#146B3A] border border-[#146B3A]/30 py-1.5 rounded-lg hover:bg-[#EAF6EE] transition-colors"
        >
          1800-180-1551
        </a>
      </div>
    </aside>
  );
};
