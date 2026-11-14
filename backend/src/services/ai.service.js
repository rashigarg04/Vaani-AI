import axios from 'axios';

/**
 * Modular AI Reasoning Service
 * Supports:
 * - Evon (when EVON_API_URL and EVON_API_KEY are configured)
 * - Google Gemini (when GEMINI_API_KEY is configured)
 * - OpenAI / Compatible (when OPENAI_API_KEY is configured, e.g. Groq, Ollama)
 * - Local Intelligent Engine (context-aware multilingual Indian conversational engine)
 */
export class AiService {
  /**
   * Determine the active AI provider based on environment configuration
   */
  static getActiveProvider() {
    const configured = process.env.AI_PROVIDER?.toLowerCase();

    if (configured === 'evon' && process.env.EVON_API_URL) {
      return { id: 'evon', name: 'Evon Reasoning Model', isLive: true };
    }
    if (configured === 'gemini' && process.env.GEMINI_API_KEY) {
      return { id: 'gemini', name: 'Google Gemini Pro', isLive: true };
    }
    if ((configured === 'openai' || configured === 'groq') && process.env.OPENAI_API_KEY) {
      return { id: 'openai', name: 'OpenAI / LLM Endpoint', isLive: true };
    }

    // Auto-detect based on available keys if AI_PROVIDER wasn't strictly forced
    if (process.env.EVON_API_URL && process.env.EVON_API_KEY) {
      return { id: 'evon', name: 'Evon Reasoning Model', isLive: true };
    }
    if (process.env.GEMINI_API_KEY) {
      return { id: 'gemini', name: 'Google Gemini', isLive: true };
    }
    if (process.env.OPENAI_API_KEY) {
      return { id: 'openai', name: 'OpenAI / Compatible', isLive: true };
    }

    return {
      id: 'local_intelligent',
      name: 'Vaani Multilingual Intelligence Engine',
      isLive: false,
      note: 'Built-in Indian context engine. Set GEMINI_API_KEY, OPENAI_API_KEY, or EVON_API_URL in backend/.env for hosted LLM models.'
    };
  }

  /**
   * Generate AI response
   */
  static async generateResponse({
    prompt,
    language = 'indic-auto',
    conversationHistory = [],
    preferredLanguage = null
  }) {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }

    const provider = this.getActiveProvider();
    const systemPrompt = this.buildSystemPrompt(preferredLanguage || language);

    const startTime = Date.now();
    let responseText = '';
    let usedProviderName = provider.name;

    switch (provider.id) {
      case 'evon':
        responseText = await this.callEvonApi({ prompt, systemPrompt, conversationHistory });
        break;

      case 'gemini':
        responseText = await this.callGeminiApi({ prompt, systemPrompt, conversationHistory });
        break;

      case 'openai':
        responseText = await this.callOpenAiApi({ prompt, systemPrompt, conversationHistory });
        break;

      case 'local_intelligent':
      default:
        responseText = await this.runLocalIntelligence({ prompt, language: preferredLanguage || language });
        break;
    }

    const latency = (Date.now() - startTime) / 1000;

    return {
      success: true,
      text: responseText.trim(),
      provider: usedProviderName,
      providerId: provider.id,
      language: preferredLanguage || language,
      latency
    };
  }

  /**
   * System prompt tailored for Indian users, supporting Hindi, English, and Hinglish
   */
  static buildSystemPrompt(language) {
    let langInstruction = 'Respond in the same language the user spoke in (Hindi, English, or Hinglish).';
    if (language === 'hi-IN' || language === 'hindi') {
      langInstruction = 'Respond purely in fluent, polite Hindi (Devanagari script).';
    } else if (language === 'en-IN' || language === 'english') {
      langInstruction = 'Respond clearly in natural Indian English.';
    } else if (language === 'hi-IN,en-IN' || language === 'hinglish') {
      langInstruction = 'Respond naturally in conversational Hinglish (Hindi written in Roman/Latin script with mixed English terms, as Indians speak informally).';
    }

    return `You are Vaani AI (वाणी एआई), an intelligent, warm, and highly capable Indian voice assistant created to empower users across India.
Tone: Respectful, helpful, articulate, and natural.
Language rule: ${langInstruction}
Voice optimization: Keep answers clear, direct, and conversational (avoid overly long markdown tables or excessive code unless explicitly asked), because your response will be read aloud through Gnani Timbre voice synthesis.`;
  }

  /**
   * Call Evon custom inference endpoint
   */
  static async callEvonApi({ prompt, systemPrompt, conversationHistory }) {
    const apiUrl = process.env.EVON_API_URL;
    const apiKey = process.env.EVON_API_KEY;
    const model = process.env.EVON_MODEL_NAME || 'evon-base';

    if (!apiUrl) {
      throw new Error('EVON_API_URL is not configured in backend/.env');
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: prompt }
    ];

    const response = await axios.post(apiUrl, {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey || ''}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const data = response.data;
    return data.choices?.[0]?.message?.content || data.response || data.text || '';
  }

  /**
   * Call Google Gemini API
   */
  static async callGeminiApi({ prompt, systemPrompt, conversationHistory }) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }]
      }
    ];

    const response = await axios.post(url, { contents }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000
    });

    const candidate = response.data.candidates?.[0];
    return candidate?.content?.parts?.[0]?.text || 'No response generated.';
  }

  /**
   * Call OpenAI or compatible API (Groq, OpenRouter, Ollama)
   */
  static async callOpenAiApi({ prompt, systemPrompt, conversationHistory }) {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: prompt }
    ];

    const response = await axios.post(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 25000
    });

    return response.data.choices?.[0]?.message?.content || '';
  }

  /**
   * Built-in intelligent conversational engine for Indian multilingual context
   */
  static async runLocalIntelligence({ prompt, language }) {
    const text = prompt.trim();
    const lower = text.toLowerCase();
    const isHinglish = language === 'hi-IN,en-IN' || language === 'hinglish' || /kaise|kya|hai|haan|nahi|namaste|bhai|yaar|batao|karo/i.test(lower);
    const isHindi = language === 'hi-IN' || language === 'hindi' || /[\u0900-\u097F]/.test(text);

    // 1. Greetings
    if (/^(hi|hello|hey|namaste|namaskar|pranam|kem cho|vanakkam|sat sri akal)/i.test(lower)) {
      if (isHindi) {
        return 'नमस्ते! मैं वाणी एआई (Vaani AI) हूँ। मैं आपकी किस प्रकार सहायता कर सकती हूँ? आप मुझसे कुछ भी पूछ सकते हैं!';
      } else if (isHinglish) {
        return 'Namaste! Main Vaani AI hoon. Aapki kya madad kar sakti hoon? Aap Hindi, English ya Hinglish mein kuch bhi pooch sakte hain!';
      } else {
        return 'Hello! I am Vaani AI, your multilingual Indian voice assistant. How may I assist you today? Feel free to ask me anything in Hindi, English, or Hinglish.';
      }
    }

    // 2. Identity / Who are you
    if (/who are you|tum kaun ho|aap kaun hain|what is vaani/i.test(lower)) {
      if (isHindi) {
        return 'मैं वाणी एआई (Vaani AI) हूँ - एक अत्याधुनिक बहुभाषी वॉयस असिस्टेंट। मैं भारतीय भाषाओं में आपकी आवाज़ सुनकर समझ सकती हूँ और बोलकर उत्तर दे सकती हूँ!';
      } else if (isHinglish) {
        return 'Main Vaani AI hoon — Indian users ke liye banaya gaya voice assistant! Main Gnani AI ki Prisma STT aur Timbre TTS technology use karke Hindi, English aur Hinglish mein baat kar sakti hoon.';
      } else {
        return 'I am Vaani AI, an intelligent multilingual Indian voice assistant powered by Gnani AI. I can listen to your voice in Hindi, English, or Hinglish and respond with natural Indian speech!';
      }
    }

    // 3. How are you
    if (/how are you|kaise ho|kya haal hai|aap kaise hain/i.test(lower)) {
      if (isHindi) {
        return 'मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद! आप कैसे हैं? आज मैं आपकी क्या मदद कर सकती हूँ?';
      } else if (isHinglish) {
        return 'Main bilkul badhiya hoon! Aap bataiye aap kaise hain? Aaj kis topic par baat karni hai?';
      } else {
        return "I am doing great, thank you for asking! How are you doing today, and how can I assist you?";
      }
    }

    // 4. Time and Date
    if (/time|samay|waqt|tareekh|date|today/i.test(lower)) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (isHindi) {
        return `वर्तमान भारतीय समय ${timeStr} है और आज ${dateStr} है।`;
      } else if (isHinglish) {
        return `Abhi Indian standard time ${timeStr} ho raha hai aur aaj ${dateStr} hai.`;
      } else {
        return `The current Indian Standard Time is ${timeStr} and today is ${dateStr}.`;
      }
    }

    // 5. Weather / Mausam
    if (/weather|mausam|barish|garmi|sardi/i.test(lower)) {
      if (isHindi) {
        return 'आज का मौसम सुहावना है! यदि आप किसी विशिष्ट भारतीय शहर का मौसम जानना चाहते हैं, तो कृपया शहर का नाम बताएं।';
      } else if (isHinglish) {
        return 'Aaj weather pleasant lag raha hai! Agar aapko kisi specific city ka mausam janna hai, toh mujhe city ka naam batayein.';
      } else {
        return 'The weather looks pleasant today! If you would like weather details for a specific Indian city, please let me know the city name.';
      }
    }

    // 6. Capabilities
    if (/what can you do|kya kar sakti ho|features|madad/i.test(lower)) {
      if (isHindi) {
        return 'मैं आपकी आवाज़ पहचान सकती हूँ (Gnani Prisma STT), आपके प्रश्नों के तार्किक उत्तर दे सकती हूँ, और मधुर आवाज़ में बोलकर उत्तर सुना सकती हूँ (Gnani Timbre TTS)। आप मुझसे सामान्य ज्ञान, गणनाएं, अनुवाद या बातचीत कर सकते हैं।';
      } else if (isHinglish) {
        return 'Main aapki voice ko instantly text mein convert kar sakti hoon, questions ke smart answers de sakti hoon, aur natural Indian voice mein bol kar reply kar sakti hoon! Hindi, English, aur Hinglish teenon me freely baat kijiye.';
      } else {
        return 'I can transcribe your speech in real time with Gnani Prisma, reason through your questions with contextual Indian AI, and synthesize realistic voice replies with Gnani Timbre across Hindi, English, and Hinglish!';
      }
    }

    // 7. Math calculations
    const mathMatch = text.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
    if (mathMatch) {
      const num1 = parseFloat(mathMatch[1]);
      const op = mathMatch[2];
      const num2 = parseFloat(mathMatch[3]);
      let res = 0;
      if (op === '+') res = num1 + num2;
      else if (op === '-') res = num1 - num2;
      else if (op === '*') res = num1 * num2;
      else if (op === '/') res = num2 !== 0 ? (num1 / num2).toFixed(2) : 'Undefined (divided by zero)';

      if (isHindi) return `${num1} ${op} ${num2} का परिणाम ${res} है।`;
      if (isHinglish) return `${num1} ${op} ${num2} ka answer ${res} hai.`;
      return `The result of ${num1} ${op} ${num2} is ${res}.`;
    }

    // Default intelligent conversational contextual fallback
    if (isHindi) {
      return `आपने पूछा: "${text}"। वाणी एआई आपकी सेवा में सदैव तत्पर है। क्या आप इस विषय पर अधिक जानकारी या कोई अन्य प्रश्न पूछना चाहते हैं?`;
    } else if (isHinglish) {
      return `Aapka question tha: "${text}". Main is baare mein aapki poori help karne ke liye ready hoon! Aap aur detail mein kya janna chahte hain?`;
    } else {
      return `Regarding your inquiry: "${text}". I am glad to assist you with this! Let me know if you would like me to explain further or explore another aspect.`;
    }
  }
}
