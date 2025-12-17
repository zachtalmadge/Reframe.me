# Reframe.me

> Empowering justice-involved individuals to prepare for employment opportunities with confidence.

Reframe.me is a free, privacy-focused web application that helps people with criminal backgrounds create professional disclosure narratives and pre-adverse action response letters for job applications.

**Status**: Live at [reframeme.app](https://reframeme.app) and actively maintained. See [CLAUDE.md](./CLAUDE.md) for detailed development status.

## 📑 Table of Contents

- [What It Does](#-what-it-does)
- [Recent Updates](#-recent-updates)
- [Getting Started](#-getting-started)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Privacy & Security](#-privacy--security)
- [Deployment](#-deployment)
- [Development](#-development)
- [Design Philosophy](#-design-philosophy)
- [Contributing](#-contributing)
- [Support & Troubleshooting](#-support--troubleshooting)

## 🎯 What It Does

**Five Disclosure Narratives**
- Direct & Professional approach
- Skills-First approach
- Growth-Focused narrative
- Brief & Confident version
- Values-Aligned narrative

**Pre-Adverse Action Response Letter**
- Professional letter template for responding to background check concerns
- Uses the OIL framework (Ownership, Impact, Lessons Learned)
- Can incorporate resume and job posting for tailored responses

## ✨ Recent Updates

- **Modern Design System**: iOS 26-inspired UI with glass morphism effects
- **Enhanced Mobile Experience**: Optimized navigation with responsive glass navbar
- **Improved Error Handling**: Silent retry functionality for better reliability
- **Donate Integration**: Support options integrated throughout the experience
- **Live Application**: Currently deployed and accessible at [reframeme.app](https://reframeme.app)

## 🚀 Getting Started

**Live Application**: Visit [reframeme.app](https://reframeme.app) to use the application.

### Local Development Setup

For developers who want to contribute or run locally, see [QUICKSTART.md](./QUICKSTART.md) for setup instructions.

**TL;DR:**
```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run db:push
npm run dev
```

### Developer Guides

- **[Local Development Guide](./LOCAL_DEVELOPMENT.md)** - Complete setup instructions
- **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Deployment configuration reference
- **[CLAUDE.md](./CLAUDE.md)** - Development status and setup progress

## ⚡ Features

- **AI-Powered Content Generation**: Uses GPT-5.2 to create personalized narratives
- **Privacy-First**: No account required, no data stored on servers
- **Mobile Optimized**: Responsive design with modern glass morphism UI
- **Regeneration Options**: Customize any narrative or letter with one click
- **Multi-Step Form**: Intuitive 9-step process for gathering context
- **Local Storage**: Form data persists in browser for convenience

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL, Drizzle ORM
- **AI**: OpenAI API (GPT-5.2)
- **UI Components**: Radix UI, shadcn/ui
- **Build Tool**: Vite
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- OpenAI API key

## 🔑 Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL=postgresql://...
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
SESSION_SECRET=random_secret_here
NODE_ENV=development
PORT=5000
```

## 📁 Project Structure

```
reframe.me/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── lib/         # Utilities and helpers
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data storage interface
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema
└── script/              # Build scripts
    └── build.ts         # Production build
```

## 🔒 Privacy & Security

- **No account required** - Users can access the service immediately
- **No data persistence** - Form data and results are stored in browser only
- **Session-based** - Results cleared when user closes browser
- **Secure by default** - Environment variables for sensitive data

## 🌐 Deployment

The application is currently **live at [reframeme.app](https://reframeme.app)**.

For deployment configuration details and architecture information, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server (port 5000)
npm run build        # Build for production
npm start            # Run production build
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes
```

### Making Changes

1. **Frontend changes**: Edit files in `client/src/`
2. **Backend changes**: Edit files in `server/`
3. **Database schema**: Edit `shared/schema.ts` then run `npm run db:push`
4. **UI components**: Using shadcn/ui components in `client/src/components/ui/`

## 🎨 Design Philosophy

Reframe.me follows a calming, accessible design approach with modern aesthetics:
- **Calming Clarity**: No visual clutter, clean interfaces
- **Dignified Simplicity**: Professional yet approachable
- **Progressive Confidence**: Clear steps and gentle guidance
- **Accessibility-First**: High contrast, readable text, clear focus states
- **Modern Design**: iOS 26-inspired glass morphism, smooth animations, responsive layouts

See [design_guidelines.md](./design_guidelines.md) for complete design specifications.

## 🤝 Contributing

This is a social impact project. Contributions that improve accessibility, user experience, or functionality are welcome.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built to support justice-involved individuals in their journey toward meaningful employment.

## 📞 Support & Troubleshooting

For issues or questions:
- **Using the App**: Visit [reframeme.app](https://reframeme.app) - no setup required
- **Local Development Help**: See [CLAUDE.md](./CLAUDE.md) for detailed development status and troubleshooting
- **Quick Setup**: Check [QUICKSTART.md](./QUICKSTART.md) for fast local development setup
- **Environment Issues**: Review `.env.example` and ensure all variables are set
- **Report Issues**: Open an issue on GitHub with detailed error messages

---

**Note**: This application uses AI to generate content. While the AI provides helpful starting points, users should review and customize all generated content before use.
