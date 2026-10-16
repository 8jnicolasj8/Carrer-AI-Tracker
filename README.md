# Career AI Tracker (Beta 0.1)

> An open source desktop companion for FIFA 16 (PC) Career Mode that visualizes results, club telemetry, squad statistics, and an interactive staff room directly from career save files.

---

## What It Is and What It Is Not

- **What it is:**
  - An offline, read-only desktop application for Windows built with Electron, React, TypeScript, and Vite.
  - A tactical career companion that parses save data dumps into clean match feeds, financial telemetry, squad overviews, and deterministically generated staff reactions.
  - Fully localized in English and Spanish (`en` / `es`).
  - Open source under the MIT License.

- **What it is NOT:**
  - **Not a real-time live match ticker**: Save data only changes when the game saves; there are no minute-by-minute live game events while playing on the pitch.
  - **Not a save editor**: The application is strictly read-only. It never writes to, modifies, or deletes anything in your game saves or FIFA 16 installation directories.
  - **Not affiliated with EA Sports**: This project contains no proprietary code, game databases, official logos, face pictures, or copyright-protected EA assets.

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+)
- Windows 10/11 (for desktop packaging)

### Installation & Running

```bash
# Navigate to the desktop application workspace
cd apps/desktop

# Install dependencies
npm install

# Start in development mode (starts in Demo Mode using fixtures/)
npm run dev
```

### Running Tests

```bash
# In apps/desktop
npm test
```

### Building the Windows Installer (NSIS)

```bash
# In apps/desktop
npm run dist
```
*Note: The generated installer (`.exe`) is located in `apps/desktop/release/`. Because local development builds are self-signed/unsigned, Windows SmartScreen may display a standard prompt.*

---

## Roadmap

- **Beta 0.1 (Current)**: Read-only UI, strict data contracts, demo mode with fixtures, JSON/JSONL reader, deterministic template staff messages and club events, compliance tracking.
- **Beta 0.2**: Integrated save reader engine and live directory watcher.
- **Beta 0.3**: Optional AI integration (bring-your-own-key for Gemini, OpenAI, Claude).

---

## License

[MIT License](LICENSE) © 2026 Career AI Tracker Contributors.
