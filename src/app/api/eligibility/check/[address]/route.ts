import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// NFT categories with eligibility criteria
const nftCategories = [
  { category: 'saga-genesis', name: 'Saga Genesis', threshold: 1 },
  { category: 'seeker-pioneer', name: 'Seeker Pioneer', threshold: 1 },
  { category: 'jupiter-aligned', name: 'Jupiter Aligned', threshold: 10000 },
  { category: 'bonk-community', name: 'Bonk Community', threshold: 1000000 },
  { category: 'meteora-lp', name: 'Meteora LP', threshold: 1000 },
];

// Get eligibility status for an address
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    // Validate address format
    if (!address || address.length < 32 || address.length > 44) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }
    
    // Query user's NFTs from database
    const { data: userNfts, error: nftError } = await supabase
      .from('user_nfts')
      .select('category, quantity')
      .eq('owner_address', address);
    
    if (nftError) {
      console.error('Error fetching NFTs:', nftError);
      // Continue with categories even if NFT fetch fails
    }
    
    // Build category eligibility based on actual holdings
    const categories = nftCategories.map(cat => {
      const userNft = userNfts?.find(n => n.category === cat.category);
      const balance = userNft?.quantity || 0;
      
      return {
        category: cat.category,
        name: cat.name,
        isEligible: balance >= cat.threshold,
        balance,
        threshold: cat.threshold,
      };
    });
    
    // Also check eligibility_verification table
    const { data: verification } = await supabase
      .from('eligibility_verification')
      .select('*')
      .eq('user_address', address)
      .eq('verified', true)
      .single();
    
    const isEligible = categories.some(c => c.isEligible) || !!verification;
    const nftCount = categories.filter(c => c.isEligible).length;
    
    return NextResponse.json({
      isEligible,
      categories,
      hasNFT: nftCount > 0,
      nftCount,
      verified: !!verification,
      verifiedAt: verification?.verified_at || null,
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 });
  }
}

// Verify eligibility for a specific category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, category } = body;
    
    // Validate required fields
    if (!address || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate category
    const validCategory = nftCategories.find(c => c.category === category);
    if (!validCategory) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    // Check actual holding in database
    const { data: userNft } = await supabase
      .from('user_nfts')
      .select('quantity')
      .eq('owner_address', address)
      .eq('category', category)
      .single();
    
    const balance = userNft?.quantity || 0;
    const isEligible = balance >= validCategory.threshold;
    
    // Record verification in database
    if (isEligible) {
      await supabase
        .from('eligibility_verification')
        .upsert([{
          user_address: address,
          category,
          verified: true,
          verified_at: new Date().toISOString(),
        }], { onConflict: 'user_address,category' });
    }
    
    return NextResponse.json({
      address,
      category,
      isEligible,
      balance,
      threshold: validCategory.threshold,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error verifying eligibility:', error);
    return NextResponse.json({ error: 'Failed to verify eligibility' }, { status: 500 });
  }
}