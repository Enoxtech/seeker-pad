import { NextResponse } from 'next/server';

const launches = [
  { id: 1, name: 'Solana Meme', symbol: 'MEME', status: 'Live', raised: 45000, target: 100000, participants: 234, startDate: '2026-03-01', endDate: '2026-03-15' },
  { id: 2, name: 'Pump Token', symbol: 'PUMP', status: 'Upcoming', raised: 0, target: 50000, participants: 0, startDate: '2026-03-20', endDate: '2026-04-05' },
  { id: 3, name: 'DeFi Stars', symbol: 'STAR', status: 'Ended', raised: 125000, target: 100000, participants: 567, startDate: '2026-02-01', endDate: '2026-02-20' },
  { id: 4, name: 'GameFi Pro', symbol: 'GFP', status: 'Live', raised: 78000, target: 150000, participants: 412, startDate: '2026-03-05', endDate: '2026-03-25' },
];

export async function GET() {
  return NextResponse.json({ launches, total: launches.length });
}
