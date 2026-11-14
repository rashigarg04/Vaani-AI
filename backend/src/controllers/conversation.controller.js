import { ConversationService } from '../services/conversation.service.js';

export class ConversationController {
  static async list(req, res, next) {
    try {
      const list = await ConversationService.listConversations();
      return res.status(200).json({ success: true, conversations: list });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const conv = await ConversationService.getConversation(id);
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found.' });
      }
      return res.status(200).json({ success: true, conversation: conv });
    } catch (err) {
      next(err);
    }
  }

  static async deleteOne(req, res, next) {
    try {
      const { id } = req.params;
      await ConversationService.deleteConversation(id);
      return res.status(200).json({ success: true, message: 'Conversation deleted.' });
    } catch (err) {
      next(err);
    }
  }

  static async clearAll(req, res, next) {
    try {
      await ConversationService.clearAll();
      return res.status(200).json({ success: true, message: 'All conversations cleared.' });
    } catch (err) {
      next(err);
    }
  }
}
