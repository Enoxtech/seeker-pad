import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// PUT /api/nft-drops/admin/drops/[id]/eligibility
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id } = params;
    const { 
      require_app_download, require_onchain_trade, require_skr_tokens, min_skr_amount 
    } = body;

    // First get the criteria ID for this drop
    const { data: existing } = await supabase
      .from('nft_eligibility_criteria')
      .select('id')
      .eq('drop_id', id)
      .single();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('nft_eligibility_criteria')
        .update({
          ...(require_app_download !== undefined && { require_app_download }),
          ...(require_onchain_trade !== undefined && { require_onchain_trade }),
          ...(require_skr_tokens !== undefined && { require_skr_tokens }),
          ...(min_skr_amount !== undefined && { min_skr_amount })
        })
        .eq('drop_id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('nft_eligibility_criteria')
        .insert({
          drop_id: id,
          require_app_download: require_app_download ?? true,
          require_onchain_trade: require_onchain_trade ?? true,
          require_skr_tokens: require_skr_tokens ?? true,
          min_skr_amount: min_skr_amount ?? 1
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating eligibility criteria:', error);
    return NextResponse.json({ error: 'Failed to update eligibility criteria' }, { status: 500 });
  }
}