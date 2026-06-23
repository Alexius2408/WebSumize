/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: windows.js
 Description:
*/

const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Menu,
  screen,
} = require("electron");
const path = require("path");

const { GENERALLY, PATHS } = require("../utils/constants.js");

function createWindow(login = true, openMainWindow = true, mainWin, miniWin) {
  if ((openMainWindow || login) && mainWin) {
    if (mainWin.isMinimized()) {
      mainWin.restore();
    }
    mainWin.focus();
    return (mainWin, miniWin);
  }
  const newWindow = new BrowserWindow({
    width: openMainWindow
      ? GENERALLY.SCREEN_WIDTH
      : Math.floor(GENERALLY.SCREEN_WIDTH * 0.33),
    height: openMainWindow
      ? GENERALLY.SCREEN_HEIGHT
      : Math.floor(GENERALLY.SCREEN_HEIGHT * 0.68),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: openMainWindow,
    frame: openMainWindow,
    icon: PATHS.ICON_PATH,
  });

  newWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  newWindow.webContents.on("will-navigate", (event, url) => {
    // Only open external links in default browser
    if (url !== newWindow.webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  newWindow.on("blur", () => {
    if (!openMainWindow) {
      newWindow.close();
    }
  });

  newWindow.on("closed", () => {
    if (openMainWindow) {
      mainWin = null;
    } else {
      miniWin = null;
    }
  });

  if (openMainWindow) {
    mainWin = newWindow;
  } else {
    miniWin = newWindow;
  }

  if (login) {
    newWindow.loadFile(
      path.join(
        PATHS.USERROOT,
        "src/renderer/mainWindow/tabs/login/login.html",
      ),
    );
  } else if (openMainWindow) {
    newWindow.loadFile(
      path.join(PATHS.USERROOT, "src/renderer/mainWindow/index.html"),
    );
  } else {
    newWindow.loadFile(
      path.join(PATHS.USERROOT, "src/renderer/miniWindow/mini.html"),
    );
  }

  return (mainWin, miniWin);
}

module.exports = { createWindow };
