/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: index.js
 Description: This is the entry point for the main window. It shows the timetable for the current day.
*/

const { ipcRenderer } = window.require("electron");

const { delData } = require("../../services/storageService.js");

const logoutbutton = document.getElementById("logoutBtn");

async function loadTimetable() {
  const timetable = await ipcRenderer.invoke("get-today-timetable");
  const txt = document.createElement("p");
  txt.textContent = JSON.stringify(timetable);
  document.body.appendChild(txt);
}

logoutbutton.addEventListener("click", async (event) => {
  event.preventDefault();
  await ipcRenderer.invoke("untis-logout");
  await ipcRenderer.invoke("units-del-instance");
  await delData();
  await ipcRenderer.invoke(
    "switch-window",
    "../renderer/mainWindow/tabs/login/login.html",
  );
});

loadTimetable();
