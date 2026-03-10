import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    // Return mock data if Supabase not configured
    return NextResponse.json([
      { id: '1', name: 'Project Alpha', symbol: 'ALPHA', status: 'active', total_raised: 50000, participants_count: 120, start_time: '2026-03-01', end_time: '2026-03-10' },
      { id: '2', name: 'Project Beta', symbol: 'BETA', status: 'upcoming', total_raised: 0, participants_count: 0, start_time: '2026-03-20', end_time: '2026-03-25' },
      { id: '3', name: 'Project Gamma', symbol: 'GAMMA', status: 'ended', total_raised: 150000, participants_count: 450, start_time: '2026-02-01', end_time: '2026-02-10' },
    ]);
  }
  
  const { data, error } = await supabase
    .from('launches')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }
  
  const { data, error } = await supabase
    .from('launches')
    .insert([{
      name: body.name,
      symbol: body.symbol,
      description: body.description,
      type: body.type || 'standard',
      status: 'upcoming',
      total_supply: body.totalSupply,
      launch_price: body.launchPrice,
      raise_target: body.raiseTarget,
      start_time: body.startTime,
      end_time: body.endTime,
    }])
    .select()
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
