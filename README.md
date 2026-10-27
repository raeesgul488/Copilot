<div align="center">

# 🎙️ Copilot — Voice-First AI Assistant

**Talk to it. Type to it. Show it photos.**
A full-stack AI chat app that runs **local models first** and falls back to **cloud AI** when it needs to.

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-local%20models-black)
![LiveKit](https://img.shields.io/badge/LiveKit-voice-FF5A5F)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

</div>

---

## ✨ Highlights

- 🖥️ **Local-first AI** — uses your [Ollama](https://ollama.com) models by default, so chats can stay on your machine.
- ☁️ **Automatic cloud fallback** — if no local model is installed, or one fails, the app switches to **Anthropic, OpenAI, Google Gemini, xAI Grok, or Meta Llama** and tells you which model answered.
- 🎤 **Real-time voice mode** — speech-to-text, turn detection, text-to-speech and noise cancellation powered by [LiveKit](https://livekit.io). Interrupt the assistant just by talking.
- 🖼️ **Vision support** — attach up to 5 photos per message and ask questions about them.
- 🔀 **Smart model picker** — Auto, Local, or Cloud, with live model lists fetched from each provider.
- 💬 **Voice + text in one chat** — spoken transcripts are saved to the conversation, so you can switch between talking and typing at any time.
- 🐳 **One-command Docker setup** with optional profiles for voice and Ollama.

---

## 🧱 Architecture

```
Copilot/
├── api/      FastAPI · Python 3.13 · uv · ruff · pytest · Ollama SDK · Anthropic / OpenAI SDKs
├── web/      Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui
├── agent/    LiveKit voice agent (speech in → reply → speech out)
└── docker-compose.yml
```

| Service | Port | Purpose |
| ------- | ---- | ------- |
| `web`   | 3000 | Chat interface |
| `api`   | 8000 | Model routing, fallback logic, voice session endpoints (`/docs` for Swagger) |
| `agent` | —    | Voice agent that joins LiveKit rooms (optional) |
| `ollama`| 11434| Local models (can run on the host or in Docker) |

---

## 🚀 Quick Start

**Requirements:** Python 3.13 with [uv](https://docs.astral.sh/uv/), Node.js 20.9+, and optionally [Ollama](https://ollama.com).

```bash
# 1. Pull a local model (optional but recommended)
ollama pull llama3.2

# 2. Start the API  →  http://localhost:8000/docs
cd api
uv sync
cp .env.example .env        # add cloud API keys here if you have them
uv run fastapi dev app/main.py

# 3. Start the web app  →  http://localhost:3000   (new terminal)
cd web
npm install
cp .env.example .env.local
npm run dev
```

### 🐳 Or use Docker

```bash
cp api/.env.example api/.env
docker compose up --build
```

| Command | What it starts |
| ------- | -------------- |
| `docker compose up --build` | API + web |
| `docker compose --profile voice up --build` | API + web + voice agent |
| `docker compose --profile ollama up` | Adds Ollama in a container (set `OLLAMA_HOST=http://ollama:11434`) |

By default the API reaches Ollama running on your host machine.

---

## 🎙️ Voice Mode

Voice mode shows up as a **sound-wave button** in the empty message box once the API has LiveKit credentials. It needs a [LiveKit Cloud](https://cloud.livekit.io) project, since speech-to-text, text-to-speech, turn detection and noise cancellation run on LiveKit Inference.

**1. Add credentials** (same three values in both `api/.env` and `agent/.env`):

```env
LIVEKIT_URL=wss://<your-project>.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
```

**2. Run the voice agent** (new terminal, API must be running):

```bash
cd agent
uv sync
uv run python voice_agent.py dev
```

Or with Docker: fill in `agent/.env`, then `docker compose --profile voice up --build`.

### How a voice session flows

```
Browser ──POST /api/voice/session──► API: creates a room + token that dispatches the agent
   │                                     (remembers the chosen model and earlier chat)
   └──WebRTC (mic + speaker)──► LiveKit ◄── agent: STT → turn detection → reply → TTS
                                                │
                                   POST /api/voice/chat   (same model dropdown,
                                   Ollama first, cloud fallback — just like text chat)
```

### Good to know

- 🗣️ **Barge-in:** talk over the assistant to interrupt it. The **Stop** button and **Esc** also work.
- 📝 **Transcripts** are saved into the chat and tagged *Spoken*.
- ⚠️ **Errors are spoken and shown:** if a model fails, the assistant says so out loud and the UI shows the reason. If the agent isn't running, the UI tells you after 20 seconds.
- 🔒 **Secure the endpoints:** anyone who can reach `/api/voice/session` can start a (billed) voice session. Put it behind your login before going public, and set the same `VOICE_AGENT_TOKEN` in `api/.env` and `agent/.env` so only the agent can call `/api/voice/chat`.

### Voice settings (`agent/.env`)

| Variable | Description |
| -------- | ----------- |
| `VOICE_STT_MODEL` / `VOICE_STT_LANGUAGE` | Speech-to-text model and language |
| `VOICE_TTS_MODEL` / `VOICE_TTS_VOICE` | Text-to-speech model and voice |
| `VOICE_GREETING` | What the assistant says when a session starts |
| `VOICE_INSTRUCTIONS` | Custom system instructions for the voice persona |
| `VOICE_NOISE_CANCELLATION` | Toggle noise cancellation |
| `VOICE_LLM` | `app` (use the app's model routing) or a LiveKit Inference model ID to bypass the app |

To offer a voice picker in the UI, set `VOICE_VOICES` in `api/.env`.

---

## 🖼️ Photos

Add images with the **+** button, by **pasting**, or by **dragging and dropping** onto the page.

- Up to **5 photos per message** · JPEG, PNG, WebP or GIF · 10 MB each
- Images are scaled to **2048 px** on the long edge and re-encoded in your browser, which also **strips metadata such as GPS location**
- HEIC isn't supported yet — the app explains how to share a JPEG instead
- Photos are stored in your browser (IndexedDB) alongside chat history; unused photos are cleaned up after a day
- The line under the input tells you whether photos stay on your computer or which provider receives them

Photos need a vision-capable model: `ollama pull gemma3` (or `llava`, `qwen2.5vl`), or a cloud API key. The model menu labels these **"Sees images"**. *Auto* picks one whenever a chat contains photos, and a text-only model shows a one-click switch.

---

## 🧠 How Model Selection Works

| Option | Behaviour |
| ------ | --------- |
| **Auto** (default) | First installed Ollama model; if none, the first cloud provider with an API key |
| **Local · Ollama** | Every chat model you've pulled, with size and parameter count |
| **Cloud (fallback)** | A sub-menu per provider whose API key is set, listing its live models |

If the chosen model fails before replying (Ollama stopped, model deleted, key out of quota), the API automatically tries the next option and the reply carries a small note saying which model answered instead.

| Setting (`api/.env`) | Effect |
| -------------------- | ------ |
| `ALLOW_CLOUD_FALLBACK=false` | Disable automatic cloud fallback |
| `CLOUD_PRIORITY` | Order in which cloud providers are tried |
| `*_MODEL` (e.g. `OPENAI_MODEL`) | Preferred fallback model for each provider |

Model lists are fetched live from each provider, so new models appear without code changes.

---

## ✅ Quality Checks

```bash
# API
cd api && uv run ruff check . && uv run ruff format --check . && uv run pytest

# Web
cd web && npm run typecheck && npm run build
```

---

## 🛡️ Production Checklist

- [ ] Put both services behind **HTTPS** (reverse proxy or load balancer). Keep response buffering **off** for `/api/chat` so replies stream.
- [ ] Set `ENVIRONMENT=production` (hides `/docs`) and a real `CORS_ORIGINS` if the API is called from another domain.
- [ ] Add **authentication and rate limiting** before exposing the API publicly — cloud and voice calls cost money.
- [ ] Set `VOICE_AGENT_TOKEN` on both the API and the agent.
- [ ] Chat history currently lives in each user's browser. Add a database when you add user accounts.
- [ ] Never commit `.env` files or API keys.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Keep changes small and follow existing patterns.
3. Use `uv` for Python dependencies and `npm` for the frontend; format Python with Ruff.
4. Run the [quality checks](#-quality-checks) before opening a pull request.

---

## 📄 License

No license has been added yet. Add a `LICENSE` file (for example MIT) to let others use and contribute to the project.

---

<div align="center">

Built with ❤️ by [@raeesgul488](https://github.com/raeesgul488)

⭐ If you find this useful, consider starring the repo!

</div>
