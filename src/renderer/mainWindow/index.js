/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: index.js
 Description: This is the entry point for the main window. It shows the timetable for the current day.
*/

const timetable = document.getElementById("timetable");

const { ipcRenderer } = window.require("electron");

const { delData } = require("../../services/storageService.js");

const logoutbutton = document.getElementById("logoutBtn");
const refreshButton = document.getElementById("refreshBtn");

async function loadTimetable(refresh = false) {
  if (refresh) {
    timetabletext.textContent = "";
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const timetable = await ipcRenderer.invoke("get-today-timetable", refresh);
  timetabletext.textContent = JSON.stringify(timetable);
}

logoutbutton.addEventListener("click", async (event) => {
  await ipcRenderer.invoke("untis-logout");
  await ipcRenderer.invoke("units-del-instance");
  await delData();
  await ipcRenderer.invoke(
    "switch-window",
    "src/renderer/mainWindow/tabs/login/login.html",
  );
});

loadTimetable();

refreshButton.addEventListener("click", async (event) => {
  refreshButton.style.animation = "fullrotate 0.5s ";
  await loadTimetable(true);
  refreshButton.style.animation = "";
});

window.addEventListener("keydown", async (event) => {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "r") {
    event.preventDefault();
    refreshButton.style.animation = "fullrotate 0.5s ";
    await loadTimetable(true);
    refreshButton.style.animation = "";
  }
});
