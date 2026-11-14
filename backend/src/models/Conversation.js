import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    text: { type: String, required: true },
    language: { type: String, default: 'indic-auto' },
    audioUrl: { type: String, default: null },
    metadata: {
      model: { type: String },
      latency: { type: Number },
      detectedLanguage: { type: String },
      provider: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ConversationSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: 'New Conversation' },
    language: { type: String, default: 'indic-auto' },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model('Conversation', ConversationSchema);
