/**
 * Kisan Mitra AI - Intelligent Multi-modal Agricultural Chatbot Service
 * Uses Google Gemini (gemini-3.8-flash) for precise, direct ChatGPT-like responses for Karnataka farmers.
 */

import { GoogleGenAI } from '@google/genai';

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  base64?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textKn?: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  solutionCard?: {
    cropName?: string;
    diagnosis?: string;
    diagnosisKn?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    immediateActions?: string[];
    immediateActionsKn?: string[];
    sprayDosage?: Array<{ name: string; dose: string; target: string }>;
    preventiveTips?: string[];
    govtReliefScheme?: string;
    helplineNumber?: string;
  };
}

export async function askKisanMitra(
  prompt: string,
  attachments: ChatAttachment[] = [],
  district = 'Kalaburagi',
  language: 'en' | 'kn' = 'en'
): Promise<ChatMessage> {
  const normalized = prompt.toLowerCase();

  // 1. Primary: Call backend `/api/farmer-chat` (which routes through Vite or Express to Gemini 3.8 Flash)
  try {
    const res = await fetch('/api/farmer-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        attachments: attachments.map((a) => ({
          name: a.name,
          type: a.type,
          url: a.url,
          mimeType: a.mimeType || (a.type === 'video' ? 'video/mp4' : 'image/jpeg'),
          base64: a.base64,
        })),
        district,
        language,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.text) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          textKn: data.textKn || data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }
  } catch (e) {
    console.warn('API route call error, attempting direct client fallback...', e);
  }

  // 2. Secondary: Direct Client-side Gemini SDK call with multi-model fallback
  try {
    const ai = new GoogleGenAI({});
    const systemInstruction = `You are "Kisan Mitra AI" (ರೈತ ಮಿತ್ರ), an expert, direct, helpful agricultural scientist answering questions for Karnataka farmers (like ChatGPT for farmers).
Answer the user's EXACT query directly and accurately.
Give exact crop varieties, spray dosages (ml or g per liter), fertilizer schedules, flood drainage methods, or government schemes (SDRF, PMFBY, Parihara, Ganga Kalyana).
Location: ${district}, Karnataka.
Language: ${language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.`;

    const contents: any[] = [];
    for (const att of attachments) {
      if (att.base64) {
        const cleanBase64 = att.base64.replace(/^data:[^;]+;base64,/, '');
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType: att.mimeType || (att.type === 'video' ? 'video/mp4' : 'image/jpeg'),
          },
        });
      }
    }
    contents.push({ text: prompt });

    const clientModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    for (const model of clientModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        if (response && response.text) {
          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: response.text,
            textKn: response.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
      } catch (e) {
        // try next model
      }
    }
  } catch (err) {
    console.warn('Direct client Gemini call error:', err);
  }

  // 3. If offline, return a clear notice rather than a canned random answer
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: language === 'kn'
      ? `ಕ್ಷಮಿಸಿ, AI ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿ ತಾತ್ಕಾಲಿಕ ಅಡಚಣೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು 10 ಸೆಕೆಂಡುಗಳ ನಂತರ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ.`
      : `AI service is currently reconnecting. Please send your question ("${prompt}") again in a moment.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
