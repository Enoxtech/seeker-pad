import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cGgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0OTcwNiwiZXhwIjo5NTgxMjU3MDZ9.Vx5kORlLMLMdcVPBNT6-Tk9dJI6FbLHqQ0r6i3jC2E'
);

// Mock transactions data
const mockTransactions = [
  { id: '1', user_address: '7xKXtg2CW8YHZr2K3vLkLqGqXDhV3m', type: 'purchase', amount_sol: 2.5, status: 'confirmed', tx_signature: 'abc123xyz', created_at: '2026-03-10T10:00:00Z' },
  { id: '2', user_address: '9aZKTtbD7mBnK9hL5nCpQ8rT', type: 'claim', amount_sol: 125, status: 'confirmed', tx_signature: 'def456uvw', created_at: '2026-03-10T09:00:00Z' },
  { id: '3', user_address: '3mBnK9hL5nCpQ8rT9aZKXy', type: 'purchase', amount_sol: 10, status: 'pending', tx_signature: 'ghi789rst', created_at: '2026-03-10T08:00:00Z' },
];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data || mockTransactions);
  } catch (error) {
    console.error('Error fetching transactions, using mock data:', error);
    return NextResponse.json(mockTransactions);
  }
}