const { ipcRenderer } = require('electron');

let lastImportTime = null;
let timetableData = null;

async function update(untisInstance) {

    try {
        if (!untisInstance.validateSession()) {
            await untisInstance.login();
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = { update };