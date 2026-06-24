/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: ipc/mainHandeler.js
 Description: Entry point for all IPC handlers. Registers all handler groups.
*/

const { setupUntisHandlers } = require("./untisHandlers.js");
const { setupWindowHandlers } = require("./windowHandlers.js");
const { setupSystemHandlers } = require("./systemHandlers.js");

function setupIpcHandlers(deps) {
  setupUntisHandlers(deps);
  setupWindowHandlers(deps);
  setupSystemHandlers(deps);
}

module.exports = { setupIpcHandlers };