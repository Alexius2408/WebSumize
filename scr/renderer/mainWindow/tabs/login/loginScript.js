/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: loginScript.js
 Description: Handles the login process in the login window. The login wndow gets shown if there is no local User Data
*/

const { setData } = require("../../../../services/storageService.js");
const { ipcRenderer } = require('electron');

const button = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const schoolNameInput = document.getElementById("schoolName");
const schoolUrlInput = document.getElementById("schoolUrl");

button.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const schoolName = schoolNameInput.value;
  const schoolUrl = schoolUrlInput.value;
  let data = JSON.stringify({ username: String(username), password: String(password), schoolName: String(schoolName), schoolUrl: String(schoolUrl) });
  await setData(data);
  try {
    await ipcRenderer.invoke("units-create-instance");
    await ipcRenderer.invoke("untis-login");
    await ipcRenderer.invoke("switch-window", "../renderer/mainWindow/index.html");
    
  } catch (err) {
    console.log("Failed to get timetable or login:", err);
  }

});
