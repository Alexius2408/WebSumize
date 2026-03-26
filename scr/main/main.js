/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: main.js
 Description: Main process of WebSumize. Manages window creation, IPC, user authentication, and WebUntis data.
*/

const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { WebUntis } = require("webuntis");
const fs = require("fs");

const { GENERALLY } = require("../utils/constants.js");
const { update } = require("./update.js");
const { getData } = require("../services/storageService.js");

let untisInstance = null;
let win = null;

function createWindow(login = true) {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    // Only open external links in default browser
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (login) {
    win.loadFile(
      path.join(
        GENERALLY.DIRNAME,
        "../renderer/mainWindow/tabs/login/login.html",
      ),
    );
  } else {
    win.loadFile(
      path.join(GENERALLY.DIRNAME, "../renderer/mainWindow/index.html"),
    );
  }
}

app.whenReady().then(async () => {
  setupIcpHandelers();

  if (untisInstance) {
    update();
  }

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  untisInstance = await createUnitsInstance();
  if (untisInstance == null) {
    createWindow(true);
  } else {
    let userData = await getData();

    if (!userData) {
      createWindow(true);
    } else {
      try {
        if (untisInstance) {
          await untisInstance.login();
          createWindow(false);
        } else {
          createWindow();
        }
      } catch (err) {
        LogWrite("Problem with login (File: main.js, Line: 84-94) " + err.message);
        createWindow(true);
      }
    }
  }
});

async function createUnitsInstance() {
  let data = await getData();
  if (!data) return null;
  let userData = JSON.parse(data);
  return (untisInstance = new WebUntis(
    userData.schoolName,
    userData.username,
    userData.password,
    userData.schoolUrl,
  ));
}

async function setupIcpHandelers() {
  ipcMain.handle("units-create-instance", async () => {
    untisInstance = await createUnitsInstance();
  });

  ipcMain.handle("untis-login", async () => {
    if (untisInstance) {
      await untisInstance.login();
    }
  });

  ipcMain.handle("units-del-instance", async () => {
    if (untisInstance != null) {
      untisInstance = null;
    }
  });

  ipcMain.handle("untis-logout", async () => {
    if (untisInstance) {
      await untisInstance.logout();
    }
  });

  ipcMain.handle("untis-validate-session", async () => {
    if (!untisInstance) return true;
    return await untisInstance.validateSession();
  });

  ipcMain.handle("switch-window", async (event, windowName) => {
    if (!win) createWindow();
    win.loadFile(path.join(GENERALLY.DIRNAME, windowName));
  });

  ipcMain.handle("get-today-timetable", async () => {
    if (!untisInstance) throw new Error("Not logged in to WebUntis.");
    return await untisInstance.getOwnTimetableForToday();
  });
}

function createLogDir() {
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(GENERALLY.LOG_DIR_PATH)) {
    fs.mkdirSync(GENERALLY.LOG_DIR_PATH, { recursive: true });
  }
}
function LogWrite(message) {
  createLogDir();

  const date = new Date();
  const day = date.toLocaleDateString("sv-SE")
  const time = date.toLocaleTimeString("sv-SE");
  const logFilePath = path.join(GENERALLY.LOG_DIR_PATH, `${day}--Log`);
  const shortMsg = message.split('\n')[0].slice(0, 150); // Get first line and limit to 150 chars

  const logMessage = `[${day} ${time}]:  ${shortMsg}\n\n`;

  fs.appendFileSync(logFilePath, logMessage, "utf8");
}

module.exports = {
  LogWrite,
};