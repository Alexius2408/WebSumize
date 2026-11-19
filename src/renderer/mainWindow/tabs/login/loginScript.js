/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: loginScript.js
 Description: Handles the login process in the login window. The login wndow gets shown if there is no local User Data
*/

const { setData, delData } = require("../../../../services/storageService.js");
const { ipcRenderer } = require("electron");
const { GENERALLY } = require("../../../../utils/constants.js");

const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const secretInput = document.getElementById("secret2FA");
const normal_login_box = document.querySelector(".normal_login_details");
const secretBox = document.querySelector(".FA_input_box");
const schoolNameInput = document.getElementById("schoolName");
const schoolUrlInput = document.getElementById("schoolUrl");
const passwordInput = document.getElementById("password");

const loginFailed = document.getElementById("loginFailedInfo");
const longText = document.getElementById("login-text");
const loginFailedInfo = document.getElementById("loginFailedInfoLink");
const inputs = document.querySelectorAll(".input");
const loader = document.getElementById("loaderAnim");

let isSubmitting = false;
let FA_input_required = false;
let data = undefined;

document.querySelector(".loginFailedLink").href = GENERALLY.HELP_WEBSITE_URL;

document.querySelectorAll(".password-toggle").forEach((toggle) => {
  const input = toggle.closest(".input-box").querySelector(".input");
  const icons = toggle.querySelectorAll(".password-icon");
  const visiblePlaceholder = input.placeholder;

  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    input.placeholder = isPassword ? visiblePlaceholder : "●●●●●●●●●●●●●●●●●";
    icons.forEach((icon) => icon.classList.toggle("hidden"));
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
    if (input.parentElement.parentElement.classList.contains("hidden")) {
      continue;
    }
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
    if (!FA_input_required) {
      const username = usernameInput.value;
      const password = passwordInput.value;
      const schoolName = schoolNameInput.value;
      const schoolUrl = schoolUrlInput.value
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "");
      data = JSON.stringify({
        username: String(username),
        password: String(password),
        schoolName: String(schoolName),
        schoolUrl: String(schoolUrl),
      });
    } else {
      data = JSON.stringify({
        ...JSON.parse(data),
        secretKey: String(secretInput.value).replace(/\s/g, "").toUpperCase(),
      });
    }

    loginButton.firstChild.textContent = "";
    loginButton.classList.add("loginButtonLoading");
    loader.classList.remove("hidden");
    await ipcRenderer.invoke("units-create-instance", data);
    const needs2FA = await ipcRenderer.invoke("untis-login");
    if (needs2FA["2FA"]) {
      FA_input_required = true;
      secretBox.classList.remove("hidden");
      normal_login_box.classList.add("hidden");
      longText.textContent = "Enter 2FA secret Key to continue";
      loginButton.firstChild.textContent = "LOGIN";
      loginButton.classList.remove("loginButtonLoading");
      loader.classList.add("hidden");
      return;
    }

    await setData(data);

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
    loginFailed.classList.remove("hidden");
    loginFailedInfo.classList.remove("hidden");

    console.error("(File: loginScript.js) " + err.message || String(err));

    await delData();
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
  const online = await ipcRenderer.invoke("is-online");

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
