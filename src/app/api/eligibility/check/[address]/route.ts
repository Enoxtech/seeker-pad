import { NextResponse } from 'next/server';

// NFT categories with eligibility criteria
const nftCategories = [
  { category: 'saga-genesis', name: 'Saga Genesis', threshold: 1 },
  { category: 'seeker-pioneer', name: 'Seeker Pioneer', threshold: 1 },
  { category: 'jupiter-aligned', name: 'Jupiter Aligned', threshold: 10000 },
  { category: 'bonk-community', name: 'Bonk Community', threshold: 1000000 },
  { category: 'meteora-lp', name: 'Meteora LP', threshold: 1000 },
];

// Get eligibility status for an address
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    // Validate address format (basic check)
    if (!address || address.length < 32 || address.length > 44) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }
    
    // Mock eligibility - randomly determine eligibility for demo
    // In production: Query blockchain/contracts to check actual holdings
    const categories = nftCategories.map(cat => ({
      category: cat.category,
      isEligible: Math.random() > 0.5, // Random for demo
      balance: Math.floor(Math.random() * 10000),
      threshold: cat.threshold,
    }));
    
    const isEligible = categories.some(c => c.isEligible);
    const nftCount = categories.filter(c => c.isEligible).length;
    
    return NextResponse.json({
      isEligible,
      categories,
      hasNFT: nftCount > 0,
      nftCount,
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 });
  }
}

// Verify eligibility for a specific category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, category } = body;
    
    // Validate required fields
    if (!address || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate category
    const validCategory = nftCategories.find(c => c.category === category);
    if (!validCategory) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    // Mock verification - in production: verify on-chain
    const isEligible = Math.random() > 0.5;
    
    return NextResponse.json({
      address,
      category,
      isEligible,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error verifying eligibility:', error);
    return NextResponse.json({ error: 'Failed to verify eligibility' }, { status: 500 });
  }
}
