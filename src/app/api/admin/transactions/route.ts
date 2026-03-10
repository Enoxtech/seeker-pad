import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json([
      { id: '1', user_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', type: 'participation', amount_sol: 2.5, status: 'confirmed', tx_signature: 'abc123', created_at: '2026-03-10T10:30:00Z' },
      { id: '2', user_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', type: 'claim', amount_sol: 1500, status: 'confirmed', tx_signature: 'def456', created_at: '2026-03-10T09:15:00Z' },
      { id: '3', user_address: '3mBnK9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXL', type: 'purchase', amount_sol: 5.0, status: 'pending', tx_signature: 'ghi789', created_at: '2026-03-10T08:00:00Z' },
    ]);
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data || []);
}
