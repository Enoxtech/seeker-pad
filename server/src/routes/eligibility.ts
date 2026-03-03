import express, { Request, Response } from 'express';
import { query } from '../config/database';

const router = express.Router();

// Check eligibility for a wallet address
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    // Check NFT holdings (mock - in production, query blockchain)
    const nftResult = await query(`
      SELECT * FROM user_nfts WHERE owner_address = $1
    `, [address]);

    // Check staking positions (mock)
    const stakingResult = await query(`
      SELECT * FROM staking_positions WHERE user_address = $1
    `, [address]);

    // Determine eligibility
    const hasSagaGenesis = nftResult.rows.some(nft => nft.category === 'saga-genesis');
    const hasSeekerPioneer = nftResult.rows.some(nft => nft.category === 'seeker-pioneer');
    const hasJupiterStake = stakingResult.rows.some(s => s.protocol === 'jupiter' && s.amount >= 10000);
    const hasBonkStake = stakingResult.rows.some(s => s.protocol === 'bonk' && s.amount >= 1000000);
    const hasMeteoraStake = stakingResult.rows.some(s => s.protocol === 'meteora' && s.amount >= 5000);

    res.json({
      isEligible: hasSagaGenesis || hasSeekerPioneer || hasJupiterStake || hasBonkStake || hasMeteoraStake,
      categories: [
        { category: 'saga-genesis', isEligible: hasSagaGenesis, balance: null },
        { category: 'seeker-pioneer', isEligible: hasSeekerPioneer, balance: null },
        { category: 'jupiter-aligned', isEligible: hasJupiterStake, balance: hasJupiterStake ? stakingResult.rows.find(s => s.protocol === 'jupiter')?.amount : null },
        { category: 'bonk-community', isEligible: hasBonkStake, balance: hasBonkStake ? stakingResult.rows.find(s => s.protocol === 'bonk')?.amount : null },
        { category: 'meteora-lp', isEligible: hasMeteoraStake, balance: hasMeteoraStake ? stakingResult.rows.find(s => s.protocol === 'meteora')?.amount : null },
      ],
      hasNFT: nftResult.rows.length > 0,
      nftCount: nftResult.rows.length
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

// Get tier based on staking
router.get('/:address/tier', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const result = await query(`
      SELECT * FROM staking_positions WHERE user_address = $1
    `, [address]);

    const totalStaked = result.rows.reduce((sum, pos) => sum + pos.amount, 0);

    let tier = 'explorer';
    let multiplier = 1;

    if (totalStaked >= 100000) {
      tier = 'founder';
      multiplier = 3;
    } else if (totalStaked >= 50000) {
      tier = 'visionary';
      multiplier = 2;
    } else if (totalStaked >= 10000) {
      tier = 'pioneer';
      multiplier = 1.5;
    }

    res.json({ tier, multiplier, stakedAmount: totalStaked });
  } catch (error) {
    console.error('Error fetching tier:', error);
    res.status(500).json({ error: 'Failed to fetch tier' });
  }
});

export default router;
