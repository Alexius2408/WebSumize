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
const {
  getTodayTimetable,
  getAnyTimetable,
  getHomework,
  getExams,
} = require("../api/webUnitsAPI.js");

let untisInstance = null;
let mainWin = null;
let miniWin = null;
let tray;
let trayLeftClicked = 0;

function createWindow(login = true, openMainWindow = true) {
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
}

function createTray() {
  tray = new Tray(PATHS.ICON_PATH);
  let singleClickTimer = null;

  const menu = Menu.buildFromTemplate([
    {
      label: "Open Main Window",
      click: async () => {
        if (mainWin === null || mainWin == undefined) {
          createWindow(!(await hasUserInstance()), true);
        } else {
          mainWin.show();
        }
      },
    },
    {
      label: "Open Mini Window",
      click: async () => {
        if (miniWin == null || miniWin == undefined) {
          createWindow(!(await hasUserInstance()), !(await hasUserInstance()));
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

    if (mainWin) {
      mainWin.show();
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
    if (!mainWin) {
      createWindow(false);
    }
    mainWin.loadFile(path.join(PATHS.USERROOT, windowName));
    mainWin.show();
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
  if (untisInstance) {
    await untisInstance.logout();
  }
  untisInstance = null;
  await delData();
  if (miniWin != null) {
    miniWin.close();
  }
  if (
    mainWin != null &&
    mainWin.getAppPath() !=
      path.join(PATHS.USERROOT, "src/renderer/mainWindow/tabs/login/login.html")
  ) {
    mainWin.loadFile(
      path.join(
        PATHS.USERROOT,
        "src/renderer/mainWindow/tabs/login/login.html",
      ),
    );
  } else {
    createWindow(true);
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
  const shortMsg = message.replace("\n", " ").slice(0, 200); // limit to 200 chars

  const logMessage = `[${day} ${time}]:  ${shortMsg}\n\n`;

  fs.appendFileSync(logFilePath, logMessage, "utf8");
}
