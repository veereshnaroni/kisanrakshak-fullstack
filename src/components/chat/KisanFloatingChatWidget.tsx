import React, { useState } from 'react';
import { Bot, MessageCircle, X, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { KisanChatbotView } from './KisanChatbotView';
import { useLanguage } from '../../context/LanguageContext';

interface KisanFloatingChatWidgetProps {
  onNavigateToFullChat?: () => void;
  onReportLoss?: () => void;
  onRequestHelp?: () => void;
}

export const KisanFloatingChatWidget: React.FC<KisanFloatingChatWidgetProps> = ({
  onNavigateToFullChat,
  onReportLoss,
  onRequestHelp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Window Popup */}
      {isOpen && (
        <div className="mb-3 animate-in slide-in-from-bottom-6 zoom-in-95 duration-200 shadow-2xl rounded-3xl">
          <KisanChatbotView
            isWidgetMode={true}
            onCloseWidget={() => setIsOpen(false)}
            onReportLoss={onReportLoss}
            onRequestHelp={onRequestHelp}
          />
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-gradient-to-r from-[#146B3A] to-[#1F8A4C] hover:from-[#1F8A4C] hover:to-[#146B3A] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Open Kisan Mitra AI Assistant"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />

        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-extrabold tracking-wide flex items-center gap-1">
            <span>Kisan Mitra AI</span>
            <Sparkles className="w-3 h-3 text-amber-300 fill-current" />
          </span>
          <span className="text-[10px] text-emerald-100 font-medium">
            {language === 'kn' ? 'ರೈತ ಮಿತ್ರ ಚಾಟ್‌ಬಾಟ್' : 'Instant Crop & Disaster AI'}
          </span>
        </div>
      </button>
    </div>
  );
};
