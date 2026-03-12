import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get user's participations
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
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