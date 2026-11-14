import { AiService } from '../services/ai.service.js';
import { ConversationService } from '../services/conversation.service.js';

export class ChatController {
  /**
   * POST /api/ai/chat
   * Process user question through AI reasoning engine
   */
  static async chat(req, res, next) {
    try {
      const { message, conversationId, language = 'indic-auto', preferredLanguage } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'EMPTY_MESSAGE',
          message: 'Message cannot be empty.'
        });
      }

      const activeConvId = conversationId || `conv-${Date.now()}`;

      // Save user message
      await ConversationService.addMessage(activeConvId, {
        sender: 'user',
        text: message.trim(),
        language: preferredLanguage || language
      });

      // Get conversation context
      const conv = await ConversationService.getConversation(activeConvId);
      const history = conv?.messages || [];

      // Generate AI response
      const result = await AiService.generateResponse({
        prompt: message.trim(),
        language,
        conversationHistory: history,
        preferredLanguage
      });

      // Save assistant message
      const assistantMessage = await ConversationService.addMessage(activeConvId, {
        sender: 'assistant',
        text: result.text,
        language: result.language,
        metadata: {
          provider: result.provider,
          latency: result.latency
        }
      });

      return res.status(200).json({
        success: true,
        conversationId: activeConvId,
        message: assistantMessage,
        response: result.text,
        provider: result.provider,
        providerId: result.providerId,
        latency: result.latency
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ai/provider
   * Returns current active provider details
   */
  static getProvider(req, res) {
    const provider = AiService.getActiveProvider();
    return res.status(200).json({
      success: true,
      provider
    });
  }
}
