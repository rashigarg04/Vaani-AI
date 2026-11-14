# VAANI AI (वाणी एआई)
### *Your Voice. Your Language. Your AI.*

[![Gnani AI Powered](https://img.shields.io/badge/Gnani_AI-Prisma_STT_%26_Timbre_TTS-7C3AED.svg)](https://docs.gnani.ai/)
[![Frontend](https://img.shields.io/badge/Frontend-React_18_+_Vite_+_Tailwind_CSS-61DAFB.svg)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js_+_Express-68A063.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

---

## 1. Project Introduction & Overview

**Vaani AI** is an intelligent, full-stack, multilingual voice assistant specifically built for Indian users. It empowers users to communicate naturally through their microphone using their mother tongue or everyday conversational language:

* **Hindi (हिन्दी)** — Pure Devanagari script conversations
* **English (Indian)** — Natural Indian English with localized context
* **Hinglish (हिंग्लिश)** — Seamless Hindi + English code-mixed speech (e.g., *"Aaj ka weather kaisa hai aur time kya ho raha hai?"*)

Traditional voice assistants typically struggle with regional accents, Indian phonetic cadences, and code-mixed conversational idioms. Vaani AI addresses this challenge by coupling the speech recognition capabilities of **Gnani AI's Prisma STT** with the natural voice synthesis of **Gnani AI's Timbre TTS**, all driven by an Indian reasoning engine.

---

## 2. Problem Statement & Objectives

### The Problem
* **Language Exclusivity:** Millions of Indian internet users think and speak in Indian languages and dialects, yet most AI voice assistants force them to communicate in formal Western English.
* **Code-Mixed Breakdowns:** In real life, Indians speak Hinglish (blending Hindi grammar with English nouns and verbs). Standard STT models misinterpret or fail on code-mixed speech.
* **Robotic Voice Delivery:** Standard text-to-speech engines mispronounce Indian names, places, and cultural terms with flat, unnatural intonations.

### The Objectives
1. **Accurate Speech-to-Text:** Stream real-time microphone recordings to Gnani Prisma v3.0, taking advantage of automatic language identification (`indic-auto`) and code-mixed transcription.
2. **Context-Aware Reasoning:** Process user queries with an intelligent reasoning layer that understands cultural nuances, preserves the user's preferred spoken language, and delivers concise conversational responses.
3. **Natural Voice Synthesis:** Generate human-like spoken responses using Gnani Timbre v3.0 with expressive Indian voices (such as *Shivani* and *Avinash*).
4. **Zero-Friction Fallback:** Run seamlessly with full in-memory Guest Mode when MongoDB is not installed, and provide a smart Indian conversational intelligence fallback when third-party LLM keys are not supplied.

---

## 3. Technology Stack

### Frontend
* **React 18** — Component-driven reactive UI
* **Vite 6** — Modern build tooling
* **Tailwind CSS** — Custom lavender and violet glassmorphism design system
* **Lucide React** — Modern iconography
* **Web Audio API & MediaRecorder** — In-browser microphone audio capture and live frequency visualizers
* **React Router v7** — Client-side navigation

### Backend
* **Node.js (ES Modules)** & **Express.js** — High-performance RESTful API
* **Multer** — Safe in-memory audio upload handling (no raw audio persisted to disk)
* **Axios & FormData** — Low-latency HTTP client for Gnani AI endpoints
* **Mongoose & MongoDB** — Conversation persistence with automated fallback to in-memory guest storage
* **Dotenv & CORS** — Secure environment configuration and origin management

### AI Integrations
* **Gnani Prisma v3.0** — Multilingual Indian Speech-to-Text (STT) via `POST https://api.vachana.ai/stt/v3`
* **Gnani Timbre v3.0** — High-fidelity Text-to-Speech (TTS) via `POST https://api.vachana.ai/api/v1/tts/inference`
* **Modular Reasoning Layer** — Evon inference endpoint, Google Gemini, OpenAI-compatible, or Built-in Indian Intelligence Engine.

---

## 4. System Architecture & End-to-End Workflow

```
[ User Microphone (Browser) ]
              │
              ▼ (MediaRecorder API: audio/webm or audio/wav)
[ Frontend: useAudioRecorder hook & MicrophoneButton ]
              │
              ▼ (HTTP POST multipart/form-data)
[ Backend: /api/voice/transcribe ]
              │
              ▼ (HTTP POST with X-API-Key-ID: GNANI_API_KEY)
[ Gnani AI Prisma STT (api.vachana.ai/stt/v3) ]
              │
              ▼ (Returns transcript & detected_language_code)
[ Backend: /api/ai/chat (Reasoning Engine: Evon / Gemini / Local) ]
              │
              ▼ (Generates localized answer in user's language)
[ Backend: /api/voice/synthesize ]
              │
              ▼ (HTTP POST JSON with X-API-Key-ID)
[ Gnani AI Timbre TTS (api.vachana.ai/api/v1/tts/inference) ]
              │
              ▼ (Returns linear PCM audio/wav binary stream)
[ Frontend: AudioPlayer & Auto-Play Audio Element ]
              │
              ▼ (Played in user speakers / headphones)
[ Human-like Spoken Voice Response ]
```

---

## 5. Official Gnani AI API Endpoints Implemented

As per official documentation ([docs.gnani.ai](https://docs.gnani.ai/)):

### A. Gnani Prisma Speech-to-Text (STT)
* **Base URL:** `https://api.vachana.ai`
* **Path:** `POST /stt/v3`
* **Authentication Header:** `X-API-Key-ID: <GNANI_API_KEY>`
* **Payload (Multipart Form):**
  * `audio_file`: Audio buffer (WAV, WebM, MP3, OGG, FLAC)
  * `model`: `prisma-v3.0`
  * `language_code`: `indic-auto`, `hi-IN`, `en-IN`, or `hi-IN,en-IN`
  * `format`: `codemix` (keeps English terms in Latin alphabet while writing Indian words appropriately)
* **Official Response Format:**
  ```json
  {
    "success": true,
    "request_id": "5c1f0a52-6d62-4e0b-9a38-2f2b8a8f7a10",
    "transcript": "नमस्ते, आप कैसे हैं?",
    "model": "prisma-v3.0",
    "detected_language_code": "hi-IN",
    "processing_time": 0.58,
    "end_to_end_latency": 0.66
  }
  ```

### B. Gnani Timbre Text-to-Speech (TTS)
* **Base URL:** `https://api.vachana.ai`
* **Path:** `POST /api/v1/tts/inference`
* **Authentication Header:** `X-API-Key-ID: <GNANI_API_KEY>`
* **Payload (JSON):**
  ```json
  {
    "text": "नमस्ते! मैं वाणी एआई हूँ।",
    "voice": "Shivani",
    "model": "timbre-v3.0",
    "language": "hi-IN",
    "speed": 1.0,
    "audio_config": {
      "sample_rate": 24000,
      "num_channels": 1,
      "sample_width": 2,
      "encoding": "linear_pcm",
      "container": "wav"
    }
  }
  ```
* **Official Response:** Binary audio stream with `Content-Type: audio/wav`.

---

## 6. Folder Structure

```
vaani-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js             # MongoDB & Guest Mode switcher
│   │   ├── controllers/
│   │   │   ├── chat.controller.js       # AI chat handlers
│   │   │   ├── conversation.controller.js # Conversation history CRUD
│   │   │   └── voice.controller.js      # STT, TTS, and pipeline handlers
│   │   ├── middleware/
│   │   │   ├── errorHandler.js          # Centralized error handler
│   │   │   └── upload.js                # Multer memory storage & size validation
│   │   ├── models/
│   │   │   └── Conversation.js          # Mongoose conversation schema
│   │   ├── routes/
│   │   │   ├── chat.routes.js           # /api/ai/*
│   │   │   ├── conversation.routes.js   # /api/conversations/*
│   │   │   ├── health.routes.js         # /api/health
│   │   │   └── voice.routes.js          # /api/voice/*
│   │   ├── services/
│   │   │   ├── ai.service.js            # Evon / Gemini / OpenAI / Local reasoning
│   │   │   ├── conversation.service.js  # Persistence & in-memory store
│   │   │   ├── prisma.service.js        # Gnani Prisma REST client
│   │   │   └── timbre.service.js        # Gnani Timbre REST client
│   │   ├── utils/
│   │   │   └── validators.js            # Languages, MIME types, voices
│   │   └── server.js                    # Express app initialization
│   ├── test/
│   │   └── services.test.js             # Automated unit and integration tests
│   ├── .env                             # Environment configuration
│   ├── .env.example                     # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.jsx          # Replay, seek, wave, duration controls
│   │   │   ├── AudioWaveform.jsx        # Live frequency visualizer
│   │   │   ├── ChatInput.jsx            # Text message box & send action
│   │   │   ├── ChatMessage.jsx          # User & AI bubbles with audio player
│   │   │   ├── LanguageSelector.jsx     # Hindi, Hinglish, English selector
│   │   │   ├── LoadingIndicator.jsx     # Stage badges (transcribing, thinking, etc.)
│   │   │   ├── MicrophoneButton.jsx     # Animated circular record button & waveform
│   │   │   ├── Navbar.jsx               # Header with status pills & navigation
│   │   │   ├── Sidebar.jsx              # Collapsible history drawer
│   │   │   └── StatusBadge.jsx          # Live service connectivity indicators
│   │   ├── context/
│   │   │   └── ChatContext.jsx          # Global speech and conversation state
│   │   ├── hooks/
│   │   │   └── useAudioRecorder.js      # MediaRecorder & Web Audio API hook
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx            # Architecture, Gnani docs & security
│   │   │   ├── AssistantPage.jsx        # Main voice assistant interface
│   │   │   ├── LandingPage.jsx          # Hero, features, how it works, footer
│   │   │   └── SettingsPage.jsx         # Voice preview, speed, keys & history
│   │   ├── services/
│   │   │   ├── api.js                   # Axios client
│   │   │   ├── chatService.js           # Chat & conversation APIs
│   │   │   └── voiceService.js          # Audio upload, STT & TTS calls
│   │   ├── App.jsx                      # Router & layout
│   │   ├── index.css                    # Tailwind directives & glassmorphism
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json                         # Root orchestration scripts
└── README.md
```

---

## 7. Installation & Setup Instructions

### Prerequisites
* **Node.js** v18+ (tested on Node.js v24)
* **npm** v9+
* *(Optional)* MongoDB instance (or rely on built-in zero-setup Guest Mode)
* *(Optional)* Gnani AI API Key from [docs.gnani.ai](https://docs.gnani.ai/)

### Step 1: Install Dependencies
From the repository root, install dependencies for both frontend and backend:
```bash
npm run install:all
```
*(Or navigate to `backend` and `frontend` folders individually and run `npm install`)*

---

## 8. Environment Configuration

Copy the example file to `.env` in the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Gnani AI API Credentials (from https://docs.gnani.ai/)
GNANI_API_KEY=your_gnani_api_key_here
GNANI_BASE_URL=https://api.vachana.ai

# Speech Models
GNANI_PRISMA_MODEL=prisma-v3.0
GNANI_PRISMA_DEFAULT_LANG=indic-auto
GNANI_TIMBRE_MODEL=timbre-v3.0
GNANI_TIMBRE_DEFAULT_VOICE=Shivani

# AI Reasoning Provider: 'local_intelligent', 'evon', 'gemini', or 'openai'
AI_PROVIDER=local_intelligent

# Evon Configuration (if you host an Evon model)
EVON_API_URL=
EVON_API_KEY=
EVON_MODEL_NAME=evon-base

# Alternative LLM Keys (optional)
GEMINI_API_KEY=
OPENAI_API_KEY=

# MongoDB URI (leave blank for zero-setup Guest Mode)
MONGODB_URI=
```

> **Note on Security:** Your `GNANI_API_KEY` is exclusively consumed by the backend server. It is never bundled into frontend assets or leaked to the client browser.

---

## 9. Running the Application

### Option A: Run Both Together (Recommended)
From the project root:
```bash
npm run dev
```

### Option B: Run Services Individually

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *Backend runs on `http://localhost:5000`*

2. **Start Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   *Frontend opens on `http://localhost:5173`*

---

## 10. Automated Testing

Run the automated backend test suite (testing validators, conversation persistence, AI reasoning, and Gnani API service handlers):
```bash
npm run test:backend
```
Expected output:
```
✔ Validators: Supported languages and voices
✔ ConversationService: In-memory guest mode CRUD operations
✔ AiService: Local intelligent multilingual reasoning responses
✔ PrismaService & TimbreService: Service configurations and status reports
✔ PrismaService: Validation of empty audio rejects properly
✔ TimbreService: Validation of empty text rejects properly
ℹ tests 6
ℹ pass 6
ℹ fail 0
```

To build and verify the frontend bundle:
```bash
npm run build:frontend
```

---

## 11. Backend REST API Endpoints

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Overall health, DB status, and AI provider status | None |
| `GET` | `/api/voice/status` | Gnani Prisma and Timbre configuration details | None |
| `POST` | `/api/voice/transcribe` | Transcribes audio via Gnani Prisma v3.0 | `multipart/form-data` with `audio_file`, `language` |
| `POST` | `/api/voice/synthesize` | Generates speech via Gnani Timbre v3.0 | JSON: `{ text, voice, language, speed }` |
| `POST` | `/api/ai/chat` | Processes text question via AI Reasoning Engine | JSON: `{ message, conversationId, language }` |
| `POST` | `/api/assistant/conversation` | Full pipeline (Audio in → STT → AI → TTS → Audio out) | `multipart/form-data` or JSON |
| `GET` | `/api/conversations` | Lists stored conversation summaries | None |
| `GET` | `/api/conversations/:id` | Returns messages for a specific conversation | Route param `:id` |
| `DELETE` | `/api/conversations/:id` | Deletes a conversation | Route param `:id` |
| `DELETE` | `/api/conversations` | Clears all conversation history | None |

---

## 12. Security & Privacy Guarantees

1. **No Audio Persistence:** Uploaded voice files are held in RAM memory buffers via Multer during the API call and immediately garbage-collected. No microphone audio is saved to disk.
2. **Credential Isolation:** Vite environment variables do not include any secret keys. All Gnani calls originate server-side.
3. **Graceful Permission Handling:** If a user denies microphone permissions, friendly in-app instructions appear explaining how to grant microphone access in the browser bar.
4. **Data Purging:** Users have complete control over conversation history, with a one-click purge available directly in the sidebar or settings.

---

## 13. Limitations & Future Roadmap

### Current Limitations
* Browser microphone recording requires HTTPS in production (or `localhost` during development).
* Gnani AI REST STT is optimized for snippets up to 30 seconds per query (standard for conversational voice bots).

### Future Improvements
* Integration with Gnani's WebSocket streaming endpoint (`wss://api.vachana.ai/stt/v3/stream`) for character-by-character live dictation.
* Additional Indian languages (Assamese, Odia, Urdu).
* Native mobile wrappers using Capacitor / React Native.

---

## 14. Acknowledgements

Special thanks to **Gnani.ai** for their speech models:
* [Gnani AI Documentation](https://docs.gnani.ai/)
* [Prisma Multilingual STT](https://docs.gnani.ai/)
* [Timbre Expressive TTS](https://docs.gnani.ai/)

---

*Vaani AI — Designed and developed for the Great Indian AI Internship Challenge.*
