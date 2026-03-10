import { NextResponse } from 'next/server';

const mockLaunches = [
  {
    id: '1',
    name: 'Solana Meme Lords',
    symbol: 'SML',
    type: 'standard',
    status: 'live',
    description: 'The ultimate meme token for the Solana ecosystem',
    total_supply: 1000000000,
    launch_price: 0.0001,
    raise_target: 50000,
    total_raised: 42350,
    participants_count: 156,
    start_time: '2026-03-08T12:00:00Z',
    end_time: '2026-03-15T12:00:00Z',
    website: 'https://solanamemelords.com',
    twitter: 'https://twitter.com/sml',
    telegram: 'https://t.me/sml'
  },
  {
    id: '2',
    name: 'Bonkify',
    symbol: 'BONK',
    type: 'standard',
    status: 'live',
    description: 'Play to earn gaming token on Solana',
    total_supply: 500000000,
    launch_price: 0.0002,
    raise_target: 75000,
    total_raised: 68200,
    participants_count: 234,
    start_time: '2026-03-05T10:00:00Z',
    end_time: '2026-03-12T10:00:00Z',
    website: 'https://bonkify.io',
    twitter: 'https://twitter.com/bonkify',
    telegram: 'https://t.me/bonkify'
  },
  {
    id: '3',
    name: 'SeedVault Elite',
    symbol: 'SEED',
    type: 'elite',
    status: 'upcoming',
    description: 'Exclusive seed-round access for elite investors',
    total_supply: 100000000,
    launch_price: 0.005,
    raise_target: 200000,
    total_raised: 0,
    participants_count: 0,
    start_time: '2026-03-20T00:00:00Z',
    end_time: '2026-03-27T00:00:00Z',
    website: 'https://seedvault.io',
    twitter: 'https://twitter.com/seedvault',
    telegram: 'https://t.me/seedvault'
  },
  {
    id: '4',
    name: 'Pixel Wars',
    symbol: 'PXW',
    type: 'standard',
    status: 'ended',
    description: 'NFT gaming token with play-to-earn mechanics',
    total_supply: 250000000,
    launch_price: 0.00015,
    raise_target: 60000,
    total_raised: 58900,
    participants_count: 412,
    start_time: '2026-02-01T12:00:00Z',
    end_time: '2026-02-08T12:00:00Z',
    website: 'https://pixelwars.game',
    twitter: 'https://twitter.com/pixelwars',
    telegram: 'https://t.me/pixelwars'
  },
  {
    id: '5',
    name: 'DeFi Masters',
    symbol: 'DFM',
    type: 'elite',
    status: 'ended',
    description: 'Premium DeFi protocol access token',
    total_supply: 50000000,
    launch_price: 0.01,
    raise_target: 500000,
    total_raised: 489000,
    participants_count: 89,
    start_time: '2026-01-15T00:00:00Z',
    end_time: '2026-01-22T00:00:00Z',
    website: 'https://defimasters.io',
    twitter: 'https://twitter.com/dfm',
    telegram: 'https://t.me/dfm'
  },
];

export async function GET() {
  return NextResponse.json(mockLaunches);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    id: Date.now().toString(),
    name: body.name,
    symbol: body.symbol,
    type: body.type || 'standard',
    status: 'upcoming',
    created_at: new Date().toISOString()
  });
}
