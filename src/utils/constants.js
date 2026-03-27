/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: constants.js
 Description: Got all constants that are necessry for the App to run. It is in 1 File for easy changes through the application.
*/

const path = require("path");


// General application info
const GENERALLY = {
APP_NAME: 'WebSumize',
APP_VERSION: '0.1.0-beta',
HELP_WEBSITE_URL: 'example.com',
DIRNAME: __dirname,
LOG_DIR_PATH: path.join(__dirname, "../logs"),
};

module.exports = {
    GENERALLY
}