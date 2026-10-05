import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'KisanRakshak',
    'app.subtitle': 'Karnataka',
    'app.tagline': 'Protect Your Farm. Prepare Before Disaster.',
    'nav.dashboard': 'Dashboard',
    'nav.reels': 'Disaster Reels (Ground Zero)',
    'nav.risk_alerts': 'Risk & Alerts',
    'nav.my_farms': 'My Farms',
    'nav.crops': 'Crops',
    'nav.seeds': 'Seeds',
    'nav.water': 'Water',
    'nav.livestock': 'Livestock',
    'nav.assets': 'Farm Assets',
    'nav.storage': 'Storage',
    'nav.protection_plan': '6-Step Protection Plan',
    'nav.loss_report': 'Report Loss',
    'nav.recovery': 'Recovery Plan',
    'nav.schemes': 'Government Schemes',
    'nav.documents': 'Farm Documents',
    'nav.emergency': 'Emergency Help',
    'nav.admin_disasters': 'Disaster Control',
    'nav.admin_farmers': 'Farmers Directory',
    'nav.admin_farms': 'Farms Monitor',
    'nav.admin_loss': 'Loss Reports',
    'nav.admin_assistance': 'Assistance Center',
    'nav.admin_analytics': 'Analytics',
    'nav.admin_schemes': 'Manage Schemes',
    'nav.admin_audit': 'Audit Log',
    'common.good_morning': 'Good Morning',
    'common.location': 'Location',
    'common.change_location': 'Change District / Taluk',
    'common.refresh': 'Refresh Weather',
    'weather.title': "Today's Weather",
    'weather.feels_like': 'Feels Like',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind Speed',
    'weather.rain_prob': 'Rain Probability',
    'weather.forecast_7d': '7-Day Agricultural Forecast',
    'weather.hourly': 'Next Hours Forecast',
    'risk.title': 'Your Farm Risk Indicator',
    'risk.disclaimer': 'Risk indicator based on live Karnataka meteorological advisories and your reported farm soil & crop conditions.',
    'risk.flood': 'Flood / Waterlogging Risk',
    'risk.drought': 'Drought Risk',
    'risk.heat': 'Heat Stress Risk',
    'risk.wind': 'Wind Damage Risk',
    'risk.pest': 'Pest & Blight Susceptibility',
    'alert.urgent': 'URGENT DISASTER ALERT',
    'alert.impact': 'Farm Impact',
    'alert.start_plan': 'START PROTECTION PLAN',
    'actions.priority_title': "Today's Priority Actions",
    'readiness.overall': 'Overall Farm Disaster Readiness',
    'emergency.title': 'Disaster Emergency Help Desk',
    'emergency.call': 'Call Immediately',
  },
  kn: {
    'app.name': 'ಕಿಸಾನ್ ರಕ್ಷಕ್',
    'app.subtitle': 'ಕರ್ನಾಟಕ',
    'app.tagline': 'ನಿಮ್ಮ ಹೊಲವನ್ನು ರಕ್ಷಿಸಿ. ವಿಪತ್ತಿಗೆ ಮುನ್ನವೇ ಸಿದ್ಧರಾಗಿ.',
    'nav.dashboard': 'ಮುಖಪುಟ (ಡ್ಯಾಶ್‌ಬೋರ್ಡ್)',
    'nav.reels': 'ವಿಪತ್ತು ವೀಡಿಯೊಗಳು (ಗ್ರೌಂಡ್ ರೀಲ್ಸ್)',
    'nav.risk_alerts': 'ಅಪಾಯ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
    'nav.my_farms': 'ನನ್ನ ಜಮೀನುಗಳು',
    'nav.crops': 'ಬೆಳೆಗಳು',
    'nav.seeds': 'ಬೀಜ ಸಂಗ್ರಹ',
    'nav.water': 'ಜಲ ಮೂಲಗಳು',
    'nav.livestock': 'ಜಾನುವಾರುಗಳು',
    'nav.assets': 'ಕೃಷಿ ಸಲಕರಣೆಗಳು',
    'nav.storage': 'ಸುರಕ್ಷಿತ ಗೋದಾಮು',
    'nav.protection_plan': '೬-ಹಂತಗಳ ರಕ್ಷಣಾ ಯೋಜನೆ',
    'nav.loss_report': 'ಬೆಳೆ ಹಾನಿ ವರದಿ',
    'nav.recovery': 'ಚೇತರಿಕೆ ಯೋಜನೆ',
    'nav.schemes': 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    'nav.documents': 'ದಾಖಲೆಗಳು (ಪಹಣಿ/ವಿಮೆ)',
    'nav.emergency': 'ತುರ್ತು ಸಹಾಯವಾಣಿ',
    'nav.admin_disasters': 'ವಿಪತ್ತು ನಿಯಂತ್ರಣ ಕೇಂದ್ರ',
    'nav.admin_farmers': 'ರೈತರ ವಿವರ',
    'nav.admin_farms': 'ಜಮೀನುಗಳ ನಿಗಾ',
    'nav.admin_loss': 'ಹಾನಿ ಪರಿಶೀಲನೆ',
    'nav.admin_assistance': 'ಸಹಾಯ ವಿಭಾಗ',
    'nav.admin_analytics': 'ಅಂಕಿಅಂಶಗಳು',
    'nav.admin_schemes': 'ಯೋಜನೆ ನಿರ್ವಹಣೆ',
    'nav.admin_audit': 'ಆಡಿಟ್ ಲಾಗ್',
    'common.good_morning': 'ಶುಭ ಮುಂಜಾನೆ',
    'common.location': 'ಸ್ಥಳ',
    'common.change_location': 'ಜಿಲ್ಲೆ / ತಾಲೂಕು ಬದಲಾಯಿಸಿ',
    'common.refresh': 'ಹವಾಮಾನ ನವೀಕರಿಸಿ',
    'weather.title': 'ಇಂದಿನ ಹವಾಮಾನ',
    'weather.feels_like': 'ಅನುಭವ ತಾಪಮಾನ',
    'weather.humidity': 'ಆರ್ದ್ರತೆ',
    'weather.wind': 'ಗಾಳಿಯ ವೇಗ',
    'weather.rain_prob': 'ಮಳೆಯ ಸಂಭವನೀಯತೆ',
    'weather.forecast_7d': '೭-ದಿನಗಳ ಕೃಷಿ ಮುನ್ಸೂಚನೆ',
    'weather.hourly': 'ಮುಂದಿನ ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ',
    'risk.title': 'ನಿಮ್ಮ ಹೊಲದ ಅಪಾಯ ಸೂಚ್ಯಂಕ',
    'risk.disclaimer': 'ಕರ್ನಾಟಕ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ನೀವು ನೀಡಿದ ಕೃಷಿ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಸಿದ್ಧಪಡಿಸಲಾದ ಅಪಾಯದ ಅಂದಾಜು.',
    'risk.flood': 'ನೆರೆ / ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ',
    'risk.drought': 'ಬರಗಾಲದ ಅಪಾಯ',
    'risk.heat': 'ಅತಿಯಾದ ತಾಪಮಾನ',
    'risk.wind': 'ಭಾರಿ ಗಾಳಿಯ ಅಪಾಯ',
    'risk.pest': 'ಕೀಟ ಭಾದೆ ಸಂಭವ',
    'alert.urgent': 'ತುರ್ತು ವಿಪತ್ತು ಎಚ್ಚರಿಕೆ',
    'alert.impact': 'ಹೊಲದ ಮೇಲಿನ ಪರಿಣಾಮ',
    'alert.start_plan': 'ರಕ್ಷಣಾ ಯೋಜನೆ ಆರಂಭಿಸಿ',
    'actions.priority_title': 'ಇಂದಿನ ಆದ್ಯತೆಯ ಕ್ರಮಗಳು',
    'readiness.overall': 'ಒಟ್ಟಾರೆ ಕೃಷಿ ವಿಪತ್ತು ಸನ್ನದ್ಧತೆ',
    'emergency.title': 'ವಿಪತ್ತು ತುರ್ತು ಸಹಾಯವಾಣಿ',
    'emergency.call': 'ತಕ್ಷಣ ಕರೆ ಮಾಡಿ',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kisanrakshak_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kisanrakshak_lang', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
