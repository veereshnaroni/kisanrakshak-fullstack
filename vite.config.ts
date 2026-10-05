import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function zipDownloadPlugin(): Plugin {
  return {
    name: 'zip-download-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ZIP Download handler
        if (req.url === '/kisanrakshak-fullstack.zip' || req.url === '/api/download-zip') {
          const zipPath = path.resolve(__dirname, 'public', 'kisanrakshak-fullstack.zip');
          if (fs.existsSync(zipPath)) {
            const stat = fs.statSync(zipPath);
            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Content-Length': stat.size,
              'Content-Disposition': 'attachment; filename="kisanrakshak-fullstack.zip"',
            });
            fs.createReadStream(zipPath).pipe(res);
            return;
          }
        }

        // Gemini AI Farmer Chatbot API Endpoint
        if (req.url === '/api/farmer-chat' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const { message, attachments = [], district = 'Kalaburagi', language = 'en' } = JSON.parse(body || '{}');

              const ai = new GoogleGenAI({});

              const systemInstruction = `You are "Kisan Mitra AI" (ರೈತ ಮಿತ್ರ), an expert, direct, and knowledgeable agricultural AI assistant (like ChatGPT for farmers) specializing in Karnataka agriculture, crops, disasters, and government schemes.

CRITICAL INSTRUCTIONS:
1. Answer the farmer's EXACT question directly and accurately. Do NOT give unrelated or canned answers.
2. If the farmer asks about a specific crop (e.g., Tomato, Cotton, Sugarcane, Tur, Paddy, Ragi, Chilli, Onion, Arecanut, Mango, Banana), answer specifically for that crop.
3. If the farmer asks about diseases, pests, sprays, fertilizer dose, seed rates, or soil, give the exact names and metric dosages (e.g. grams/ml per liter of water, kg per acre).
4. If the farmer asks about government schemes (SDRF, NDRF, PMFBY, Parihara, Ganga Kalyana, PM-Kisan, Raitha Siri), give the accurate eligibility, required documents, and application procedure in Karnataka.
5. If the farmer asks in Kannada or requests Kannada, provide clear, respectful, and natural Kannada responses (ಕನ್ನಡದಲ್ಲಿ ನಿಖರ ಮಾಹಿತಿ).
6. Format your response clearly with headings, bullet points, and exact dosages.

User Location: ${district}, Karnataka
Language Mode: ${language}`;

              const contents: any[] = [];

              if (attachments && Array.isArray(attachments)) {
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
              }

              contents.push({
                text: message || 'Please provide agricultural guidance for my farm.',
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
                      temperature: 0.3,
                    },
                  });

                  if (response && response.text) {
                    generatedText = response.text;
                    break;
                  }
                } catch (err: any) {
                  lastError = err;
                  console.warn(`Model ${model} failed, trying fallback...`, err.message);
                }
              }

              if (!generatedText && lastError) {
                throw lastError;
              }

              const text = generatedText || 'Unable to generate response.';
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, text, textKn: text }));
            } catch (err: any) {
              console.error('Vite middleware Gemini error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), zipDownloadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
