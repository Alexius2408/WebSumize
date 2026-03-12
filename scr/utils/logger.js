// This file is responsible for logging into WebUntis using the WebUntis library.
// Its gets the username, password, school and url from the storageService
// It gets the Information by asking at the begining of the app for the informations or if the data is null

const { WebUntis } = require("webuntis");
const { getData } = require("../services/storageService.js");

async function getDataJson() {
  let data = await getData();
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

async function createUntisInstance() {
  const data = await getDataJson();
  if (!data) {
    throw new Error("No user data found. Cannot create WebUntis instance.");
  }
  return new WebUntis(
    "htl-ibk",
    data.username,
    data.password,
    "htl-ibk.webuntis.com",
  );
}

async function loginUntis() {
  const untisInstance = await createUntisInstance();
  await untisInstance.login();
}

// Do not create untis instance at top level, use createUntisInstance() when needed

module.exports = {
  loginUntis,
  createUntisInstance,
};
