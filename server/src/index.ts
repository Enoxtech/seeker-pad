import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports
import launchesRouter from './routes/launches';
import participationRouter from './routes/participation';
import eligibilityRouter from './routes/eligibility';
import nftRouter from './routes/nft';
import walletRouter from './routes/wallet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/launches', launchesRouter);
app.use('/api/participation', participationRouter);
app.use('/api/eligibility', eligibilityRouter);
app.use('/api/nft', nftRouter);
app.use('/api/wallet', walletRouter);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 SeekerPad API running on port ${PORT}`);
  console.log(`   Network: ${process.env.SOLANA_NETWORK || 'devnet'}`);
});

export default app;
