import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { findNearbyElectionPlaces } from '../services/placesOptionalService';

// We need a minimal app for testing health routes
const app = express();

app.get('/health/google', (req, res) => {
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

describe('Health Endpoint', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.GEMINI_API_KEY = 'test-gemini';
    process.env.GOOGLE_MAPS_API_KEY = 'test-maps';
    process.env.GOOGLE_PLACES_SERVER_KEY = 'test-server-key';
  });

  it('should report all services as configured when keys are present', async () => {
    const response = await request(app).get('/health/google');
    
    expect(response.status).toBe(200);
    expect(response.body.geminiConfigured).toBe(true);
    expect(response.body.mapsConfigured).toBe(true);
    expect(response.body.placesConfigured).toBe(true);
    expect(response.body.placesServerKeyConfigured).toBe(true);
    expect(response.body.googleServices).toContain("Optional Places Enhancement");
  });

  it('should report placesConfigured true if only server key is present', async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    
    const response = await request(app).get('/health/google');
    
    expect(response.body.mapsConfigured).toBe(false);
    expect(response.body.placesConfigured).toBe(true);
    expect(response.body.placesServerKeyConfigured).toBe(true);
  });

  it('should report placesConfigured false if no keys are present', async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    delete process.env.GOOGLE_PLACES_SERVER_KEY;
    
    const response = await request(app).get('/health/google');
    
    expect(response.body.placesConfigured).toBe(false);
    expect(response.body.placesServerKeyConfigured).toBe(false);
  });
});
