/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: webUnitsAPI.js
 Description: Provides functions to interact using the WebUntis API.
 Link to WebUntis API: https://github.com/SchoolUtils/WebUntis
*/

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