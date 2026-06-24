/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: ipc/windowHandlers.js
 Description: IPC handlers for window navigation and management.
*/

const { ipcMain } = require("electron");
const path = require("path");
const { PATHS } = require("../../utils/constants.js");
const { createWindow } = require("../windows.js");

function setupWindowHandlers({ getMainWindow, getMiniWindow, setMainWindow, setMiniWindow }) {
  ipcMain.handle("switch-window", async (event, windowName) => {
    let mainWin = getMainWindow();
    if (!mainWin) {
      const result = createWindow(
        false,
        true,
        getMainWindow,
        getMiniWindow,
        setMainWindow,
        setMiniWindow,
      );
      mainWin = result.mainWin;
    }
    mainWin.loadFile(path.join(PATHS.USERROOT, windowName));
    mainWin.show();
  });
}

module.exports = { setupWindowHandlers };