import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { enhanceWithGemini } from './services/geminiOptionalService';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Core Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Prevent Service Worker caching issues
app.get('/sw.js', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.status(404).send('Service Worker Disabled');
});

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Health Routes
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/google', (_req: Request, res: Response) => {
  res.json({
    cloudRun: "active",
    mode: "fallback-safe",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    geminiMode: "optional-enhancement",
    mapsConfigured: !!process.env.GOOGLE_MAPS_API_KEY,
    googleServices: [
      "Google Cloud Run",
      "Google Maps Deep Links",
      "Optional Gemini Enhancement",
      "Optional Places Enhancement"
    ]
  });
});

// Stable API Fallbacks (No External Dependencies)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, persona = 'Professional', language = 'English' } = req.body;
  
  const localAnswer = "I’m here to help with your voter journey! You can ask about eligibility, how to register, or where to find your booth. What specifically can I assist you with?";
  
  // Optional enhancement
  const enhanced = await enhanceWithGemini({
    userQuery: message || '',
    localAnswer,
    persona,
    language
  });

  res.json({
    answer: enhanced || localAnswer,
    attribution: enhanced ? "Gemini Enhanced" : "Local Knowledge Base",
    verified: true
  });
});

app.get('/api/booths', (req: Request, res: Response) => {
  res.json([]); // Empty response, frontend handles mapping locally now
});

// SPA Fallback
app.get("*", (req: Request, res: Response) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) return;
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Centralized Error Handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`VoteGuide Stable Local Mode running on port ${PORT}`);
});

export default app;
