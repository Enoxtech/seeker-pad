import { Launch, Participation, SeekerPadNFT, EligibilityStatus } from '@/types';
import { launchesApi, participationApi, eligibilityApi, nftApi } from './api';

// Use API by default, fallback to mock if not available
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Mock data store (fallback)
const mockLaunches: Launch[] = [
  {
    id: '1',
    name: 'Bonkify',
    symbol: 'BKFY',
    description: 'Mobile-first meme coin trading platform built specifically for Seeker and Saga users.',
    status: 'live',
    type: 'elite',
    launchPrice: 0.001,
    hardCap: 2000000,
    totalRaised: 1560000,
    startTime: new Date('2026-03-12T14:00:00Z'),
    endTime: new Date('2026-03-18T20:00:00Z'),
    participants: 1250,
  },
  {
    id: '2',
    name: 'SolanaSaga Phone',
    symbol: 'SAGA',
    description: 'The next generation blockchain phone.',
    status: 'upcoming',
    type: 'standard',
    launchPrice: 0.005,
    hardCap: 5000000,
    totalRaised: 0,
    startTime: new Date('2026-03-20T14:00:00Z'),
    endTime: new Date('2026-03-27T20:00:00Z'),
    participants: 0,
  },
  {
    id: '3',
    name: 'SeekerX',
    symbol: 'SKRX',
    description: 'DeFi suite built for the Seeker ecosystem.',
    status: 'ended',
    type: 'elite',
    launchPrice: 0.01,
    hardCap: 1000000,
    totalRaised: 1000000,
    startTime: new Date('2026-03-01T14:00:00Z'),
    endTime: new Date('2026-03-05T20:00:00Z'),
    participants: 3420,
  },
  {
    id: '4',
    name: 'MobileDeFi',
    symbol: 'MDFI',
    description: 'Decentralized finance platform optimized for mobile blockchain users.',
    status: 'upcoming',
    type: 'elite',
    launchPrice: 0.002,
    hardCap: 3000000,
    totalRaised: 0,
    startTime: new Date('2026-03-25T14:00:00Z'),
    endTime: new Date('2026-04-01T20:00:00Z'),
    participants: 0,
  },
  {
    id: '5',
    name: 'SagaPay',
    symbol: 'SPY',
    description: 'Payment solution for the Saga ecosystem with instant swaps.',
    status: 'live',
    type: 'standard',
    launchPrice: 0.0008,
    hardCap: 1500000,
    totalRaised: 890000,
    startTime: new Date('2026-03-10T14:00:00Z'),
    endTime: new Date('2026-03-15T20:00:00Z'),
    participants: 890,
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
    eliteAccess: true,
    metadataUrl: '',
  },
];

// API-based functions
export async function getLaunches(): Promise<Launch[]> {
  if (USE_API) {
    try {
      const launches = await launchesApi.getAll();
      return launches.map(transformLaunchFromApi);
    } catch (error) {
      console.warn('Failed to fetch from API, using mock data:', error);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLaunches;
}

export async function getLaunchById(id: string): Promise<Launch | undefined> {
  if (USE_API) {
    try {
      const launch = await launchesApi.getById(id);
      return transformLaunchFromApi(launch);
    } catch (error) {
      console.warn('Failed to fetch from API, using mock data:', error);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockLaunches.find((l) => l.id === id);
}

export async function getEliteLaunches(): Promise<Launch[]> {
  const launches = await getLaunches();
  return launches.filter((l) => l.type === 'elite');
}

export async function getLiveLaunches(): Promise<Launch[]> {
  const launches = await getLaunches();
  return launches.filter((l) => l.status === 'live');
}

export async function getUserParticipations(address: string): Promise<Participation[]> {
  if (!address) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockParticipations;
  }
  
  if (USE_API) {
    try {
      const participations = await participationApi.getUserParticipations(address);
      return participations.map(transformParticipationFromApi);
    } catch (error) {
      console.warn('Failed to fetch participations from API:', error);
    }
  }
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockParticipations;
}

export async function getUserParticipation(address: string, launchId: string): Promise<Participation | null> {
  if (!address) return null;
  
  if (USE_API) {
    try {
      const participation = await participationApi.getUserParticipation(address, launchId);
      return participation ? transformParticipationFromApi(participation) : null;
    } catch (error) {
      console.warn('Failed to fetch participation from API:', error);
    }
  }
  
  return mockParticipations.find(p => p.launchId === launchId) || null;
}

export async function createParticipation(data: {
  launchId: string;
  userAddress: string;
  amountSol: number;
  txSignature: string;
}): Promise<Participation> {
  if (USE_API) {
    try {
      const participation = await participationApi.create({
        launch_id: data.launchId,
        user_address: data.userAddress,
        amount_sol: data.amountSol,
        tx_signature: data.txSignature,
      });
      return transformParticipationFromApi(participation);
    } catch (error) {
      console.error('Failed to create participation:', error);
      throw error;
    }
  }
  
  // Mock response
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: `p_${Date.now()}`,
    launchId: data.launchId,
    userAddress: data.userAddress,
    amount: data.amountSol,
    tokenAmount: data.amountSol * 1000,
    status: 'pending',
    claimableAmount: data.amountSol * 1000,
    claimedAmount: 0,
  };
}

export async function claimTokens(participationId: string, txSignature: string): Promise<Participation> {
  if (USE_API) {
    try {
      const participation = await participationApi.claim(participationId, txSignature);
      return transformParticipationFromApi(participation);
    } catch (error) {
      console.error('Failed to claim tokens:', error);
      throw error;
    }
  }
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: participationId,
    status: 'claimed',
  };
}

// Eligibility
export async function checkEligibility(address: string): Promise<EligibilityStatus> {
  if (!address) {
    return {
      isEligible: false,
      hasNFT: false,
      nftCount: 0,
      categories: [],
    };
  }
  
  if (USE_API) {
    try {
      const eligibility = await eligibilityApi.check(address);
      return eligibility;
    } catch (error) {
      console.warn('Failed to check eligibility from API:', error);
    }
  }
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    isEligible: true,
    hasNFT: true,
    nftCount: 1,
    categories: [
      { category: 'seeker-pioneer', isEligible: true },
      { category: 'jupiter-aligned', isEligible: false },
    ],
  };
}

// NFTs
export async function getUserNFTs(address: string): Promise<SeekerPadNFT[]> {
  if (!address) return [];
  
  if (USE_API) {
    try {
      const nfts = await nftApi.getUserNFTs(address);
      return nfts.map(transformNFTFromApi);
    } catch (error) {
      console.warn('Failed to fetch NFTs from API:', error);
    }
  }
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockNFTs;
}

// Transform functions to match frontend types
function transformLaunchFromApi(apiLaunch: any): Launch {
  return {
    id: apiLaunch.id,
    name: apiLaunch.name,
    symbol: apiLaunch.symbol,
    description: apiLaunch.description,
    status: apiLaunch.status,
    type: apiLaunch.type,
    launchPrice: parseFloat(apiLaunch.launch_price),
    hardCap: parseInt(apiLaunch.raise_target),
    totalRaised: parseInt(apiLaunch.total_raised) || 0,
    startTime: new Date(apiLaunch.start_time),
    endTime: new Date(apiLaunch.end_time),
    participants: apiLaunch.participants_count || 0,
  };
}

function transformParticipationFromApi(apiParticipation: any): Participation {
  return {
    id: apiParticipation.id,
    launchId: apiParticipation.launch_id,
    userAddress: apiParticipation.user_address,
    amount: parseFloat(apiParticipation.amount_sol),
    tokenAmount: parseInt(apiParticipation.tokens_received),
    status: apiParticipation.status,
    claimableAmount: parseInt(apiParticipation.claimable_amount) || 0,
    claimedAmount: parseInt(apiParticipation.claimed_amount) || 0,
  };
}

function transformNFTFromApi(apiNFT: any): SeekerPadNFT {
  return {
    id: apiNFT.id,
    mintAddress: apiNFT.mint_address,
    ownerAddress: apiNFT.owner_address,
    category: apiNFT.category,
    mintDate: new Date(apiNFT.mint_date),
    eliteAccess: true,
    metadataUrl: apiNFT.metadata_url,
  };
}
