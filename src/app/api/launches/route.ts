import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all launches
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('launches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
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
    const { name, symbol, total_supply, launch_price, start_time, end_time } = body;
    if (!name || !symbol || !total_supply || !launch_price || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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