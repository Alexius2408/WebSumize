/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: constants.js
 Description: Got all constants that are necessry for the App to run. It is in 1 File for easy changes through the application.
*/

const path = require("path");
const { screen } = require("electron");

const GENERALLY = {
  SCREEN_WIDTH: null,
  SCREEN_HEIGHT: null,
  APP_NAME: "WebSumize",
  APP_VERSION: "0.1.0-beta",
  HELP_WEBSITE_URL: "example.com",
  USERROOT: null, // Gets changed when the App is ready
  LOG_DIR_PATH: null, // Gets changed when the App is ready
  ICON_PATH: getTrayIcon(),
};

async function initalizeNullVariables(app) {
  // Now, that the app is ready we can set the varaibles the value

  // Screen size
  const display = screen.getPrimaryDisplay();
  GENERALLY.SCREEN_WIDTH = display.workAreaSize.width;
  GENERALLY.SCREEN_HEIGHT = display.workAreaSize.height;

  // User Root and log file path
  GENERALLY.USERROOT = app.getAppPath();
  GENERALLY.LOG_DIR_PATH = path.join(app.getPath("userData"), "logs");
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
  initalizeNullVariables
};
