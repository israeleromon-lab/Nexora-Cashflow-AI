import { NextResponse } from 'next/server';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { createClient } from '@/utils/supabase/server';

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

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
        "X-Title": "Nexora CashFlow AI", // Required by OpenRouter
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // Fast Chatbot model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const responseContent = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response: responseContent });
  } catch (error: any) {
    console.error('Error in OpenRouter chat route:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
