/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: ipc/untisHandlers.js
 Description: IPC handlers for WebUntis instance management and data fetching.
*/

const { ipcMain } = require("electron");
const { getTodayTimetable } = require("../../api/webUnitsAPI.js");
const { updateTray } = require("../trayIcon.js");

function setupUntisHandlers({
  getUntisInstance,
  setUntisInstance,
  createUnitsInstance,
  createWindow,
  hasUserInstance,
  userWipeEverything,
  getMainWindow,
  getMiniWindow,
  setMainWindow,
  setMiniWindow,
}) {
  ipcMain.handle("units-create-instance", async () => {
    setUntisInstance(await createUnitsInstance());
  });

  ipcMain.handle("untis-login", async () => {
    const untis = getUntisInstance();
    if (untis) {
      await untis.login();
    }
    updateTray(
      createWindow,
      hasUserInstance,
      userWipeEverything,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    );
  });

  ipcMain.handle("units-del-instance", async () => {
    if (getUntisInstance() != null) setUntisInstance(null);
    updateTray(
      createWindow,
      hasUserInstance,
      userWipeEverything,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    );
  });

  ipcMain.handle("untis-logout", async () => {
    const instance = getUntisInstance();
    if (instance) await instance.logout();
    updateTray(
      createWindow,
      hasUserInstance,
      userWipeEverything,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    );
  });

  ipcMain.handle("untis-validate-session", async () => {
    const instance = getUntisInstance();
    updateTray(
      createWindow,
      hasUserInstance,
      userWipeEverything,
      getMainWindow,
      getMiniWindow,
      setMainWindow,
      setMiniWindow,
    );
    if (!instance) return true;
    return await instance.validateSession();
  });

  ipcMain.handle("get-today-timetable", async (event, refresh) => {
    const instance = getUntisInstance();
    if (!instance) throw new Error("Not logged in to WebUntis.");
    return await getTodayTimetable(instance, refresh);
  });
}

module.exports = { setupUntisHandlers };
