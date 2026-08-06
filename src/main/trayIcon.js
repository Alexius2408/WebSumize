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

let tray = null
let singleClickTimer = null;
async function createTray({
  createWindow,
  hasUserInstance,
  userWipeEverything,
  getMainWindow,
  getMiniWindow,
  setMainWindow,
  setMiniWindow,
}) {
  if (!tray) {
    tray = new Tray(PATHS.ICON_PATH);
  }

  const logedin = await hasUserInstance();

  const menu = Menu.buildFromTemplate([
    {
      label: "Open Main Window",
      click: async () => {
        const mainWin = getMainWindow();

        if (!mainWin) {
          const result = createWindow(
            !logedin,
            true,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );

          setMainWindow(result.mainWin);
          setMiniWindow(result.miniWin);
        } else {
          mainWin.show();
        }
      },
    },
    {
      label: "Open Mini Window" + (logedin ? "" : " (Login required)"),
      enabled: logedin,
      click: async () => {
        let miniWin = getMiniWindow();

        if (!miniWin) {
          const result = createWindow(
            !logedin,
            !logedin,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );

          setMainWindow(result.mainWin);
          setMiniWindow(result.miniWin);
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

    let mainWin = getMainWindow();

    if (mainWin) {
      mainWin.show();
    } else {
      const result = createWindow(
        !(await hasUserInstance()),
        true,
        getMainWindow,
        getMiniWindow,
        setMainWindow,
        setMiniWindow,
      );

      setMainWindow(result.mainWin);
      setMiniWindow(result.miniWin);
    }
  });

  tray.on("click", () => {
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
    }

    singleClickTimer = setTimeout(async () => {
      const result = createWindow(
        !(await hasUserInstance()),
        !(await hasUserInstance()),
        getMainWindow,
        getMiniWindow,
        setMainWindow,
        setMiniWindow,
      );
      setMainWindow(result.mainWin);
      setMiniWindow(result.miniWin);
      singleClickTimer = null;
    }, 300);
  });
}

async function updateTray (
  createWindow,
  hasUserInstance,
  userWipeEverything,
  getMainWindow,
  getMiniWindow,
  setMainWindow,
  setMiniWindow,
) {

  if (!tray) {
    tray = new Tray(PATHS.ICON_PATH);
  }

  const logedin = await hasUserInstance();

  tray.setContextMenu(Menu.buildFromTemplate([ {
      label: "Open Main Window",
      click: async () => {
        const mainWin = getMainWindow();

        if (!mainWin) {
          const result = createWindow(
            !logedin,
            true,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );

          setMainWindow(result.mainWin);
          setMiniWindow(result.miniWin);
        } else {
          mainWin.show();
        }
      },
    },
    {
      label: "Open Mini Window" + (logedin ? "" : " (Login required)"),
      enabled: logedin,
      click: async () => {
        let miniWin = getMiniWindow();

        if (!miniWin) {
          const result = createWindow(
            !logedin,
            !logedin,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );

          setMainWindow(result.mainWin);
          setMiniWindow(result.miniWin);
        } else {
          miniWin.show();
        }
      },
    },
    { label: "Logout", click: () => userWipeEverything() },
    { label: "Exit", click: () => app.quit() },
  ]));

  }

module.exports = {
  createTray,
  updateTray
 };
