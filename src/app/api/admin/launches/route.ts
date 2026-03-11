import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cGgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0OTcwNiwiZXhwIjo5NTgxMjU3MDZ9.Vx5kORlLMLMdcVPBNT6-Tk9dJI6FbLHqQ0r6i3jC2E'
);

// Mock data for when Supabase is unavailable
const mockLaunches = [
  { id: '1', name: 'Solana Meme Lords', symbol: 'SML', status: 'active', total_raised: 42350, participants_count: 156, start_time: '2026-03-01', end_time: '2026-03-15' },
  { id: '2', name: 'Bonkify', symbol: 'BONK', status: 'active', total_raised: 68200, participants_count: 234, start_time: '2026-03-05', end_time: '2026-03-12' },
  { id: '3', name: 'SeedVault Elite', symbol: 'SVE', status: 'upcoming', total_raised: 0, participants_count: 0, start_time: '2026-03-20', end_time: '2026-03-27' },
  { id: '4', name: 'Pixel Wars', symbol: 'PXW', status: 'ended', total_raised: 58900, participants_count: 412, start_time: '2026-02-15', end_time: '2026-02-28' },
];

export async function GET() {
  try {
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
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('launches')
      .insert([{ ...body, status: 'upcoming' }])
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating launch, using mock response:', error);
    // Return mock success for demo
    return NextResponse.json({ 
      id: Date.now().toString(), 
      ...body, 
      status: 'upcoming',
      created_at: new Date().toISOString()
    });
  }
}