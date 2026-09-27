import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
// @ts-ignore
import lamejs from 'lamejs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Shared server-side Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Converts raw PCM audio (24kHz 16-bit mono little-endian) into standard WAV format
 * by prepending a 44-byte RIFF/WAVE header if not already present.
 */
function ensureWavBuffer(buffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  if (buffer.length >= 12 && buffer.toString('utf8', 0, 4) === 'RIFF') {
    return buffer;
  }
  const dataSize = buffer.length;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, buffer]);
}

/**
 * Converts raw PCM 16-bit 24kHz buffer to an MP3 buffer using lamejs
 */
function pcmToMp3Buffer(pcmBuffer: Buffer, sampleRate = 24000, channels = 1): Buffer | null {
  try {
    const Mp3Encoder = (lamejs as any).Mp3Encoder || (lamejs as any).default?.Mp3Encoder;
    if (!Mp3Encoder) return null;
    const pcm16 = new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, Math.floor(pcmBuffer.length / 2));
    const mp3encoder = new Mp3Encoder(channels, sampleRate, 128);
    const mp3Chunks: Buffer[] = [];
    const blockSize = 1152;
    for (let i = 0; i < pcm16.length; i += blockSize) {
      const chunk = pcm16.subarray(i, i + blockSize);
      const mp3buf = channels === 1 ? mp3encoder.encodeBuffer(chunk) : mp3encoder.encodeBuffer(chunk, chunk);
      if (mp3buf && mp3buf.length > 0) {
        mp3Chunks.push(Buffer.from(mp3buf));
      }
    }
    const end = mp3encoder.flush();
    if (end && end.length > 0) {
      mp3Chunks.push(Buffer.from(end));
    }
    return Buffer.concat(mp3Chunks);
  } catch (err) {
    console.error('pcmToMp3Buffer error:', err);
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/tts/generate
 * Uses gemini-3.8-flash-tts to convert text to high-fidelity speech.
 * Handles both single speaker and dual speaker configurations with custom styles.
 */
app.post('/api/tts/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      text,
      mode = 'single', // 'single' | 'dialogue'
      voiceName = 'Kore', // 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede'
      style,
      speakerConfigs,
      dialogueParts,
      language = 'ne',
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your secrets configuration.',
      });
      return;
    }

    if (mode === 'dialogue' && dialogueParts && Array.isArray(dialogueParts) && dialogueParts.length > 0) {
      // Dual-speaker dialogue mode using gemini-3.8-flash-tts
      const sp1 = speakerConfigs?.[0] || { speaker: 'Speaker1', voiceName: 'Puck', style: 'Enthusiastic' };
      const sp2 = speakerConfigs?.[1] || { speaker: 'Speaker2', voiceName: 'Kore', style: 'Calm, thoughtful' };

      const parts = dialogueParts.map((item: { speaker: string; text: string; style?: string }) => ({
        text: `${item.speaker}: ${item.text}`,
        speechMetadata: {
          speaker: item.speaker,
          style: item.style || (item.speaker === sp1.speaker ? sp1.style : sp2.style) || 'Natural conversational tone',
        },
      }));

      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: sp1.speaker,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: sp1.voiceName || 'Puck' },
                  },
                },
                {
                  speaker: sp2.speaker,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: sp2.voiceName || 'Kore' },
                  },
                },
              ],
            },
          },
        },
      });

      const part = ttsResponse.candidates?.[0]?.content?.parts?.[0];
      const rawBase64 = part?.inlineData?.data;

      if (!rawBase64) {
        res.status(502).json({
          error: 'No audio returned by gemini-3.8-flash-tts. The text or speaker tokens may have been rejected.',
          details: ttsResponse.text,
        });
        return;
      }

      const rawBuffer = Buffer.from(rawBase64, 'base64');
      const wavBuffer = ensureWavBuffer(rawBuffer, 24000, 1, 16);
      const audioBase64 = wavBuffer.toString('base64');
      const mp3Buf = pcmToMp3Buffer(rawBuffer, 24000, 1);
      const mp3Base64 = mp3Buf ? mp3Buf.toString('base64') : null;

      res.json({
        success: true,
        mimeType: 'audio/wav',
        audioData: `data:audio/wav;base64,${audioBase64}`,
        mp3Data: mp3Base64 ? `data:audio/mp3;base64,${mp3Base64}` : null,
        sampleRate: 24000,
        mode: 'dialogue',
        durationEstimateSec: Math.round((rawBuffer.length / (24000 * 2)) * 10) / 10,
      });
      return;
    }

    // Single Speaker Mode
    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text prompt is required.' });
      return;
    }

    // Default style guidance tailored for Nepali and natural articulation
    const defaultNepaliStyle = language === 'ne'
      ? 'Expressive and clear Nepali native pronunciation with authentic rhythm, smooth phrasing, and appropriate breathing pauses.'
      : 'Clear, articulate, natural vocal delivery.';

    const voiceStyle = style?.trim() ? style.trim() : defaultNepaliStyle;

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: voiceStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const part = ttsResponse.candidates?.[0]?.content?.parts?.[0];
    const rawBase64 = part?.inlineData?.data;

    if (!rawBase64) {
      res.status(502).json({
        error: 'No audio data returned by gemini-3.8-flash-tts. This often happens if the text input caused a synthesis error.',
        modelText: ttsResponse.text,
      });
      return;
    }

    const rawBuffer = Buffer.from(rawBase64, 'base64');
    const wavBuffer = ensureWavBuffer(rawBuffer, 24000, 1, 16);
    const audioBase64 = wavBuffer.toString('base64');
    const mp3Buf = pcmToMp3Buffer(rawBuffer, 24000, 1);
    const mp3Base64 = mp3Buf ? mp3Buf.toString('base64') : null;

    res.json({
      success: true,
      mimeType: 'audio/wav',
      audioData: `data:audio/wav;base64,${audioBase64}`,
      mp3Data: mp3Base64 ? `data:audio/mp3;base64,${mp3Base64}` : null,
      sampleRate: 24000,
      mode: 'single',
      voiceName,
      durationEstimateSec: Math.round((rawBuffer.length / (24000 * 2)) * 10) / 10,
    });
  } catch (err: any) {
    console.error('Error generating TTS audio:', err);
    res.status(500).json({
      error: err.message || 'Failed to synthesize speech audio.',
      suggestion:
        'Try using the "Script Doctor / TTS Optimizer" to normalize Devanagari numerals, abbreviations, or complex conjuncts.',
    });
  }
});

/**
 * POST /api/tts/generate-discussion
 * Synthesizes a 5-person panel roundtable discussion in Nepali using gemini-3.8-flash-tts.
 * Handles speaker transitions, vocal burst cues, and seamless PCM concatenation with conversational pacing.
 */
app.post('/api/tts/generate-discussion', async (req: Request, res: Response): Promise<void> => {
  try {
    const { panelists, turns, title = '५-पात्र गोलमेच छलफल' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    if (!turns || !Array.isArray(turns) || turns.length === 0) {
      res.status(400).json({ error: 'Turns are required for discussion synthesis.' });
      return;
    }

    const panelistMap = new Map<string, any>();
    if (Array.isArray(panelists)) {
      for (const p of panelists) {
        panelistMap.set(p.id, p);
      }
    }

    const pcmChunks: Buffer[] = [];
    const conversationalPause = Buffer.alloc(Math.floor(24000 * 0.4 * 2)); // 400ms pause between speakers

    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i];
      if (!turn.text || !turn.text.trim()) continue;

      const pInfo = panelistMap.get(turn.panelistId) || {
        voiceBase: 'Kore',
        style: 'Natural conversational Nepali speaker with clear enunciation',
      };

      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: turn.text.trim(),
                speechMetadata: {
                  style: pInfo.style || 'Articulate, expressive Nepali speaker',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: pInfo.voiceBase || 'Kore' },
            },
          },
        },
      });

      const part = ttsResponse.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      if (base64Audio) {
        const buf = Buffer.from(base64Audio, 'base64');
        pcmChunks.push(buf);
        if (i < turns.length - 1) {
          pcmChunks.push(conversationalPause);
        }
      }
    }

    if (pcmChunks.length === 0) {
      res.status(502).json({ error: 'Failed to synthesize discussion turns.' });
      return;
    }

    const fullPcm = Buffer.concat(pcmChunks);
    const wavBuffer = ensureWavBuffer(fullPcm, 24000, 1, 16);
    const audioBase64 = wavBuffer.toString('base64');
    const mp3Buf = pcmToMp3Buffer(fullPcm, 24000, 1);
    const mp3Base64 = mp3Buf ? mp3Buf.toString('base64') : null;

    res.json({
      success: true,
      title,
      audioData: `data:audio/wav;base64,${audioBase64}`,
      mp3Data: mp3Base64 ? `data:audio/mp3;base64,${mp3Base64}` : null,
      sampleRate: 24000,
      mode: 'discussion',
      durationEstimateSec: Math.round((fullPcm.length / (24000 * 2)) * 10) / 10,
    });
  } catch (err: any) {
    console.error('Discussion generation error:', err);
    res.status(500).json({
      error: err.message || 'Failed to synthesize 5-person panel discussion.',
    });
  }
});

/**
 * POST /api/tts/optimize-script
 * Uses gemini-3.8-flash to analyze Nepali / multilingual text and address the
 * "Audio not supported" or synthesis failure issue.
 * Produces:
 * 1. An optimized Devanagari text (spelling out numbers into Nepali words, punctuation for pauses)
 * 2. An alternative Romanized/Phonetic Nepali version (guaranteed 100% synthesis compatibility)
 * 3. A diagnostic breakdown explaining why Google AI TTS tools might report "Audio not supported"
 * 4. Pacing and emotional cue suggestions.
 */
app.post('/api/tts/optimize-script', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawText, targetTone = 'conversational' } = req.body;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      res.status(400).json({ error: 'Text to optimize is required.' });
      return;
    }

    const prompt = `You are an expert Nepali Phonetics & AI Text-to-Speech (TTS) Acoustic Engineer.
A user encountered the common issue in Google AI voice-over / TTS tools where entering Nepali text gives "Audio not supported" or fails to synthesize.

Input Text:
"""
${rawText.trim()}
"""

Target Tone: ${targetTone}

Your job is to:
1. Diagnose why Google TTS tools or Gemini TTS might show "Audio not supported" or stumble on this input (e.g., Devanagari numerals vs words, non-standard conjuncts, missing pause punctuation, zero-width characters, unhandled acronyms, English technical loanwords mixed in, foreign symbols).
2. Create an "optimizedText": Beautiful, clean Devanagari text where numerals (e.g. 2026, 50, 100) are written out as full Nepali words (e.g. दुई हजार छब्बीस), acronyms are spelled out phonetically, comma/full stop (। or ,) cadence is optimized for natural speech breathing, and optional vocal bursts or backchanneling markers like <breath>, <laugh>, |mhm| are placed where fitting.
3. Create a "phoneticRomanizedText": Accurate, natural Romanized Nepali / IAST phonetic spelling that Google AI Voice / Gemini TTS can pronounce with 100% reliability with zero script-rendering bugs.
4. Provide actionable "diagnostics": Clear explanation in both Nepali and English of what was fixed and why.
5. Provide a suggested "voiceStyle" string suitable for gemini-3.8-flash-tts speechMetadata.style.
6. Provide an English translation for multilingual context.

Return STRICT JSON matching this schema:
{
  "optimizedText": string,
  "phoneticRomanizedText": string,
  "englishTranslation": string,
  "voiceStyleSuggestion": string,
  "diagnostics": {
    "nepaliExplanation": string,
    "englishExplanation": string,
    "issuesDetected": string[],
    "improvementsApplied": string[]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedText: { type: Type.STRING },
            phoneticRomanizedText: { type: Type.STRING },
            englishTranslation: { type: Type.STRING },
            voiceStyleSuggestion: { type: Type.STRING },
            diagnostics: {
              type: Type.OBJECT,
              properties: {
                nepaliExplanation: { type: Type.STRING },
                englishExplanation: { type: Type.STRING },
                issuesDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                improvementsApplied: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['nepaliExplanation', 'englishExplanation', 'issuesDetected', 'improvementsApplied'],
            },
          },
          required: [
            'optimizedText',
            'phoneticRomanizedText',
            'englishTranslation',
            'voiceStyleSuggestion',
            'diagnostics',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Error optimizing script:', err);
    res.status(500).json({ error: err.message || 'Failed to optimize script.' });
  }
});

/**
 * POST /api/tts/translate-text
 * Translates English or other languages to natural conversational Nepali
 * ready for voice-over generation.
 */
app.post('/api/tts/translate-text', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceText, targetLanguage = 'ne' } = req.body;
    if (!sourceText || typeof sourceText !== 'string') {
      res.status(400).json({ error: 'sourceText is required.' });
      return;
    }

    const prompt = `Translate the following text into natural, spoken, and idiomatic ${
      targetLanguage === 'ne' ? 'Nepali (नेपाली)' : 'English'
    } suitable for voice-over and audio speech synthesis.
Text:
"""
${sourceText}
"""

Return JSON:
{
  "translatedText": string,
  "romanized": string,
  "styleNotes": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            romanized: { type: Type.STRING },
            styleNotes: { type: Type.STRING },
          },
          required: ['translatedText', 'romanized', 'styleNotes'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Error translating text:', err);
    res.status(500).json({ error: err.message || 'Translation failed.' });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nepali Voice Studio] Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
