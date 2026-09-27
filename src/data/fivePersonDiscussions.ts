import { PanelistConfig, DiscussionTurn } from '../types';

export interface FivePersonDiscussionPreset {
  id: string;
  titleNe: string;
  titleEn: string;
  topicDescription: string;
  panelists: PanelistConfig[];
  turns: DiscussionTurn[];
}

export const FIVE_PERSON_DISCUSSIONS: FivePersonDiscussionPreset[] = [
  {
    id: 'ai-nepal-future',
    titleNe: 'नेपालमा एआई, डिजिटल प्रविधि र युवाहरूको भविष्य',
    titleEn: 'AI, Digital Innovation & Youth Future in Nepal',
    topicDescription: 'नेपालमा कृत्रिम बुद्धिमत्ता (AI) को विस्तार, रोजगारीका नयाँ सम्भावनाहरू र भाषा प्रविधिको विकासबारे ५ विज्ञहरूको गोलमेच छलफल।',
    panelists: [
      {
        id: 'p1',
        name: 'रमेश सिलवाल (प्रस्तोता)',
        role: 'टेक पोडकास्टर तथा मध्यस्थकर्ता',
        agentId: 'ramesh-podcaster',
        voiceBase: 'Puck',
        style: 'Charismatic, lively moderator leading with curiosity and sharp questions',
        color: 'sky',
      },
      {
        id: 'p2',
        name: 'प्रा. डा. सुदीप पोखरेल',
        role: 'एआई अनुसन्धानकर्ता तथा प्राध्यापक',
        agentId: 'dr-sudip-professor',
        voiceBase: 'Charon',
        style: 'Deep, intellectual, thoughtful academic expert with steady explanations',
        color: 'violet',
      },
      {
        id: 'p3',
        name: 'समीक्षा अधिकारी',
        role: 'भाषा तथा संस्कृतिविद्',
        agentId: 'samiksha-storyteller',
        voiceBase: 'Kore',
        style: 'Warm, poetic, passionate about linguistic heritage and inclusion',
        color: 'amber',
      },
      {
        id: 'p4',
        name: 'प्रकृति थापा',
        role: 'डिजिटल उद्यमी तथा स्टार्टअप संस्थापक',
        agentId: 'prakriti-drama',
        voiceBase: 'Aoede',
        style: 'Energetic, optimistic entrepreneur sharing real-world business insights',
        color: 'rose',
      },
      {
        id: 'p5',
        name: 'कमल भट्टराई',
        role: 'वरिष्ठ नीति विश्लेषक तथा पत्रकार',
        agentId: 'kamal-news',
        voiceBase: 'Fenrir',
        style: 'Authoritative, grounded policy analyst highlighting ethics and infrastructure',
        color: 'blue',
      },
    ],
    turns: [
      {
        id: 't-1',
        panelistId: 'p1',
        speakerName: 'रमेश सिलवाल (प्रस्तोता)',
        text: 'नमस्कार सबैलाई! आज हाम्रो पाँच-पात्र विशेष गोलमेच छलफलमा स्वागत छ। <breath> डाक्टर सुदीप, के नेपाल जस्तो देशमा नेपाली भाषामा काम गर्ने एआई साँच्चिकै उपयोगी सावित हुन सक्छ?',
        vocalReaction: '<breath>',
      },
      {
        id: 't-2',
        panelistId: 'p2',
        speakerName: 'प्रा. डा. सुदीप पोखरेल',
        text: 'अवश्य पनि रमेशजी। |हो| यदि हाम्रा विद्यालय, अस्पताल र सरकारी सेवाहरूमा नेपाली बोली बुझ्ने र बोल्ने भ्वाइस एआई पुग्यो भने, दूरदराजका नागरिकले आफ्नै मातृभाषामा सबै सेवा पाउनेछन्।',
        vocalReaction: '|हो|',
      },
      {
        id: 't-3',
        panelistId: 'p3',
        speakerName: 'समीक्षा अधिकारी',
        text: 'म डाक्टरसाबको कुरामा शतप्रतिशत सहमत छु। <breath> हाम्रा परम्परागत हिमाली लोककथाहरू र ज्ञान नयाँ पुस्तासम्म पुर्याउन नेपाली भ्वाइस प्रविधि एक वरदान साबित हुन सक्छ। <laugh>',
        vocalReaction: '<laugh>',
      },
      {
        id: 't-4',
        panelistId: 'p4',
        speakerName: 'प्रकृति थापा',
        text: 'व्यापारिक दृष्टिकोणबाट हेर्दा पनि, हाम्रा नेपाली स्टार्टअपहरूले अब विश्वस्तरीय कन्टेन्ट र ग्राहक सेवा स्वचालित रूपमा नेपालीमै सञ्चालन गर्न सक्छन्। यसले लाखौँ डलर बचत गर्छ!',
        vocalReaction: '',
      },
      {
        id: 't-5',
        panelistId: 'p5',
        speakerName: 'कमल भट्टराई',
        text: 'तर हामीले एउटा कुरा बिर्सनु हुँदैन। डाटा सुरक्षा, नेपाली भाषाको शुद्धता र नैतिक नियमनमा सरकार र निजी क्षेत्र दुवैले समयमै नीति बनाउनुपर्छ। <breath>',
        vocalReaction: '<breath>',
      },
      {
        id: 't-6',
        panelistId: 'p1',
        speakerName: 'रमेश सिलवाल (प्रस्तोता)',
        text: 'निकै महत्वपूर्ण दृष्टिकोणहरू आए। तपाईं सबै वक्ताहरूलाई यो जीवन्त र अर्थपूर्ण छलफलका लागि धेरै धेरै धन्यवाद!',
        vocalReaction: '',
      },
    ],
  },
  {
    id: 'everest-tourism-panel',
    titleNe: 'सगरमाथा, पर्यावरण र नेपालको दिगो पर्यटन',
    titleEn: 'Mount Everest, Climate & Sustainable Tourism in Nepal',
    topicDescription: 'हिमालको पर्यावरण जोगाउँदै पर्यटनलाई नयाँ उचाइमा लैजाने विषयमा ५ जना क्षेत्रगत विज्ञहरूको अन्तरक्रिया।',
    panelists: [
      {
        id: 'p1',
        name: 'रमेश सिलवाल',
        role: 'मध्यस्थकर्ता / सहजकर्ता',
        agentId: 'ramesh-podcaster',
        voiceBase: 'Puck',
        style: 'Respectful, engaging moderator setting an active pace',
        color: 'sky',
      },
      {
        id: 'p2',
        name: 'सिर्जना मानन्धर',
        role: 'वातावरणविद् तथा प्रकृति अन्वेषक',
        agentId: 'sirjana-documentary',
        voiceBase: 'Aoede',
        style: 'Poetic, deeply mindful environmental scientist',
        color: 'cyan',
      },
      {
        id: 'p3',
        name: 'बिदुर बाजे',
        role: 'हिमाली क्षेत्रका स्थानीय अनुभवी',
        agentId: 'baaje-elder',
        voiceBase: 'Fenrir',
        style: 'Affectionate, nostalgic mountain elder sharing lived experiences',
        color: 'orange',
      },
      {
        id: 'p4',
        name: 'समीक्षा अधिकारी',
        role: 'पर्यटन विकास प्रवर्द्धक',
        agentId: 'samiksha-storyteller',
        voiceBase: 'Kore',
        style: 'Warm, positive tourism advocate',
        color: 'amber',
      },
      {
        id: 'p5',
        name: 'अन्जना शर्मा',
        role: 'पारिस्थितिक संरक्षण अभियन्ता',
        agentId: 'anjana-meditation',
        voiceBase: 'Zephyr',
        style: 'Calm, gentle, persuasive voice on harmony with nature',
        color: 'emerald',
      },
    ],
    turns: [
      {
        id: 't-201',
        panelistId: 'p1',
        speakerName: 'रमेश सिलवाल',
        text: 'नमस्ते मित्रहरू! आज हामी हाम्रा गौरव सगरमाथा र हिमाली पर्यावरणबारे ५ जना विज्ञहरूसँग छलफलमा छौँ। बिदुर बाजे, पहिले र अहिलेको हिमालमा तपाईं के फरक देख्नुहुन्छ?',
        vocalReaction: '',
      },
      {
        id: 't-202',
        panelistId: 'p3',
        speakerName: 'बिदुर बाजे',
        text: 'बाबु, पहिले-पहिले हिउँ कहिल्यै पग्लिँदैनथ्यो, हिमाल सेताम्मे हुन्थ्यो। <breath> अचेल काला चट्टानहरू बढी देखिन थालेका छन्। हामीले हिमालको माया गर्नैपर्छ।',
        vocalReaction: '<breath>',
      },
      {
        id: 't-203',
        panelistId: 'p2',
        speakerName: 'सिर्जना मानन्धर',
        text: 'एकदम सही भन्नुभयो बिदुर बाजे। |हो| विश्वव्यापी तापमान वृद्धिले गर्दा हाम्रा हिमतालहरू जोखिममा छन्। पर्यटनसँगै पर्यावरण संरक्षणलाई सँगसँगै लैजानुपर्छ।',
        vocalReaction: '|हो|',
      },
      {
        id: 't-204',
        panelistId: 'p4',
        speakerName: 'समीक्षा अधिकारी',
        text: 'दिगो पर्यटन नै यसको अचुक उपाय हो। स्थानीय शेर्पा समुदाय र युवाहरूलाई प्रत्यक्ष लाभ पुग्ने गरी हामीले हरित पर्यटन मोडल अघि बढाउनुपर्छ।',
        vocalReaction: '',
      },
      {
        id: 't-205',
        panelistId: 'p5',
        speakerName: 'अन्जना शर्मा',
        text: 'प्रकृतिलाई सम्मान गर्दा मात्र हाम्रो अस्तित्व सुरक्षित रहन्छ। <breath> जब हरेक पदयात्रीले हिमाललाई सफा राख्ने प्रण गर्छन्, तब मात्र स्वर्गीय सौन्दर्य बचिरहन्छ।',
        vocalReaction: '<breath>',
      },
      {
        id: 't-206',
        panelistId: 'p1',
        speakerName: 'रमेश सिलवाल',
        text: 'तपाईंहरू सबैको यो अमूल्य सन्देशका लागि कृतज्ञ छौँ। हिमाल जोगिए मात्र हाम्रो पहिचान जोगिनेछ!',
        vocalReaction: '',
      },
    ],
  },
];
