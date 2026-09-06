// PixelForge Studio — Electron main process
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;
let currentProjectPath = null; // last saved/opened project file (silent autosave target)

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 950,
    minWidth: 1024,
    minHeight: 620,
    backgroundColor: '#0b1020',
    title: 'PixelForge Studio',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));

  // External links (itch.io etc.) open in the OS browser; the playable demo opens as its own window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url && url.endsWith('game.html')) {
      const demo = new BrowserWindow({
        width: 1020, height: 760, backgroundColor: '#0b1020',
        title: 'Village Quest', autoHideMenuBar: true,
        webPreferences: { contextIsolation: true, nodeIntegration: false }
      });
      demo.loadFile(path.join(__dirname, '..', 'game.html'));
    } else if (url && /^https?:/i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* ---------- IPC: project open / save / export ---------- */

ipcMain.handle('save-project', async (e, content, manual) => {
  try {
    if (!currentProjectPath) {
      if (manual) {
        const r = await dialog.showSaveDialog(win, {
          title: 'Save PixelForge Project',
          defaultPath: path.join(app.getPath('documents'), 'my-game.pixelforge.json'),
          filters: [{ name: 'PixelForge Project', extensions: ['json'] }]
        });
        if (r.canceled || !r.filePath) return { ok: false, canceled: true };
        currentProjectPath = r.filePath;
      } else {
        // Silent autosave to the app data dir until the user picks a location.
        currentProjectPath = path.join(app.getPath('userData'), 'autosave.pixelforge.json');
      }
    }
    fs.mkdirSync(path.dirname(currentProjectPath), { recursive: true });
    fs.writeFileSync(currentProjectPath, typeof content === 'string' ? content : JSON.stringify(content), 'utf8');
    return { ok: true, path: currentProjectPath };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
});

ipcMain.handle('open-project', async () => {
  try {
    const r = await dialog.showOpenDialog(win, {
      title: 'Open PixelForge Project',
      properties: ['openFile'],
      filters: [{ name: 'PixelForge Project', extensions: ['json'] }]
    });
    if (r.canceled || !r.filePaths.length) return { ok: false, canceled: true };
    const p = r.filePaths[0];
    const content = fs.readFileSync(p, 'utf8');
    currentProjectPath = p;
    return { ok: true, content, path: p };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
});

ipcMain.handle('export-files', async (e, files) => {
  try {
    const r = await dialog.showOpenDialog(win, {
      title: 'Choose export folder',
      properties: ['openDirectory', 'createDirectory']
    });
    if (r.canceled || !r.filePaths.length) return { ok: false, canceled: true };
    const dir = r.filePaths[0];
    if (!Array.isArray(files)) return { ok: false, error: 'Bad file list' };
    for (const f of files) {
      const name = (f && f.name) || 'file';
      if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) continue;
      const target = path.join(dir, name);
      if (f.type === 'png' && typeof f.content === 'string' && f.content.startsWith('data:')) {
        const b64 = f.content.split(',')[1] || '';
        fs.writeFileSync(target, Buffer.from(b64, 'base64'));
      } else {
        fs.writeFileSync(target, typeof f.content === 'string' ? f.content : JSON.stringify(f.content), 'utf8');
      }
    }
    return { ok: true, dir };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
});
