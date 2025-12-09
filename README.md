# Reframe.me

> Empowering justice-involved individuals to prepare for employment opportunities with confidence.

Reframe.me is a free, privacy-focused web application that helps people with criminal backgrounds create professional disclosure narratives and pre-adverse action response letters for job applications.

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

## 🚀 Getting Started

### Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for the fastest way to get up and running locally.

**TL;DR:**
```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run db:push
npm run dev
```

### Detailed Guides

- **[Local Development Guide](./LOCAL_DEVELOPMENT.md)** - Complete setup instructions
- **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Production deployment steps

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL, Drizzle ORM
- **AI**: OpenAI API (GPT-4o-mini)
- **UI Components**: Radix UI, shadcn/ui
- **Build Tool**: Vite
- **Deployment**: Vercel-ready

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

## 🚢 Deployment

This project is configured for deployment on Vercel. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Freframe.me)

**Important**: You must configure environment variables in Vercel before the app will work.

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

Reframe.me follows a calming, accessible design approach:
- **Calming Clarity**: No visual clutter
- **Dignified Simplicity**: Professional yet approachable
- **Progressive Confidence**: Clear steps and gentle guidance
- **Accessibility-First**: High contrast, readable text, clear focus states

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

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Review the documentation in `/docs`
- Check environment variable configuration

---

**Note**: This application uses AI to generate content. While the AI provides helpful starting points, users should review and customize all generated content before use.
