import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { createClient } from '@/utils/supabase/server';

// Initialize the new standard GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let financialContext = "User has no data.";

    if (user) {
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
        Total Revenue: ₦${totalIncome}
        Total Expenses: ₦${totalExpense}
        Net Cash Flow: ₦${totalIncome - totalExpense}
        Transaction Count: ${transactions.length}
        Recent Transactions JSON: ${JSON.stringify(transactions.slice(0, 50))}
        `;
      } else {
        // Fallback demo data if user has no transactions so the AI can still generate a nice report
        financialContext = `
        [DEMO DATA - USER HAS NO REAL TRANSACTIONS YET]
        Total Revenue: ₦2,450,000
        Total Expenses: ₦1,200,000
        Net Cash Flow: ₦1,250,000
        Major Expenses: Payroll (₦250k), SaaS (₦120k), Marketing (₦50k)
        `;
      }
    }

    const systemInstruction = SYSTEM_PROMPTS.STRATEGIC_REPORT.replace('{financialData}', financialContext);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Please generate my Strategic Financial Report now.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more structured, analytical output
      }
    });

    const adviceContent = response.text || "Failed to generate report.";

    return NextResponse.json({ advice: adviceContent });
  } catch (error: any) {
    console.error('Error in Gemini advice route:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
