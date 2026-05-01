import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { enhanceWithGemini } from './services/geminiOptionalService';
import { getLocalElectionAnswer } from './services/localIntentRouter';
import { findNearbyElectionPlaces } from './services/placesOptionalService';


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
    placesConfigured: !!(process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_SERVER_KEY),
    placesServerKeyConfigured: !!process.env.GOOGLE_PLACES_SERVER_KEY,
    placesMode: "optional-enhancement",
    googleServices: [
      "Google Cloud Run",
      "Google Maps Deep Links",
      process.env.GEMINI_API_KEY ? "Optional Gemini Enhancement" : null,
      (process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_SERVER_KEY) ? "Optional Places Enhancement" : null
    ].filter(Boolean)
  });
});

// Stable API Fallbacks (No External Dependencies)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, persona = 'Professional', language = 'English' } = req.body;
  const query = message || '';
  const q = query.toLowerCase();
  
  // 1. Off-topic Guardrail
  const offTopicKeywords = ['weather', 'joke', 'ipl', 'score', 'movie', 'film', 'song', 'news', 'price', 'buy', 'shop', 'game', 'play'];
  if (offTopicKeywords.some(kw => q.includes(kw))) {
    return res.json({
      answer: "I’m VoteGuide AI and I can help only with Indian voter guidance (eligibility, registration, polling booth, voter ID, election help). What would you like help with?",
      verified: true,
      attribution: "Local Guardrail"
    });
  }

  // 2. Detect local intent
  const electionAnswer = getLocalElectionAnswer(query, language);
  
  // 3. Final Fallback if no intent detected
  const localAnswer = electionAnswer || "I’m here to help with your voter journey! You can ask about eligibility, how to register, or where to find your booth. What specifically can I assist you with?";
  
  // 4. Optional Gemini enhancement
  const enhanced = await enhanceWithGemini({
    userQuery: query,
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
  res.json([]); // Legacy endpoint
});

app.get('/api/places/nearby', async (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.json({ places: [] });
  }

  try {
    const places = await findNearbyElectionPlaces(latitude, longitude);
    res.json({ places });
  } catch (error) {
    console.error('Places API error:', error);
    res.json({ places: [] });
  }
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
