import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const mockLaunches = [
  { id: '1', name: 'Solana Meme', symbol: 'MEME', status: 'live', target_amount: 100000, raised_amount: 45000, start_date: '2026-03-01', end_date: '2026-03-15' },
  { id: '2', name: 'Pump Token', symbol: 'PUMP', status: 'upcoming', target_amount: 50000, raised_amount: 0, start_date: '2026-03-20', end_date: '2026-04-05' },
  { id: '3', name: 'DeFi Stars', symbol: 'STAR', status: 'ended', target_amount: 100000, raised_amount: 125000, start_date: '2026-02-01', end_date: '2026-02-20' },
];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('launches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return NextResponse.json({ launches: data || [], total: data?.length || 0 });
    }
    
    return NextResponse.json({ launches: mockLaunches, total: mockLaunches.length });
    
  } catch (error) {
    console.error('Error fetching launches:', error);
    return NextResponse.json({ error: 'Failed to fetch launches' }, { status: 500 });
  }
}
