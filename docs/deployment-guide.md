# Nexora CashFlow Deployment Guide

This guide covers how to deploy the platform to **Vercel** and connect it to your **Supabase** instance.

## 1. Database Setup (Supabase)
1. Log into Supabase and create a new project.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `database/supabase_schema.sql` and run it in the SQL Editor to create the `User`, `Transaction`, and `Forecast` tables.
4. Go to **Project Settings > Database** and copy the Connection String URI (with connection pooling enabled).

## 2. Environment Variables
You will need to set the following environment variables in Vercel:

```env
# Database (Prisma requires a pooled connection URL for Next.js)
DATABASE_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# AI Services
GROQ_API_KEY="your-groq-key"
GEMINI_API_KEY="your-gemini-key"
COHERE_API_KEY="your-cohere-key"
```

## 3. Deploying to Vercel
1. Push this codebase to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to `Next.js`.
5. Set the **Root Directory** to `frontend/`.
6. Expand **Environment Variables** and add all the keys listed above.
7. Under **Build Command**, override it with:
   ```bash
   npx prisma generate && next build
   ```
8. Click **Deploy**.

Vercel will automatically build the Next.js app, generate the Prisma Client, and deploy the serverless API routes.
