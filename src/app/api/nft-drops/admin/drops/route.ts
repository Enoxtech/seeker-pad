import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== Admin Routes ====================

// Create NFT Drop - POST /api/nft-drops/admin/drops
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, description, image_url, contract_address, candy_machine_id,
      start_date, end_date, supply_limit, mint_price, is_active
    } = body;

    const { data: drop, error } = await supabase
      .from('nft_drops')
      .insert({
        name,
        description,
        image_url,
        contract_address,
        candy_machine_id,
        start_date: start_date || null,
        end_date: end_date || null,
        supply_limit: supply_limit || 0,
        mint_price: mint_price || 0,
        is_active: is_active ?? true
      })
      .select()
      .single();

    if (error) throw error;

    // Create default eligibility criteria
    const { error: criteriaError } = await supabase
      .from('nft_eligibility_criteria')
      .insert({
        drop_id: drop.id,
        require_app_download: true,
        require_onchain_trade: true,
        require_skr_tokens: true,
        min_skr_amount: 1
      });

    if (criteriaError) throw criteriaError;

    return NextResponse.json(drop, { status: 201 });
  } catch (error) {
    console.error('Error creating NFT drop:', error);
    return NextResponse.json({ error: 'Failed to create NFT drop' }, { status: 500 });
  }
}

// Get all NFT Drops (admin) - GET /api/nft-drops/admin/drops
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    if (admin) {
      // Admin view - get all drops with criteria
      const { data: drops, error } = await supabase
        .from('nft_drops')
        .select(`
          *,
          nft_eligibility_criteria (
            require_app_download,
            require_onchain_trade,
            require_skr_tokens,
            min_skr_amount
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Flatten the response
      const formatted = drops?.map(drop => ({
        ...drop,
        require_app_download: drop.nft_eligibility_criteria?.[0]?.require_app_download ?? true,
        require_onchain_trade: drop.nft_eligibility_criteria?.[0]?.require_onchain_trade ?? true,
        require_skr_tokens: drop.nft_eligibility_criteria?.[0]?.require_skr_tokens ?? true,
        min_skr_amount: drop.nft_eligibility_criteria?.[0]?.min_skr_amount ?? 1
      })) || [];

      return NextResponse.json(formatted);
    }

    // Public view - get active drops only
    const now = new Date().toISOString();
    const { data: drops, error } = await supabase
      .from('nft_drops')
      .select(`
        *,
        nft_eligibility_criteria (
          require_app_download,
          require_onchain_trade,
          require_skr_tokens,
          min_skr_amount
        )
      `)
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(drops || []);
  } catch (error) {
    console.error('Error fetching NFT drops:', error);
    return NextResponse.json({ error: 'Failed to fetch NFT drops' }, { status: 500 });
  }
}