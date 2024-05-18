const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    transferFile: async (filePath, portPath, baudRate) => ipcRenderer.invoke('transfer-file', filePath, portPath, baudRate),
    onTransferProgress: (callback) => ipcRenderer.on('transfer-progress', (event, progress) => callback(progress)),
    onTransferLog: (callback) => ipcRenderer.on('transfer-log', (event, log) => callback(log)),
    showOpenDialog: async (options) => ipcRenderer.invoke('show-open-dialog', options),
});
