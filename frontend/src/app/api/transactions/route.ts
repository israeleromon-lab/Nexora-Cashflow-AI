import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, type, category, description, date } = body;

    if (!amount || !type || !category || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount,
          type,
          category,
          description,
          date
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, transaction: data[0] });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: error.message || 'Failed to create transaction' }, { status: 500 });
  }
}
