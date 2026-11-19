const { WebUntis } = require("webuntis");

const timetablebox = document.getElementById("timetable");

const DEFAULT_SKELETON_ROWS = 5;

let lastLayout = Array(DEFAULT_SKELETON_ROWS).fill(1);

function formatUntisTime(time) {
  const date = WebUntis.convertUntisTime(time);
  return date.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createElements(timetable) {
  if (timetable.length === 1) {
    timetablebox.appendChild(crateOneLecture(timetable[0]));
  } else {
    let timtableList = [];
    timetable.forEach((element) => {
      timtableList.push(crateOneLecture(element));
    });
    timetablebox.appendChild(crateMultipleLecture(timtableList));
  }
}

async function createTimetable(timetable) {
  timetablebox.innerHTML = ``;
  timetable.sort((a, b) => a.startTime - b.startTime);

  timetable = getLessonsOrganisedByTime(timetable);
  lastLayout = timetable.map((group) => group.length);

  timetable.forEach((element) => {
    createElements(element);
  });
}

function createSkeleton() {
  timetablebox.innerHTML = ``;

  lastLayout.forEach((size) => {
    const lectures = Array.from({ length: size }, () => createSkeletonLecture());
    timetablebox.appendChild(
      size === 1 ? lectures[0] : crateMultipleLecture(lectures),
    );
  });
}

function createSkeletonLecture() {
  const lecture = document.createElement("div");
  lecture.classList.add("timetable-lecture", "skeleton");

  lecture.innerHTML = `
    <p class="start-time">&nbsp;</p>
    <p class="lecture-name">&nbsp;</p>
    <p class="end-time">&nbsp;</p>`;

  return lecture;
}

function getLessonsOrganisedByTime(timetable) {
  const groups = new Map();

  for (const lesson of timetable) {
    const key = `${lesson.date}_${lesson.startTime}_${lesson.endTime}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(lesson);
  }
  const lectures = [...groups.values()];

  return lectures;
}

function joinNames(list) {
  if (list.length > 1) {
    let names = [];
    for (const element of list) {
      names.push(element.name);
    }
    return names.join(" / ");
  }
  return list[0].name;
}

function appendField(lecture, className, text) {
  const field = document.createElement("p");
  field.classList.add(className);
  field.textContent = text;
  lecture.appendChild(field);
}

function crateOneLecture(timetable) {
  let lecture = document.createElement("div");

  lecture.id = timetable.id;
  lecture.classList.add("timetable-lecture");

  appendField(lecture, "start-time", formatUntisTime(timetable.startTime));
  appendField(lecture, "lecture-name", joinNames(timetable.su));
  appendField(lecture, "class-name", joinNames(timetable.kl));
  appendField(lecture, "room-name", joinNames(timetable.ro));
  appendField(lecture, "end-time", formatUntisTime(timetable.endTime));

  return lecture;
}

function crateMultipleLecture(timetableList) {
  const doubbleDiv = document.createElement("div");
  doubbleDiv.classList.add("doubble-lecture");

  timetableList.forEach((element) => {
    doubbleDiv.appendChild(element);
  });

  return doubbleDiv;
}

module.exports = {
  createTimetable,
  createSkeleton,
};
