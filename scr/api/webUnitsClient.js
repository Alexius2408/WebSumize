const { webuntis } = require("webuntis");

async function getTodayTimetable(untis) {
    return await untis.getOwnTimetableFor(new Date());
}

async function getAnyTimetable(untis, date) {
    return await untis.getOwnTimetableFor(date);
}

async function getHomework(untis, startDate, endDate) {
    return await untis.getHomeWorkAndLessons(startDate, endDate);
}

async function getExams(untis, startDate, endDate) {
    return await untis.getExamsForRange(startDate, endDate);
}

module.exports = {
    getTodayTimetable,
    getAnyTimetable,
    getHomework,
    getExams
}