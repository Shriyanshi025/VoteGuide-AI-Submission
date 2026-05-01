# Testing Report - VoteGuide AI

## Testing Strategy
VoteGuide AI prioritizes reliability through a multi-layered testing approach:
1. **Automated Unit Tests**: Using Vitest and JSDOM to verify core logic, guardrails, and persona behaviors in a deterministic environment.
2. **Manual UX Testing**: Verification of UI responsiveness, accessibility features, and complex user flows.
3. **Guardrail Validation**: Stress-testing the AI orchestrator with off-topic and adversarial prompts to ensure adherence to voter guidance.

## Automated Tests List
| Test File | Description | Status |
|-----------|-------------|--------|
| `quickActions.test.ts` | Verifies that the greeting includes all 7 core quick actions. | PASS |
| `guardrail.test.ts` | Ensures off-topic queries (jokes, weather) are redirected. | PASS |
| `persona.test.ts` | Validates that responses are tailored to different voter personas. | PASS |
| `reminder.test.ts` | Tests localStorage persistence for vote day reminders. | PASS |
| `language.test.ts` | Verifies multi-language support (EN, HI, BN, TA, TE). | PASS |
| `health.test.ts` | Verifies Google services configuration and server-key detection. | PASS |
| `places.test.ts` | Validates multi-query search strategy and legacy fallback logic. | PASS |

## Manual Test Cases
| Feature | Case | Expected Result | Status |
|---------|------|-----------------|--------|
| Greeting | User opens app | App presents a friendly greeting and 7 quick actions. | PASS |
| Booth Finder | User opens Booth Finder | App detects location and shows live nearby polling help suggestions. | PASS |
| Booth Fallback | Places API fails | UI shows a helpful message and 100% reliable Google Maps deep-links. | PASS |
| Reminder | User sets a reminder | A notification is scheduled/shown when due. | PASS |
| Dark Mode | Toggle theme | App switches between high-contrast light and dark modes. | PASS |
| Accessibility | Screen Reader test | All core buttons have descriptive ARIA labels. | PASS |
| Google Services | GET /health/google | Backend returns Google services status and configuration check. | PASS |

## Features Tested
- **Greeting & Quick Actions**: Immediate access to top voter queries.
- **Guardrails**: Protection against non-electoral topics.
- **Persona Intelligence**: Deterministic behavioral guidance for first-time voters, professionals, and seniors.
- **Reminders**: Browser-based persistence for critical dates.
- **Localization**: Native support for 5 major Indian languages.
- **Booth Finder**: Mapping integration for physical guidance.

## Known Limitations
- Geolocation accuracy depends on browser permissions and device hardware.
- Local guardrail uses keyword matching and basic intent logic; advanced conversational nuances may require LLM activation.

## How to Run Tests
1. Install dependencies: `npm install`
2. Run automated tests: `npm test`
3. Build for production: `npm run build`

---
*Verified for Google AI Submission 2026.*
