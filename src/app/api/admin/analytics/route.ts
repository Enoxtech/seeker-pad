import { NextResponse } from 'next/server';

export async function GET() {
  // Return mock data - Supabase types not available during build
  const stats = {
    totalUsers: 12458,
    activeLaunches: 8,
    totalRaised: 2400000,
    pendingKYC: 45,
    changes: { users: 12, launches: 2, raised: 24, kyc: -8 }
  };
  
  const recentActivity = [
    { user: '7xKXtg2CW...', action: 'Participated', launch: 'Project Alpha', time: '2 min ago', amount: '$500' },
    { user: '9aZKTtbD...', action: 'KYC Submitted', launch: '-', time: '5 min ago', amount: '-' },
    { user: '3mBnK9hL...', action: 'Claimed Tokens', launch: 'Project Beta', time: '10 min ago', amount: '$1,200' },
  ];
  
  const launches = [
    { name: 'Project Alpha', status: 'Active', participants: 458, raised: '$850,000', ends: '2 days' },
    { name: 'Project Beta', status: 'Completed', participants: 892, raised: '$1.2M', ends: 'Ended' },
    { name: 'Project Gamma', status: 'Upcoming', participants: 0, raised: '$0', ends: '5 days' },
  ];
  
  return NextResponse.json({ stats, recentActivity, launches });
}
