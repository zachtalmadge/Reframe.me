# Reframe.me - Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```

### 3. Configure your environment

Edit `.env` and add:

**Required:**
- `DATABASE_URL` - Get a free PostgreSQL database from [Neon](https://neon.tech/)
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Get from [OpenAI](https://platform.openai.com/api-keys)
- `SESSION_SECRET` - Generate one: `openssl rand -base64 32`

**Example `.env` file:**
```env
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb
AI_INTEGRATIONS_OPENAI_API_KEY=sk-proj-xyz123...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
SESSION_SECRET=your_random_secret_here
NODE_ENV=development
PORT=5000
```

### 4. Set up the database
```bash
npm run db:push
```

### 5. Start developing!
```bash
npm run dev
```

Visit `http://localhost:5000` 🎉

## 📚 Next Steps

- **Local Development**: See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for detailed info
- **Deploy to Vercel**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for deployment guide

## 🐛 Common Issues

**"DATABASE_URL not found"**
- Make sure you created and configured your `.env` file

**"OpenAI API error"**
- Verify your API key is correct
- Check you have credits in your OpenAI account

**"Port 5000 already in use"**
- Change `PORT=5000` to another port in your `.env` file

## 🎯 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI API
- **Build**: Vite
