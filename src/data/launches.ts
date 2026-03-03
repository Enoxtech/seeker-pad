import { Launch, Participation, SeekerPadNFT, EligibilityStatus } from '@/types';

// Mock data store
// In production, these would be API calls

export async function getLaunches(): Promise<Launch[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLaunches;
}

export async function getLaunchById(id: string): Promise<Launch | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockLaunches.find((l) => l.id === id);
}

export async function getEliteLaunches(): Promise<Launch[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLaunches.filter((l) => l.type === 'elite');
}

export async function getLiveLaunches(): Promise<Launch[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLaunches.filter((l) => l.status === 'live');
}

export async function getUserParticipations(address: string): Promise<Participation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockParticipations;
}

export async function checkEligibility(address: string): Promise<EligibilityStatus> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    isEligible: true,
    hasNFT: false,
    nftCount: 0,
    categories: [
      { category: 'saga-genesis', isEligible: false },
      { category: 'seeker-pioneer', isEligible: true },
      { category: 'jupiter-aligned', isEligible: false },
      { category: 'bonk-community', isEligible: false },
      { category: 'meteora-lp', isEligible: false },
    ],
  };
}

export async function getUserNFTs(address: string): Promise<SeekerPadNFT[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockNFTs;
}

const mockLaunches: Launch[] = [
  {
    id: '1',
    name: 'Solana Mobile dApp Store',
    symbol: 'MDA',
    description: 'The official dApp store for Solana Mobile devices. Discover and install native mobile dApps directly on your Seeker or Saga device.',
    tokenomics: {
      totalSupply: 1000000000,
      initialLiquidity: 15,
      liquidityPercent: 15,
      marketingPercent: 5,
      teamPercent: 10,
      communityPercent: 70,
      pricePerToken: 0.05,
      raiseTarget: 5000000,
    },
    timeline: {
      startTime: new Date('2025-04-01T12:00:00Z'),
      endTime: new Date('2025-04-01T18:00:00Z'),
      tgeDate: new Date('2025-04-15T12:00:00Z'),
      vestingStart: new Date('2025-04-15T12:00:00Z'),
      vestingDuration: 12,
      vestingCliff: 3,
    },
    status: 'upcoming',
    type: 'standard',
    website: 'https://solana.com/mobile',
    twitter: '@solanamobile',
  },
  {
    id: '2',
    name: 'Bonkify',
    symbol: 'BKFY',
    description: 'Mobile-first meme coin trading platform built specifically for Seeker and Saga users.',
    tokenomics: {
      totalSupply: 5000000000,
      initialLiquidity: 10,
      liquidityPercent: 12,
      marketingPercent: 8,
      teamPercent: 5,
      communityPercent: 75,
      pricePerToken: 0.001,
      raiseTarget: 2000000,
    },
    timeline: {
      startTime: new Date('2025-03-25T14:00:00Z'),
      endTime: new Date('2025-03-25T20:00:00Z'),
      tgeDate: new Date('2025-04-05T12:00:00Z'),
      vestingStart: new Date('2025-04-05T12:00:00Z'),
      vestingDuration: 6,
      vestingCliff: 1,
    },
    status: 'live',
    type: 'elite',
    website: 'https://bonkify.app',
    twitter: '@bonkify',
  },
  {
    id: '3',
    name: 'SeedVault Wallet',
    symbol: 'SVW',
    description: 'Hardware-grade mobile wallet with Seed Vault integration for Solana mobile devices.',
    tokenomics: {
      totalSupply: 500000000,
      initialLiquidity: 20,
      liquidityPercent: 20,
      marketingPercent: 5,
      teamPercent: 15,
      communityPercent: 60,
      pricePerToken: 0.10,
      raiseTarget: 8000000,
    },
    timeline: {
      startTime: new Date('2025-03-10T12:00:00Z'),
      endTime: new Date('2025-03-10T18:00:00Z'),
      tgeDate: new Date('2025-03-20T12:00:00Z'),
      vestingStart: new Date('2025-03-20T12:00:00Z'),
      vestingDuration: 9,
      vestingCliff: 3,
    },
    status: 'ended',
    type: 'standard',
    website: 'https://seedvault.io',
    twitter: '@seedvault',
  },
];

const mockParticipations: Participation[] = [
  {
    id: 'p1',
    launchId: '3',
    userAddress: '',
    amount: 2.5,
    tokenAmount: 25000,
    status: 'claimed',
    claimableAmount: 0,
    claimedAmount: 25000,
  },
];

const mockNFTs: SeekerPadNFT[] = [
  {
    id: 'nft1',
    category: 'seeker-pioneer',
    mintDate: new Date('2025-01-15'),
    metadataUrl: 'https://arweave.net/example',
  },
];
