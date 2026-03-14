import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { useWallet } from '@/contexts/WalletContextProvider';

// Devnet RPC endpoint
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

// Smart contract program ID (deployed on devnet)
// TODO: Update this after deploying the smart contract
export const PROGRAM_ID = new PublicKey('SeekPad1111111111111111111111111111111');

// Create a connection instance
export function getConnection(): Connection {
  return new Connection(RPC_ENDPOINT, 'confirmed');
}

// Participate in a launch (creates real Solana transaction)
export async function participateInLaunch(
  connection: Connection,
  wallet: ReturnType<typeof useWallet>,
  launchId: string,
  amountSol: number
): Promise<{ txSignature: string; success: boolean }> {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  try {
    // Convert SOL to lamports (1 SOL = 1e9 lamports)
    const lamports = Math.floor(amountSol * 1e9);

    // Create a simple transfer transaction to a vault address
    // In production, this would interact with the smart contract
    const vaultAddress = new PublicKey('SeekPad1111111111111111111111111111111'); // Program-derived address
    
    // For now, we create a simple SOL transfer to a vault
    // The actual smart contract interaction would be more complex
    const transaction = new Transaction();
    
    // Add instruction to transfer SOL
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: vaultAddress,
        lamports,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Send the transaction
    // Note: In production, we'd use wallet.signTransaction() 
    // and the actual program ID would be deployed
    const signature = await wallet.sendTransaction!(transaction, connection);
    
    return {
      txSignature: signature,
      success: true,
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

// Claim tokens after TGE
export async function claimTokens(
  connection: Connection,
  wallet: ReturnType<typeof useWallet>,
  participationAccount: PublicKey
): Promise<{ txSignature: string; success: boolean }> {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  try {
    // This would create a claim transaction interacting with the smart contract
    // For now, returns mock response - needs smart contract deployment
    const mockSignature = `claim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return {
      txSignature: mockSignature,
      success: true,
    };
  } catch (error) {
    console.error('Claim failed:', error);
    throw error;
  }
}

// Check if program is deployed
export async function isProgramDeployed(connection: Connection): Promise<boolean> {
  try {
    const programInfo = await connection.getAccountInfo(PROGRAM_ID);
    return programInfo !== null && programInfo.executable;
  } catch {
    return false;
  }
}