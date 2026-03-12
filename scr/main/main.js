// This File is the entry point for the Electron App
// It creates the main window and handles IPC communication

const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const { getData, delData } = require("../services/storageService.js");
const path = require("path");
const { WebUntis } = require("webuntis");
const { update } = require("./update.js");

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
  if (login) {
    win.loadFile(
      path.join(__dirname, "../renderer/mainWindow/tabs/login/login.html"),
    );
  } else {
    win.loadFile(path.join(__dirname, "../renderer/mainWindow/index.html"));
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
        console.error("Login failed:", err);
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
    "htl-ibk",
    userData.username,
    userData.password,
    "htl-ibk.webuntis.com",
  ));
}

async function setupIcpHandelers() {
  ipcMain.handle("units-create-instance", async () => {
      untisInstance = await createUnitsInstance();
      if (untisInstance == null) {
        ipcRenderer.invoke("switch-window", "../renderer/mainWindow/tabs/login/login.html");
      }
  });

  ipcMain.handle("untis-login", async () => {
    await untisInstance.login();
    return "logged in";
  });

  ipcMain.handle("switch-window", async (event, windowName) => {
    if (!win) createWindow();
    win.loadFile(path.join(__dirname, windowName));
  });

  ipcMain.handle("get-today-timetable", async () => {
    if (!untisInstance) throw new Error("Not logged in to WebUntis.");
    return await untisInstance.getOwnTimetableForToday();
  });
}
