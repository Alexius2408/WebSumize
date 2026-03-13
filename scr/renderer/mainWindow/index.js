/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: index.js
 Description: This is the entry point for the main window. It shows the timetable for the current day.
*/


const { ipcRenderer } = window.require('electron');

async function loadTimetable() {
    const timetable = await ipcRenderer.invoke('get-today-timetable');
    const txt = document.createElement("p");
    txt.textContent = JSON.stringify(timetable);
    document.body.appendChild(txt);
}

loadTimetable();