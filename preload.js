window.platform = require("os").platform();

const { TrzszFilter } = require("trzsz");
const { ipcRenderer } = require("electron");
const fsp = require('fs/promises');
const { SerialPort, ReadlineParser } = require('serialport')

// node-pty proxy
class PtyProxy {
  constructor(...args) {
    ipcRenderer.send("pty:spawn", ...args);
  }

  on(evt, handler) {
    ipcRenderer.on(`pty:on${evt}`, (_event, ...args) => handler(...args));
  }

  write(data) {
    ipcRenderer.send("pty:write", data);
  }

  resize(cols, rows) {
    ipcRenderer.send("pty:resize", cols, rows);
  }
}

window.spawnPTY = function (...args) {
  return new PtyProxy(...args);
};
// window.getFile = function (path) {
//   return fsp.readFile(path);
// };

// window.getPorts = function (port) {
//   return new SerialPort({ path: port, baudRate: 9600 })
// };
