// API Client - Mock implementation for frontend
// In production, these would make actual HTTP calls to the backend
import type { EligibilityStatus, Launch, Participation, SeekerPadNFT } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper function for API calls
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Launch API
interface ApiLaunch {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  type?: string;
  status?: string;
  totalSupply?: string;
  launchPrice?: string;
  raiseTarget?: string;
  totalRaised?: string;
  startTime?: string;
  endTime?: string;
}

export const launchesApi = {
  getAll: () => fetchApi<ApiLaunch[]>('/launches'),
  getById: (id: string) => fetchApi<ApiLaunch>(`/launches/${id}`),
  create: (data: any) => fetchApi('/launches', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id: string, status: string) => fetchApi(`/launches/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

// Participation API
interface ApiParticipation {
  id: string;
  launchId: string;
  userAddress: string;
  amountSol: string;
  tokensReceived: string;
  status: string;
}

export const participationApi = {
  getUserParticipations: (address: string) => fetchApi<ApiParticipation[]>(`/participation/user/${address}`),
  getUserParticipation: (address: string, launchId: string) => fetchApi<ApiParticipation>(`/participation/user/${address}/${launchId}`),
  create: (data: any) => fetchApi('/participation', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  claim: (id: string, txSignature: string) => fetchApi(`/participation/${id}/claim`, {
    method: 'POST',
    body: JSON.stringify({ txSignature }),
  }),
  getClaimable: (id: string) => fetchApi(`/participation/${id}/claimable`),
};

// Eligibility API
export const eligibilityApi = {
  check: (address: string) => fetchApi<EligibilityStatus>(`/eligibility/check/${address}`),
  verify: (address: string, category: string) => fetchApi('/eligibility/verify', {
    method: 'POST',
    body: JSON.stringify({ address, category }),
  }),
  getCategories: () => fetchApi('/eligibility/categories'),
};

// NFT API
export const nftApi = {
  getUserNFTs: (address: string) => fetchApi<SeekerPadNFT[]>(`/nft/user/${address}`),
  getCategories: () => fetchApi('/nft/categories'),
  checkEligibility: (address: string) => fetchApi(`/nft/eligibility/${address}`),
};

// Wallet API
export const walletApi = {
  getBalance: (address: string) => fetchApi(`/wallet/balance/${address}`),
  getTransactions: (address: string) => fetchApi(`/wallet/transactions/${address}`),
};

// AI API
export const aiApi = {
  analyze: (launchId: string, projectData: any) => fetchApi('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ launchId, projectData }),
  }),
  chat: (message: string, context?: any) => fetchApi('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  }),
  getRecommendations: (walletAddress: string) => fetchApi(`/ai/recommendations/${walletAddress}`),
};

// Applications API
export const applicationsApi = {
  apply: (data: any) => fetchApi('/applications/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getStatus: (email: string) => fetchApi(`/applications/status/${email}`),
  getAll: (status?: string) => fetchApi(`/applications/admin/all${status ? `?status=${status}` : ''}`),
};

// Whales API
export const whalesApi = {
  getTokenActivity: (mintAddress: string) => fetchApi(`/whales/token/${mintAddress}`),
  getWhalePortfolio: (walletAddress: string) => fetchApi(`/whales/portfolio/${walletAddress}`),
  getLaunchAlerts: (launchId: string) => fetchApi(`/whales/launch/${launchId}/alerts`),
  getTopWhales: (timeframe?: string) => fetchApi(`/whales/top-whales${timeframe ? `?timeframe=${timeframe}` : ''}`),
  getPatterns: () => fetchApi('/whales/patterns'),
};
