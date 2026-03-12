
const { ipcRenderer } = window.require('electron');

async function loadTimetable() {
    const timetable = await ipcRenderer.invoke('get-today-timetable');
    const txt = document.createElement("p");
    txt.textContent = JSON.stringify(timetable);
    document.body.appendChild(txt);
}

loadTimetable();