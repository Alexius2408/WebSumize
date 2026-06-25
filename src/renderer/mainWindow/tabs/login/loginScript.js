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
const isOnline = require('is-online');

const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const schoolNameInput = document.getElementById("schoolName");
const schoolUrlInput = document.getElementById("schoolUrl");

const loginFailed = document.getElementById("loginFailedInfo");
const loginFailedInfo = document.getElementById("loginFailedInfoLink");
const inputs = document.querySelectorAll(".input");
const loader = document.getElementById("loaderAnim");
const passwordVisibilityToggle = document.querySelectorAll(
  ".passwordvisibility",
);
let isSubmitting = false;

passwordVisibilityToggle.forEach((element) => {
  element.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");

    document.getElementById("passwordNotVisible").classList.toggle("hidden");
    document.getElementById("passwordVisible").classList.toggle("hidden");

    passwordInput.placeholder = isPassword
      ? "SchoolPassword123"
      : "●●●●●●●●●●●●●●●●●";
  });
});

loginButton.classList.remove("loginButtonLoading");
loader.classList.add("hidden");
loginButton.firstChild.textContent = "LOGIN";
loginFailed.classList.add("hidden");
loginFailedInfo.classList.add("hidden");

function setLoginButton() {
  let hasEmpty = false;
  for (const input of inputs) {
    if (input.value.trim() === "") {
      hasEmpty = true;
      break;
    }
  }
  loginButton.disabled = isSubmitting || hasEmpty;
}

const texts = [
  "Made with Chromium!",
  "Made with love by Alexius!",
  "Made for Students, for Teachers, for EVERYONE!",
  "Check out my GitHub: github.com/Alexius2408",
  "Everything in one place!",
  "Your timetable, your style!",
  "Make it look like you want!",
  "For help, check out " + GENERALLY.HELP_WEBSITE_URL,
  "If you don't like the look, change it!",
  "Future updates coming soon!",
  "Please log in to continue!",
  "For errors, check the log file for more details!",
  "Use the tray icon to navigate.",
  "Left-click the tray icon to open a small window.",
  "Double-click the tray icon to open the main page.",
  "Right-click the tray icon for quick access.",
];

let typingIndex = 0;
let typingText = "";
let lastTypedText = "";

function choosText(lastTypedText) {
  while (typingText === lastTypedText) {
    typingText = "";
    typingText = texts[Math.floor(Math.random() * texts.length)];
  }
  return typingText;
}

function type() {
  lastTypedText = choosText(lastTypedText);
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
    setTimeout(delCharLoop, 4000);
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

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    loginFailed.classList.add("hidden");
    loginFailedInfo.classList.add("hidden");
    setLoginButton();
  });
});

async function login(event) {
  if (event) {
    event.preventDefault();
  }
  if (loginButton.disabled) {
    return;
  }
  isSubmitting = true;
  setLoginButton();
  try {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const schoolName = schoolNameInput.value;
    const schoolUrl = schoolUrlInput.value
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "");
    let data = JSON.stringify({
      username: String(username),
      password: String(password),
      schoolName: String(schoolName),
      schoolUrl: String(schoolUrl),
    });
    await setData(data);
    loginButton.firstChild.textContent = "";
    loginButton.classList.add("loginButtonLoading");
    loader.classList.remove("hidden");
    await ipcRenderer.invoke("units-create-instance");
    await ipcRenderer.invoke("untis-login");
    await ipcRenderer.invoke(
      "switch-window",
      "src/renderer/mainWindow/index.html",
    );

    loginButton.classList.remove("loginButtonLoading");
    loader.classList.add("hidden");
    loginButton.firstChild.textContent = "LOGIN";
    loginFailed.classList.add("hidden");
    loginFailedInfo.classList.add("hidden");
  } catch (err) {
    loginButton.firstChild.textContent = "LOGIN";
    loginButton.classList.remove("loginButtonLoading");
    loader.classList.add("hidden");
    ipcRenderer.invoke(
      "log-error",
      "(File: loginScript.js) " + err.message || String(err),
    );
    loginFailed.classList.remove("hidden");
    loginFailedInfo.classList.remove("hidden");
  } finally {
    isSubmitting = false;
    setLoginButton();
  }
}

loginButton.addEventListener("click", async (event) => {
  await login(event);
});

let textEl;

document.addEventListener("DOMContentLoaded", () => {
  textEl = document.getElementById("writer-content");
  type();
});

window.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    await login(event);
  }
});

setLoginButton();

let lastConectionState = null;

setInterval(async () => {
  const online = await isOnline();

  if (online !== lastConectionState) {
    lastConectionState = online;
    if (online) {
      document.getElementById("offlineText").classList.add("hidden");
      inputs.forEach((element) => {
        element.disabled = false;
      });
    } else {
      document.getElementById("offlineText").classList.remove("hidden");
      inputs.forEach((element) => {
        element.disabled = true;
      });
    }
  }
}, 5000);
