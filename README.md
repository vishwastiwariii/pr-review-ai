# CodeFitsPR

> [!CAUTION]
> This is a **work in progress**. The codebase is currently being developed and tested, and may not be production-ready.

CodeFitsPR is an intelligent automation system designed to streamline the code review process for GitHub pull requests. It leverages advanced AI to automatically review code changes, provide intelligent feedback, identify bugs and security vulnerabilities, suggest improvements, and automatically post comprehensive reviews back to the pull request.

## 🚀 Features

- **Automated PR Analysis**: Automatically detects and processes pull requests based on configured events
- **Intelligent Review Generation**: Uses LLMs to analyze code changes and generate human-like review comments
- **Multi-Stage Review Pipeline**:
  - **Style & Quality**: Identifies maintainability, readability, and code quality issues
  - **Bug Detection**: Catches logic errors, race conditions, and potential bugs
  - **Security Audit**: Detects vulnerabilities and security risks
  - **Performance Optimization**: Suggests improvements for speed and resource usage
- **GitHub Integration**:
  - Posts review comments directly to GitHub pull requests
  - Supports multiple comment types (COMMENT, IN_PROGRESS, REQUEST_CHANGES)
  - Processes both push and pull request events
- **Developer Experience**:
  - Web-based dashboard to view all pull requests and their review status
  - Real-time logging and progress tracking
  - GitHub OAuth for secure authentication
- **Production Ready Features**:
  - **Safe LLM Interaction**: Robust JSON parsing and error handling with auto-repair
  - **GitHub Signature Verification**: Ensures webhook payloads come from GitHub
  - **Content Validation**: Strict filtering and sanitization of AI-generated content
  - **Graceful Degradation**: Fallback mechanisms when specific files cannot be processed

## 🛠️ Tech Stack

### Backend (Node.js)
- **Framework**: Express.js
- **AI Orchestration**: Custom review orchestration service
- **LLM Providers**: OpenRouter
- **GitHub API**: Octokit for GitHub interactions
- **Data Validation**: Joi for request validation

### AI & NLP
- **Prompt Engineering**: Context-aware prompts for code review
- **Response Sanitization**: JSON schema validation and auto-repair
- **Content Moderation**: Comment classification and filtering

## 📂 Project Structure

```
/pr-review-ai
├── server/                  # Backend Node.js application
│   ├── src/
│   │   ├── config/          # Configuration management
│   │   ├── middleware/      # Express middleware (auth, logging, etc.)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic and AI services
│   │   ├── utils/           # Helper utilities
│   │   ├── orchestrators/   # Multi-service workflows
│   │   └── app.js           # Express application
│   ├── .env.example         # Environment variable template
│   └── package.json
└── client/                  # (Under construction) Web-based dashboard
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` and `admin:repo_hook` scopes
- [OpenRouter API Key](https://openrouter.ai/keys) (optional, for local LLM inference)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd pr-review-ai
   ```

2. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create environment variables:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:

   ```env
   # Application settings
   NODE_ENV=development
   PORT=5000

   # GitHub Authentication
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_APP_WEBHOOK_SECRET=your-webhook-secret
   GITHUB_APP_ID=your-app-id
   GITHUB_APP_PRIVATE_KEY="----BEGIN RSA PRIVATE KEY----\n...\n----END RSA PRIVATE KEY----"

   # LLM Providers (OpenRouter recommended for ease of use)
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   OPENROUTER_MODEL_PRIMARY=openai/gpt-4.1-mini
   OPENROUTER_MODEL_FALLBACK=openai/gpt-4.1-mini
   ```

5. (Optional) Start ngrok for external access:

   ```bash
   # Set NGROK_AUTHTOKEN in .env
   npm run dev
   ```

## 🏃 Usage

### Development Mode

```bash
# Start the server
npm run dev
```

The server will start on `http://localhost:5000`. The dashboard (under construction) will be available at `http://localhost:5000` (or via ngrok if enabled).

### Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server in development mode with hot-reload |
| `npm start` | Start the production server |
| `npm run test` | Run automated tests |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format code with Prettier |

## 🤝 Contributing

Contributions are welcome! This project is currently under active development, and all contributions are appreciated. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) (when available) for detailed contribution guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Vishwas Tiwari - [vishwastiwariii09@gmail.com]
Project Link: [https://github.com/vishwastiwariii/pr-review-ai]

## 📖 Project Roadmap

- [ ] **Phase 1: Core Backend Development**
  - [x] Complete GitHub integration
  - [x] Implement LLM review pipeline
  - [x] Add webhook endpoint
  - [x] Basic validation and error handling
- [ ] **Phase 2: Production Readiness**
  - [ ] Advanced content moderation
  - [ ] Performance optimization
  - [ ] Comprehensive testing
  - [ ] Deployment scripts
- [ ] **Phase 3: Frontend Development**
  - [ ] Create dashboard UI
  - [ ] Implement real-time status tracking
  - [ ] Add configuration management
- [ ] **Phase 4: Advanced Features**
  - [ ] Multi-language support
  - [ ] IDE plugin integration
  - [ ] Custom review workflows
