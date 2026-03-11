import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cGgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0OTcwNiwiZXhwIjo5NTgxMjU3MDZ9.Vx5kORlLMLMdcVPBNT6-Tk9dJI6FbLHqQ0r6i3jC2E'
);

// Mock data
const mockTransactions = [
  { id: '1', user_id: 'user1', type: 'purchase', amount: '2.5 SOL', launch_id: '1', status: 'completed', created_at: '2026-03-10T10:00:00Z' },
  { id: '2', user_id: 'user2', type: 'claim', amount: '125000 PXW', launch_id: '4', status: 'completed', created_at: '2026-03-10T09:00:00Z' },
  { id: '3', user_id: 'user3', type: 'purchase', amount: '10 SOL', launch_id: '2', status: 'pending', created_at: '2026-03-10T08:00:00Z' },
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