import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase only if env vars exist
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Mock participations for when Supabase is not configured
const mockParticipations = [
  {
    id: '1',
    launch_id: '1',
    user_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    amount_sol: 5,
    tokens_received: 100,
    status: 'claimed',
    claimed_amount: 100,
    tx_signature: 'mock_sig_1',
    created_at: '2026-03-10T14:00:00Z'
  },
  {
    id: '2',
    launch_id: '1',
    user_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    amount_sol: 10,
    tokens_received: 200,
    status: 'pending',
    claimed_amount: 0,
    tx_signature: 'mock_sig_2',
    created_at: '2026-03-12T10:30:00Z'
  }
];

// Get user's participations
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    // If Supabase is not configured, return mock data
    if (!supabase) {
      console.log('Supabase not configured, returning mock participations');
      const userParticipations = mockParticipations.filter(p => p.user_address === address);
      return NextResponse.json(userParticipations);
    }
    
    const { data, error } = await supabase
      .from('participations')
      .select('*')
      .eq('user_address', address)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
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
    
    // If Supabase is not configured, return mock success response
    if (!supabase) {
      const mockResponse = {
        id: Date.now().toString(),
        launch_id: launchId,
        user_address: userAddress,
        amount_sol: amountSol,
        tokens_received: Math.floor(amountSol / 0.05), // Mock price
        status: 'pending',
        claimed_amount: 0,
        tx_signature: txSignature,
        created_at: new Date().toISOString(),
      };
      console.log('Supabase not configured, returning mock participation response');
      return NextResponse.json(mockResponse, { status: 201 });
    }
    
    // Get launch price to calculate tokens
    const { data: launch, error: launchError } = await supabase
      .from('launches')
      .select('launch_price')
      .eq('id', launchId)
      .single();
    
    if (launchError || !launch) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 });
    }
    
    // Calculate tokens received
    const tokensReceived = Math.floor(amountSol / launch.launch_price);
    
    const { data, error } = await supabase
      .from('participations')
      .insert([{
        launch_id: launchId,
        user_address: userAddress,
        amount_sol: amountSol,
        tokens_received: tokensReceived,
        status: 'pending',
        claimed_amount: 0,
        tx_signature: txSignature,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update total raised in launch
    try {
      await supabase.rpc('increment_raised', { 
        launch_id_param: launchId, 
        amount_param: amountSol 
      });
    } catch (rpcError) {
      // Fallback: direct update if RPC doesn't exist
      const { data: launch } = await supabase
        .from('launches')
        .select('total_raised')
        .eq('id', launchId)
        .single();
      
      if (launch) {
        await supabase
          .from('launches')
          .update({ total_raised: launch.total_raised + amountSol })
          .eq('id', launchId);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating participation:', error);
    return NextResponse.json({ error: 'Failed to create participation' }, { status: 500 });
  }
}