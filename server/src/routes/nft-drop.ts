import express, { Request, Response } from 'express';
import { query } from '../config/database';

const router = express.Router();

// ==================== Admin Routes ====================

// Create NFT Drop
router.post('/admin/drops', async (req: Request, res: Response) => {
  try {
    const { 
      name, description, image_url, contract_address, candy_machine_id,
      start_date, end_date, supply_limit, mint_price, is_active
    } = req.body;

    const result = await query(`
      INSERT INTO nft_drops (
        name, description, image_url, contract_address, candy_machine_id,
        start_date, end_date, supply_limit, mint_price, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [name, description, image_url, contract_address, candy_machine_id,
        start_date, end_date, supply_limit, mint_price, is_active ?? true]);

    // Create default eligibility criteria
    const dropId = result.rows[0].id;
    await query(`
      INSERT INTO nft_eligibility_criteria (
        drop_id, require_app_download, require_onchain_trade, require_skr_tokens, min_skr_amount
      )
      VALUES ($1, true, true, true, 1)
    `, [dropId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating NFT drop:', error);
    res.status(500).json({ error: 'Failed to create NFT drop' });
  }
});

// Get all NFT Drops (admin)
router.get('/admin/drops', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT d.*, c.require_app_download, c.require_onchain_trade, 
             c.require_skr_tokens, c.min_skr_amount
      FROM nft_drops d
      LEFT JOIN nft_eligibility_criteria c ON d.id = c.drop_id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching NFT drops:', error);
    res.status(500).json({ error: 'Failed to fetch NFT drops' });
  }
});

// Update NFT Drop
router.put('/admin/drops/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name, description, image_url, contract_address, candy_machine_id,
      start_date, end_date, supply_limit, mint_price, is_active
    } = req.body;

    const result = await query(`
      UPDATE nft_drops
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          image_url = COALESCE($3, image_url),
          contract_address = COALESCE($4, contract_address),
          candy_machine_id = COALESCE($5, candy_machine_id),
          start_date = COALESCE($6, start_date),
          end_date = COALESCE($7, end_date),
          supply_limit = COALESCE($8, supply_limit),
          mint_price = COALESCE($9, mint_price),
          is_active = COALESCE($10, is_active),
          updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [name, description, image_url, contract_address, candy_machine_id,
        start_date, end_date, supply_limit, mint_price, is_active, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating NFT drop:', error);
    res.status(500).json({ error: 'Failed to update NFT drop' });
  }
});

// Update eligibility criteria for a drop
router.put('/admin/drops/:id/eligibility', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      require_app_download, require_onchain_trade, require_skr_tokens, min_skr_amount 
    } = req.body;

    const result = await query(`
      UPDATE nft_eligibility_criteria
      SET require_app_download = COALESCE($1, require_app_download),
          require_onchain_trade = COALESCE($2, require_onchain_trade),
          require_skr_tokens = COALESCE($3, require_skr_tokens),
          min_skr_amount = COALESCE($4, min_skr_amount)
      WHERE drop_id = $5
      RETURNING *
    `, [require_app_download, require_onchain_trade, require_skr_tokens, min_skr_amount, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating eligibility criteria:', error);
    res.status(500).json({ error: 'Failed to update eligibility criteria' });
  }
});

// Delete NFT Drop
router.delete('/admin/drops/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await query(`DELETE FROM nft_drops WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting NFT drop:', error);
    res.status(500).json({ error: 'Failed to delete NFT drop' });
  }
});

// ==================== Public Routes ====================

// Get active NFT drops (for users)
router.get('/drops', async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();
    const result = await query(`
      SELECT d.*, c.require_app_download, c.require_onchain_trade, 
             c.require_skr_tokens, c.min_skr_amount
      FROM nft_drops d
      LEFT JOIN nft_eligibility_criteria c ON d.id = c.drop_id
      WHERE d.is_active = true 
        AND (d.start_date IS NULL OR d.start_date <= $1)
        AND (d.end_date IS NULL OR d.end_date >= $1)
      ORDER BY d.start_date ASC
    `, [now]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching NFT drops:', error);
    res.status(500).json({ error: 'Failed to fetch NFT drops' });
  }
});

// Get single NFT drop
router.get('/drops/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT d.*, c.require_app_download, c.require_onchain_trade, 
             c.require_skr_tokens, c.min_skr_amount
      FROM nft_drops d
      LEFT JOIN nft_eligibility_criteria c ON d.id = c.drop_id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'NFT drop not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching NFT drop:', error);
    res.status(500).json({ error: 'Failed to fetch NFT drop' });
  }
});

// ==================== Eligibility Check ====================

// Check eligibility for a wallet address
router.get('/eligibility/:dropId/:address', async (req: Request, res: Response) => {
  try {
    const { dropId, address } = req.params;

    // Get eligibility criteria for this drop
    const criteriaResult = await query(`
      SELECT * FROM nft_eligibility_criteria WHERE drop_id = $1
    `, [dropId]);

    if (criteriaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Eligibility criteria not found' });
    }

    const criteria = criteriaResult.rows[0];
    
    // Check each criterion
    let hasAppDownload = false;
    let hasOnchainTrade = false;
    let hasMinSkrTokens = false;

    // Check app download
    if (criteria.require_app_download) {
      const appResult = await query(`
        SELECT * FROM seekerpad_app_users WHERE wallet_address = $1
      `, [address]);
      hasAppDownload = appResult.rows.length > 0;
    } else {
      hasAppDownload = true; // Not required
    }

    // Check onchain trade
    if (criteria.require_onchain_trade) {
      const tradeResult = await query(`
        SELECT * FROM user_transactions 
        WHERE user_address = $1 AND type = 'trade' 
        LIMIT 1
      `, [address]);
      hasOnchainTrade = tradeResult.rows.length > 0;
    } else {
      hasOnchainTrade = true; // Not required
    }

    // Check SKR tokens (mock - in production, query blockchain)
    if (criteria.require_skr_tokens) {
      // TODO: Integrate with Solana blockchain to check actual SKR balance
      // For now, check if they have any token tracked
      const tokenResult = await query(`
        SELECT * FROM token_balances 
        WHERE user_address = $1 AND token_symbol = 'SKR' 
        AND amount >= $2
      `, [address, criteria.min_skr_amount]);
      hasMinSkrTokens = tokenResult.rows.length > 0;
    } else {
      hasMinSkrTokens = true; // Not required
    }

    const isEligible = hasAppDownload && hasOnchainTrade && hasMinSkrTokens;

    // Update eligibility record
    await query(`
      INSERT INTO nft_eligibility_records (
        drop_id, user_address, has_app_download, has_onchain_trade, 
        has_min_skr_tokens, is_eligible, verified_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (drop_id, user_address) 
      DO UPDATE SET
        has_app_download = $3, has_onchain_trade = $4, 
        has_min_skr_tokens = $5, is_eligible = $6, verified_at = NOW()
    `, [dropId, address, hasAppDownload, hasOnchainTrade, hasMinSkrTokens, isEligible]);

    res.json({
      isEligible,
      criteria: {
        requireAppDownload: criteria.require_app_download,
        requireOnchainTrade: criteria.require_onchain_trade,
        requireSkrTokens: criteria.require_skr_tokens,
        minSkrAmount: criteria.min_skr_amount
      },
      checks: {
        hasAppDownload,
        hasOnchainTrade,
        hasMinSkrTokens
      }
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

// ==================== User Tracking ====================

// Record app download (called when user logs in from SeekerPad app)
router.post('/track/app-download', async (req: Request, res: Response) => {
  try {
    const { wallet_address, device_id } = req.body;

    if (!wallet_address) {
      return res.status(400).json({ error: 'wallet_address required' });
    }

    const result = await query(`
      INSERT INTO seekerpad_app_users (wallet_address, device_id)
      VALUES ($1, $2)
      ON CONFLICT (wallet_address) 
      DO UPDATE SET last_active_at = NOW()
      RETURNING *
    `, [wallet_address, device_id]);

    res.json({ success: true, record: result.rows[0] });
  } catch (error) {
    console.error('Error tracking app download:', error);
    res.status(500).json({ error: 'Failed to track app download' });
  }
});

// Record onchain trade (called when user makes a trade)
router.post('/track/trade', async (req: Request, res: Response) => {
  try {
    const { user_address, tx_signature, token_in, token_out, amount_in, amount_out } = req.body;

    await query(`
      INSERT INTO user_transactions (user_address, tx_signature, type, token_in, token_out, amount_in, amount_out)
      VALUES ($1, $2, 'trade', $3, $4, $5, $6)
    `, [user_address, tx_signature, token_in, token_out, amount_in, amount_out]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording trade:', error);
    res.status(500).json({ error: 'Failed to record trade' });
  }
});

export default router;