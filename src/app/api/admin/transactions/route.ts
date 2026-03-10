import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const mockTransactions = [
  { id: '1', tx_hash: '0xabc123...', type: 'buy', token: 'MEME', amount: '500', usd_value: '500', wallet_address: '0x1234...5678', status: 'confirmed', created_at: '2026-03-05T14:30:00Z' },
  { id: '2', tx_hash: '0xdef456...', type: 'claim', token: 'STAR', amount: '1000', usd_value: '1200', wallet_address: '0xabcd...efgh', status: 'confirmed', created_at: '2026-03-04T10:15:00Z' },
];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return NextResponse.json({ transactions: data || [], total: data?.length || 0 });
    }
    
    return NextResponse.json({ transactions: mockTransactions, total: mockTransactions.length });
    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
