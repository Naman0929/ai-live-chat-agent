# AI Live Chat Support Agent

## Overview

This project is a **mini AI-powered customer support chat application**.

The goal was to simulate a realistic live chat widget where:

* A user asks support-related questions
* Messages are persisted on the backend
* A real LLM is used to generate contextual replies
* The system is robust, simple, and extensible

---

## What I Built

* A web-based chat UI with user & AI messages
* A TypeScript backend that:

  * Persists conversations
  * Calls a real LLM (Google Gemini)
  * Handles failures gracefully
* A domain-aware AI support agent seeded with store policies
* Conversation history that survives reloads

---

## Tech Stack & Deviations from Suggested Stack

### Backend

* **Node.js + TypeScript** (as suggested)
* **Express** for HTTP APIs
* **MongoDB** (instead of PostgreSQL)
* **Google Gemini**

### Frontend

* **React + TypeScript + Vite**

### Why these choices?

**React instead of Svelte**
The assignment explicitly allowed React/Vue/etc. if faster. React is what I’m fastest in, which allowed me to:

* Spend time on architecture and robustness
* Avoid UI churn and framework learning overhead

**MongoDB instead of PostgreSQL**
Since it was a time based assignment :

* MongoDB allowed fast iteration on conversation/message schemas, especially when using React and Node as frontend and    backend. The data model maps cleanly to a relational schema and can be migrated easily.
* Message history is naturally document-oriented
* No migrations were required to evolve the data model

In a production system, PostgreSQL would make more sense maybe so —> this was a conscious trade-off for speed and clarity.

**Google Gemini**
The assignment allows *any* major LLM provider.
So, I chose Gemini Google.

The LLM integration is isolated so the provider can be swapped easily.

---

## Architecture Overview

### High-Level Flow

```
Frontend Chat UI
   ↓
POST /api/v1/chat/message
   ↓
Chat Controller
   ↓
LLM Service (Gemini)
   ↓
Google Gemini API
```

### Backend Structure

```
backend/src
 ├─ controllers/        # Request handling & orchestration
 ├─ routes/             # API endpoints
 ├─ services/           # LLM clients & config
 ├─ models/             # MongoDB schemas
 ├─ utils/              # Validators, helpers
 ├─ app.ts
 └─ index.ts
```

**Design principle:**
LLM logic is encapsulated in a single service (`gemini-client.ts`) so future channels when going into production and scaling, (WhatsApp, Instagram, etc.) can reuse the same core intelligence.

---

## Core User Flow

### 1. Chat UI

Implemented:

* Scrollable message list
* Clear visual distinction between user and AI messages
* Input box + send button
* Enter-to-send
* Auto-scroll to latest message
* Disabled input while request is in flight

Additional UX features (typing indicator, etc.) were deprioritized due to time constraints.

---

### 2. Backend API

The backend exposes endpoints to:

* Accept user messages
* Persist conversations
* Return AI-generated replies

Each message:

* Is validated
* Is stored before and after LLM generation
* Is associated with a session/conversation

---

### 3. LLM Integration

#### Provider

* **Google Gemini**
* Model: `gemini-2.0-flash`

#### Prompt Strategy

The agent is seeded with:

* Store shipping policies
* Return/refund rules
* Support hours
* Behavioral constraints (no hallucinations, polite tone)

This ensures **consistent, reliable FAQ answers**.

---

### 4. FAQ / Domain Knowledge

Store policies are **hardcoded into the system prompt**:

* Shipping regions & timelines
* Return & refund rules
* Support hours
* Contact information

This approach was chosen because:

* The knowledge is static
* It avoids unnecessary DB complexity
* It keeps the LLM call self-contained

In a production system, this could be moved to a CMS or DB.

---

### 5. Data Model & Persistence

#### What’s persisted

* Users
* Messages (`user` and `assistant`)
* Conversation history

Messages are stored in sequence and reloaded on refresh.

#### Why this model?

For a weekend-scale assignment:

* Simplicity > normalization
* Fewer joins
* Faster iteration

#### Conversation & Session Handling

- Conversations are associated with authenticated users
- Message history is fetched per user instead of using an explicit sessionId
- This allowed persistence across reloads without introducing a separate session layer
- In a production system, sessionId-based conversations would be preferable for anonymous users, skipped it right now because of time constraints


### Authentication Note

Authentication was added even though it was not strictly required.
This was done to:

- Simplify conversation persistence
- Avoid session storage complexity
- Mirror real-world SaaS patterns Spur likely uses

In a simpler version, auth could be removed and replaced with sessionId-based chats. There was one to choose between the two beacuse of time constraints and I went with authentication since it looked more production grade to me.

---

### 6. Robustness & Idiot-Proofing 

Explicitly implemented:

* Empty messages rejected
* Very long messages truncated safely
* LLM/API errors caught and handled
* Friendly fallback message returned to the UI
* No secrets committed (API keys via env vars)

---

## How to Run Locally

### Clone the Repo

```bash
git clone <repo-url>
cd ai-support-chat-agent
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=any_random_secret
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Trade-offs & Limitations

Conscious decisions due to timeboxing:

* No Redis caching layer
* Simplified data model
* Minimal UI polish

Each omission was intentional and documented.

---

## If I Had More Time…

* Stream AI responses (typing effect)
* Separate session & message schemas
* Add Redis for short-term context caching
* Introduce admin chat review dashboard
* Tool calling (order lookup, refunds, etc.)
* Multi-channel abstraction (WhatsApp / IG-ready)

---


