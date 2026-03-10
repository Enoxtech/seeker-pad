import { NextResponse } from 'next/server';

export async function GET() {
  // Return mock data
  return NextResponse.json([
    { id: '1', name: 'Project Alpha', symbol: 'ALPHA', status: 'active', total_raised: 50000, participants_count: 120, start_time: '2026-03-01', end_time: '2026-03-10' },
    { id: '2', name: 'Project Beta', symbol: 'BETA', status: 'upcoming', total_raised: 0, participants_count: 0, start_time: '2026-03-20', end_time: '2026-03-25' },
    { id: '3', name: 'Project Gamma', symbol: 'GAMMA', status: 'ended', total_raised: 150000, participants_count: 450, start_time: '2026-02-01', end_time: '2026-02-10' },
  ]);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Return mock success
  return NextResponse.json({
    id: Date.now().toString(),
    name: body.name,
    symbol: body.symbol,
    status: 'upcoming',
    created_at: new Date().toISOString()
  });
}
