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

function crateOneLecture(timetable) {
  let lecture = document.createElement("div");

  lecture.id = timetable.id;
  lecture.classList.add("timetable-lecture");

  let startTime = document.createElement("p");

  startTime.classList.add("start-time");
  startTime.textContent = formatUntisTime(timetable.startTime);
  lecture.appendChild(startTime);

  let lectureName = document.createElement("p");

  lectureName.classList.add("lecture-name");
  if (timetable.su.length > 1) {
    lectureName.textContent = timetable.su.map(({ name }) => name).join(" / ");
  } else {
    lectureName.textContent = timetable.su[0].name;
  }
  lecture.appendChild(lectureName);

  let className = document.createElement("p");

  className.classList.add("class-name");
  if (timetable.kl.length > 1) {
    className.textContent = timetable.kl.map(({ name }) => name).join(" / ");
  } else {
    className.textContent = timetable.kl[0].name;
  }
  lecture.appendChild(className);

  let roomName = document.createElement("p");

  roomName.classList.add("room-name");
  if (timetable.ro.length > 1) {
    roomName.textContent = timetable.ro.map(({ name }) => name).join(" / ");
  } else {
    roomName.textContent = timetable.ro[0].name;
  }
  lecture.appendChild(roomName);

  let endTime = document.createElement("p");
  endTime.classList.add("end-time");
  endTime.textContent = formatUntisTime(timetable.endTime);
  lecture.appendChild(endTime);

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
