import { TtsToolComparison } from '../types';

export const ALTERNATIVE_TTS_TOOLS: TtsToolComparison[] = [
  {
    name: 'Microsoft Azure AI Speech (Cognitive Services)',
    tagline: 'Industry Standard for Devanagari & Nepali Neural Voices',
    nepaliSupportRating: '9.4 / 10',
    nepaliVoices: [
      'ne-NP-HemkalaNeural (महिला / Female - Warm, natural broadcast tone)',
      'ne-NP-SagarNeural (पुरुष / Male - Authoritative, natural clarity)',
    ],
    strengths: [
      'Dedicated native Nepali neural voice models (ne-NP) trained on authentic local acoustic datasets',
      'Flawless handling of Devanagari ligatures (संयुक्त अक्षर) and virama without "Audio not supported" errors',
      'Comprehensive SSML support: pitch, rate, contour, custom phonetic pronunciations (<phoneme alphabet="ipa">)',
      'High-uptime enterprise SLA, low latency, and real-time streaming audio endpoints',
      'Built-in number-to-Devanagari word expander (handles dates, currencies, percentages in Nepali natively)',
    ],
    limitations: [
      'Requires an active Microsoft Azure cloud account and subscription key',
      'Pay-per-character pricing after the free 500,000 characters/month tier',
      'Voice customization is limited to SSML tweaks unless custom neural voice training is ordered',
    ],
    pricingModel: 'Free tier: 500,000 characters/month free. Pay-as-you-go: ~$16.00 per 1 million characters.',
    integrationMethod: 'Official SDKs for Node.js/TypeScript, Python, C#, Java, Go, plus REST & WebSocket streaming APIs.',
    accuracyVerdict: 'उत्कृष्ट (Exceptional). Currently the most reliable commercial cloud API for Devanagari text-to-speech with virtually zero dropped syllables.',
    recommendedFor: 'Commercial production apps, telecom IVR systems, financial banking audio alerts, and news broadcast automation.',
    codeSnippet: `import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY!, "eastus");
speechConfig.speechSynthesisVoiceName = "ne-NP-HemkalaNeural"; // or ne-NP-SagarNeural

const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
synthesizer.speakTextAsync(
  "नमस्ते! माइक्रोसफ्ट एजुरमा नेपाली बोली निकै स्पष्ट सुनिन्छ।",
  result => {
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      console.log("Synthesized audio bytes:", result.audioData.byteLength);
    }
  }
);`,
  },
  {
    name: 'AI4Bharat (Indic-TTS / Bhashini / IIT Madras)',
    tagline: 'Open-Source & Sovereign AI Voice for Indic & Nepali Languages',
    nepaliSupportRating: '9.1 / 10',
    nepaliVoices: [
      'nepali_female (AI4Bharat IndicTTS FastSpeech2 / VITS)',
      'nepali_male (Bhashini National Language Translation Mission)',
    ],
    strengths: [
      '100% trained on South Asian phonetics by IIT Madras & Indian Ministry of Electronics & IT',
      'Open-source weights available on Hugging Face (VITS, FastSpeech2, Coqui TTS)',
      'Can be self-hosted on your own GPU/CPU servers for complete data privacy and zero API costs',
      'Devanagari Grapheme-to-Phoneme (G2P) engine specifically built for Sanskrit/Nepali-derived root words',
      'Available via official Government of India Bhashini ULCA API with high availability',
    ],
    limitations: [
      'Self-hosting requires PyTorch/CUDA setup and infrastructure management',
      'Emotional inflection is slightly more monotonic compared to modern LLM-based TTS models',
      'Cloud hosted endpoints can have intermittent queue latency during peak hours',
    ],
    pricingModel: 'Free and Open Source (Apache 2.0 / MIT). Bhashini API offers free access for registered developers.',
    integrationMethod: 'Hugging Face Inference API, Coqui TTS library in Python, or REST API via Bhashini ULCA Gateway.',
    accuracyVerdict: 'उच्च (Very High). Extremely accurate Devanagari pronunciation because the acoustic tokenizer was built by native Indic language linguists.',
    recommendedFor: 'Government, academic, non-profit projects, and privacy-sensitive on-premise deployments where recurring cloud fees are undesirable.',
    codeSnippet: `# Python integration using Hugging Face / Coqui TTS
import requests

API_URL = "https://api-inference.huggingface.co/models/ai4bharat/indic-tts-nepali"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

response = requests.post(API_URL, headers=headers, json={
    "inputs": "नमस्ते, यो एआई फर भारतको नेपाली टेक्स्ट टु स्पीच प्रणाली हो।"
})
with open("nepali_speech.wav", "wb") as f:
    f.write(response.content)`,
  },
  {
    name: 'ElevenLabs (Multilingual v2 & Turbo v2.5)',
    tagline: 'Most Emotionally Expressive & Realistic Human Voice Synthesis',
    nepaliSupportRating: '8.8 / 10',
    nepaliVoices: [
      '1,000+ Pre-made & Community Voice Agents (e.g. Rachel, Adam, Josh, Dorothy)',
      'Custom Voice Cloning (Clone any authentic Nepali speaker in 60 seconds)',
    ],
    strengths: [
      'Unrivaled emotional depth, natural conversational breathing, pauses, laughter, and human cadence',
      'Allows cloning an authentic Nepali speaker from just a 1-minute audio recording',
      'Modern, world-class developer REST API and WebSockets with low-latency streaming (<200ms)',
      'High-resolution 44.1kHz audio output with dynamic stability and clarity sliders',
      'Prompting voice personas and accents using natural language directions',
    ],
    limitations: [
      'Native Devanagari script can sometimes stumble on rare conjuncts; works best when Devanagari numbers are pre-expanded or Romanized',
      'Higher pricing tier for large volumes of text synthesis',
      'No native "ne-NP" preset voice out of the box (requires using Multilingual model with prompt tuning)',
    ],
    pricingModel: 'Free tier: 10,000 credits/month. Starter plan starts at $5/month for 30,000 characters.',
    integrationMethod: 'ElevenLabs JavaScript/TypeScript SDK, Python SDK, or standard REST API (`POST /v1/text-to-speech/{voice_id}`).',
    accuracyVerdict: 'अत्यन्त प्राकृतिक र जीवन्त (Incredible Naturalness). When text is pre-processed (or romanized), audio realism surpasses virtually any other commercial engine.',
    recommendedFor: 'Podcasts, audiobooks, cinematic video dubbing, video game voice acting, and high-end marketing campaigns.',
    codeSnippet: `import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const audio = await elevenlabs.generate({
  voice: "Rachel",
  model_id: "eleven_multilingual_v2",
  text: "Namaste! Yo ElevenLabs ko expressive Nepali voice-over ho.",
});`,
  },
  {
    name: 'Amazon Polly (Neural Engine & Indian English/Hindi Fallback)',
    tagline: 'AWS Cloud Native Voice Synthesis with SSML Lexicon',
    nepaliSupportRating: '8.2 / 10',
    nepaliVoices: [
      'Kajal (Neural Hindi/Indic - bilingual Devanagari reader)',
      'Aditi (Neural Indian accent voice)',
    ],
    strengths: [
      'Native integration within AWS ecosystem (S3, Lambda, CloudFront)',
      'Low cost ($16 per million characters for Neural, $4 for Standard)',
      'Custom Pronunciation Lexicons (PLS format) allow overriding any Devanagari mispronunciation',
      'Speech Marks support (synchronizing lips and captions to timestamps)',
    ],
    limitations: [
      'Lacks a dedicated "ne-NP" language code; relies on hi-IN (Devanagari) or en-IN fallback',
      'Certain Nepali-specific vocabulary requires custom phonetic lexicon mapping',
    ],
    pricingModel: 'Free tier: 1 million characters/month for the first 12 months. $16 per million characters for Neural.',
    integrationMethod: 'AWS SDK for JavaScript v3, Python Boto3, AWS CLI, REST API.',
    accuracyVerdict: 'मध्यम-उच्च (Good with Lexicons). Reliable Devanagari articulation when paired with Devanagari pronunciation lexicons.',
    recommendedFor: 'Applications already hosted on AWS infrastructure needing simple voice synthesis with speech mark timestamps.',
    codeSnippet: `import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const polly = new PollyClient({ region: "us-east-1" });
const command = new SynthesizeSpeechCommand({
  Engine: "neural",
  VoiceId: "Kajal",
  OutputFormat: "mp3",
  Text: "<speak>नमस्ते, म अमेजन पली हुँ।</speak>",
  TextType: "ssml",
});
const response = await polly.send(command);`,
  },
];
