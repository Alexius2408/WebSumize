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

function setupUntisHandlers({ getUntisInstance, setUntisInstance, createUnitsInstance }) {
  ipcMain.handle("units-create-instance", async () => {
    setUntisInstance(await createUnitsInstance());
  });

  ipcMain.handle("untis-login", async () => {
    const instance = getUntisInstance();
    if (instance) await instance.login();
  });

  ipcMain.handle("units-del-instance", async () => {
    if (getUntisInstance() != null) setUntisInstance(null);
  });

  ipcMain.handle("untis-logout", async () => {
    const instance = getUntisInstance();
    if (instance) await instance.logout();
  });

  ipcMain.handle("untis-validate-session", async () => {
    const instance = getUntisInstance();
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
