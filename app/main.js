/* Finders of Paths License v1.0
 See LICENSE file in the root of this repository for details.
 Unauthorized commercial use is prohibited. */

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,        // MUST be true to use contextBridge
            nodeIntegration: false,        // Should also be false for security
            enableRemoteModule: false,     // Optional, disables remote if unused
            preload: path.join(__dirname, 'js', 'preload.js'), // Required for contextBridge to run
            sandbox: false               // Required to get console logging to work.
        },
    });

    win.loadFile('index.html');
    //win.webContents.openDevTools(); // This opens DevTools when the app starts
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
