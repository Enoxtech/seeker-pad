import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('launches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching launches:', error);
    return NextResponse.json({ error: 'Failed to fetch launches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('launches')
      .insert([{
        name: body.name,
        symbol: body.symbol,
        description: body.description,
        type: body.type || 'standard',
        status: 'upcoming',
        total_supply: body.totalSupply,
        launch_price: body.launchPrice,
        raise_target: body.raiseTarget,
        website: body.website,
        twitter: body.twitter,
        telegram: body.telegram,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating launch:', error);
    return NextResponse.json({ error: 'Failed to create launch' }, { status: 500 });
  }
}
