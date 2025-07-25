/* Finders of Paths License v1.0
 See LICENSE file in the root of this repository for details.
 Unauthorized commercial use is prohibited. */


/**
 * Electron Preload Script
 * 
 * This script bridges the gap between the secure renderer context and Node.js/Electron APIs,
 * exposing safe, controlled functions to the frontend via `contextBridge`.
 */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose limited IPC functionality to the renderer via `window.api`.
 * Prevents direct access to Node.js for security.
 */
contextBridge.exposeInMainWorld('api', {
    /**
     * Send a message to the main process on a specified channel.
     * @param {string} channel - The IPC channel name.
     * @param {*} data - Payload to send.
     */
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },

    /**
     * Listen for a message from the main process on a specified channel.
     * @param {string} channel - The IPC channel to listen to.
     * @param {function} func - Callback to execute when message is received.
     */
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
