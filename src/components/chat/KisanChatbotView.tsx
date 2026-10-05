import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  X,
  Plus,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  MapPin,
  ExternalLink,
  HelpCircle,
  Camera,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { askKisanMitra, ChatAttachment, ChatMessage } from '../../services/aiChatService';

interface KisanChatbotViewProps {
  onReportLoss?: () => void;
  onRequestHelp?: () => void;
  initialQuery?: string;
  isWidgetMode?: boolean;
  onCloseWidget?: () => void;
}

export const KisanChatbotView: React.FC<KisanChatbotViewProps> = ({
  onReportLoss,
  onRequestHelp,
  initialQuery,
  isWidgetMode = false,
  onCloseWidget,
}) => {
  const { currentUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Namaskara ${currentUser?.name || 'Farmer'}! 🙏 I am **Kisan Mitra AI (ರೈತ ಮಿತ್ರ)**, your 24/7 intelligent agriculture and disaster recovery assistant for **${currentUser?.district || 'Kalaburagi'}**, Karnataka.\n\nYou can:\n- 💬 Ask any farming, pest, crop disease, or flood recovery question.\n- 📸 **Upload photos of damaged crops or leaves** for instant visual diagnosis.\n- 🎥 **Upload field flood videos** to analyze water depth and submergence risk.\n- 🏛️ Get guidance on claiming **SDRF / Parihara input subsidies** and **PMFBY crop insurance**.`,
      textKn: `ನಮಸ್ಕಾರ ${currentUser?.name || 'ರೈತರೇ'}! 🙏 ನಾನು **ಕಿಸಾನ್ ಮಿತ್ರ AI (ರೈತ ಮಿತ್ರ)**, **${currentUser?.district || 'ಕಲಬುರಗಿ'}** ಭಾಗದ ರೈತರ ಕೃಷಿ ಮತ್ತು ವಿಪತ್ತು ಸಲಹಾ ಸಹಾಯಕ.\n\nನೀವು:\n- 💬 ಬೆಳೆ ರೋಗ, ಕೀಟ ಬಾಧೆ ಅಥವಾ ಪ್ರವಾಹ ನಂತರದ ಚಿಕಿತ್ಸೆಯ ಬಗ್ಗೆ ಪ್ರಶ್ನಿಸಬಹುದು.\n- 📸 **ಹಾನಿಗೊಳಗಾದ ಬೆಳೆ/ಎಲೆಗಳ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ** ತಕ್ಷಣದ ರೋಗ ಪರೀಕ್ಷೆ ಪಡೆಯಬಹುದು.\n- 🎥 **ಗದ್ದೆಯ ಪ್ರವಾಹ ವಿಡಿಯೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ** ನೀರಿನ ಮಟ್ಟ ಮತ್ತು ನಷ್ಟದ ಅಂದಾಜು ಪಡೆಯಬಹುದು.\n- 🏛️ **SDRF / ಪರಿಹಾರ ತಂತ್ರಾಂಶ** ಮತ್ತು **ಬೆಳೆ ವಿಮೆ** ಪರಿಹಾರ ಪಡೆಯುವ ವಿವರ ತಿಳಿಯಬಹುದು.`,
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>(initialQuery || '');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech-to-Text Voice Input
  const handleToggleVoiceRecord = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Handle Text-to-Speech audio readout
  const handleSpeakMessage = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const content = (language === 'kn' && msg.textKn) ? msg.textKn : msg.text;
    const cleanText = content.replace(/[*#_`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(
      (v) =>
        v.lang.includes('kn') ||
        v.lang.includes('hi') ||
        v.lang.includes('en-IN') ||
        v.name.includes('India')
    );
    if (match) utterance.voice = match;

    utterance.onstart = () => setSpeakingMsgId(msg.id);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          const newAtt: ChatAttachment = {
            id: `att-${Date.now()}-${i}`,
            name: file.name,
            type,
            url: URL.createObjectURL(file),
            base64: reader.result,
            mimeType: file.type,
          };
          setAttachments((prev) => [...prev, newAtt]);
        }
      };

      reader.readAsDataURL(file);
    }

    // Reset input
    e.target.value = '';
  };

  // Submit User Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputPrompt.trim() && attachments.length === 0) || isLoading) return;

    const userText = inputPrompt.trim();
    const currentAttachments = [...attachments];

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText || (currentAttachments.some((a) => a.type === 'video') ? 'Field flood video analysis request' : 'Crop leaf disease photo diagnosis request'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAttachments,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const botResponse = await askKisanMitra(
        userText,
        currentAttachments,
        currentUser?.district || 'Kalaburagi',
        language as 'en' | 'kn'
      );
      setMessages((prev) => [...prev, botResponse]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Sorry, I encountered a temporary connection glitch. Please check your internet or retry your question.',
          textKn: 'ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕದಲ್ಲಿ ತೊಂದರೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    {
      en: '🌱 Tur (Red gram) root rot after heavy rain — what spray dosage?',
      kn: '🌱 ಮಳೆ ನಂತರ ತೊಗರಿ ಗಿಡ ಕೊಳೆಯುತ್ತಿದೆ - ಯಾವ ಔಷಧ ಸಿಂಪಡಿಸಬೇಕು?',
      query: 'My Tur (Red Gram) crop has root rot and stem blight after flood water. What chemical and organic spray should I use?',
    },
    {
      en: '🌾 Paddy field flooded with 2 ft water — recovery steps?',
      kn: '🌾 ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ 2 ಅಡಿ ನೀರು ನಿಂತಿದೆ - ರಕ್ಷಣಾ ಕ್ರಮಗಳೇನು?',
      query: 'My paddy field is flooded with silt and 2 feet water. How to drain safely and revive the roots?',
    },
    {
      en: '📜 How to claim Parihara SDRF subsidy for crop damage?',
      kn: '📜 ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಪರಿಹಾರ (SDRF) ಪಡೆಯುವುದು ಹೇಗೆ?',
      query: 'How can I claim Karnataka SDRF and NDRF disaster input subsidy through Parihara portal for my damaged crop?',
    },
    {
      en: '🐄 Cow has high fever & foot sores after flood — first aid?',
      kn: '🐄 ಪ್ರವಾಹ ನಂತರ ಆಕಳಿಗೆ ಕಾಲುಬಾಯಿ ರೋಗದ ಲಕ್ಷಣ - ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ?',
      query: 'My cattle has high fever and hoof lesions after staying in wet flood water. What immediate first aid should I give?',
    },
  ];

  return (
    <div
      className={`flex flex-col bg-white border border-[#E2E8E4] overflow-hidden ${
        isWidgetMode
          ? 'h-[620px] w-full max-w-[440px] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200'
          : 'h-[calc(100vh-140px)] min-h-[600px] rounded-2xl shadow-xs'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#146B3A] to-[#1F8A4C] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#146B3A] rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight">Kisan Mitra AI</h2>
              <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                ರೈತ ಮಿತ್ರ
              </span>
            </div>
            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{currentUser?.district || 'Kalaburagi'} 24/7 Agri Expert</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
            title="Toggle English / Kannada"
          >
            {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>

          {/* Clear Chat */}
          <button
            onClick={() => {
              if (confirm('Start a new chat session?')) {
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'assistant',
                    text: `New conversation started! How can I help your farm today in ${currentUser?.district || 'Kalaburagi'}?`,
                    textKn: `ಹೊಸ ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭವಾಗಿದೆ! ${currentUser?.district || 'ಕಲಬುರಗಿ'} ಭಾಗದ ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.`,
                    timestamp: 'Just now',
                  },
                ]);
              }
            }}
            className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Start New Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Close Widget if in modal mode */}
          {isWidgetMode && onCloseWidget && (
            <button
              onClick={onCloseWidget}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F7F9F8]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const content = language === 'kn' && msg.textKn ? msg.textKn : msg.text;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-150`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                  isUser
                    ? 'bg-[#146B3A] text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2.5 shadow-xs ${
                  isUser
                    ? 'bg-[#146B3A] text-white rounded-tr-xs'
                    : 'bg-white text-[#17211B] border border-[#E2E8E4] rounded-tl-xs'
                }`}
              >
                {/* Media Attachments Preview */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-2">
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="relative rounded-xl overflow-hidden border border-white/20 max-w-[200px] max-h-[160px] bg-black/40"
                      >
                        {att.type === 'video' ? (
                          <video
                            src={att.url}
                            controls
                            className="w-full h-full object-cover max-h-[150px]"
                          />
                        ) : (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full h-full object-cover max-h-[150px]"
                          />
                        )}
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-mono">
                          {att.type === 'video' ? '🎥 Video' : '📷 Image'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Body Text */}
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed space-y-1.5 font-normal">
                  {content.split('\n').map((line, idx) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={idx} className="font-extrabold text-[#146B3A]">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                {/* Solution Action Card (If Assistant gave dosage/guidance) */}
                {!isUser && msg.solutionCard && (
                  <div className="mt-3 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs text-[#17211B] space-y-2.5">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Prescribed Recovery Plan</span>
                      </span>
                      {msg.solutionCard.severity && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            msg.solutionCard.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {msg.solutionCard.severity} SEVERITY
                        </span>
                      )}
                    </div>

                    {/* Dosage Table if available */}
                    {msg.solutionCard.sprayDosage && msg.solutionCard.sprayDosage.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-bold text-emerald-950">🧪 Spray / Fertilizer Formulation:</p>
                        <div className="bg-white rounded-lg border border-emerald-200 overflow-hidden divide-y divide-emerald-100">
                          {msg.solutionCard.sprayDosage.map((spray, sIdx) => (
                            <div key={sIdx} className="p-2 flex items-center justify-between text-[11px]">
                              <div>
                                <span className="font-bold text-emerald-900">{spray.name}</span>
                                <p className="text-[10px] text-[#65736B]">{spray.target}</p>
                              </div>
                              <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md">
                                {spray.dose}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons inside Card */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {onReportLoss && (
                        <button
                          onClick={onReportLoss}
                          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>📋 Claim Govt Parihara / Loss</span>
                        </button>
                      )}
                      {onRequestHelp && (
                        <button
                          onClick={onRequestHelp}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>🚨 Request SDRF Rescue</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Controls: Audio readout & timestamp */}
                <div
                  className={`flex items-center justify-between pt-1 text-[10px] ${
                    isUser ? 'text-emerald-100' : 'text-[#65736B]'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleSpeakMessage(msg)}
                      className="flex items-center gap-1 hover:text-[#146B3A] font-semibold cursor-pointer"
                      title="Listen to this response"
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          <span className="text-amber-600 font-bold">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Voice</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2.5 text-xs text-[#65736B] p-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#E2E8E4] px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Analyzing crop symptoms & calculating agro-solutions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length <= 2 && (
        <div className="p-3 bg-white border-t border-[#E2E8E4] overflow-x-auto">
          <p className="text-[11px] font-bold text-[#65736B] mb-2">⚡ Quick Suggested Questions:</p>
          <div className="flex gap-2 pb-1">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputPrompt(q.query);
                }}
                className="shrink-0 bg-[#F7F9F8] hover:bg-emerald-50 hover:border-emerald-300 border border-[#E2E8E4] px-3 py-1.5 rounded-xl text-xs text-[#17211B] text-left transition-colors cursor-pointer"
              >
                {language === 'kn' ? q.kn : q.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Previews before sending */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 overflow-x-auto">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative shrink-0 w-16 h-16 rounded-xl border border-emerald-300 overflow-hidden bg-black"
            >
              {att.type === 'video' ? (
                <video src={att.url} className="w-full h-full object-cover" />
              ) : (
                <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
          <span className="text-xs text-emerald-800 font-bold ml-2">
            {attachments.length} media attached
          </span>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-[#E2E8E4]">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'image')}
        />
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'video')}
        />

        <div className="flex items-center gap-2">
          {/* Add Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[#65736B] hover:text-[#146B3A] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            title="Upload Crop Photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Add Video Button */}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="p-2 text-[#65736B] hover:text-[#146B3A] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            title="Upload Flood / Field Video"
          >
            <VideoIcon className="w-5 h-5" />
          </button>

          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={handleToggleVoiceRecord}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-[#65736B] hover:text-[#146B3A] hover:bg-emerald-50'
            }`}
            title="Speak Kannada / English"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              language === 'kn'
                ? 'ಬೆಳೆ ರೋಗ, ಪ್ರವಾಹ, ಗೊಬ್ಬರ ಪ್ರಮಾಣ ಅಥವಾ ಪರಿಹಾರದ ಬಗ್ಗೆ ಕೇಳಿ...'
                : 'Ask about crop disease, flood drainage, spray dosage, or SDRF relief...'
            }
            className="flex-1 bg-[#F7F9F8] border border-[#E2E8E4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#17211B] focus:outline-none focus:border-[#146B3A] focus:ring-1 focus:ring-[#146B3A]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!inputPrompt.trim() && attachments.length === 0) || isLoading}
            className="bg-[#146B3A] hover:bg-[#1F8A4C] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            title="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
