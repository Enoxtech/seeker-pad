import express, { Request, Response } from 'express';
import { query } from '../config/database';

const router = express.Router();

// Get user's participations
router.get('/user/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    const result = await query(`
      SELECT p.*, l.name as launch_name, l.symbol as launch_symbol
      FROM participations p
      JOIN launches l ON p.launch_id = l.id
      WHERE p.user_address = $1
      ORDER BY p.created_at DESC
    `, [walletAddress]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching participations:', error);
    res.status(500).json({ error: 'Failed to fetch participations' });
  }
});

// Get single participation
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM participations WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching participation:', error);
    res.status(500).json({ error: 'Failed to fetch participation' });
  }
});

// Create participation (after on-chain transaction)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { launchId, userAddress, amountSol, txSignature } = req.body;
    
    // Get launch to calculate tokens
    const launchResult = await query(
      'SELECT launch_price FROM launches WHERE id = $1',
      [launchId]
    );
    
    if (launchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Launch not found' });
    }
    
    const launchPrice = parseFloat(launchResult.rows[0].launch_price);
    const tokensReceived = Math.floor(amountSol / launchPrice);
    
    // Create participation record
    const result = await query(`
      INSERT INTO participations (
        launch_id, user_address, amount_sol, tokens_received, 
        status, tx_signature
      ) VALUES ($1, $2, $3, $4, 'pending', $5)
      RETURNING *
    `, [launchId, userAddress, amountSol, tokensReceived, txSignature]);
    
    // Update launch total raised
    await query(
      'UPDATE launches SET total_raised = total_raised + $1, participants_count = participants_count + 1 WHERE id = $2',
      [amountSol, launchId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating participation:', error);
    res.status(500).json({ error: 'Failed to create participation' });
  }
});

// Claim tokens (after on-chain transaction)
router.post('/:id/claim', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { txSignature } = req.body;
    
    // Get participation
    const partResult = await query(
      'SELECT * FROM participations WHERE id = $1',
      [id]
    );
    
    if (partResult.rows.length === 0) {
      return res.status(404).json({ error: 'Participation not found' });
    }
    
    const participation = partResult.rows[0];
    
    if (participation.status === 'claimed') {
      return res.status(400).json({ error: 'Already claimed' });
    }
    
    if (participation.status === 'pending') {
      return res.status(400).json({ error: 'TGE not reached yet' });
    }
    
    // Update participation
    const result = await query(`
      UPDATE participations 
      SET status = 'claimed', 
          claimed_amount = claimable_amount,
          claimable_amount = 0,
          tx_signature = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [txSignature, id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error claiming tokens:', error);
    res.status(500).json({ error: 'Failed to claim tokens' });
  }
});

// Get claimable amount
router.get('/:id/claimable', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT p.*, l.tge_time, l.vesting_schedule
       FROM participations p
       JOIN launches l ON p.launch_id = l.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participation not found' });
    }
    
    const participation = result.rows[0];
    const now = new Date();
    const tgeTime = new Date(participation.tge_time);
    
    if (now < tgeTime) {
      return res.json({
        claimable: 0,
        message: 'TGE not reached',
        tgeTime: tgeTime.toISOString()
      });
    }
    
    // Calculate vested amount based on vesting schedule
    // Simplified: assume linear vesting after TGE
    const vestingMonths = participation.vesting_schedule?.months || 6;
    const initialUnlock = participation.vesting_schedule?.initial_unlock || 20;
    
    const monthsSinceTGE = Math.floor(
      (now.getTime() - tgeTime.getTime()) / (30 * 24 * 60 * 60 * 1000)
    );
    
    const vestedPercent = Math.min(
      initialUnlock + (monthsSinceTGE / vestingMonths) * (100 - initialUnlock),
      100
    );
    
    const totalTokens = participation.tokens_received;
    const claimable = Math.floor(totalTokens * (vestedPercent / 100)) - participation.claimed_amount;
    
    res.json({
      claimable: Math.max(0, claimable),
      claimed: participation.claimed_amount,
      total: totalTokens,
      vestedPercent,
      nextUnlockIn: Math.max(0, 30 - (monthsSinceTGE % 30))
    });
  } catch (error) {
    console.error('Error fetching claimable:', error);
    res.status(500).json({ error: 'Failed to fetch claimable amount' });
  }
});

export default router;
