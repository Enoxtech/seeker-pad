import { NextResponse } from 'next/server';

const categories = [
  { category: 'saga-genesis', name: 'Saga Genesis', description: 'For Saga device NFT holders', supplyLimit: 10000 },
  { category: 'seeker-pioneer', name: 'Seeker Pioneer', description: 'For Seeker device owners', supplyLimit: 50000 },
  { category: 'jupiter-aligned', name: 'Jupiter Aligned', description: 'For JUP stakers', supplyLimit: 25000 },
  { category: 'bonk-community', name: 'Bonk Community', description: 'For BONK stakers', supplyLimit: 25000 },
  { category: 'meteora-lp', name: 'Meteora LP', description: 'For Meteora LPs', supplyLimit: 15000 },
];

export async function GET() {
  return NextResponse.json(categories);
}
