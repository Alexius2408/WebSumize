/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: main.js
 Description: Main process of WebSumize. Manages IPC, user authentication, and WebUntis data.
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
const { WebUntis } = require("webuntis");
const fs = require("fs");

const {
  GENERALLY,
  PATHS,
  initalizeNullVariables,
} = require("../utils/constants.js");
const {
  getData,
  delData,
  delTimetableCache,
} = require("../services/storageService.js");
const {
  getTodayTimetable,
  getAnyTimetable,
  getHomework,
  getExams,
} = require("../api/webUnitsAPI.js");
const { createTray } = require("./trayIcon.js");

const { createWindow } = require("./windows.js");
const { setupIpcHandlers } = require("./ipc/mainHandeler.js");

let untisInstance = null;
let mainWin = null;
let miniWin = null;
let tray;
let trayLeftClicked = 0;

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
    LogWrite,
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
  if (untisInstance == null) {
    const result = createWindow(
      true,
      true,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    );
    mainWin = result.mainWin;
    miniWin = result.miniWin;
  } else {
    let userData = await getData();

    if (!userData) {
      const result = createWindow(
        true,
        true,
        getMainWindow,
        getMiniWindow,
        setMainWindow,
        setMiniWindow,
      );
      mainWin = result.mainWin;
      miniWin = result.miniWin;
    } else {
      try {
        if (untisInstance) {
          await untisInstance.login();
        } else {
          const result = createWindow(
            true,
            true,
            getMainWindow,
            getMiniWindow,
            setMainWindow,
            setMiniWindow,
          );

          mainWin = result.mainWin;
          miniWin = result.miniWin;
        }
      } catch (err) {
        LogWrite("Problem with login (File: main.js) " + err.message);
        const result = createWindow(
          true,
          true,
          getMainWindow,
          getMiniWindow,
          setMainWindow,
          setMiniWindow,
        );
        mainWin = result.mainWin;
        miniWin = result.miniWin;
      }
    }
  }
});

app.on("window-all-closed", () => {
  // Don't quit the app if all windows are closed
  // User can quit via the tray menu "Quit" option
});

async function hasUserInstance() {
  return untisInstance != null;
}

async function createUnitsInstance() {
  let data = await getData();
  if (!data) return null;
  let userData = JSON.parse(data);
  return new WebUntis(
    userData.schoolName,
    userData.username,
    userData.password,
    userData.schoolUrl,
    undefined,
    true,
  );
}

async function userWipeEverything() {
  if (untisInstance) {
    await untisInstance.logout();
  }
  untisInstance = null;
  await delData();
  await delTimetableCache();
  if (miniWin) {
    miniWin.close();
  }
  if (
    mainWin &&
    mainWin.webContents.getURL() !==
      `file://${path.join(PATHS.USERROOT, "src/renderer/mainWindow/tabs/login/login.html")}`
  ) {
    mainWin.loadFile(
      path.join(
        PATHS.USERROOT,
        "src/renderer/mainWindow/tabs/login/login.html",
      ),
    );
  } else {
    const result = createWindow(
      true,
      true,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    );
    mainWin = result.mainWin;
    miniWin = result.miniWin;
  }
}

function createLogDir() {
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(PATHS.LOG_DIR_PATH)) {
    fs.mkdirSync(PATHS.LOG_DIR_PATH, { recursive: true });
  }
}

function LogWrite(message) {
  createLogDir();

  const date = new Date();
  const day = date.toLocaleDateString("sv-SE");
  const time = date.toLocaleTimeString("sv-SE");
  const logFilePath = path.join(PATHS.LOG_DIR_PATH, `${day}--Log.log`);
  const shortMsg = message.replaceAll("\n", " ").slice(0, 200); // limit to 200 chars

  const logMessage = `[${day} ${time}]:  ${shortMsg}\n\n`;

  fs.appendFileSync(logFilePath, logMessage, "utf8");
}
