// ═══════════════════════════════════════════════════════════════
// PawFinder — Electron desktop shell
// Runs the Express server in-process and shows it in a window.
// ═══════════════════════════════════════════════════════════════
const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const PORT = 38217;
let mainWindow = null;

// Keep one instance only — a second launch focuses the existing window.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function startServer() {
  // Store the database and uploaded documents in a writable per-user
  // location — the app directory is read-only once packaged.
  const dataDir = app.getPath('userData');
  fs.mkdirSync(dataDir, { recursive: true });
  process.env.PORT = String(PORT);
  process.env.PAWFINDER_DB = path.join(dataDir, 'pawfinder.db');
  process.env.PAWFINDER_UPLOADS = path.join(dataDir, 'uploads');

  const { start } = require('./server');
  return start();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 840,
    minWidth: 380,
    minHeight: 600,
    backgroundColor: '#060608',
    title: 'PawFinder',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Open external links in the system browser, keep app links in-app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(`http://localhost:${PORT}`)) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  try {
    await startServer();
  } catch (err) {
    dialog.showErrorBox('PawFinder failed to start', String(err && err.stack || err));
    app.quit();
    return;
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
