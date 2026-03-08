import express, { Request, Response } from 'express';
import { query } from '../config/database';

const router = express.Router();

// Submit project application
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      symbol,
      description,
      website,
      twitter,
      telegram,
      whitepaperUrl,
      tokenomics,
      team,
      contactEmail,
      launchType // 'standard' or 'elite'
    } = req.body;

    // Validate required fields
    if (!projectName || !symbol || !description || !contactEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(`
      INSERT INTO project_applications (
        project_name, 
        symbol, 
        description, 
        website, 
        twitter, 
        telegram,
        whitepaper_url,
        tokenomics,
        team_info,
        contact_email,
        launch_type,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
      RETURNING *
    `, [
      projectName, 
      symbol, 
      description, 
      website, 
      twitter, 
      telegram,
      whitepaperUrl,
      JSON.stringify(tokenomics),
      JSON.stringify(team),
      contactEmail,
      launchType || 'standard'
    ]);

    res.status(201).json({
      success: true,
      applicationId: result.rows[0].id,
      message: 'Application submitted successfully! We will review and get back to you.'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get application status
router.get('/status/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const result = await query(`
      SELECT id, project_name, symbol, status, submitted_at, reviewed_at, notes
      FROM project_applications 
      WHERE contact_email = $1
      ORDER BY submitted_at DESC
    `, [email]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ error: 'Failed to fetch application status' });
  }
});

// Admin: Get all applications
router.get('/admin/all', async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM project_applications';
    const params: any[] = [];

    if (status) {
      params.push(status);
      queryText += ` WHERE status = $${params.length}`;
    }

    queryText += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Admin: Update application status
router.patch('/admin/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await query(`
      UPDATE project_applications 
      SET status = $1, 
          notes = $2,
          reviewed_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // If approved, create a launch entry
    if (status === 'approved') {
      const app = result.rows[0];
      const tokenomics = typeof app.tokenomics === 'string' 
        ? JSON.parse(app.tokenomics) 
        : app.tokenomics;

      await query(`
        INSERT INTO launches (
          name, 
          symbol, 
          description, 
          website,
          twitter,
          telegram,
          launch_price,
          raise_target,
          start_time,
          end_time,
          type,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'upcoming')
      `, [
        app.project_name,
        app.symbol,
        app.description,
        app.website,
        app.twitter,
        app.telegram,
        tokenomics?.price || 0.001,
        tokenomics?.hardCap || 1000000,
        tokenomics?.startTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tokenomics?.endTime || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        app.launch_type
      ]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Get application by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM project_applications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

export default router;
