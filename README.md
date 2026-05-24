# 🤖 CodeFitsPR

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vishwastiwariii/pr-review-ai/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/vishwastiwariii/pr-review-ai/pulls)
[![Built with Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green.svg)](https://nodejs.org/)
[![Vite + React](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%20%2B%20Tailwind-blueviolet.svg)](https://vite.dev/)
[![AI Orchestrated](https://img.shields.io/badge/AI%20Orchestrated-OpenRouter%20(Gemini)-orange.svg)](https://openrouter.ai/)

**CodeFitsPR** is an intelligent, self-healing automated code review and security auditing agent designed to act as an automated co-pilot on every pull request. It integrates directly with GitHub, systematically auditing changed files for functional bugs, security vulnerabilities (SAST/SCA), database bottlenecks, and code styling—delivering clean, human-like inline suggestions and global summary reviews directly onto your pull request.

---

## 🚀 Key Features

* **Multi-Stage Code Audit**: Reviews every pull request across 4 distinct dimensions:
  * 🔴 **Security (SAST/SCA)**: Catches hardcoded secrets, SQL injection context, PII exposure, and insecure dependencies.
  * 🟡 **Bug Detection**: Spots edge-case crashes, logic loops, race conditions, and unhandled return states.
  * 🟢 **Performance**: Flags unoptimized database N+1 queries, memory leak risks, and CPU bottlenecks.
  * 🔵 **Style & Readability**: Checks naming clarity, file organization, and clean architecture standards.
* **Resilient Self-Healing AI Pipeline**: Engineered with state-of-the-art token truncation scanners, stack-based JSON repair algorithms, and automatic fallback routers to handle malformed LLM outputs and connection timeouts gracefully.
* **Intelligent Line-Mapping Recovery**: Automatically handles API conflicts (such as GitHub HTTP `422` error codes caused by hallucinated code diff lines) by falling back to separate summary postings and line-by-line comment mapping.
* **Developer Simulation Landing Page**: A beautiful, responsive brutalist-style visual landing page built with React, Vite, and Tailwind CSS to introduce the product and visualize pull request review executions.
* **Cryptographic Webhook Security**: Secure HMAC-SHA256 signature verification matching GitHub's webhooks.

---

## 📂 Project Structure

Here is the exact folder structure of the repository, reflecting the actual codebase:

```
/pr-review-ai
├── server/                       # Backend Node.js Web Server
│   ├── src/
│   │   ├── config/               # Schema-based environment configuration
│   │   │   └── index.js
│   │   ├── middleware/           # Express middleware (webhook HMAC verification)
│   │   │   └── validateWebhook.js
│   │   ├── routes/               # Express endpoints (webhook, health check)
│   │   │   ├── health.js
│   │   │   └── webhooks.js
│   │   ├── services/             # Core review services
│   │   │   ├── aiService.js      # AI chat orchestrator & fallback engine
│   │   │   ├── githubService.js  # Octokit wrapper for reviews & comments
│   │   │   └── reviewService.js  # End-to-end pull request processor
│   │   ├── utils/                # JSON sanitizers, diff engines, prompt builders
│   │   │   ├── filterFiles.js    # Strips out non-code binary assets/lockfiles
│   │   │   ├── formatComment.js  # Formats review items for GitHub markdown
│   │   │   ├── formatDiff.js     # Optimizes raw diff patches for AI tokens
│   │   │   ├── logger.js         # Unified console color-logger
│   │   │   ├── parseWebhook.js   # Payload normalizer helper
│   │   │   ├── promptBuilder.js  # Structured system & user prompts
│   │   │   └── sanitizeJson.js   # JSON repair & brackets closure scanners
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # HTTP listener & automated Ngrok tunnel setup
│   ├── .env.example              # Server environment variable template
│   └── package.json              # Backend package list
│
├── client/                       # Interactive Frontend Simulation Landing Page
│   ├── src/
│   │   ├── assets/               # Branding images and stylesheet loaders
│   │   ├── components/           # UI elements (Navbar, Showcase, Hero)
│   │   │   ├── AsymmetricStack.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Showcase.jsx      # Feature layout (custom GitHub App section)
│   │   ├── App.jsx               # UI Core
│   │   ├── index.css             # TailwindCSS & custom brutalist classes
│   │   └── main.jsx              # React entry script
│   ├── package.json              # Client package list
│   └── vite.config.js            # Vite configuration
│
├── documentation.md              # In-depth Hackathon Judge Guide
└── README.md                     # Project installation & quickstart guide
```

---

## ⚙️ Getting Started & Local Setup

Follow these steps to configure and run the backend web server and frontend developer sandbox dashboard locally on your machine.

### 📋 Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)
* [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scopes (or a registered GitHub App)
* [OpenRouter API Key](https://openrouter.ai/keys) *(optional: if omitted, the backend will generate smart simulated mock reviews for local testing)*

---

### 1. Backend Server Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Initialize your local configuration file:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file with your credentials:
   ```env
   # General Settings
   PORT=5001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173

   # GitHub Token or App Credentials
   # For quick PAT setup, configure GITHUB_TOKEN fallback:
   GITHUB_TOKEN=your_personal_access_token_here
   
   # Optional: Configure if utilizing a verified GitHub webhook signature
   GITHUB_WEBHOOK_SECRET=your_signature_secret_here

   # OpenRouter AI Credentials
   OPENROUTER_API_KEY=your_openrouter_api_key_here

   # Automated Webhook Tunneling (Great for quick local webhook triggers!)
   START_NGROK=true
   NGROK_AUTHTOKEN=your_ngrok_authtoken_here
   ```
   > [!TIP]
   > By setting `START_NGROK=true` and entering a valid `NGROK_AUTHTOKEN`, the Express application will automatically spin up a secure, public tunnel to forward GitHub's webhook events directly to your local port. Your unique webhook URL will print directly in your terminal console!

5. Boot up the backend development server:
   ```bash
   npm run dev
   ```

---

### 2. Frontend Landing Page Setup

1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading server:
   ```bash
   npm run dev
   ```
4. Access the responsive visual landing page in your browser at:
   👉 **`http://localhost:5173`**

---

## 🏃 Triggering Reviews via GitHub Webhooks

Once both the client and server are running, you can verify your active setup by triggering reviews on code changes:
1. Ensure your local backend is tunneling through Ngrok (if configured) or deployed externally.
2. In your GitHub App configuration (or repository settings), configure a webhook pointing to your active tunnel address (e.g. `https://<your-ngrok-subdomain>.ngrok-free.app/webhooks/github`).
3. Open a Pull Request or push a new commit to a Pull Request in a monitored repository.
4. The GitHub Webhook will trigger a background transaction, prompting the review orchestrator to run deep multi-stage audits and write inline reviews directly back to GitHub!

---

## 🛠️ Key Commands

| Directory | Command | Description |
| :--- | :--- | :--- |
| `/server` | `npm run dev` | Starts backend development server with auto hot-reload |
| `/server` | `npm start` | Starts production listener |
| `/client` | `npm run dev` | Runs the interactive developer landing page |
| `/client` | `npm run build` | Builds frontend assets for production distribution |

---

## 📄 License
This project is licensed under the **MIT License** - see the `LICENSE` file for details.

---

## 📞 Contact
* **Developer**: Vishwas Tiwari
* **Email**: [vishwastiwariii09@gmail.com](mailto:vishwastiwariii09@gmail.com)
* **GitHub Repository**: [https://github.com/vishwastiwariii/pr-review-ai](https://github.com/vishwastiwariii/pr-review-ai)