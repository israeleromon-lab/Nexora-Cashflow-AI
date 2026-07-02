import { NextResponse } from 'next/server';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all transactions to give a comprehensive report
    const { data: transactions } = await supabase
    let financialContext = "User has no data.";
    let currency = '₦';

    if (user) {
      currency = user.user_metadata?.currency || '₦';

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

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
      IMPORTANT: Generate financial figures using the currency symbol ${currency}.
      `;
      } else {
        // Fallback demo data if user has no transactions
        financialContext = `
      [DEMO DATA - USER HAS NO REAL TRANSACTIONS YET]
      Total Revenue: ${currency}2,450,000
      Total Expenses: ${currency}1,200,000
      Net Cash Flow: ${currency}1,250,000
      Major Expenses: Payroll (${currency}250k), SaaS (${currency}120k), Marketing (${currency}50k)
      IMPORTANT: Generate financial figures using the currency symbol ${currency}.
      `;
      }
    } 

    const systemInstruction = SYSTEM_PROMPTS.FORECAST_GENERATOR.replace('{financialData}', financialContext);

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
        model: "google/gemini-2.5-flash", // Excellent for structured JSON output
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: "Generate the JSON array of 6-month scenarios now." }
        ],
        temperature: 0.2, // Low temperature for consistent JSON
        max_tokens: 2000, // Explicitly set to avoid large credit reservation holds
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let rawOutput = data.choices?.[0]?.message?.content || "[]";
    
    // Clean markdown blocks if the AI ignored instructions
    rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let scenariosToInsert = [];
    try {
      scenariosToInsert = JSON.parse(rawOutput);
    } catch (e) {
      console.error('Failed to parse AI output:', rawOutput);
      throw new Error('AI returned invalid JSON format.');
    }

    // Clear old scenarios to avoid duplicate clutter
    await supabase.from('scenarios').delete().eq('user_id', user.id);

    // Prepare data for DB
    const dbPayload = scenariosToInsert.map((s: any) => ({
      user_id: user.id,
      name: s.name,
      type: s.type,
      projected_revenue: s.projected_revenue,
      projected_expense: s.projected_expense,
      target_date: s.target_date
    }));

    // Save to Supabase
    const { data: savedScenarios, error: insertError } = await supabase
      .from('scenarios')
      .insert(dbPayload)
      .select();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ scenarios: savedScenarios });
  } catch (error: any) {
    console.error('Error in forecast generation route:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: scenarios, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('user_id', user.id)
      .order('target_date', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ scenarios });
  } catch (error: any) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
