# Contributing to Career AI Tracker

Thank you for your interest in contributing to Career AI Tracker!

## Philosophy & Core Rules
1. **Strictly Read-Only**: The app never writes into FIFA 16 save folders or game installations. Any feature proposing write operations to career saves or game files will be rejected.
2. **Zero Telemetry & Offline by Default**: In Beta 0.1, the application makes no network calls whatsoever.
3. **No EA/FIFA Assets**: Do not commit real club badges, player face scans, proprietary database tables, or official EA logos. Use generic shields and fictional placeholder datasets.
4. **Clean Code & Testing**: All core parser, engine, and flag behaviors must have automated Vitest coverage.
5. **Privacy & Anonymization**: Do not commit local filesystem paths containing user names or personal identifiers.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/career-ai-tracker.git
cd career-ai-tracker

# Install dependencies in the desktop app
cd apps/desktop
npm install

# Run the app in development demo mode
npm run dev

# Run test suites
npm test

# Run linter
npm run lint
```

## Pull Request Guidelines
- Branch naming: `feat/<feature-name>`, `fix/<bug-name>`, `docs/<description>`.
- Make sure all Vitest unit tests pass.
- Verify that `git grep -i "Users\\\\"` yields zero occurrences.
