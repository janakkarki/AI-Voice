import { VoiceOption, VoicePreset } from '../types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: 'Kore',
    name: 'Kore (कोरे)',
    gender: 'Female',
    toneDescription: 'Warm, clear, and melodious — ideal for storytelling, guidance, and narrations',
    nepaliRecommended: true,
  },
  {
    id: 'Puck',
    name: 'Puck (पक)',
    gender: 'Male',
    toneDescription: 'Youthful, energetic, and engaging — great for podcasts, commercials, and dialogues',
    nepaliRecommended: true,
  },
  {
    id: 'Zephyr',
    name: 'Zephyr (जेफिर)',
    gender: 'Female',
    toneDescription: 'Calm, gentle, and reflective — suited for meditations, audiobooks, and soft prompts',
    nepaliRecommended: true,
  },
  {
    id: 'Fenrir',
    name: 'Fenrir (फेनरिर)',
    gender: 'Male',
    toneDescription: 'Deep, authoritative, and resonant — excellent for news broadcasts, documentaries',
    nepaliRecommended: true,
  },
  {
    id: 'Charon',
    name: 'Charon (क्यारन)',
    gender: 'Male',
    toneDescription: 'Measured, serious, and cinematic — perfect for dramatic narrations',
    nepaliRecommended: false,
  },
  {
    id: 'Aoede',
    name: 'Aoede (एओडी)',
    gender: 'Female',
    toneDescription: 'Expressive, dynamic, and modern conversationalist',
    nepaliRecommended: false,
  },
];

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'storyteller',
    labelNe: 'कथा वाचक (Storyteller)',
    labelEn: 'Himalayan Storyteller',
    icon: 'BookOpen',
    stylePrompt: 'Warm, soothing, and rhythmic Nepali folklore storyteller. Gentle pauses at punctuation with melodic inflection.',
    recommendedVoice: 'Kore',
  },
  {
    id: 'news',
    labelNe: 'समाचार प्रस्तोता (News Anchor)',
    labelEn: 'News Anchor',
    icon: 'Radio',
    stylePrompt: 'Formal, crisp, professional Nepali news reader. Steady rhythm, clear consonant enunciation, objective cadence.',
    recommendedVoice: 'Fenrir',
  },
  {
    id: 'podcast',
    labelNe: 'युवा पोडकास्ट (Youth Podcast)',
    labelEn: 'Vibrant Podcaster',
    icon: 'Mic',
    stylePrompt: 'Casual, vibrant Kathmandu youth conversational style. Natural breathing, spontaneous vocal energy with natural chuckles.',
    recommendedVoice: 'Puck',
  },
  {
    id: 'calm',
    labelNe: 'शान्त / ध्यान (Meditation & Calm)',
    labelEn: 'Calm & Mindful',
    icon: 'Sparkles',
    stylePrompt: 'Soft, slow, deeply peaceful Nepali voice. Gentle breath at commas, comforting and reassuring presence.',
    recommendedVoice: 'Zephyr',
  },
  {
    id: 'commercial',
    labelNe: 'उत्साही विज्ञापन (Promo & Tech)',
    labelEn: 'Energetic Commercial',
    icon: 'Zap',
    stylePrompt: 'Punchy, persuasive, bright and engaging commercial voice-over with high enthusiasm and crisp clarity.',
    recommendedVoice: 'Puck',
  },
];

export interface SampleScript {
  id: string;
  titleNe: string;
  titleEn: string;
  category: string;
  voice: 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr';
  style: string;
  text: string;
  englishTranslation: string;
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: 'nepali-troubleshoot-greeting',
    titleNe: 'समस्या समाधान - "Audio not supported" को जवाफ',
    titleEn: 'Troubleshoot: Audio Not Supported Solution',
    category: 'Troubleshooting / व्याख्या',
    voice: 'Kore',
    style: 'Explaining gently and clearly with friendly reassurance',
    text: 'नमस्ते! यदि तपाईंको गुगल टेक्स्ट टु स्पीचमा नेपाली राख्दा "Audio not supported" भन्ने समस्या आयो भने, नआत्तिनुहोस्। यसको मुख्य कारण फन्ट वा लिपिमा भएका विशेष अक्षर र अङ्कहरूको ढाँचा हुन सक्छ। हामी यसलाई सजिलै मिलाउन सक्छौँ।',
    englishTranslation: 'Hello! If you saw "Audio not supported" when entering Nepali in Google TTS, do not worry. The main cause is often font ligatures or unexpanded numerals in the text. We can fix it easily.',
  },
  {
    id: 'morning-news',
    titleNe: 'काठमाडौँ बिहानी समाचार',
    titleEn: 'Kathmandu Morning News Broadcast',
    category: 'समाचार / News',
    voice: 'Fenrir',
    style: 'Formal, dignified news anchor voice with steady tempo',
    text: 'नमस्कार, बिहानीको मुख्य समाचारमा स्वागत छ। आज काठमाडौँ उपत्यकाको मौसम सफा रहने र तापक्रम बाइस डिग्री सेल्सियस रहने जल तथा मौसम विज्ञान विभागले जनाएको छ। देशभरिको जनजीवन सामान्य रूपमा अघि बढिरहेको छ।',
    englishTranslation: 'Greetings, welcome to the morning news headline. Today, the weather in Kathmandu valley will remain clear with temperatures around 22 degrees Celsius according to the meteorological division.',
  },
  {
    id: 'mountain-folklore',
    titleNe: 'हिमाली लोककथा - चतुर खरायो',
    titleEn: 'Himalayan Folk Story: The Clever Hare',
    category: 'कथा / Folklore',
    voice: 'Kore',
    style: 'Expressive traditional storyteller, gentle melodic delivery with dramatic pauses',
    text: 'एक समयको कुरा हो, <breath> धौलागिरी हिमालको फेदीमा एउटा सुन्दर गाउँ थियो। त्यहाँ एउटा सानो तर निकै चतुर खरायो बस्थ्यो। एक दिन जंगलमा ठूलो बाघ आयो, तर खरायोले आफ्नो चलाखीले सबै जनावरलाई बचायो। <laugh>',
    englishTranslation: 'Once upon a time, at the foothills of Mount Dhaulagiri, there was a beautiful village. There lived a small but very clever hare. One day, a big tiger entered the forest, but the hare saved everyone with his wit.',
  },
  {
    id: 'mindfulness-nepali',
    titleNe: 'दैनिक ध्यान र शान्ति',
    titleEn: 'Daily Mindfulness & Inner Peace',
    category: 'ध्यान / Meditation',
    voice: 'Zephyr',
    style: 'Soft, slow, deeply peaceful and reassuring cadence with gentle breathing',
    text: 'आफ्नो आँखा बन्द गर्नुहोस्। <breath> एक पटक लामो श्वास भित्र लिनुहोस्, अनि बिस्तारै बाहिर छोड्नुहोस्। आजको दिन तपाईंका लागि नयाँ अवसर र शान्ति लिएर आएको छ। मनलाई पूर्ण रूपमा शान्त बनाउनुहोस्।',
    englishTranslation: 'Close your eyes. Take a deep breath in, and gently exhale. Today brings fresh opportunity and peace for you. Allow your mind to become completely calm.',
  },
  {
    id: 'tech-announcement',
    titleNe: 'कृत्रिम बुद्धिमत्ता (AI) को नयाँ युग',
    titleEn: 'The New Age of Artificial Intelligence',
    category: 'प्रविधि / Technology',
    voice: 'Puck',
    style: 'Upbeat, articulate tech enthusiast',
    text: 'नमस्ते साथीहरू! आज हामी नेपाली भाषामा एआई भ्वाइस कसरी प्रयोग गर्ने भन्ने बारेमा छलफल गर्दैछौँ। जेमिनाईको नयाँ मोडलले अब हाम्रै लवज र भावना बुझेर प्राकृतिक बोली निकाल्न सक्छ। <breath> यो साँच्चिकै अद्भुत छ!',
    englishTranslation: 'Hello friends! Today we are discussing how to use AI Voice in Nepali. Gemini’s new model can now understand our authentic accent and emotion to produce natural speech. This is truly amazing!',
  },
];

export interface DialoguePreset {
  id: string;
  titleNe: string;
  titleEn: string;
  speaker1: { name: string; voice: 'Puck' | 'Fenrir'; style: string };
  speaker2: { name: string; voice: 'Kore' | 'Zephyr'; style: string };
  turns: Array<{ speaker: string; text: string }>;
}

export const SAMPLE_DIALOGUES: DialoguePreset[] = [
  {
    id: 'trekking-plan',
    titleNe: 'अन्नपूर्ण पदयात्रा योजना (Annapurna Trek Plan)',
    titleEn: 'Planning an Annapurna Trek',
    speaker1: {
      name: 'Ramesh',
      voice: 'Puck',
      style: 'Enthusiastic young hiker with cheerful Nepali accent',
    },
    speaker2: {
      name: 'Sunita',
      voice: 'Kore',
      style: 'Thoughtful, encouraging travel guide with warm smile in voice',
    },
    turns: [
      {
        speaker: 'Ramesh',
        text: 'सुनिता, के तिमी आगामी हप्ता अन्नपूर्ण पदयात्रामा जान तयार छौ? मैले सबै सामान मिलाइसकेँ!',
      },
      {
        speaker: 'Sunita',
        text: '|हो| रमेश, म त एकदमै उत्साहित छु! <breath> तर उच्च हिमाली क्षेत्रको लागि न्यानो ज्याकेट नबिर्स है।',
      },
      {
        speaker: 'Ramesh',
        text: 'चिन्तै नगर, क्यामरा र तातो लुगा दुवै ठिक्क पारेको छु। पोखरामा भेटौँला है त!',
      },
      {
        speaker: 'Sunita',
        text: 'हुन्छ, पोखराको फेवाताल किनारमा भेटौँला। यात्रा निकै रमाइलो हुनेछ! <laugh>',
      },
    ],
  },
  {
    id: 'nepali-ai-podcast',
    titleNe: 'नेपाली एआई पोडकास्ट (Tech Talk)',
    titleEn: 'Nepali AI & Language Podcast',
    speaker1: {
      name: 'Alex',
      voice: 'Puck',
      style: 'Dynamic podcast host, engaging and curious',
    },
    speaker2: {
      name: 'Kore',
      voice: 'Kore',
      style: 'Knowledgeable, articulate AI researcher with clear enunciation',
    },
    turns: [
      {
        speaker: 'Alex',
        text: 'नमस्ते सबैलाई! आज हाम्रो पोडकास्टमा नेपाली भाषाको टेक्स्ट टु स्पीच प्रविधिको बारेमा कुरा गर्दैछौँ।',
      },
      {
        speaker: 'Kore',
        text: 'धन्यवाद! |yeah| पहिले नेपाली बोली निकाल्दा धेरै समस्या आउँथ्यो, तर अब जेमिनाई मोडलले नेपाली लवजलाई निकै राम्रोसँग समातेको छ।',
      },
      {
        speaker: 'Alex',
        text: 'साँच्चै हो, |mhm| अब हामी कथा, समाचार, र अडियोबुक सजिलै आफ्नै भाषामा सुन्न सक्छौँ।',
      },
      {
        speaker: 'Kore',
        text: 'एकदम सही भन्नुभयो। यसले भाषा संरक्षण र पहुँचमा ठूलो सहयोग पुर्याउनेछ। <breath>',
      },
    ],
  },
];
