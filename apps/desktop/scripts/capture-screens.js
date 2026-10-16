/**
 * apps/desktop/scripts/capture-screens.js
 * 
 * Uses Electron to render the built application and capture
 * PNG screenshots of all four screens into apps/desktop/screenshots/.
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function capture() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      offscreen: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  const indexPath = path.resolve(__dirname, '../dist/renderer/index.html');
  await win.loadFile(indexPath);
  await new Promise((r) => setTimeout(r, 1500));

  // Helper to switch tab and capture
  const takeScreen = async (key, filename) => {
    console.log(`[capture] Switching to ${filename}...`);
    await win.webContents.executeJavaScript(`
      try {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '${key}', altKey: true }));
      } catch (e) {
        console.error(e);
      }
    `);
    await new Promise((r) => setTimeout(r, 800));
    const image = await win.capturePage();
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, filename), image.toPNG());
    console.log(`[capture] Saved ${filename}`);
  };

  try {
    await takeScreen('1', 'dashboard.png');
    await takeScreen('2', 'squad.png');
    await takeScreen('3', 'staff.png');
    await takeScreen('4', 'settings.png');
    console.log('[capture] All screenshots generated successfully.');
  } catch (err) {
    console.error('[capture] Error during capture:', err);
  } finally {
    app.quit();
  }
}

app.whenReady().then(capture);
