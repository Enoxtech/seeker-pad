import { NextResponse } from 'next/server';

// Mock data for development
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
    description: 'Bonkify is revolutionizing mobile crypto trading...',
    logoUrl: '',
    websiteUrl: 'https://bonkify.io',
    twitterUrl: 'https://twitter.com/bonkify',
    telegramUrl: 'https://t.me/bonkify',
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
    description: 'Experience the future of blockchain...',
    logoUrl: '',
    websiteUrl: 'https://saga.com',
    twitterUrl: 'https://twitter.com/saga',
    telegramUrl: 'https://t.me/saga',
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

// Get all launches
export async function GET() {
  try {
    // For now, return mock data
    // In production, this would query Supabase
    return NextResponse.json(mockLaunches);
  } catch (error) {
    console.error('Error fetching launches:', error);
    return NextResponse.json({ error: 'Failed to fetch launches' }, { status: 500 });
  }
}

// Create new launch (admin only in production)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, symbol, totalSupply, launchPrice, startTime, endTime } = body;
    if (!name || !symbol || !totalSupply || !launchPrice || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // In production: Insert into Supabase
    const newLaunch = {
      id: Date.now().toString(),
      ...body,
      status: 'upcoming',
      totalRaised: 0,
      participantsCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(newLaunch, { status: 201 });
  } catch (error) {
    console.error('Error creating launch:', error);
    return NextResponse.json({ error: 'Failed to create launch' }, { status: 500 });
  }
}
