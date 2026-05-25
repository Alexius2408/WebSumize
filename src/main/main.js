/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: main.js
 Description: Main process of WebSumize. Manages window creation, IPC, user authentication, and WebUntis data.
*/

const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Tray,
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
const { update } = require("./update.js");
const { getData, delData } = require("../services/storageService.js");
const { getTodayTimetable, getAnyTimetable, getHomework, getExams } = require("../api/webUnitsAPI.js");

let untisInstance = null;
let win = null;
let tray;
let trayLeftClicked = 0;

function createWindow(login = true, mainWindow = true) {
  win = new BrowserWindow({
    width: mainWindow
      ? GENERALLY.SCREEN_WIDTH
      : Math.floor(GENERALLY.SCREEN_WIDTH * 0.33),
    height: mainWindow
      ? GENERALLY.SCREEN_HEIGHT
      : Math.floor(GENERALLY.SCREEN_HEIGHT * 0.68),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: mainWindow,
    frame: mainWindow,
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

  win.on("blur", () => {
    if (!mainWindow) {
      win.close();
    }
  });

  win.on("closed", () => {
    win = null;
  });

  if (login) {
    win.loadFile(
      path.join(
        PATHS.USERROOT,
        "src/renderer/mainWindow/tabs/login/login.html",
      ),
    );
  } else if (mainWindow) {
    win.loadFile(
      path.join(PATHS.USERROOT, "src/renderer/mainWindow/index.html"),
    );
  } else {
    win.loadFile(
      path.join(PATHS.USERROOT, "src/renderer/miniWindow/mini.html"),
    );
  }
}

function createTray() {
  tray = new Tray(PATHS.ICON_PATH);
  let singleClickTimer = null;

  const menu = Menu.buildFromTemplate([
    {
      label: "Open Main Window",
      click: async () => createWindow(!(await hasUserInstance()), true),
    },
    {
      label: "Open Mini Window",
      click: async () =>
        createWindow(!(await hasUserInstance()), !(await hasUserInstance())),
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

    if (win) {
      win.show();
    } else {
      createWindow(!(await hasUserInstance()));
    }
  });

  tray.on("click", () => {
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
    }

    singleClickTimer = setTimeout(async () => {
      createWindow(!(await hasUserInstance()), !(await hasUserInstance()));
      singleClickTimer = null;
    }, 300);
  });
}

app.whenReady().then(async () => {
  await initalizeNullVariables(app);
  setupIcpHandelers();
  createTray();

  if (untisInstance) {
    update();
  }

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
        LogWrite("Problem with login (File: main.js) " + err.message);
        createWindow(true);
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
    if (untisInstance === null) {
      createWindow(true);
    } else {
      if (!win) createWindow();
      win.loadFile(path.join(PATHS.USERROOT, windowName));
    }
  });

  ipcMain.handle("get-today-timetable", async (event, refresh) => {
    if (!untisInstance) throw new Error("Not logged in to WebUntis.");
    return await getTodayTimetable(untisInstance, refresh);
  });

  ipcMain.handle("get-app-path", (event, arguemnt) => {
    if (arguemnt === "") return app.getAppPath();
    return app.getAppPath(arguemnt);
  });

  ipcMain.handle("log-error", (event, msg) => {
    LogWrite(msg);
  });
}

async function userWipeEverything() {
  untisInstance.logout();
  untisInstance = null;
  await delData();
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
  const shortMsg = message.replace("\n", " ").slice(0, 200); // limit to 200 chars

  const logMessage = `[${day} ${time}]:  ${shortMsg}\n\n`;

  fs.appendFileSync(logFilePath, logMessage, "utf8");
}
