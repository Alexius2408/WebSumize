// This File Stores data Like Password, username
// and settings unsing keytar

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