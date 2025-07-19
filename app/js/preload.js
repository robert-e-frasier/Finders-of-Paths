/* Finders of Paths License v1.0
 See LICENSE file in the root of this repository for details.
 Unauthorized commercial use is prohibited. */


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
