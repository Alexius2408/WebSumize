/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: update.js
 Description: Checks if the WebUntis session is still valid and logs in again if necessary.
*/

const { ipcRenderer } = require('electron');

async function update(untisInstance) {

    try {
        if (!ipcRenderer.invoke("untis-validate-session")) {
            await ipcRenderer.invoke("untis-login");
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = { update };