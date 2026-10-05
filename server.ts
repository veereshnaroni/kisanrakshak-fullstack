import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google Gen AI
const ai = new GoogleGenAI({});

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KisanRakshak Karnataka Disaster Management API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// AI Farmer Chatbot Endpoint
app.post('/api/farmer-chat', async (req, res) => {
  try {
    const { message, attachments = [], district = 'Kalaburagi', language = 'en' } = req.body;

    const systemInstruction = `You are "Kisan Mitra AI" (ರೈತ ಮಿತ್ರ), an expert agricultural scientist and disaster mitigation specialist dedicated to farmers in Karnataka, India.
You provide precise, actionable, practical, and compassionate farming advice.
Expertise covers:
- Karnataka agro-climatic zones, soils, and regional crops (Tur / Red gram in Kalaburagi/Bidar, Paddy in Raichur/Mandya/Shimoga, Sugarcane in Belagavi, Cotton in Haveri, Coffee in Kodagu, Arecanut in Shivamogga/Chikkamagaluru).
- Post-disaster crop recovery: flood de-watering, silt management, root asphyxiation revival, hailstorm leaf healing, drought conservation.
- Accurate chemical and organic spray dosages (e.g., Metalaxyl, Copper Oxychloride, NPK 19:19:19, Hexaconazole, Trichoderma viride).
- Government relief mechanisms in Karnataka: SDRF/NDRF input subsidies, Parihara portal DBT, PM Fasal Bima Yojana (PMFBY) 72-hour claim window.
- Livestock health during floods (FMD, Lumpy Skin Disease, cattle shelter hygiene).

Respond in clear structured Markdown with sections:
1. 🔍 Diagnosis / Condition Analysis
2. ⚡ Immediate Emergency Steps
3. 🧪 Recommended Spray / Fertilizer Dosage (table or bullet points with exact metric dosages)
4. 🏛️ Government Compensation & Parihara Scheme Guidance
5. 📞 Emergency Helplines (Kisan Call Centre 1800-180-1551, State Disaster 1070)

${language === 'kn' ? 'Also include a fluent Kannada translation summary.' : 'Also include key Kannada agricultural terms for crops and sprays.'}`;

    const contents: any[] = [];

    // Add image/video data parts if available
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

    contents.push({
      text: `Farmer location: ${district}, Karnataka.\nFarmer query: ${message}`,
    });

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let generatedText = '';
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        if (response && response.text) {
          generatedText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Server model ${model} failed, trying fallback...`, err.message);
      }
    }

    if (!generatedText && lastError) {
      throw lastError;
    }

    const text = generatedText || 'Unable to generate advice at this moment.';

    res.json({
      success: true,
      text,
      textKn: text,
      district,
    });
  } catch (err: any) {
    console.error('Gemini farmer-chat error:', err);
    res.status(500).json({
      error: 'AI service unavailable',
      message: err.message,
    });
  }
});

// ZIP file download endpoint
app.get('/kisanrakshak-fullstack.zip', (req, res) => {
  const zipPath = path.join(__dirname, 'public', 'kisanrakshak-fullstack.zip');
  res.download(zipPath, 'kisanrakshak-fullstack.zip');
});

app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(__dirname, 'public', 'kisanrakshak-fullstack.zip');
  res.download(zipPath, 'kisanrakshak-fullstack.zip');
});

// Serve static assets in production if built
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// For SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌾 KisanRakshak server is running at http://localhost:${PORT}`);
});
