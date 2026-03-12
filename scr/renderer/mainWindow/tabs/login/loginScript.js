const { setData } = require("../../../../services/storageService.js");
const { ipcRenderer } = require('electron');

const button = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

button.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  let data = JSON.stringify({ username: String(username), password: String(password) });
  await setData(data);
  try {
    await ipcRenderer.invoke("units-create-instance");
    await ipcRenderer.invoke("untis-login");
    await ipcRenderer.invoke("switch-window", "../renderer/mainWindow/index.html");
    
  } catch (err) {
    console.log("Failed to get timetable or login:", err);
  }

});
