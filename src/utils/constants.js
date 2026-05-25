/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: constants.js
 Description: Got all constants that are necessry for the App to run. It is in 1 File for easy changes through the application.
              Some variables are set to null, that is because they can only be set when the app is ready. They get changed in initalizeNullVariables().
*/

const path = require("path");
const { screen } = require("electron");

const GENERALLY = {
  SCREEN_WIDTH: null,
  SCREEN_HEIGHT: null,
  APP_NAME: "WebSumize",
  APP_VERSION: "0.1.0-beta",
  HELP_WEBSITE_URL: "example.com",
};

const PATHS = {
  USERROOT: null,
  LOG_DIR_PATH: null,
  ICON_PATH: getTrayIcon(),
  CACHE_DIR: null,
  TIMETABLE_CACHE_FILE: null,
};

async function initalizeNullVariables(app) {
  // Now, that the app is ready we can set the varaibles the value

  // Screen size
  const display = screen.getPrimaryDisplay();
  GENERALLY.SCREEN_WIDTH = display.workAreaSize.width;
  GENERALLY.SCREEN_HEIGHT = display.workAreaSize.height;

  // User Root and log file path
  PATHS.USERROOT = app.getAppPath();
  PATHS.LOG_DIR_PATH = path.join(app.getPath("userData"), "logs");

  PATHS.CACHE_DIR = path.join(app.getPath("userData"), "cache");
  PATHS.TIMETABLE_CACHE_FILE = path.join(PATHS.CACHE_DIR, "today-timetable.json");
  console.log(PATHS.CACHE_DIR)
}

function getTrayIcon() {
  if (process.platform === "win32") {
    return path.join(__dirname, "../assets/icons/png/64x64.png");
  }

  if (process.platform === "darwin") {
    return path.join(__dirname, "../assets/icons/mac/trayTemplate.png");
  }

  return path.join(__dirname, "../assets/icons/png/32x32.png");
}

module.exports = {
  GENERALLY,
  PATHS,
  initalizeNullVariables,
};
