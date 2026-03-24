/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: loginScript.js
 Description: Handles the login process in the login window. The login wndow gets shown if there is no local User Data
*/

const { setData } = require("../../../../services/storageService.js");
const { ipcRenderer } = require("electron");
const { GENERALLY } = require("../../../../utils/constants.js");

const button = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const schoolNameInput = document.getElementById("schoolName");
const schoolUrlInput = document.getElementById("schoolUrl");

const texts = [
  "Made with Chromium!",
  "Made by Alexius2408!",
  "Made for Students, for Teachers, for EVERYONE!",
  "Check out my GitHub: github.com/Alexius2408",
  "Everything at one place!",
  "Your timetable, your style!",
  "Make it look like you want!",
  "For Help check out " + GENERALLY.WEBSITE_URL,
];

function logWindowSize() {
  console.log(`Width: ${window.innerWidth}, Height: ${window.innerHeight}`);
}

// Log size initially
logWindowSize();

// Log size whenever the window is resized
window.addEventListener('resize', logWindowSize);
const textEl = document.getElementById("writer-content");

let typingIndex = 0;
let typingText = "";

function type() {
  lastTypedText = "";
  typingText = "";
  while (typingText == lastTypedText) {
    typingText = texts[Math.floor(Math.random() * texts.length)];
  }
  lastTypedText = typingText;
  typingIndex = 0;
  textEl.innerHTML = "";
  typeCharLoop();
}

function typeCharLoop() {
  if (typingIndex < typingText.length) {
    textEl.innerHTML += typingText[typingIndex];
    typingIndex++;
    setTimeout(typeCharLoop, 50);
  } else {
    textEl.innerHTML = textEl.innerHTML.replace(
      /((https?:\/\/)?([\w-]+\.)+([a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?)/gi,
      function (match) {
        const url = match.startsWith("http") ? match : "https://" + match;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match.replace(/^https?:\/\//, "")}</a>`;
      },
    );
    setTimeout(delCharLoop, 5000);
  }
}

function delCharLoop() {
  if (typingIndex > 0) {
    typingIndex--;
    textEl.innerHTML = typingText.slice(0, typingIndex);
    setTimeout(delCharLoop, 30);
  } else {
    setTimeout(type, 1000);
  }
}

button.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const schoolName = schoolNameInput.value;
  const schoolUrl = schoolUrlInput.value;
  let data = JSON.stringify({
    username: String(username),
    password: String(password),
    schoolName: String(schoolName),
    schoolUrl: String(schoolUrl),
  });
  await setData(data);
  try {
    await ipcRenderer.invoke("units-create-instance");
    await ipcRenderer.invoke("untis-login");
    await ipcRenderer.invoke(
      "switch-window",
      "../renderer/mainWindow/index.html",
    );
  } catch (err) {
    console.log("Failed to get timetable or login:", err);
  }
});

type();
