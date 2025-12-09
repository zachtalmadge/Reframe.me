# Vercel Deployment Guide

This guide walks you through deploying Reframe.me to Vercel.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code
- PostgreSQL database (cloud-hosted)
- OpenAI API key

## Step 1: Prepare Your Database

You'll need a production PostgreSQL database. Options:

- **Neon** (recommended): https://neon.tech/
- **Supabase**: https://supabase.com/
- **Railway**: https://railway.app/
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

Get your database connection string (it should start with `postgresql://`).

## Step 2: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

Or deploy directly from the Vercel dashboard.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add environment variables (see Step 4 below)
5. Click "Deploy"

### Option B: Deploy via CLI

```bash
vercel
```

Follow the prompts, then configure environment variables.

## Step 4: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host.com/db` |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI API base URL | `https://api.openai.com/v1` |
| `SESSION_SECRET` | Random secret for sessions | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment | `production` |

### Setting Variables via Dashboard
1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable listed above
4. Select all environments (Production, Preview, Development)
5. Click "Save"

### Setting Variables via CLI
```bash
vercel env add DATABASE_URL
vercel env add AI_INTEGRATIONS_OPENAI_API_KEY
vercel env add AI_INTEGRATIONS_OPENAI_BASE_URL
vercel env add SESSION_SECRET
vercel env add NODE_ENV
```

## Step 5: Set Up Database Schema

After deploying, run database migrations:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull your environment variables locally
vercel env pull

# Run the migration
npm run db:push
```

Alternatively, you can run migrations from your local machine if you have `DATABASE_URL` set to your production database.

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the application:
   - Click "Get Started"
   - Fill out the form
   - Verify narratives are generated

## Production Considerations

### Database Connection Pooling
For production, consider using connection pooling:
- Neon provides this automatically
- For other databases, use a pooler like PgBouncer

### OpenAI Rate Limits
- Monitor your OpenAI API usage
- Consider implementing rate limiting on your API endpoints
- Set up usage alerts in your OpenAI dashboard

### Session Storage
Currently using PostgreSQL for session storage via `connect-pg-simple`. This works well for production but ensure:
- Your database has good uptime
- Connection limits are configured appropriately

### Monitoring
- Set up Vercel Analytics
- Monitor function execution times
- Watch for errors in Vercel logs

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Troubleshooting

### Build Failures
- Check Vercel build logs
- Ensure all environment variables are set
- Verify `package.json` scripts are correct

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check database server is accessible from Vercel (0.0.0.0/0 if needed)
- Ensure SSL is configured if required

### API Errors
- Check Vercel function logs
- Verify OpenAI API key is valid
- Check rate limits haven't been exceeded

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed by Vercel

## Rollback

If something goes wrong:
1. Go to Deployments in Vercel dashboard
2. Find a previous working deployment
3. Click the three dots → Promote to Production
