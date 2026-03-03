import express, { Request, Response } from 'express';
import { query } from '../config/database';

const router = express.Router();

// Get user's NFTs
router.get('/user/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const result = await query(`
      SELECT * FROM user_nfts WHERE owner_address = $1
    `, [address]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Get NFT categories and supply
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        category,
        COUNT(*) as minted,
        MAX(supply_limit) as supply_limit
      FROM nft_categories
      GROUP BY category
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Mint NFT (would be called after on-chain mint)
router.post('/mint', async (req: Request, res: Response) => {
  try {
    const { user_address, category, mint_address, tx_signature } = req.body;

    // Check if user is eligible
    const eligibleResult = await query(`
      SELECT * FROM eligibility_verification 
      WHERE user_address = $1 AND category = $2 AND is_eligible = true
    `, [user_address, category]);

    if (eligibleResult.rows.length === 0) {
      return res.status(403).json({ error: 'Not eligible for this category' });
    }

    // Check supply limit
    const categoryResult = await query(`
      SELECT * FROM nft_categories WHERE category = $1
    `, [category]);

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const { supply_limit, minted } = categoryResult.rows[0];
    if (minted >= supply_limit) {
      return res.status(400).json({ error: 'Supply limit reached' });
    }

    // Record mint
    const result = await query(`
      INSERT INTO user_nfts (owner_address, category, mint_address, tx_signature)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [user_address, category, mint_address, tx_signature]);

    // Update minted count
    await query(`
      UPDATE nft_categories SET minted = minted + 1 WHERE category = $1
    `, [category]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({ error: 'Failed to mint NFT' });
  }
});

export default router;
