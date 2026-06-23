/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: trayIcon.js
 Description: This file crates the tray icon for the App.
        The features are, that you can single (for smal Window) or doubble click (for the large window) on the Tray icon. 
        You can also right click on the tray icon for also a logout (logsout of every window) and exit button (closes the app)
*/

const { app, Menu, Tray } = require("electron");
const { PATHS } = require("../utils/constants.js");

function createTray({
  createWindow,
  hasUserInstance,
  userWipeEverything,
  getMainWindow,
  getMiniWindow,
}) {
  const tray = new Tray(PATHS.ICON_PATH);
  let singleClickTimer = null;

  const menu = Menu.buildFromTemplate([
    {
      label: "Open Main Window",
      click: async () => {
        const mainWin = getMainWindow();
        const miniWin = getMiniWindow();

        if (!mainWin) {
          createWindow(!(await hasUserInstance()), true, mainWin, miniWin);
        } else {
          mainWin.show();
        }
      },
    },
    {
      label: "Open Mini Window",
      click: async () => {
        const miniWin = getMiniWindow();
        const mainWin = getMainWindow();

        if (!miniWin) {
          createWindow(!(await hasUserInstance()), !(await hasUserInstance()), mainWin, miniWin);
        } else {
          miniWin.show();
        }
      },
    },
    { label: "Logout", click: () => userWipeEverything() },
    { label: "Exit", click: () => app.quit() },
  ]);

  tray.setContextMenu(menu);
  tray.setToolTip("WebSumize");

  tray.on("double-click", async () => {
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
      singleClickTimer = null;
    }

    const mainWin = getMainWindow();
    const miniWin = getMiniWindow();

    if (mainWin) {
      mainWin.show();
    } else {
      createWindow(!(await hasUserInstance()), true, mainWin, miniWin);
    }
  });

  tray.on("click", () => {
    const miniWin = getMiniWindow();
    const mainWin = getMainWindow();
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
    }

    singleClickTimer = setTimeout(async () => {
      createWindow(!(await hasUserInstance()), !(await hasUserInstance()), mainWin, miniWin);
      singleClickTimer = null;
    }, 300);
  });
}

module.exports = { createTray };
