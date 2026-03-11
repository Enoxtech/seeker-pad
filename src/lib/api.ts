// API client for SeekerPad

// Use relative URLs for Same-Origin (works both locally and on Vercel)
// For separate backend deployment, set NEXT_PUBLIC_API_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

// Launches API
export const launchesApi = {
  getAll: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/launches`);
    return handleResponse<any[]>(response);
  },

  getById: async (id: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/launches/${id}`);
    return handleResponse<any>(response);
  },

  create: async (launch: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/launches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(launch),
    });
    return handleResponse<any>(response);
  },
};

// Participation API
export const participationApi = {
  getUserParticipations: async (address: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/participation/user/${address}`
    );
    return handleResponse<any[]>(response);
  },

  getUserParticipation: async (address: string, launchId: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/participation/user/${address}/launch/${launchId}`
    );
    return handleResponse<any>(response);
  },

  create: async (participation: {
    launch_id: string;
    user_address: string;
    amount_sol: number;
    tx_signature: string;
  }) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/participation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participation),
    });
    return handleResponse<any>(response);
  },

  claim: async (id: string, txSignature: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/participation/${id}/claim`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_signature: txSignature }),
      }
    );
    return handleResponse<any>(response);
  },
};

// Eligibility API
export const eligibilityApi = {
  check: async (address: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/eligibility/${address}`
    );
    return handleResponse<any>(response);
  },

  getTier: async (address: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/eligibility/${address}/tier`
    );
    return handleResponse<any>(response);
  },
};

// NFT API
export const nftApi = {
  getUserNFTs: async (address: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/nft/user/${address}`
    );
    return handleResponse<any[]>(response);
  },

  getCategories: async () => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/nft/categories`
    );
    return handleResponse<any[]>(response);
  },

  mint: async (mintData: {
    user_address: string;
    category: string;
    mint_address: string;
    tx_signature: string;
  }) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/nft/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mintData),
    });
    return handleResponse<any>(response);
  },
};

// Wallet API
export const walletApi = {
  getBalance: async (address: string, network: string = 'devnet') => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/wallet/${address}/balance?network=${network}`
    );
    return handleResponse<any>(response);
  },
};
