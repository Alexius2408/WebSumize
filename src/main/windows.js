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
  nativeTheme,
} = require("electron");
const path = require("path");

const { GENERALLY, PATHS } = require("../utils/constants.js");

// Only allow http/https links to be opened in the external browser.
// Other schemes (file:, smb:, etc.) can trigger OS handlers and code execution.
function openExternalSafe(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      shell.openExternal(url);
    }
  } catch {}
}

function createWindow(
  login = true,
  openMainWindow = true,
  getMainWindow,
  getMiniWindow,
  setMainWindow,
  setMiniWindow,
) {
  const mainWin = getMainWindow();
  const miniWin = getMiniWindow();
  if ((openMainWindow || login) && mainWin) {
    if (mainWin.isMinimized()) {
      mainWin.restore();
    }
    mainWin.focus();
    return { mainWin, miniWin };
  }
  const newWindow = new BrowserWindow({
    width: openMainWindow
      ? GENERALLY.SCREEN_WIDTH
      : Math.floor(GENERALLY.SCREEN_WIDTH * 0.3),
    height: openMainWindow
      ? GENERALLY.SCREEN_HEIGHT
      : Math.floor(GENERALLY.SCREEN_HEIGHT * 0.6),
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#191a1b" : "#fffdf7",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: openMainWindow,
    frame: openMainWindow,
    icon: PATHS.ICON_PATH,
    skipTaskbar: !openMainWindow,
  });

  newWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalSafe(url);
    return { action: "deny" };
  });

  newWindow.webContents.on("will-navigate", (event, url) => {
    // Only open external links in default browser
    if (url !== newWindow.webContents.getURL()) {
      event.preventDefault();
      openExternalSafe(url);
    }
  });

  newWindow.on("blur", () => {
    if (!openMainWindow) {
      newWindow.close();
      setMiniWindow(null);
    }
  });

  newWindow.on("closed", () => {
    if (openMainWindow) {
      setMainWindow(null);
    } else {
      setMiniWindow(null);
    }
  });

  if (openMainWindow) {
    setMainWindow(newWindow);
  } else {
    setMiniWindow(newWindow);
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

  return { mainWin, miniWin };
}

module.exports = { createWindow };
