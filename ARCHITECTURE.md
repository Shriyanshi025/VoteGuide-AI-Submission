# Architecture Overview - VoteGuide AI

VoteGuide AI is designed with a **Hybrid Reliability Architecture**, combining a high-performance deterministic local engine with optional Google Cloud AI enhancements. This ensures that critical voter guidance remains available 100% of the time, even in degraded network conditions.

## System Components

### 1. Frontend (React + Vite)
- **Deterministic UI Engine**: Serves localized voter guidance and roadmap steps directly from a local knowledge base.
- **State Management**: Uses lightweight stores (Zustand) for persistent user preferences and journey progress.
- **Local Persistence**: Manages reminders and polling booth selections via `localStorage`.

### 2. Backend (Node.js + Express)
- **Intelligent Intent Router**: Analyzes user queries to determine if they can be handled locally or require optional AI enhancement.
- **Google Services Orchestrator**: Manages server-side integration with:
    - **Google Places API**: Aggregates nearby civic centers and polling help locations.
    - **Google Gemini API**: Provides optional, context-aware conversational depth for complex voter queries.
- **Health System**: Real-time diagnostic endpoint at `/health/google` to verify service configuration.

### 3. Google Services Layer
- **Cloud Run**: High-availability serverless hosting for the full-stack container.
- **Places API**: Backend-driven location search for authoritative polling help markers.
- **Maps Protocol**: Deterministic deep-linking for turn-by-turn navigation fallback.

## Implementation Patterns

### Fallback-Safe Flow
```text
User Input
    |
    v
Local Intent Check (Frontend/Backend) ----> [MATCH] ----> Local Guidance Response
    |                                                      (100% Reliability)
    v
[NO LOCAL MATCH]
    |
    v
Gemini Optional Enhancement --------------> [SUCCESS] --> Context-Aware Response
    |
    v
[ERROR/TIMEOUT] --------------------------> [FALLBACK] -> Voter Guidance Redirect
                                                           (Guaranteed Safety)
```

### Booth Finder Flow
```text
Location Detected
    |
    v
Google Places API Search -----------------> [SUCCESS] --> Live Authoritative Suggestions
    |                                                      + Manual Maps Fallback
    v
[ZERO RESULTS/API ERROR] -----------------> [FALLBACK] -> Clear Manual Search Links
                                                           (Never Broken UX)
```

## Deployment Architecture
The application is deployed as a single multi-stage Docker container on **Google Cloud Run**, serving the frontend as static assets from the Node backend. This unified architecture simplifies deployment and ensures consistent environment variable management for API keys.

---
*Architecture Verified for Google AI Submission 2026.*
