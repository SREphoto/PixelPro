// PixelForge Studio — preload bridge (safe, context-isolated)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pixelForgeDesktop', {
  saveProject: (content, manual) => ipcRenderer.invoke('save-project', content, !!manual),
  openProject: () => ipcRenderer.invoke('open-project'),
  exportFiles: (files) => ipcRenderer.invoke('export-files', files)
});
