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

function buildMenu(
  logedin,
  createWindow,
  userWipeEverything,
  getMainWindow,
  getMiniWindow,
  setMainWindow,
  setMiniWindow,
) {
  return Menu.buildFromTemplate([
    {
      label: "Open Main Window",
      click: async () => {
        const mainWin = getMainWindow();

        if (!mainWin) {
          createWindow(
            !logedin,
            true,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );
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
          createWindow(
            !logedin,
            !logedin,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );
        } else {
          miniWin.show();
        }
      },
    },
    { label: "Logout", click: () => userWipeEverything() },
    { label: "Exit", click: () => app.quit() },
  ]);
}

async function createTray({
  createWindow,
  hasUserInstance,
  userWipeEverything,
  getMainWindow,
  getMiniWindow,
  setMainWindow,
  setMiniWindow,
}) {
  await updateTray(
    createWindow,
    hasUserInstance,
    userWipeEverything,
    getMainWindow,
    getMiniWindow,
    setMainWindow,
    setMiniWindow,
  );
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
      createWindow(
        !(await hasUserInstance()),
        true,
        getMainWindow,
        getMiniWindow,
        setMainWindow,
        setMiniWindow,
      );
    }
  });

  tray.on("click", () => {
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
    }

    singleClickTimer = setTimeout(async () => {
      const logedin = await hasUserInstance();
      createWindow(
        !logedin,
        !logedin,
        getMainWindow,
        getMiniWindow,
        setMainWindow,
        setMiniWindow,
      );
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

  tray.setContextMenu(
    buildMenu(
      logedin,
      createWindow,
      userWipeEverything,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    ),
  );
}

module.exports = {
  createTray,
  updateTray
 };
