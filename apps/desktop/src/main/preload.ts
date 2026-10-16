/**
 * apps/desktop/src/main/preload.ts
 * 
 * Secure Electron Preload Script with Context Isolation.
 * Exposes only safe, allowlisted APIs to the renderer process.
 */

import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>;
  loadCareerData: (customPath?: string) => Promise<any>;
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<boolean>;
  getAppInfo: () => Promise<{ version: string; isDemo: boolean }>;
}

const api: ElectronAPI = {
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  loadCareerData: (customPath?: string) => ipcRenderer.invoke('data:load', customPath),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
};

contextBridge.exposeInMainWorld('electronAPI', api);
