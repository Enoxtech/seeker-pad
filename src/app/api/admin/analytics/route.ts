import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    totalUsers: 12458,
    activeLaunches: 8,
    totalRaised: 2456780,
    pendingKYC: 23,
    changes: { users: 12, launches: 2, raised: 8, kyc: -5 },
    chartData: {
      revenue: [
        { month: 'Oct', value: 450000 },
        { month: 'Nov', value: 680000 },
        { month: 'Dec', value: 920000 },
        { month: 'Jan', value: 1250000 },
        { month: 'Feb', value: 1890000 },
        { month: 'Mar', value: 2456780 },
      ],
      users: [
        { month: 'Oct', value: 1200 },
        { month: 'Nov', value: 2400 },
        { month: 'Dec', value: 4100 },
        { month: 'Jan', value: 6800 },
        { month: 'Feb', value: 9200 },
        { month: 'Mar', value: 12458 },
      ],
      launches: [
        { month: 'Oct', value: 2 },
        { month: 'Nov', value: 3 },
        { month: 'Dec', value: 4 },
        { month: 'Jan', value: 5 },
        { month: 'Feb', value: 7 },
        { month: 'Mar', value: 8 },
      ],
    }
  };
  
  const recentActivity = [
    { id: '1', user: '7xKXtg2CW...', action: 'Participated', launch: 'Solana Meme Lords', time: '2 min ago', amount: '2.5 SOL' },
    { id: '2', user: '9aZKTtbD...', action: 'Claimed', launch: 'Pixel Wars', time: '15 min ago', amount: '125,000 PXW' },
    { id: '3', user: '3mBnK9hL...', action: 'KYC Verified', launch: '-', time: '32 min ago', amount: '-' },
    { id: '4', user: '5nCpLQ9h...', action: 'Registered', launch: '-', time: '45 min ago', amount: '-' },
    { id: '5', user: '8dEfG0iM...', action: 'Participated', launch: 'Bonkify', time: '1 hour ago', amount: '10 SOL' },
  ];
  
  const launches = [
    { name: 'Solana Meme Lords', status: 'Live', participants: 156, raised: '$42,350', ends: '3 days' },
    { name: 'Bonkify', status: 'Live', participants: 234, raised: '$68,200', ends: '1 day' },
    { name: 'SeedVault Elite', status: 'Upcoming', participants: 0, raised: '$0', ends: '8 days' },
    { name: 'Pixel Wars', status: 'Ended', participants: 412, raised: '$58,900', ends: 'Ended' },
  ];
  
  return NextResponse.json({ stats, recentActivity, launches });
}
