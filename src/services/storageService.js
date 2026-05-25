/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: storageService.js
 Description: Handles the storage of user data using the keytar library for secure credential storage locally.
              It also safes the timetable so you can visit it offline.
*/

const { GENERALLY, PATHS } = require("../utils/constants.js");
const keytar = require("keytar");
const fs = require("fs");

async function setData(data) {
  await keytar.setPassword(GENERALLY.APP_NAME, "currentLoginedUser", data);
}

async function getData() {
  return await keytar.getPassword(GENERALLY.APP_NAME, "currentLoginedUser");
}

async function delData() {
  await keytar.deletePassword(GENERALLY.APP_NAME, "currentLoginedUser");
}

function createCacheDir() {
  if (!fs.existsSync(PATHS.CACHE_DIR)) {
    fs.mkdirSync(PATHS.CACHE_DIR, { recursive: true });
  }
}

async function getTimetableCache() {
  try {
    createCacheDir();
    const data = await fs.promises.readFile(PATHS.TIMETABLE_CACHE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet (first run) or is invalid
    return null;
  }
}

async function saveTimetableCache(timetableData) {
  createCacheDir()
  const cacheData = {
    timetable: timetableData,
    timestamp: Date.now(),
  };
  await fs.promises.writeFile(
    PATHS.TIMETABLE_CACHE_FILE,
    JSON.stringify(cacheData, null, 2),
  );
}

module.exports = {
  setData,
  getData,
  delData,
  getTimetableCache,
  saveTimetableCache,
};
