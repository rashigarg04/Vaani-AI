import { v4 as uuidv4 } from 'uuid';
import { ConversationModel } from '../models/Conversation.js';
import { getDbStatus } from '../config/database.js';

// In-Memory storage for Guest Mode
const guestStore = new Map();

export class ConversationService {
  /**
   * Get all conversations summary
   */
  static async listConversations() {
    const { connected } = getDbStatus();

    if (connected) {
      try {
        const convos = await ConversationModel.find({})
          .sort({ updatedAt: -1 })
          .select('conversationId title language updatedAt messages')
          .lean();

        return convos.map(c => ({
          conversationId: c.conversationId,
          title: c.title,
          language: c.language,
          messageCount: c.messages?.length || 0,
          updatedAt: c.updatedAt
        }));
      } catch (err) {
        console.warn('DB read failed, falling back to guest store', err.message);
      }
    }

    // In-memory fallback
    const list = Array.from(guestStore.values()).map(c => ({
      conversationId: c.conversationId,
      title: c.title,
      language: c.language,
      messageCount: c.messages.length,
      updatedAt: c.updatedAt
    }));

    return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  /**
   * Get single conversation by ID
   */
  static async getConversation(conversationId) {
    const { connected } = getDbStatus();

    if (connected) {
      try {
        const conv = await ConversationModel.findOne({ conversationId }).lean();
        if (conv) return conv;
      } catch (err) {
        console.warn('DB findOne failed, checking guest store', err.message);
      }
    }

    return guestStore.get(conversationId) || null;
  }

  /**
   * Create or fetch conversation
   */
  static async getOrCreateConversation(conversationId, title = 'New Conversation', language = 'indic-auto') {
    let conv = await this.getConversation(conversationId);
    if (conv) return conv;

    const newConvo = {
      conversationId: conversationId || uuidv4(),
      title,
      language,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { connected } = getDbStatus();
    if (connected) {
      try {
        const doc = await ConversationModel.create(newConvo);
        return doc.toObject();
      } catch (err) {
        console.warn('DB create failed, saving to guest store', err.message);
      }
    }

    guestStore.set(newConvo.conversationId, newConvo);
    return newConvo;
  }

  /**
   * Add message to conversation
   */
  static async addMessage(conversationId, message) {
    const messageObj = {
      id: message.id || uuidv4(),
      sender: message.sender, // 'user' | 'assistant'
      text: message.text,
      language: message.language || 'indic-auto',
      audioUrl: message.audioUrl || null,
      metadata: message.metadata || {},
      createdAt: new Date()
    };

    const { connected } = getDbStatus();
    if (connected) {
      try {
        let conv = await ConversationModel.findOne({ conversationId });
        if (!conv) {
          conv = new ConversationModel({
            conversationId,
            title: message.text ? message.text.slice(0, 30) + '...' : 'Conversation',
            language: message.language || 'indic-auto',
            messages: []
          });
        }
        conv.messages.push(messageObj);
        conv.updatedAt = new Date();
        if (conv.messages.length === 1 && message.sender === 'user') {
          conv.title = message.text.slice(0, 32);
        }
        await conv.save();
        return messageObj;
      } catch (err) {
        console.warn('DB save message failed, saving in memory', err.message);
      }
    }

    // In-Memory store
    let conv = guestStore.get(conversationId);
    if (!conv) {
      conv = {
        conversationId,
        title: message.text ? message.text.slice(0, 32) : 'Conversation',
        language: message.language || 'indic-auto',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      guestStore.set(conversationId, conv);
    }
    conv.messages.push(messageObj);
    conv.updatedAt = new Date();
    if (conv.messages.length === 1 && message.sender === 'user') {
      conv.title = message.text.slice(0, 32);
    }

    return messageObj;
  }

  /**
   * Delete conversation
   */
  static async deleteConversation(conversationId) {
    const { connected } = getDbStatus();
    if (connected) {
      try {
        await ConversationModel.deleteOne({ conversationId });
      } catch (err) {
        console.warn('DB delete failed', err.message);
      }
    }
    guestStore.delete(conversationId);
    return true;
  }

  /**
   * Clear all conversations
   */
  static async clearAll() {
    const { connected } = getDbStatus();
    if (connected) {
      try {
        await ConversationModel.deleteMany({});
      } catch (err) {
        console.warn('DB deleteMany failed', err.message);
      }
    }
    guestStore.clear();
    return true;
  }
}
