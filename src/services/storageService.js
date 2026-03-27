/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: storageService.js
 Description: Handles the storage of user data using the keytar library for secure credential storage locally.
*/

const { GENERALLY } = require('../utils/constants.js');
const keytar = require('keytar');


async function setData(data) {
    await keytar.setPassword(GENERALLY.APP_NAME, "currentLoginedUser", data)
}

async function getData() {
    return await keytar.getPassword(GENERALLY.APP_NAME, "currentLoginedUser")
}

async function delData() {
    await keytar.deletePassword(GENERALLY.APP_NAME, "currentLoginedUser")
}

module.exports = {
    setData,
    getData,
    delData,
};