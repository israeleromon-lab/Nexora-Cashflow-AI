# Nexora CashFlow AI

A robust, full-stack financial dashboard tailored to help modern businesses track, forecast, and visualize their cash flow efficiently. Built from the ground up for speed, reliability, and powerful predictive analytics.

## Features

- **Interactive Dashboard:** Real-time metrics highlighting your Net Cash Flow, Revenue, and Expenses with beautiful, reactive charting.
- **AI Financial Forecaster:** Analyzes your historical transaction data and intelligently projects your next 6 months of runway in Base, Upside, and Downside scenarios.
- **Smart Transaction Tracking:** Log daily expenses and revenues cleanly.
- **Multi-Currency Support:** Easily toggle between major currencies (Naira, USD, Euro, Pound, Yen) to adapt to your operational context.
- **Supabase Authentication:** Secure, frictionless user authentication and session management.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Recharts, Shadcn UI
- **Backend:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL via Supabase
- **AI Models:** OpenRouter API (Gemini 2.5 Flash, Groq, Cohere)

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a free [Supabase](https://supabase.com) account and an [OpenRouter](https://openrouter.ai/) API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/israeleromon-lab/Nexora-Cashflow-AI.git
   cd Nexora-Cashflow-AI/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Rename `.env.example` to `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   OPENROUTER_API_KEY=your-openrouter-key
   ```

4. **Initialize the Database:**
   Run the provided `database/schema.sql` script inside your Supabase SQL Editor to instantly scaffold your `profiles`, `transactions`, and `scenarios` tables.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to start visualizing your data.

## Deployment

Nexora CashFlow AI is optimized for zero-configuration deployment on **Vercel**. 
Simply import your GitHub repository into your Vercel dashboard, attach your Environment Variables in the project settings, and click Deploy. 

## License

This project is licensed under the MIT License.
