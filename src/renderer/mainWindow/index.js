/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: index.js
 Description: This is the entry point for the main window. It shows the timetable for the current day.
*/

const timetablebox = document.getElementById("timetable");

const { ipcRenderer } = window.require("electron");

const { delData, delTimetableCache } = require("../../services/storageService.js");
const { createTimetable, createSkeleton } = require("./index_createTimetable.js")

const logoutbutton = document.getElementById("logoutBtn");
const refreshButton = document.getElementById("refreshBtn");

const SKELETON_DELAY_MS = 120;
const SKELETON_MIN_VISIBLE_MS = 300;
const FADE_MS = 150;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fadeSwap(mutate) {
  if (!timetablebox.classList.contains("is-fading")) {
    timetablebox.classList.add("is-fading");
    await sleep(FADE_MS);
  }
  mutate();
  timetablebox.classList.remove("is-fading");
}

async function loadTimetable(refresh = false) {
  let skeletonShown = null;
  const skeletonTimer = setTimeout(() => {
    skeletonShown = fadeSwap(createSkeleton).then(() => performance.now());
  }, SKELETON_DELAY_MS);

  const timetable = await ipcRenderer.invoke("get-today-timetable", refresh);
  clearTimeout(skeletonTimer);

  if (skeletonShown) {
    const shownAt = await skeletonShown;
    await sleep(SKELETON_MIN_VISIBLE_MS - (performance.now() - shownAt));
  }

  await fadeSwap(() => createTimetable(timetable));
}


logoutbutton.addEventListener("click", async (event) => {
  await ipcRenderer.invoke("untis-logout");
  await ipcRenderer.invoke("units-del-instance");
  await delData();
  await delTimetableCache();
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