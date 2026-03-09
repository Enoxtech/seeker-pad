import { NextResponse } from 'next/server';

// Mock data
const mockLaunches = [
  {
    id: '1',
    name: 'Bonkify',
    symbol: 'BKFY',
    description: 'Mobile-first meme coin trading platform',
    type: 'elite',
    status: 'live',
    totalSupply: 5000000000,
    launchPrice: 0.001,
    raiseTarget: 2000000,
    totalRaised: 1560000,
    startTime: new Date('2025-03-25T14:00:00Z'),
    endTime: new Date('2025-03-25T20:00:00Z'),
    minAllocation: 0.1,
    maxAllocation: 5,
  },
  {
    id: '2',
    name: 'SolanaSaga Phone',
    symbol: 'SAGA',
    description: 'The next generation blockchain phone',
    type: 'standard',
    status: 'upcoming',
    totalSupply: 1000000000,
    launchPrice: 0.005,
    raiseTarget: 5000000,
    totalRaised: 0,
    startTime: new Date('2025-04-01T14:00:00Z'),
    endTime: new Date('2025-04-07T20:00:00Z'),
    minAllocation: 1,
    maxAllocation: 50,
  },
  {
    id: '3',
    name: 'SeekerX',
    symbol: 'SKRX',
    description: 'DeFi suite built for the Seeker ecosystem',
    type: 'elite',
    status: 'ended',
    totalSupply: 100000000,
    launchPrice: 0.01,
    raiseTarget: 1000000,
    totalRaised: 1000000,
    startTime: new Date('2025-03-20T14:00:00Z'),
    endTime: new Date('2025-03-22T20:00:00Z'),
    minAllocation: 0.5,
    maxAllocation: 10,
  }
];

// Get single launch by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const launch = mockLaunches.find(l => l.id === id);
    
    if (!launch) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 });
    }
    
    return NextResponse.json(launch);
  } catch (error) {
    console.error('Error fetching launch:', error);
    return NextResponse.json({ error: 'Failed to fetch launch' }, { status: 500 });
  }
}

// Update launch status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    // Validate status
    if (!['upcoming', 'live', 'ended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    // In production: Update Supabase
    // await supabase.from('launches').update({ status }).eq('id', id);
    
    return NextResponse.json({ id, status, message: 'Launch status updated' });
  } catch (error) {
    console.error('Error updating launch:', error);
    return NextResponse.json({ error: 'Failed to update launch' }, { status: 500 });
  }
}
