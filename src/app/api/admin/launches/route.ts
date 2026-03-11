import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Mock data for production when Supabase is unavailable
const mockLaunches = [
  { id: '1', name: 'Solana Meme Lords', symbol: 'SML', status: 'active', total_raised: 42350, participants_count: 156, start_time: '2026-03-01', end_time: '2026-03-15' },
  { id: '2', name: 'Bonkify', symbol: 'BONK', status: 'active', total_raised: 68200, participants_count: 234, start_time: '2026-03-05', end_time: '2026-03-12' },
  { id: '3', name: 'SeedVault Elite', symbol: 'SVE', status: 'upcoming', total_raised: 0, participants_count: 0, start_time: '2026-03-20', end_time: '2026-03-27' },
  { id: '4', name: 'Pixel Wars', symbol: 'PXW', status: 'ended', total_raised: 58900, participants_count: 412, start_time: '2026-02-15', end_time: '2026-02-28' },
];

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(mockLaunches);
    }
    const { data, error } = await supabase
      .from('launches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data || mockLaunches);
  } catch (error) {
    console.error('Error fetching launches, using mock data:', error);
    return NextResponse.json(mockLaunches);
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  let body = {};
  
  if (!supabase) {
    // Return mock success for demo when Supabase unavailable
    body = await request.json();
    return NextResponse.json({ 
      id: Date.now().toString(), 
      ...body, 
      status: 'upcoming',
      created_at: new Date().toISOString()
    });
  }
  
  try {
    body = await request.json();
    
    const { data, error } = await supabase
      .from('launches')
      .insert([{ ...body, status: 'upcoming' }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating launch:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}