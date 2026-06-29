import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { createClient } from '@/utils/supabase/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Initialize Supabase to get user context
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let financialContext = "User is not authenticated or has no data.";
    
    if (user) {
      // Fetch recent transactions for context
      const { data: transactions } = await supabase
        .from('transactions')
        .select('date, amount, type, category, description')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(20);

      if (transactions && transactions.length > 0) {
        financialContext = JSON.stringify(transactions, null, 2);
      } else {
        financialContext = "User has no recorded transactions yet. Advise them to add transactions in the Transactions tab.";
      }
    }

    // Replace context placeholder in prompt
    const systemMessage = SYSTEM_PROMPTS.CHAT_ADVISOR.replace('{financialData}', financialContext);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response: responseContent });
  } catch (error: any) {
    console.error('Error in Groq chat route:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
