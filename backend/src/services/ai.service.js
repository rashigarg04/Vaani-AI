
import Groq from 'groq-sdk';

export class AiService {
  static groq = null;

  /**
   * Get active AI provider
   * Required by /api/health
   */
  static getActiveProvider() {
    return process.env.GROQ_API_KEY?.trim()
      ? 'Groq'
      : 'None';
  }

  /**
   * Initialize Groq client
   */
  static getClient() {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      const error = new Error(
        'GROQ_API_KEY is missing. Add it to backend/.env'
      );
      error.status = 500;
      throw error;
    }

    if (!this.groq) {
      this.groq = new Groq({
        apiKey: apiKey.trim(),
      });
    }

    return this.groq;
  }

  /**
   * Generate AI response using Groq
   */
  static async generateResponse({
    prompt,
    language = 'English',
    conversationHistory = [],
    preferredLanguage = language,
  }) {
    if (!prompt || !prompt.trim()) {
      throw new Error('AI prompt cannot be empty.');
    }

    const startTime = Date.now();

    try {
      const groq = this.getClient();

      const model =
        process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

      const systemPrompt = `
You are Vaani AI, an intelligent multilingual Indian voice assistant.

Your responsibilities:
1. Understand Hindi, English and Hinglish.
2. Reply naturally and conversationally.
3. Use simple, clear language.
4. Keep responses concise and suitable for voice output.
5. Follow the user's preferred language.
6. If the user speaks Hindi, respond in Hindi.
7. If the user speaks Hinglish, respond naturally in Hinglish.
8. If the user speaks English, respond in English.
9. Never invent information when uncertain.
10. Do not include unnecessary markdown, tables or emojis in spoken responses.

Current language: ${language}
Preferred response language: ${preferredLanguage}

Always behave as a helpful, friendly Indian voice assistant.
      `.trim();

      const historyMessages = (conversationHistory || [])
        .filter((message) => (
          message &&
          typeof message.text === 'string' &&
          message.text.trim()
        ))
        .slice(-10)
        .map((message) => ({
          role: message.sender === 'assistant'
            ? 'assistant'
            : 'user',
          content: message.text,
        }));

      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...historyMessages,
        {
          role: 'user',
          content: prompt,
        },
      ];

      const completion = await groq.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_completion_tokens: 1024,
      });

      const aiText =
        completion.choices?.[0]?.message?.content?.trim();

      if (!aiText) {
        throw new Error('Groq returned an empty AI response.');
      }

      return {
        success: true,
        text: aiText,
        language: preferredLanguage,
        provider: 'Groq',
        model,
        latency: Date.now() - startTime,
      };

    } catch (error) {
      console.error('[Groq AI Error]:', error.message);

      if (error.status === 401) {
        error.message =
          'Groq authentication failed. Check your GROQ_API_KEY.';
      } else if (error.status === 403) {
        error.message =
          'Groq access forbidden. Check your API account and model permissions.';
      } else if (error.status === 429) {
        error.message =
          'Groq rate limit exceeded. Please try again later.';
      }

      throw error;
    }
  }

  /**
   * Check Groq configuration
   */
  static getStatus() {
    return {
      configured: Boolean(
        process.env.GROQ_API_KEY?.trim()
      ),
      provider: this.getActiveProvider(),
      model:
        process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    };
  }
}

export default AiService;
