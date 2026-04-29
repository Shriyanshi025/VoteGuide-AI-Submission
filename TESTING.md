# Testing Report - VoteGuide AI

## Testing Strategy
VoteGuide AI uses a multi-layered deterministic testing suite to ensure reliability and safety without external API dependencies.

### Automated Test Count: 41
### CI Status: Enabled (GitHub Actions)

## Test Categories
| Category | Description | Status |
|----------|-------------|--------|
| **Guardrails** | Blocks off-topic queries (coding, sports, jokes, etc.) | PASS |
| **Persona Styles** | Tailors responses to First-Time, Busy, Elderly, and Accessibility personas | PASS |
| **Localization** | Verified support for English, Hindi, Bengali, Tamil, and Telugu | PASS |
| **Reminders** | Persistence and notification logic for election reminders | PASS |
| **Quick Actions** | Ensures all 7 core shortcuts are present and functional | PASS |
| **Formatting** | Validates Simple, Concise, and Detailed explanation modes | PASS |
| **Settings** | Verifies theme toggling, font scaling, and language switching | PASS |

## Feature Verification Table
| Feature | Test Type | Status |
|---------|-----------|--------|
| Off-topic blocking | Automated | PASS |
| Persona Guidance | Automated | PASS |
| Multi-language UI | Automated | PASS |
| Reminder Storage | Automated | PASS |
| Quick Action Labels| Automated | PASS |
| Dark Mode Toggling | Automated | PASS |
| Simple Mode State  | Automated | PASS |
| Booth Finder Link  | Manual | PASS |
| Voice Recognition  | Manual | PASS |

## How to Run Tests
1. Install dependencies: `npm install`
2. Run unit tests: `npm test`
3. Run coverage report: `npm run test:coverage`

## Continuous Integration
A GitHub Actions workflow is configured in `.github/workflows/test.yml` which automatically runs the test suite and build process on every push and pull request to the `main` branch.

## Manual Test Checklist
- [x] Verify Dark Mode contrast in both modes.
- [x] Test "Find Booth" redirection to Google Maps.
- [x] Verify screen reader compatibility for quick actions.
- [x] Check font scaling responsiveness in mobile view.

## Known Limitations
- All tests are deterministic; no real-world geolocation or live API calls are tested in unit tests.
- UI component visual regressions require manual verification.

---
*Verified for Google AI Submission 2026.*
