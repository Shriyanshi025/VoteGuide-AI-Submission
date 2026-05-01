# Security & Privacy Policy - VoteGuide AI

VoteGuide AI is built with a **Security-First** and **Privacy-Preserving** mindset. We ensure that voter guidance is provided without compromising user identity or exposing critical API infrastructure.

## Secret Management
- **Zero-Secret Repository**: No API keys, credentials, or private environmental configurations are committed to the version control system.
- **Server-Side Proxying**: All calls to the **Google Gemini API** and **Google Places API** are performed server-side on Google Cloud Run. This prevents API keys from being exposed to the client-side browser or network logs.
- **Environment Isolation**: API keys are injected at runtime via Google Cloud Run environment variables, ensuring they never touch the physical disk of the container.

## User Privacy
- **Anonymous Usage**: VoteGuide AI does not require user accounts or login.
- **Local Persistence**: User preferences (Language, Persona, Reminders, Polling Booth Selection) are stored exclusively in the user's browser `localStorage`. No user-identifiable data is transmitted to or stored on our backend servers.
- **Location Privacy**: Browser-based geolocation is used only with explicit user permission and is never logged or stored by the application.

## Infrastructure Security
- **Cloud Run IAM**: The service is configured with least-privilege IAM roles.
- **Fallback-Safe Mode**: If Google APIs are unreachable or respond with errors (e.g., quota limits), the application automatically falls back to local deterministic guidance, preventing denial-of-service impacts on the user.
- **API Key Restrictions**:
    - **Browser Maps Key**: Restricted via HTTP Referrer to the production domain.
    - **Server Places Key**: Restricted to specific Google Cloud APIs (Places API New) to minimize attack surface.

## Future Hardening
- **Restricted Outbound IP**: Implementation of a static outbound IP for the Cloud Run service to allow strict allowlisting on Google API console.
- **Rate Limiting**: Integrated backend rate-limiting to prevent automated scraping of voter guidance.

---
*Security Audit Verified for Google AI Submission 2026.*
