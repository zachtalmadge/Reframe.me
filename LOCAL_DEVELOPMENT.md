# Local Development Setup

This guide will help you set up Reframe.me for local development.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- OpenAI API key

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and configure the following:

### Database Configuration
You have two options:

**Option A: Use a cloud database (recommended for getting started quickly)**
- Use a service like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
- Get your PostgreSQL connection string and set it as `DATABASE_URL`

**Option B: Use local PostgreSQL**
- Install PostgreSQL locally
- Create a database: `createdb reframeme`
- Update `DATABASE_URL` with your local connection string

### OpenAI API Configuration
- Get an API key from [OpenAI](https://platform.openai.com/api-keys)
- Set `AI_INTEGRATIONS_OPENAI_API_KEY` in your `.env` file
- Keep `AI_INTEGRATIONS_OPENAI_BASE_URL` as `https://api.openai.com/v1`

### Session Secret
- Generate a random string for `SESSION_SECRET`
- Example: `openssl rand -base64 32`

## Step 3: Set Up the Database

Run database migrations:
```bash
npm run db:push
```

This will create the necessary tables in your PostgreSQL database.

## Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Development Workflow

- **Frontend**: React code in `client/src/`
- **Backend**: Express API in `server/`

### Hot Reload
The dev server supports hot module replacement. Changes to frontend code will reload automatically.

### Type Checking
Run TypeScript type checking:
```bash
npm run check
```

### Building for Production
Build the production bundle:
```bash
npm run build
```

Run the production server:
```bash
npm start
```

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your database server is running
- Ensure your IP is allowed if using a cloud database

### OpenAI API Issues
- Verify your API key is valid
- Check you have credits available in your OpenAI account
- Ensure the base URL is correct

### Port Already in Use
If port 5000 is already in use, change the `PORT` in your `.env` file.
