const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const SerialPort = require('serialport');
const lightYModem = require('particle-ymodem');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Ensure to set the correct path to preload.js
        },
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`); // Load your HTML file

    ipcMain.handle('transfer-file', async (event, filePath, portPath, baudRate) => {
        try {
            const file = fs.readFileSync(filePath);
            const serialPort = new SerialPort(portPath, { baudRate: baudRate });

            const modem = new lightYModem();
            modem.transfer(file, serialPort, (val) => {
                mainWindow.webContents.send('transfer-progress', Math.round(val.current * 100 / val.total));
            }, (log) => {
                mainWindow.webContents.send('transfer-log', log);
            });

            return { status: 'success' };
        } catch (error) {
            console.error('Error during file transfer:', error);
            return { status: 'error', message: error.message };
        }
    });

    ipcMain.handle('show-open-dialog', async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        return await dialog.showOpenDialog(win, options);
    });

    if (process.env.DEBUG) {
        mainWindow.openDevTools();
      }
});
