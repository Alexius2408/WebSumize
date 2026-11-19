/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: ipc/systemHandlers.js
 Description: IPC handlers for system-level operations like app path and logging.
*/

const { ipcMain, app } = require("electron");
const { default: isOnline } = require("is-online");

function setupSystemHandlers() {
  ipcMain.handle("get-app-path", (event, arguemnt) => {
    if (arguemnt === "") return app.getAppPath();
    return app.getAppPath(arguemnt);
  });

  ipcMain.handle("is-online", async () => {
    return await isOnline();
  });
}

module.exports = { setupSystemHandlers };