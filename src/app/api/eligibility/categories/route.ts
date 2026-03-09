import { NextResponse } from 'next/server';

// NFT categories
const categories = [
  { 
    category: 'saga-genesis', 
    name: 'Saga Genesis', 
    description: 'For Saga device NFT holders',
    supplyLimit: 10000,
    eligibilityCriteria: 'Hold Saga Genesis NFT',
  },
  { 
    category: 'seeker-pioneer', 
    name: 'Seeker Pioneer', 
    description: 'For Seeker device owners',
    supplyLimit: 50000,
    eligibilityCriteria: 'Verify Seeker device ownership',
  },
  { 
    category: 'jupiter-aligned', 
    name: 'Jupiter Aligned', 
    description: 'For JUP stakers',
    supplyLimit: 25000,
    eligibilityCriteria: 'Stake minimum 10,000 JUP',
  },
  { 
    category: 'bonk-community', 
    name: 'Bonk Community', 
    description: 'For BONK stakers',
    supplyLimit: 25000,
    eligibilityCriteria: 'Stake minimum 1,000,000 BONK',
  },
  { 
    category: 'meteora-lp', 
    name: 'Meteora LP', 
    description: 'For Meteora LPs',
    supplyLimit: 15000,
    eligibilityCriteria: 'Provide liquidity on Meteora',
  },
];

export async function GET() {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
