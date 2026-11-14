import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidLanguage,
  normalizeLanguageCode,
  isValidVoice,
  SUPPORTED_LANGUAGES,
  SUPPORTED_VOICES
} from '../src/utils/validators.js';

import { AiService } from '../src/services/ai.service.js';
import { ConversationService } from '../src/services/conversation.service.js';
import { PrismaService } from '../src/services/prisma.service.js';
import { TimbreService } from '../src/services/timbre.service.js';

test('Validators: Supported languages and voices', () => {
  assert.ok(SUPPORTED_LANGUAGES.includes('hi-IN'));
  assert.ok(SUPPORTED_LANGUAGES.includes('indic-auto'));
  assert.ok(SUPPORTED_LANGUAGES.includes('en-IN'));
  assert.ok(SUPPORTED_VOICES.includes('Shivani'));
  assert.ok(SUPPORTED_VOICES.includes('Avinash'));

  assert.equal(normalizeLanguageCode('hindi'), 'hi-IN');
  assert.equal(normalizeLanguageCode('english'), 'en-IN');
  assert.equal(normalizeLanguageCode('hinglish'), 'hi-IN,en-IN');

  assert.equal(isValidVoice('Shivani'), true);
  assert.equal(isValidVoice('invalid_voice_name'), false);
});

test('ConversationService: In-memory guest mode CRUD operations', async () => {
  const convId = `test-conv-${Date.now()}`;

  // Create or get
  const conv = await ConversationService.getOrCreateConversation(convId, 'Test Conversation', 'hi-IN');
  assert.equal(conv.conversationId, convId);
  assert.equal(conv.title, 'Test Conversation');

  // Add message
  const userMsg = await ConversationService.addMessage(convId, {
    sender: 'user',
    text: 'नमस्ते वाणी',
    language: 'hi-IN'
  });
  assert.equal(userMsg.sender, 'user');
  assert.equal(userMsg.text, 'नमस्ते वाणी');

  // Verify fetch
  const fetched = await ConversationService.getConversation(convId);
  assert.equal(fetched.messages.length, 1);
  assert.equal(fetched.messages[0].text, 'नमस्ते वाणी');

  // Add assistant reply
  await ConversationService.addMessage(convId, {
    sender: 'assistant',
    text: 'नमस्ते! मैं आपकी क्या सहायता कर सकती हूँ?',
    language: 'hi-IN'
  });

  const updated = await ConversationService.getConversation(convId);
  assert.equal(updated.messages.length, 2);

  // List conversations
  const list = await ConversationService.listConversations();
  assert.ok(list.some(c => c.conversationId === convId));

  // Delete
  await ConversationService.deleteConversation(convId);
  const deleted = await ConversationService.getConversation(convId);
  assert.equal(deleted, null);
});

test('AiService: Local intelligent multilingual reasoning responses', async () => {
  // 1. Hindi greeting
  const hindiReply = await AiService.generateResponse({
    prompt: 'नमस्ते, आप कौन हैं?',
    language: 'hi-IN'
  });
  assert.equal(hindiReply.success, true);
  assert.ok(hindiReply.text.includes('वाणी') || hindiReply.text.includes('नमस्ते'));
  assert.equal(hindiReply.providerId, 'local_intelligent');

  // 2. Hinglish greeting
  const hinglishReply = await AiService.generateResponse({
    prompt: 'Namaste, aapka naam kya hai?',
    language: 'hi-IN,en-IN'
  });
  assert.equal(hinglishReply.success, true);
  assert.ok(hinglishReply.text.includes('Vaani') || hinglishReply.text.includes('hoon'));

  // 3. English greeting
  const englishReply = await AiService.generateResponse({
    prompt: 'Hello, who are you?',
    language: 'en-IN'
  });
  assert.equal(englishReply.success, true);
  assert.ok(englishReply.text.toLowerCase().includes('vaani'));

  // 4. Math reasoning
  const mathReply = await AiService.generateResponse({
    prompt: 'Calculate 25 * 4',
    language: 'en-IN'
  });
  assert.equal(mathReply.success, true);
  assert.ok(mathReply.text.includes('100'));
});

test('PrismaService & TimbreService: Service configurations and status reports', () => {
  const prismaStatus = PrismaService.getStatus();
  assert.equal(prismaStatus.service, 'Gnani Prisma v3.0 (STT)');
  assert.equal(prismaStatus.model, 'prisma-v3.0');

  const timbreStatus = TimbreService.getStatus();
  assert.equal(timbreStatus.service, 'Gnani Timbre v3.0 (TTS)');
  assert.equal(timbreStatus.model, 'timbre-v3.0');
  assert.ok(timbreStatus.availableVoices.includes('Shivani'));
});

test('PrismaService: Validation of empty audio rejects properly', async () => {
  await assert.rejects(
    async () => {
      await PrismaService.transcribeAudio({
        audioBuffer: null
      });
    },
    (err) => err.code === 'GNANI_API_KEY_MISSING' || err.code === 'EMPTY_AUDIO'
  );
});

test('TimbreService: Validation of empty text rejects properly', async () => {
  await assert.rejects(
    async () => {
      await TimbreService.synthesizeSpeech({
        text: ''
      });
    },
    (err) => err.code === 'GNANI_API_KEY_MISSING' || err.code === 'EMPTY_TEXT'
  );
});
