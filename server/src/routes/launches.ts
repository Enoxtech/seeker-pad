import express, { Request, Response } from 'express';
import { query } from '../config/database';

const router = express.Router();

// Get all launches
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT * FROM launches 
      ORDER BY start_time DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching launches:', error);
    res.status(500).json({ error: 'Failed to fetch launches' });
  }
});

// Get single launch
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM launches WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Launch not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching launch:', error);
    res.status(500).json({ error: 'Failed to fetch launch' });
  }
});

// Create new launch (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      symbol,
      description,
      total_supply,
      launch_price,
      raise_target,
      start_time,
      end_time,
      type
    } = req.body;

    const result = await query(`
      INSERT INTO launches (
        name, symbol, description, total_supply, launch_price,
        raise_target, start_time, end_time, type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'upcoming')
      RETURNING *
    `, [name, symbol, description, total_supply, launch_price, raise_target, start_time, end_time, type]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating launch:', error);
    res.status(500).json({ error: 'Failed to create launch' });
  }
});

// Update launch status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      'UPDATE launches SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update launch status' });
  }
});

export default router;
