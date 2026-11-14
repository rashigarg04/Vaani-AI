import api from './api.js';

export const chatService = {
  /**
   * Send a text message to the AI reasoning engine
   */
  async sendMessage({ message, conversationId, language = 'indic-auto', preferredLanguage }) {
    const response = await api.post('/ai/chat', {
      message,
      conversationId,
      language,
      preferredLanguage
    });
    return response.data;
  },

  /**
   * Get active AI provider details
   */
  async getProvider() {
    const response = await api.get('/ai/provider');
    return response.data;
  },

  /**
   * List all stored conversations
   */
  async getConversations() {
    const response = await api.get('/conversations');
    return response.data;
  },

  /**
   * Get a single conversation with all its messages
   */
  async getConversation(id) {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(id) {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Clear all conversation history
   */
  async clearAllConversations() {
    const response = await api.delete('/conversations');
    return response.data;
  },

  /**
   * Check full system health status
   */
  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  }
};
