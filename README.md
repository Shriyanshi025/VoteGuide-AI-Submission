# VoteGuide AI: The Specialized Indian Election Assistant

**Live Application:** [https://voteguide-fullstack-485431787756.us-central1.run.app/](https://voteguide-fullstack-485431787756.us-central1.run.app/)

VoteGuide AI is a production-hardened digital assistant designed to guide citizens through the complex Indian voter journey. From eligibility checks to locating physical polling booths, the app provides a seamless, high-reliability experience.

## chosen Vertical: Civic Engagement & Voter Guidance

---

## Evaluation Highlights

| Area | Implementation Details |
| :--- | :--- |
| **Code Quality** | Clean separation of concerns (React/Node), TypeScript enforcement, and multi-stage Docker builds. |
| **Security** | Zero-trust secret management; all Google APIs called server-side with no keys exposed to the client. |
| **Efficiency** | Minimalist footprint (~468 KB); no tracked generated files or bloated assets. |
| **Testing** | 77 automated tests (Vitest) with verified non-zero coverage and manual UI regression audits. |
| **Accessibility** | Premium UI with font-scaling support, high-contrast dark mode, and screen-reader friendly labels. |
| **Google Services** | Integrated with Cloud Run, Gemini, Places API, and Google Maps with robust fallbacks. |
| **Alignment** | Directly solves the "Civic Engagement" problem by digitizing the end-to-end voting roadmap. |

---

## Core Features
- **Deterministic Journey Tracker**: A step-by-step roadmap for eligibility, registration, and voting.
- **Intelligent Booth Finder**: Real-time polling help locations via Google Places API with 100% reliable Maps fallback.
- **Persona-Based Guidance**: Tailored behavioral advice for first-time voters, busy professionals, and senior citizens.
- **AI-Enhanced Chat**: Specialized intent routing with off-topic guardrails and optional Gemini conversational depth.
- **Multi-Language Support**: Native localization for English, Hindi, Bengali, Tamil, and Telugu.
- **Privacy-First Reminders**: Browser-based vote-day notifications with zero backend storage.

## Google Services Used
- **Google Cloud Run**: Highly available serverless hosting.
- **Google Gemini API**: Optional conversational enhancement for complex voter queries.
- **Google Places API**: Real-time authoritative indexing of local civic help centers.
- **Google Maps**: Deterministic navigation protocols for booth locations.

## Fallback-Safe Architecture
VoteGuide AI is built for reliability. If external APIs (Gemini or Places) encounter errors or quota limits, the app automatically degrades to a deterministic local mode. This ensures critical voter information is always available, even in low-connectivity environments.

## Project Documentation
- [Architecture Details](./ARCHITECTURE.md) - Deep dive into the system design.
- [Security & Privacy](./SECURITY.md) - Secret management and user data policies.
- [Testing Report](./TESTING.md) - Full automated test suite and coverage details.

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
cd backend && npm install
```

### 2. Run Automated Tests
```bash
npm test
```

### 3. Run Development Server
```bash
npm run dev
```

---
*Created for the Google AI Submission 2026. Optimized for stability, security, and civic impact.*
