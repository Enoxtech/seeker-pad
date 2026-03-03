import express, { Request, Response } from 'express';
import { Connection, PublicKey } from '@solana/web3.js';

const router = express.Router();

// Get wallet balance
router.get('/:address/balance', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const network = req.query.network as string || 'devnet';
    
    const connection = new Connection(
      network === 'mainnet' 
        ? 'https://api.mainnet.solana.com' 
        : 'https://api.devnet.solana.com'
    );

    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    
    res.json({
      address,
      balance: balance / 1e9, // Convert lamports to SOL
      network
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Verify wallet ownership (for KYC)
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { address, signature } = req.body;
    
    // In production, verify the signature proves ownership
    // For now, just validate the address format
    try {
      new PublicKey(address);
    } catch {
      return res.status(400).json({ error: 'Invalid address' });
    }

    res.json({ verified: true, address });
  } catch (error) {
    console.error('Error verifying wallet:', error);
    res.status(500).json({ error: 'Failed to verify wallet' });
  }
});

export default router;
