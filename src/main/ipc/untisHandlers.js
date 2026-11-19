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

function setupUntisHandlers({
  getUntisInstance,
  setUntisInstance,
  createUnitsInstance,
  refreshTray,
}) {
  ipcMain.handle("units-create-instance", async (event, data) => {
    setUntisInstance(await createUnitsInstance(data));
  });

  ipcMain.handle("untis-login", async () => {
    const untis = getUntisInstance();
    let needs2FA = false;
    try {
      if (untis) {
        await untis.login();
      }
    } catch (err) {
      needs2FA = err.message.includes("2FA");
      if (!needs2FA) {
        setUntisInstance(null);
        throw err;
      }
    } finally {
      refreshTray();
    }
    return { "2FA": needs2FA };
  });

  ipcMain.handle("units-del-instance", async () => {
    setUntisInstance(null);
    refreshTray();
  });

  ipcMain.handle("untis-logout", async () => {
    const instance = getUntisInstance();
    if (instance) {
      try {
        await instance.logout();
      } catch (err) {
        console.error("Problem with logout (File: untisHandlers.js) " + err.message);
      }
    }
    refreshTray();
  });

  ipcMain.handle("get-today-timetable", async (event, refresh) => {
    const instance = getUntisInstance();
    if (!instance) throw new Error("Not logged in to WebUntis.");
    return await getTodayTimetable(instance, refresh);
  });
}

module.exports = { setupUntisHandlers };
