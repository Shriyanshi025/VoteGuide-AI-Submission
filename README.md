# VoteGuide AI

**Live Cloud Run Application:** [https://voteguide-fullstack-485431787756.us-central1.run.app/](https://voteguide-fullstack-485431787756.us-central1.run.app/)

VoteGuide AI is a specialized, production-hardened digital assistant designed to guide citizens through the voter journey—from checking eligibility to finding their polling booth.

## Tech Stack
*   **Frontend**: React (TypeScript), Vite, Vanilla CSS.
*   **Backend**: Node.js, Express.
*   **Deployment**: Docker, Google Cloud Run.
*   **Testing**: Vitest, JSDOM, React Testing Library.

## Setup Locally
1. Install Dependencies: `npm install` and `cd backend && npm install`
2. Run Automated Tests: `npm test`
3. Run Dev Server: `npm run dev`

## Testing
The project includes a comprehensive suite of deterministic automated tests covering:
- AI Guardrails & Topic Safety
- Persona-based Behavioral Guidance
- Multi-language Localization
- Local Persistence (Reminders)
See [TESTING.md](./TESTING.md) for the full report.

## Reliability Strategy
- **Deterministic Engine**: Core voter guidance works entirely locally without external API dependencies, ensuring 100% uptime for critical information.
- **Stable Fallback**: A robust local knowledge base protects the user experience even in low-connectivity scenarios.
- **Safety First**: Strict keyword and intent-based guardrails prevent off-topic discussions.

## Google Services Integration
VoteGuide AI is architected to leverage Google's ecosystem for a premium voter experience:
*   **Google Cloud Run**: The application is containerized and deployed on Google Cloud Run for high availability and serverless scalability.
*   **Google Maps Deep Links**: Uses standard mapping protocols for deterministic, location-based guidance to help voters find election and government help centers.
*   **Optional Gemini Enhancement**: Designed with an optional integration layer for Google Gemini to provide advanced conversational capabilities while maintaining a local fallback.
*   **Optional Google Places Enhancement**: Ready for integration with Google Places API for real-time indexing of dynamic polling locations.
*   **Fallback-Safe Architecture**: Our "Stability-First" design ensures that the core app flow remains functional even if external API dependencies are unavailable, preventing service disruptions.

## Google Services Usage
- **Google Cloud Run**: Hosts the fullstack containerized application.
- **Google Antigravity**: Advanced agentic development workflow for system stabilization and testing.
- **Google Maps**: Leverages standard mapping protocols for polling booth location guidance.

---
*Created for the Google AI Submission 2026.*
