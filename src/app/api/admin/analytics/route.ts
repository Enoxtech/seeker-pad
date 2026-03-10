import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  
  // Get stats
  let stats = {
    totalUsers: 12458,
    activeLaunches: 8,
    totalRaised: 2400000,
    pendingKYC: 45,
    changes: { users: 12, launches: 2, raised: 24, kyc: -8 }
  };
  
  let recentActivity = [
    { user: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', action: 'Participated', launch: 'Project Alpha', time: '2 min ago', amount: '$500' },
    { user: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', action: 'KYC Submitted', launch: '-', time: '5 min ago', amount: '-' },
    { user: '3mBnK9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXL', action: 'Claimed Tokens', launch: 'Project Beta', time: '10 min ago', amount: '$1,200' },
  ];
  
  let launches = [
    { name: 'Project Alpha', status: 'Active', participants: 458, raised: '$850,000', ends: '2 days' },
    { name: 'Project Beta', status: 'Completed', participants: 892, raised: '$1.2M', ends: 'Ended' },
    { name: 'Project Gamma', status: 'Upcoming', participants: 0, raised: '$0', ends: '5 days' },
  ];
  
  if (supabase) {
    // Get real data from database
    const [usersRes, launchesRes, transactionsRes]: any = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('launches').select('*').in('status', ['active', 'live']),
      supabase.from('transactions').select('*')
    ]);
    
    if (usersRes.count) stats.totalUsers = usersRes.count;
    if (launchesRes.data) stats.activeLaunches = launchesRes.data.length;
    if (transactionsRes.data) {
      stats.totalRaised = transactionsRes.data.reduce((sum: number, t: any) => sum + Number(t.amount_sol || 0), 0);
    }
  }
  
  return NextResponse.json({ stats, recentActivity, launches });
}
