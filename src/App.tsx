import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { LandingPage } from './components/public/LandingPage';
import { FarmerAuthModal } from './components/public/FarmerAuthModal';

// Farmer Views
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { SixStepProtectionPlanView } from './components/farmer/SixStepProtectionPlanView';
import { FarmManager } from './components/farmer/FarmManager';
import { CropManager } from './components/farmer/CropManager';
import { SeedManager } from './components/farmer/SeedManager';
import { WaterManager } from './components/farmer/WaterManager';
import { LivestockManager } from './components/farmer/LivestockManager';
import { AssetManager } from './components/farmer/AssetManager';
import { StorageManager } from './components/farmer/StorageManager';
import { DocumentManager } from './components/farmer/DocumentManager';
import { DisasterAlertsView } from './components/farmer/DisasterAlertsView';
import { LossReportWizard } from './components/farmer/LossReportWizard';
import { RecoveryPlanView } from './components/farmer/RecoveryPlanView';
import { GovernmentSchemesView } from './components/farmer/GovernmentSchemesView';
import { EmergencyHelpView } from './components/farmer/EmergencyHelpView';
import { FarmerProfileView } from './components/farmer/FarmerProfileView';
import { DisasterReelsView } from './components/common/DisasterReelsView';
import { KisanChatbotView } from './components/chat/KisanChatbotView';
import { KisanFloatingChatWidget } from './components/chat/KisanFloatingChatWidget';

// Admin Views
import { AdminDisasterControl } from './components/admin/AdminDisasterControl';
import { AdminFarmersList } from './components/admin/AdminFarmersList';
import { AdminLossReportsReview } from './components/admin/AdminLossReportsReview';
import { AdminAssistanceCenter } from './components/admin/AdminAssistanceCenter';
import { AdminAnalyticsView } from './components/admin/AdminAnalyticsView';
import { AdminAuditLogView } from './components/admin/AdminAuditLogView';

// Context & Services
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { WeatherData } from './types';
import { fetchLiveWeatherData } from './services/weatherService';
import { db } from './services/mockBackendApi';

function MainApp() {
  const { currentUser, role, isFarmer, isAdmin, isAuthenticated } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin' | null>(null);

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  // Sync weather on district change or refresh
  const loadWeather = async () => {
    setIsWeatherLoading(true);
    const w = await fetchLiveWeatherData(
      currentUser?.district || 'Kalaburagi',
      currentUser?.taluk || 'Kalaburagi'
    );
    setWeather(w);
    setIsWeatherLoading(false);
  };

  useEffect(() => {
    loadWeather();
  }, [currentUser?.district, currentUser?.taluk]);

  // Adjust default tab when role changes
  useEffect(() => {
    if (isAdmin && !currentTab.startsWith('admin_')) {
      setCurrentTab('admin_dashboard');
    } else if (isFarmer && currentTab.startsWith('admin_')) {
      setCurrentTab('dashboard');
    }
  }, [isAdmin, isFarmer]);

  // Alerts sync state
  const [activeAlerts, setActiveAlerts] = useState<any[]>(() =>
    db.getAlerts().filter((a) => a.isActive)
  );

  useEffect(() => {
    const handleSync = () => {
      setActiveAlerts(db.getAlerts().filter((a) => a.isActive));
    };
    window.addEventListener('kisan_alerts_updated', handleSync);
    return () => window.removeEventListener('kisan_alerts_updated', handleSync);
  }, []);

  // If user is logged out, show the public landing page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setAuthModalMode('login')}
          onOpenRegister={() => setAuthModalMode('register')}
          onOpenAdminLogin={() => setAuthModalMode('admin')}
        />
        <FarmerAuthModal
          isOpen={authModalMode !== null}
          initialMode={authModalMode || 'login'}
          onClose={() => setAuthModalMode(null)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17211B] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onRefreshWeather={loadWeather}
        isWeatherLoading={isWeatherLoading}
        alertCount={activeAlerts.length}
        onNavigateToAlerts={() => setCurrentTab(isAdmin ? 'admin_dashboard' : 'alerts')}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto items-start">
        {/* Left Sidebar (Desktop) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          urgentAlertCount={activeAlerts.length}
        />

        {/* Content View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
          {/* Farmer & Shared Views */}
          {currentTab === 'dashboard' && weather && (
            <FarmerDashboard
              weather={weather}
              isWeatherLoading={isWeatherLoading}
              onRefreshWeather={loadWeather}
              onChangeLocation={loadWeather}
              onNavigate={setCurrentTab}
            />
          )}

          {/* Kisan Mitra AI (ChatGPT) */}
          {currentTab === 'ai_chatbot' && (
            <KisanChatbotView
              onReportLoss={() => setCurrentTab('loss_report')}
              onRequestHelp={() => setCurrentTab('emergency')}
            />
          )}

          {currentTab === 'reels' && (
            <DisasterReelsView
              onReportLoss={() => setCurrentTab('loss_report')}
              onRequestHelp={() => setCurrentTab('emergency')}
            />
          )}

          {currentTab === 'protection_plan' && (
            <SixStepProtectionPlanView onBackToDashboard={() => setCurrentTab('dashboard')} />
          )}

          {currentTab === 'farms' && <FarmManager />}
          {currentTab === 'crops' && (
            <CropManager onOpenProtectionPlan={() => setCurrentTab('protection_plan')} />
          )}
          {currentTab === 'seeds' && <SeedManager />}
          {currentTab === 'water' && <WaterManager />}
          {currentTab === 'livestock' && <LivestockManager />}
          {currentTab === 'assets' && <AssetManager />}
          {currentTab === 'storage' && <StorageManager />}
          {currentTab === 'documents' && <DocumentManager />}
          {currentTab === 'alerts' && (
            <DisasterAlertsView onStartProtectionPlan={() => setCurrentTab('protection_plan')} />
          )}
          {currentTab === 'loss_report' && <LossReportWizard />}
          {currentTab === 'recovery' && <RecoveryPlanView />}
          {currentTab === 'schemes' && <GovernmentSchemesView />}
          {currentTab === 'emergency' && <EmergencyHelpView />}
          {currentTab === 'farmer_profile' && <FarmerProfileView />}

          {/* Admin Views */}
          {currentTab === 'admin_dashboard' && <AdminDisasterControl />}
          {currentTab === 'admin_farmers' && <AdminFarmersList />}
          {currentTab === 'admin_farms' && <FarmManager />}
          {currentTab === 'admin_loss' && <AdminLossReportsReview />}
          {currentTab === 'admin_assistance' && <AdminAssistanceCenter />}
          {currentTab === 'admin_analytics' && <AdminAnalyticsView />}
          {currentTab === 'admin_schemes' && <GovernmentSchemesView />}
          {currentTab === 'admin_audit' && <AdminAuditLogView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        alertCount={activeAlerts.length}
      />

      {/* Floating Bottom AI Chatbot Logo / Widget */}
      <KisanFloatingChatWidget
        onNavigateToFullChat={() => setCurrentTab('ai_chatbot')}
        onReportLoss={() => setCurrentTab('loss_report')}
        onRequestHelp={() => setCurrentTab('emergency')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
