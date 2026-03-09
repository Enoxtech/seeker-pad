import { NextResponse } from 'next/server';

// Get wallet balance
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    // Validate address
    if (!address || address.length < 32) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }
    
    // Mock balance - in production: Query Solana blockchain
    const balance = Math.random() * 10; // Random SOL balance for demo
    
    return NextResponse.json({
      address,
      balance: balance.toFixed(4),
      symbol: 'SOL',
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
