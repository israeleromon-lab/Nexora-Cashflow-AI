import { NextResponse } from 'next/server';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let financialContext = "User has no data.";

    if (user) {
      const currency = user.user_metadata?.currency || '₦';

      // Fetch all transactions to give a comprehensive report
      const { data: transactions } = await supabase
        .from('transactions')
        .select('date, amount, type, category, description')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transactions && transactions.length > 0) {
        // Summarize data to save tokens
        const totalIncome = transactions.filter(t => t.type === 'revenue').reduce((acc, t) => acc + Number(t.amount), 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
        
        financialContext = `
        Total Revenue: ${currency}${totalIncome}
        Total Expenses: ${currency}${totalExpense}
        Net Cash Flow: ${currency}${totalIncome - totalExpense}
        Transaction Count: ${transactions.length}
        Recent Transactions JSON: ${JSON.stringify(transactions.slice(0, 50))}
        Please provide advice formatted in ${currency}.
        `;
      } else {
        // Fallback demo data if user has no transactions so the AI can still generate a nice report
        financialContext = `
        [DEMO DATA - USER HAS NO REAL TRANSACTIONS YET]
        Total Revenue: ${currency}2,450,000
        Total Expenses: ${currency}1,200,000
        Net Cash Flow: ${currency}1,250,000
        Major Expenses: Payroll (${currency}250k), SaaS (${currency}120k), Marketing (${currency}50k)
        Please provide advice formatted in ${currency}.
        `;
      }
    }

    const systemInstruction = SYSTEM_PROMPTS.STRATEGIC_REPORT.replace('{financialData}', financialContext);

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Nexora CashFlow AI",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Powerful analytical model
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: "Please generate my Strategic Financial Report now." }
        ],
        temperature: 0.4, // Lower temperature for more structured, analytical output
        max_tokens: 2000, // Explicitly set to avoid large credit reservation holds
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const adviceContent = data.choices?.[0]?.message?.content || "Failed to generate report.";

    return NextResponse.json({ advice: adviceContent });
  } catch (error: any) {
    console.error('Error in OpenRouter advice route:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
