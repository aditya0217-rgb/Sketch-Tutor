import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Allow larger payload for camera and high-res mobile photos
  app.use(express.json({ limit: '25mb' }));

  // API Status route to verify configuration without exposing keys
  app.get('/api/status', (req, res) => {
    const isConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      configured: isConfigured,
      message: isConfigured
        ? 'Gemini AI service is configured and ready.'
        : 'GEMINI_API_KEY is not configured or is using default placeholder. Please provide a valid key in Secrets.',
    });
  });

  // Multimodal Drawing Guide generation endpoint
  app.post('/api/generate-guide', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error: 'AI_NOT_CONFIGURED',
          message:
            'Gemini API key is not configured in the server environment. Sketch Tutor strictly uses real multimodal AI and does not fake tutorials. Please add GEMINI_API_KEY in the AI Studio Secrets panel or .env file to enable live analysis.',
        });
        return;
      }

      const {
        imageBase64,
        mimeType = 'image/jpeg',
        userSkillLevel = 'beginner',
        language = 'en',
      } = req.body;

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        res.status(400).json({
          error: 'INVALID_PAYLOAD',
          message: 'An image is required. Please upload or capture an image to generate a drawing tutorial.',
        });
        return;
      }

      let cleanBase64 = imageBase64;
      let finalMimeType = mimeType || 'image/jpeg';

      // Robustly extract base64 data regardless of data URL formatting
      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        cleanBase64 = parts[1];
        const prefix = parts[0];
        const match = prefix.match(/^data:([^;]+)/);
        if (match && match[1]) {
          finalMimeType = match[1];
        }
      } else if (imageBase64.startsWith('data:')) {
        // Strip data: prefix up to comma
        const commaIdx = imageBase64.indexOf(',');
        if (commaIdx !== -1) {
          cleanBase64 = imageBase64.slice(commaIdx + 1);
        }
      }

      // Remove any whitespace, newlines, or url-encoded artifacts
      cleanBase64 = cleanBase64.trim().replace(/\s+/g, '');

      // Normalize MIME type for Gemini API (only supports raster image types)
      const supportedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!supportedMimes.includes(finalMimeType)) {
        finalMimeType = 'image/png';
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let languageInstructions = '';
      switch (language) {
        case 'hinglish':
          languageInstructions = `
CRITICAL REQUIREMENT - NATURAL CONVERSATIONAL HINGLISH:
You MUST write the ENTIRE lesson and ALL JSON string fields in NATURAL HINGLISH using the Roman / English alphabet (Latin script).
This must sound EXACTLY like how young people naturally chat, talk, and explain things in everyday modern Indian conversations (like friendly Indian tutorial videos or WhatsApp messages).

EXAMPLE OF DESIRED NATURAL HINGLISH TONE AND STYLE:
"Ab face ka basic shape banao. Pencil ko halka rakho, zyada pressure mat dena, taaki guidelines baad mein easily erase kar sako."
"Pehle ek light oval banao jo main body ka outline banega. Pencil ko tight mat pakdo, bilkul loose hand se draw karo."
"Dekho, center vertical line ko check karo. Ab iske baad dono sides ki symmetry verify karo."
"Shading karte waqt dhyan rakhna ki light kahan se aa rahi hai. Thoda light stroke lagao aur dheere-dheere dark karo."

MANDATORY RULES FOR NATURAL HINGLISH:
1. SCRIPT: NEVER use Devanagari script (NO हिंदी अक्षर). ONLY use English/Roman alphabet letters (A-Z, a-z).
2. TONE & VOCABULARY:
   - Use natural Hindi phrasing: "banao", "dekho", "ab iske baad", "dhyaan rakhna", "thoda light rakho", "aise karna", "bilkul smooth hand se", "pencil halki chalao", "zyada pressure mat do".
   - Keep common drawing words in natural English: sketch, outline, shading, pencil pressure, erase, blend, guidelines, proportions, light source, highlight, shadows, 2B/4B pencil.
3. STRICTLY PROHIBITED:
   - Do NOT use formal, pure, or textbook/Sanskritized Hindi (NO "mukhakriti", NO "kripya aisi aakriti banayein", NO "chitrakala").
   - Do NOT write pure English and pretend it is Hinglish.
   - Do NOT use overly complex or archaic words.
`;
          break;

        case 'hi':
          languageInstructions = `
LANGUAGE REQUIREMENT - HINDI (DEVANAGARI SCRIPT):
Write the complete lesson and all JSON string fields in natural, friendly Hindi using Devanagari script (हिंदी).
Keep the tone simple and accessible for beginners. Common art terms can be transliterated naturally (e.g. पेंसिल, स्केच, आउटलाइन, शेडिंग, इरेज़र).
`;
          break;

        case 'gu':
          languageInstructions = `
LANGUAGE REQUIREMENT - GUJARATI (ગુજરાતી):
Write the complete lesson and all JSON string fields in simple, friendly, conversational Gujarati (ગુજરાતી લિપિ).
Keep drawing instructions easy to understand for beginners.
`;
          break;

        case 'mr':
          languageInstructions = `
LANGUAGE REQUIREMENT - MARATHI (मराठी):
Write the complete lesson and all JSON string fields in simple, encouraging Marathi (मराठी).
`;
          break;

        case 'bn':
          languageInstructions = `
LANGUAGE REQUIREMENT - BENGALI (বাংলা):
Write the complete lesson and all JSON string fields in simple, beginner-friendly Bengali (বাংলা).
`;
          break;

        case 'ta':
          languageInstructions = `
LANGUAGE REQUIREMENT - TAMIL (தமிழ்):
Write the complete lesson and all JSON string fields in simple, beginner-friendly Tamil (தமிழ்).
`;
          break;

        case 'es':
          languageInstructions = `
LANGUAGE REQUIREMENT - SPANISH (ESPAÑOL):
Write the complete lesson and all JSON string fields in clear, encouraging, beginner-friendly Spanish.
`;
          break;

        case 'fr':
          languageInstructions = `
LANGUAGE REQUIREMENT - FRENCH (FRANÇAIS):
Write the complete lesson and all JSON string fields in clear, encouraging, beginner-friendly French.
`;
          break;

        case 'de':
          languageInstructions = `
LANGUAGE REQUIREMENT - GERMAN (DEUTSCH):
Write the complete lesson and all JSON string fields in clear, encouraging, beginner-friendly German.
`;
          break;

        default:
          languageInstructions = `
LANGUAGE REQUIREMENT - ENGLISH:
Write the complete lesson and all JSON string fields in clear, friendly, beginner-friendly English.
`;
          break;
      }

      const promptText = `
You are an expert, encouraging art teacher creating a tailored step-by-step drawing lesson for a beginner artist based on the provided reference image.

Target Audience: Absolute beginner to intermediate drawer.
Language Style: Warm, direct, highly visual, clear, without confusing technical jargon unless immediately explained.

${languageInstructions}

Drawing Lesson Focus:
1. Break down the subject into elementary geometric 2D & 3D shapes (cylinders, spheres, boxes, wedges, curved planes).
2. Teach proportional landmarks (e.g. "The head is about one-third the height of the torso", "Align the top corner with the center vertical line").
3. Provide progressive steps from initial ghost lines / bounding envelope to final shading and texture.
4. Each step must have a clear actionable instruction, a "Beginner Tip" (e.g., pencil grip, line weight), and a quick "Self-Check Question".

Respond with pure JSON conforming exactly to the requested schema. Ensure all textual fields in the JSON match the specified language.
`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          subjectName: {
            type: Type.STRING,
            description: 'Brief, clear name of the detected subject or scene in the image.',
          },
          summary: {
            type: Type.STRING,
            description: '2-3 sentence overview of what makes this subject fun and accessible to sketch.',
          },
          difficulty: {
            type: Type.STRING,
            description: 'Difficulty rating, e.g. "Beginner Friendly", "Intermediate-Beginner", or "Moderate".',
          },
          estimatedMinutes: {
            type: Type.INTEGER,
            description: 'Realistic estimated time in minutes for a beginner sketch (e.g., 15 to 30).',
          },
          recommendedPencils: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Recommended pencil grades and tools (e.g., HB, 2B, kneaded eraser, blending stump).',
          },
          keyGeometricShapes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                shape: { type: Type.STRING, description: 'Basic shape name (e.g. Oval, Cylinder, Trapezoid)' },
                role: { type: Type.STRING, description: 'Which part of the subject this shape represents' },
              },
              required: ['shape', 'role'],
            },
            description: 'The foundation shapes a beginner should look for first.',
          },
          lightSourceDirection: {
            type: Type.STRING,
            description: 'Identified primary light direction (e.g., "From the upper left, casting soft shadows downwards to the right").',
          },
          proportionsTip: {
            type: Type.STRING,
            description: 'Crucial visual rule of thumb or landmark comparison to get the proportions right.',
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                title: { type: Type.STRING, description: 'Clear step headline (e.g. "Step 1: Lay Down the Bounding Envelope")' },
                instruction: { type: Type.STRING, description: 'Step-by-step description of what to draw at this stage.' },
                actionableTip: { type: Type.STRING, description: 'Practical tip on hand pressure, sight measurements, or pencil grip.' },
                selfCheck: { type: Type.STRING, description: 'A question the artist can ask themselves to verify accuracy before moving on.' },
              },
              required: ['stepNumber', 'title', 'instruction', 'actionableTip', 'selfCheck'],
            },
            description: 'Ordered list of 4 to 6 drawing steps from initial layout to final details.',
          },
          commonMistakesToAvoid: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-3 common pitfalls beginners make when sketching this exact type of subject.',
          },
          warmupExercise: {
            type: Type.STRING,
            description: 'A 60-second warmup drill to do on scrap paper before starting this drawing.',
          },
        },
        required: [
          'subjectName',
          'summary',
          'difficulty',
          'estimatedMinutes',
          'recommendedPencils',
          'keyGeometricShapes',
          'lightSourceDirection',
          'proportionsTip',
          'steps',
          'commonMistakesToAvoid',
          'warmupExercise',
        ],
      };

      // Resilient model cascade: try fast gemini-3.1-flash-lite first, then fallback to gemini-flash-latest
      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let responseText: string | undefined;
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: {
                parts: [
                  {
                    inlineData: {
                      mimeType: finalMimeType,
                      data: cleanBase64,
                    },
                  },
                  {
                    text: promptText,
                  },
                ],
              },
              config: {
                responseMimeType: 'application/json',
                responseSchema,
              },
            });

            if (response.text) {
              responseText = response.text;
              break;
            }
          } catch (err: any) {
            lastError = err;
            const isDemandSpike =
              err?.status === 503 ||
              err?.message?.includes('503') ||
              err?.message?.includes('high demand') ||
              err?.status === 429;

            if (isDemandSpike && attempt < 2) {
              await new Promise((r) => setTimeout(r, 1000));
              continue;
            }
            break;
          }
        }
        if (responseText) break;
      }

      if (!responseText) {
        throw lastError || new Error('Received an empty response from Gemini API.');
      }

      const parsedData = JSON.parse(responseText);
      res.json(parsedData);
    } catch (err: any) {
      console.error('Error generating drawing guide:', err);
      let userMessage = 'Failed to analyze image and generate the drawing guide. Please try again with another clear image.';

      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error?.message) {
            userMessage = parsed.error.message;
          } else {
            userMessage = err.message;
          }
        } catch {
          userMessage = err.message;
        }
      }

      const isApiKeyError =
        err?.message?.includes('API_KEY_INVALID') ||
        err?.status === 401 ||
        err?.status === 403;

      res.status(isApiKeyError ? 401 : 500).json({
        error: isApiKeyError ? 'INVALID_API_KEY' : 'GENERATION_FAILED',
        message: isApiKeyError
          ? 'The provided Gemini API key appears invalid or unauthorized. Please verify the key in Secrets.'
          : userMessage,
      });
    }
  });

  // Multiturn AI Chat endpoint for Sketch Assistant
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error: 'AI_NOT_CONFIGURED',
          message:
            'Gemini API key is not configured on the server. Please add GEMINI_API_KEY in Secrets to chat with Sketch Assistant.',
        });
        return;
      }

      const {
        messages = [],
        language = 'hinglish',
        currentGuideContext,
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({
          error: 'INVALID_MESSAGES',
          message: 'At least one message is required to start or continue a conversation.',
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Language style guidance for chatbot
      let langGuide = '';
      switch (language) {
        case 'hinglish':
          langGuide = `
CRITICAL LANGUAGE REQUIREMENT - NATURAL HINGLISH:
You MUST reply in NATURAL, CONVERSATIONAL HINGLISH using the Roman / English alphabet (Latin script).
NEVER use Devanagari script (NO हिंदी अक्षर).
Speak like a friendly, helpful Indian art teacher in a YouTube video or casual chat.
Use everyday expressions: "banao", "dekho", "ab iske baad", "dhyaan rakhna", "thoda light rakho", "aise karna", "bilkul tension mat lo", "pencil ko halka pakdo".
Keep drawing terms in English: sketch, outline, shading, pencil pressure, erase, blend, guidelines, proportions, highlight, shadow.
`;
          break;

        case 'hi':
          langGuide = `
LANGUAGE REQUIREMENT - HINDI:
Reply in warm, friendly Hindi using Devanagari script (हिंदी). Keep advice simple and clear for beginners.
`;
          break;

        case 'gu':
          langGuide = `
LANGUAGE REQUIREMENT - GUJARATI:
Reply in encouraging, friendly Gujarati (ગુજરાતી લિપિ). Keep drawing terms simple and beginner-friendly.
`;
          break;

        case 'mr':
          langGuide = `
LANGUAGE REQUIREMENT - MARATHI:
Reply in encouraging, friendly Marathi (मराठी).
`;
          break;

        default:
          langGuide = `
LANGUAGE REQUIREMENT - ENGLISH:
Reply in clear, warm, encouraging, beginner-friendly English.
`;
          break;
      }

      let contextSnippet = '';
      if (currentGuideContext && currentGuideContext.subjectName) {
        contextSnippet = `
CURRENT DRAWING CONTEXT:
The student is currently working on: "${currentGuideContext.subjectName}".
Summary: "${currentGuideContext.summary || ''}".
Light Direction: "${currentGuideContext.lightSourceDirection || ''}".
Proportions Tip: "${currentGuideContext.proportionsTip || ''}".
When the student asks questions like "how do I shade this?", "what pencil should I use?", or "how do I fix the shape?", give specific advice tailored to this subject!
`;
      }

      const systemInstruction = `
You are "Sketch Assistant", a warm, encouraging, expert drawing tutor helping a beginner artist.
Your goal is to build confidence, give practical drawing techniques (grip, line weight, measurement, shapes, shading), and answer their art questions.

${langGuide}

${contextSnippet}

Guidelines:
1. Keep replies friendly, concise, and easy to read on mobile screens (use short paragraphs or bullet points).
2. Never patronize; praise effort and give actionable solutions (e.g. "Try turning your paper upside down to check symmetry").
3. Do not include markdown code blocks unless writing a checklist.
`;

      // Build valid gemini Content array
      const contents = messages
        .filter((m: any) => m && m.content && typeof m.content === 'string')
        .slice(-8)
        .map((m: any) => ({
          role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content.trim() }],
        }));

      if (contents.length === 0) {
        res.status(400).json({ error: 'EMPTY_CONTENT', message: 'No valid message content provided.' });
        return;
      }

      // Ensure last message is from user
      if (contents[contents.length - 1].role !== 'user') {
        res.status(400).json({ error: 'INVALID_SEQUENCE', message: 'Last message must be from user.' });
        return;
      }

      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let replyText: string | undefined;
      let lastErr: any = null;

      for (const modelName of modelsToTry) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const result = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
              },
            });

            if (result.text) {
              replyText = result.text;
              break;
            }
          } catch (err: any) {
            lastErr = err;
            const isDemandSpike =
              err?.status === 503 ||
              err?.message?.includes('503') ||
              err?.message?.includes('high demand') ||
              err?.status === 429;

            if (isDemandSpike && attempt < 2) {
              await new Promise((r) => setTimeout(r, 1000));
              continue;
            }
            break;
          }
        }
        if (replyText) break;
      }

      if (!replyText) {
        throw lastErr || new Error('Failed to generate response from Sketch Assistant.');
      }

      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      let userMessage = 'Sketch Assistant is currently unavailable. Please try again.';
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          userMessage = parsed?.error?.message || err.message;
        } catch {
          userMessage = err.message;
        }
      }
      res.status(500).json({ error: 'CHAT_FAILED', message: userMessage });
    }
  });

  // Serve static assets in production, or mount Vite dev server in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sketch Tutor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
