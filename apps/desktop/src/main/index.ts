/**
 * apps/desktop/src/main/index.ts
 * 
 * Electron Main Process for Career AI Tracker.
 * Manages window lifecycle, secure IPC, and settings repository in userData.
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { CareerDataReader } from '../data/reader';

let mainWindow: BrowserWindow | null = null;
let currentDataReader: CareerDataReader | null = null;

function getSettingsPath(): string {
  const userData = app.getPath('userData');
  return path.join(userData, 'settings.json');
}

function loadSavedSettings(): Record<string, any> {
  try {
    const p = getSettingsPath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading settings from userData:', err);
  }
  return {
    language: 'en',
    compactMode: false,
    showNews: true,
    fileWatchEnabled: true,
    customDataPath: null,
    personalities: {
      presidentStrictness: 6,
      assistantAggression: 5,
      scoutRiskTolerance: 5,
      mediaConfidence: 6,
      youthFocus: 7,
    },
    indicators: {
      team_morale: 70,
      media_pressure: 40,
      board_confidence: 75,
    },
    sanctions: [],
  };
}

function saveSettingsToDisk(settings: Record<string, any>): boolean {
  try {
    const p = getSettingsPath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(p, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving settings to userData:', err);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#05121a',
    title: 'Career AI Tracker',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../renderer/index.html'));
  }

  // Prevent navigation to external URLs (strictly offline)
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });
}

// IPC Handlers
ipcMain.handle('dialog:selectDirectory', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select FIFA 16 Save Reader Data Folder',
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

ipcMain.handle('data:load', async (_event, customPath?: string) => {
  const settings = loadSavedSettings();
  const targetDir = customPath || settings.customDataPath || undefined;

  currentDataReader = new CareerDataReader(targetDir);
  return currentDataReader.loadAll();
});

ipcMain.handle('settings:get', async () => {
  return loadSavedSettings();
});

ipcMain.handle('settings:save', async (_event, settings: any) => {
  return saveSettingsToDisk(settings);
});

ipcMain.handle('app:getInfo', async () => {
  return {
    version: '0.1.0-beta',
    isDemo: currentDataReader ? currentDataReader.isDemoMode() : true,
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
