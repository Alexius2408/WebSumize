/*
 WebSumize
 Copyright (c) 2026 Alexius2408

 This file is part of the WebSumize project.
 License: Personal / Non-Commercial Use Only

 File: webUnitsAPI.js
 Description: Provides functions to interact using the WebUntis API. It also safes the timetable in a json format so you dint call the api that much.
 Link to WebUntis API: https://github.com/SchoolUtils/WebUntis
*/

const { webuntis } = require("webuntis");
const {
  getTimetableCache,
  saveTimetableCache,
} = require("../services/storageService.js");

async function getTodayTimetable(untis, foreceSafe = false) {
  let timetable = await getTimetableCache();

  if (timetable == null) {
    return await getTodayTimetableFromWebUntis(untis);
  }

  const chacheTime = Date.now() - timetable.timestamp;
  const CACHE_DURATION = 1_800_000; // 30 minutes 30 * 60 * 1000

  if (
    !foreceSafe &&
    chacheTime < CACHE_DURATION &&
    timetable != null
  ) {
    return await timetable.timetable;
  }

  return getTodayTimetableFromWebUntis(untis);
}

async function getTodayTimetableFromWebUntis(untis) {
  timetable = await untis.getOwnTimetableFor(new Date());
  saveTimetableCache(timetable);

  return timetable;
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
  getExams,
};
