import { NextResponse } from 'next/server';

// Mock participations storage
const mockParticipations: any[] = [];

// Get user's participations
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    // Filter mock data for this user
    const userParticipations = mockParticipations.filter(p => p.userAddress === address);
    
    return NextResponse.json(userParticipations);
  } catch (error) {
    console.error('Error fetching participations:', error);
    return NextResponse.json({ error: 'Failed to fetch participations' }, { status: 500 });
  }
}

// Create new participation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { launchId, userAddress, amountSol, txSignature } = body;
    
    // Validate required fields
    if (!launchId || !userAddress || !amountSol || !txSignature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate amount
    if (amountSol <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Calculate tokens received (simplified)
    const tokensReceived = Math.floor(amountSol * 1000); // 1 SOL = 1000 tokens
    
    const newParticipation = {
      id: Date.now().toString(),
      launchId,
      userAddress,
      amountSol,
      tokensReceived,
      status: 'pending',
      claimedAmount: 0,
      txSignature,
      createdAt: new Date().toISOString(),
    };
    
    // Store in mock (in production: Supabase)
    mockParticipations.push(newParticipation);
    
    return NextResponse.json(newParticipation, { status: 201 });
  } catch (error) {
    console.error('Error creating participation:', error);
    return NextResponse.json({ error: 'Failed to create participation' }, { status: 500 });
  }
}
