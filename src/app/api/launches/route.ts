import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase only if env vars exist
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Mock data for when Supabase is not configured
const mockLaunches = [
  {
    id: '1',
    name: 'Solana Mobile',
    symbol: 'MBILE',
    description: 'The first mobile-native crypto ecosystem',
    logo_url: '/logos/solana-mobile.png',
    website_url: 'https://solanamobile.com',
    twitter_url: 'https://twitter.com/solanamobile',
    telegram_url: 'https://t.me/solanamobile',
    type: 'token',
    status: 'live',
    total_supply: 1000000000,
    launch_price: 0.05,
    raise_target: 500000,
    total_raised: 325000,
    min_allocation: 50,
    max_allocation: 5000,
    start_time: '2026-03-10T12:00:00Z',
    end_time: '2026-03-20T12:00:00Z',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Raydium',
    symbol: 'RAY',
    description: 'Automated market maker on Solana',
    logo_url: '/logos/raydium.png',
    website_url: 'https://raydium.io',
    twitter_url: 'https://twitter.com/RaydiumProtocol',
    type: 'token',
    status: 'upcoming',
    total_supply: 555000000,
    launch_price: 0.75,
    raise_target: 1000000,
    total_raised: 0,
    min_allocation: 100,
    max_allocation: 10000,
    start_time: '2026-03-25T12:00:00Z',
    end_time: '2026-04-05T12:00:00Z',
    created_at: '2026-03-05T00:00:00Z'
  },
  {
    id: '3',
    name: 'Star Atlas',
    symbol: 'ATLAS',
    description: 'Multiplayer gaming in the metaverse',
    logo_url: '/logos/star-atlas.png',
    website_url: 'https://staratlas.com',
    twitter_url: 'https://twitter.com/staratlas',
    type: 'token',
    status: 'ended',
    total_supply: 40000000000,
    launch_price: 0.02,
    raise_target: 800000,
    total_raised: 800000,
    min_allocation: 25,
    max_allocation: 2500,
    start_time: '2026-01-15T12:00:00Z',
    end_time: '2026-01-30T12:00:00Z',
    created_at: '2026-01-10T00:00:00Z'
  }
];

// Get all launches
export async function GET() {
  try {
    // If Supabase is not configured, return mock data
    if (!supabase) {
      console.log('Supabase not configured, returning mock launches');
      return NextResponse.json(mockLaunches);
    }

    const { data, error } = await supabase
      .from('launches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to mock data on error
      return NextResponse.json(mockLaunches);
    }

    return NextResponse.json(data || mockLaunches);
  } catch (error) {
    console.error('Error fetching launches:', error);
    // Fallback to mock data on exception
    return NextResponse.json(mockLaunches);
  }
}

// Create new launch (admin only in production)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, symbol, total_supply, launch_price, start_time, end_time } = body;
    if (!name || !symbol || !total_supply || !launch_price || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // If Supabase is not configured, return mock success response
    if (!supabase) {
      const mockResponse = {
        id: Date.now().toString(),
        name,
        symbol,
        description: body.description || '',
        logo_url: body.logo_url || '',
        website_url: body.website_url || '',
        twitter_url: body.twitter_url || '',
        telegram_url: body.telegram_url || '',
        type: body.type || 'standard',
        status: 'upcoming',
        total_supply,
        launch_price,
        raise_target: body.raise_target || null,
        total_raised: 0,
        min_allocation: body.min_allocation || null,
        max_allocation: body.max_allocation || null,
        start_time,
        end_time,
        created_at: new Date().toISOString(),
      };
      console.log('Supabase not configured, returning mock create response');
      return NextResponse.json(mockResponse, { status: 201 });
    }
    
    const { data, error } = await supabase
      .from('launches')
      .insert([{
        name,
        symbol,
        description: body.description || '',
        logo_url: body.logo_url || '',
        website_url: body.website_url || '',
        twitter_url: body.twitter_url || '',
        telegram_url: body.telegram_url || '',
        type: body.type || 'standard',
        status: 'upcoming',
        total_supply,
        launch_price,
        raise_target: body.raise_target || null,
        total_raised: 0,
        min_allocation: body.min_allocation || null,
        max_allocation: body.max_allocation || null,
        start_time,
        end_time,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating launch:', error);
    return NextResponse.json({ error: 'Failed to create launch' }, { status: 500 });
  }
}