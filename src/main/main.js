/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: main.js
 Description: Main process of WebSumize. Manages IPC, user authentication, and WebUntis data.
*/

const { app } = require("electron");
const path = require("path");
const { WebUntis, WebUntisSecretAuth } = require("webuntis");
const { authenticator: Authenticator } = require("otplib");

const { PATHS, initalizeNullVariables } = require("../utils/constants.js");

const {
  getData,
  delData,
  delTimetableCache,
} = require("../services/storageService.js");

const { createTray, updateTray } = require("./trayIcon.js");

const { createWindow } = require("./windows.js");
const { setupIpcHandlers } = require("./ipc/mainHandeler.js");

let untisInstance = null;
let mainWin = null;
let miniWin = null;

function getUntisInstance() {
  return untisInstance;
}

function setUntisInstance(val) {
  untisInstance = val;
}

function getMainWindow() {
  return mainWin;
}

function getMiniWindow() {
  return miniWin;
}

function setMainWindow(win) {
  mainWin = win;
}

function setMiniWindow(win) {
  miniWin = win;
}

function openLoginWindow() {
  createWindow(
    true,
    true,
    getMainWindow,
    getMiniWindow,
    setMainWindow,
    setMiniWindow,
  );
}

function refreshTray() {
  updateTray(
    createWindow,
    hasUserInstance,
    userWipeEverything,
    getMainWindow,
    getMiniWindow,
    setMainWindow,
    setMiniWindow,
  );
}

app.whenReady().then(async () => {
  await initalizeNullVariables(app);
  setupIpcHandlers({
    getUntisInstance,
    setUntisInstance,
    createUnitsInstance,
    getMainWindow,
    getMiniWindow,
    setMainWindow,
    setMiniWindow,
    refreshTray,
  });

  createTray({
    createWindow,
    hasUserInstance,
    userWipeEverything,
    getMainWindow,
    getMiniWindow,
    setMainWindow,
    setMiniWindow,
  });

  untisInstance = await createUnitsInstance();
  if (untisInstance) {
    try {
      await untisInstance.login();
      refreshTray();
      return;
    } catch (err) {
      console.error("Problem with login (File: main.js) " + err.message);
      untisInstance = null;
    }
  }
  openLoginWindow();
});

app.on("window-all-closed", () => {
  // Don't quit the app if all windows are closed
  // User can quit via the tray menu "Quit" option
});

async function hasUserInstance() {
  return untisInstance != null;
}

async function createUnitsInstance(data) {
  if (!data) {
    data = await getData();
  }
  const userData = JSON.parse(data);

  try {
    for (const value of Object.values(userData)) {
      if (value === "") {
        return null;
      }
    }
  } catch {
    return null;
  }

  let untisObject = undefined;

  if (userData.secretKey) {
    untisObject = new WebUntisSecretAuth(
      userData.schoolName,
      userData.username,
      userData.secretKey,
      userData.schoolUrl,
      "Awesome",
      Authenticator,
      true,
    );
  } else {
    untisObject = new WebUntis(
      userData.schoolName,
      userData.username,
      userData.password,
      userData.schoolUrl,
      undefined,
      true,
    );
  }
  return untisObject;
}

async function userWipeEverything() {
  if (untisInstance) {
    try {
      await untisInstance.logout();
    } catch (err) {
      console.error("Problem with logout (File: main.js) " + err.message);
    }
  }
  untisInstance = null;
  await delData();
  await delTimetableCache();
  if (miniWin) {
    miniWin.close();
  }

  refreshTray();

  const loginPage = path.join(
    PATHS.USERROOT,
    "src/renderer/mainWindow/tabs/login/login.html",
  );

  if (mainWin && mainWin.webContents.getURL() !== `file://${loginPage}`) {
    mainWin.loadFile(loginPage);
  } else {
    openLoginWindow();
  }
}
