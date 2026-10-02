const API_BASE_URL = "https://exam-prep-backend-git-staging-bidex327s-projects.vercel.app";


// SIDEBAR

const menuBtn = document.getElementById("menuBtn");
const sidebarClose = document.getElementById("sidebar-close");
const sidebar = document.getElementById("sidebar");

function openSidebar() {
  if (sidebar) {
    sidebar.classList.remove("-translate-x-full");
  }
}

function closeSidebar() {
  if (sidebar) {
    sidebar.classList.add("-translate-x-full");
  }
}

if (menuBtn) {
  menuBtn.addEventListener("click", openSidebar);
}

if (sidebarClose) {
  sidebarClose.addEventListener("click", closeSidebar);
}

window.addEventListener("resize", () => {
  if (!sidebar) return;

  if (window.innerWidth >= 1024) {
    sidebar.classList.remove("-translate-x-full");
  } else {
    sidebar.classList.add("-translate-x-full");
  }
});


// PRACTICE CARDS

const practiceCards = document.querySelectorAll(".practice-card");

practiceCards.forEach((card) => {
  card.addEventListener("click", () => {
    practiceCards.forEach((item) => {
      item.classList.remove("border-[#085848]");
      item.classList.add("border-[#D9D9D9]");

      const circle = item.querySelector(".radio-circle");
      const dot = item.querySelector(".radio-dot");

      if (circle) {
        circle.classList.remove("border-[#085848]");
        circle.classList.add("border-[#D9D9D9]");
      }

      if (dot) {
        dot.classList.remove("bg-[#085848]");
      }
    });

    card.classList.remove("border-[#D9D9D9]");
    card.classList.add("border-[#085848]");

    const selectedCircle = card.querySelector(".radio-circle");
    const selectedDot = card.querySelector(".radio-dot");

    if (selectedCircle) {
      selectedCircle.classList.remove("border-[#D9D9D9]");
      selectedCircle.classList.add("border-[#085848]");
    }

    if (selectedDot) {
      selectedDot.classList.add("bg-[#085848]");
    }

    const selectedPractice = card.dataset.value;

    if (selectedPractice) {
      console.log("Selected practice:", selectedPractice);
    }
  });
});


// HELPERS

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
}

function getValue(object, keys, fallback = null) {
  if (!object) return fallback;

  for (const key of keys) {
    if (
      object[key] !== undefined &&
      object[key] !== null &&
      object[key] !== ""
    ) {
      return object[key];
    }
  }

  return fallback;
}

function getNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function getFirstName(name = "Student") {
  return name.trim().split(/\s+/)[0] || "Student";
}

function getInitials(name = "Student") {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "ST";
  }

  if (parts.length === 1) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getSubjectImage(subject = "") {
  const value = subject.toLowerCase();

  if (value.includes("math")) {
    return "./Images/Math.png";
  }

  if (value.includes("physics")) {
    return "./Images/Phy.png";
  }

  if (value.includes("chem")) {
    return "./Images/Chem.png";
  }

  if (
    value.includes("english") ||
    value.includes("use of english")
  ) {
    return "./Images/Eng.png";
  }

  return "./Images/Math.png";
}


// DEFAULT DASHBOARD

function setDashboardDefaults() {
  setText("profile-initials", "ST");
  setText("profile-name", "Student");
  setText("profile-role", "Student");

  setText("welcome-name", "Student");

  setText("study-streak", "0 Days");
  setText("best-streak", "Best: 0 days");

  setText("questions-attempted", "0");

  setText("practice-sessions", "0");

  setText(
    "overall-progress",
    "0% overall progress"
  );

  setText(
    "current-subject-topic",
    "No practice started yet"
  );

  setText(
    "current-practice-meta",
    "0 questions · Practice mode"
  );

  const dashboardDate =
    document.getElementById("dashboard-date");

  if (dashboardDate) {
    dashboardDate.textContent =
      new Date().toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );
  }

  renderRecentAttempts([]);
  renderWeakTopics([]);
}


// PROFILE

function updateProfile(studentName) {
  const name = studentName || "Student";

  setText(
    "profile-initials",
    getInitials(name)
  );

  setText(
    "profile-name",
    name
  );

  setText(
    "profile-role",
    "Student"
  );

  setText(
    "welcome-name",
    getFirstName(name)
  );
}


// RECENT ATTEMPTS

function renderRecentAttempts(attempts = []) {
  const tableBody =
    document.getElementById(
      "recent-attempts-body"
    );

  if (!tableBody) {
    return;
  }

  if (
    !Array.isArray(attempts) ||
    attempts.length === 0
  ) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-8 text-center text-sm text-[#78909C] font-medium">
          No practice attempts yet.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = attempts
    .map((attempt) => {
      const subject = getValue(
        attempt,
        [
          "subject",
          "subjectName",
          "name"
        ],
        "Subject"
      );

      const questions = getNumber(
        getValue(
          attempt,
          [
            "questionsAttempted",
            "questions",
            "totalQuestions",
            "questionCount"
          ],
          0
        )
      );

      const rawScore = getValue(
        attempt,
        [
          "scorePercentage",
          "score",
          "percentage",
          "accuracy"
        ],
        0
      );

      const score =
        typeof rawScore === "string" &&
        rawScore.includes("%")
          ? rawScore
          : `${getNumber(rawScore)}%`;

      const date = formatDate(
        getValue(
          attempt,
          [
            "date",
            "createdAt",
            "completedAt",
            "attemptedAt"
          ],
          null
        )
      );

      return `
        <tr class="border-b border-border">

          <td class="px-6 py-4">
            <div class="flex items-center gap-3">

              <div>
                <img
                  src="${getSubjectImage(subject)}"
                  alt=""
                  class="w-8 h-8 object-contain"
                >
              </div>

              <span class="font-bold">
                ${subject}
              </span>

            </div>
          </td>

          <td class="px-5 py-4 font-bold">
            ${questions}
          </td>

          <td class="px-5 py-4 text-green-500 font-bold">
            ${score}
          </td>

          <td class="px-6 py-4 text-[#78909C] font-bold">
            ${date}
          </td>

        </tr>
      `;
    })
    .join("");
}


// WEAK TOPICS

function renderWeakTopics(topics = []) {
  const container =
    document.getElementById(
      "weak-topics-list"
    );

  if (!container) {
    return;
  }

  if (
    !Array.isArray(topics) ||
    topics.length === 0
  ) {
    container.innerHTML = `
      <div class="border border-[#D8E0DE] rounded-xl p-5 text-center">

        <p class="text-sm font-bold text-[#085848]">
          No weak topics yet
        </p>

        <p class="mt-2 text-[11px] text-[#78909C] leading-5">
          Complete some practice questions and your weak topics will appear here.
        </p>

      </div>
    `;

    return;
  }

  container.innerHTML = topics
    .map((topic) => {
      const topicName = getValue(
        topic,
        [
          "topic",
          "topicName",
          "name"
        ],
        "Topic"
      );

      const subject = getValue(
        topic,
        [
          "subject",
          "subjectName"
        ],
        ""
      );

      const accuracy = getNumber(
        getValue(
          topic,
          [
            "accuracy",
            "percentage",
            "score"
          ],
          0
        )
      );

      return `
        <div class="flex gap-3">

          <div>
            <img
              src="${getSubjectImage(subject)}"
              alt=""
              class="w-10 h-10 shrink-0"
            >
          </div>

          <div class="flex-1 min-w-0">

            <div class="flex items-start justify-between gap-2">

              <div>
                <p class="text-sm font-bold">
                  ${topicName}
                </p>

                <p class="text-[11px] text-[#78909C] font-bold">
                  ${accuracy}% accuracy
                </p>
              </div>

              <button class="bg-red-100 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">
                Practice
              </button>

            </div>

            <div class="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">

              <div
                class="h-full bg-red-500 rounded-full"
                style="width: ${Math.min(
                  Math.max(accuracy, 0),
                  100
                )}%"
              ></div>

            </div>

          </div>

        </div>
      `;
    })
    .join("");
}


// LOAD DASHBOARD

async function loadDashboard() {
  const isDashboard =
    window.location.pathname
      .toLowerCase()
      .includes("studentdashboard");

  if (!isDashboard) {
    return;
  }

  setDashboardDefaults();

  const token =
    localStorage.getItem("token");

  if (!token) {
    window.location.href =
      "/studentlogin.html";

    return;
  }

  const storedUser =
    getStoredUser();

  if (
    storedUser.fullName ||
    storedUser.name
  ) {
    updateProfile(
      storedUser.fullName ||
      storedUser.name
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/dashboard`,
      {
        method: "GET",

        headers: {
          "Authorization":
            `Bearer ${token}`,
          "Content-Type":
            "application/json"
        }
      }
    );

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href =
        "/studentlogin.html";

      return;
    }

    let responseData = {};

    try {
      responseData =
        await response.json();
    } catch (error) {
      throw new Error(
        "Invalid server response."
      );
    }

    if (
      !response.ok ||
      responseData?.success === false
    ) {
      throw new Error(
        responseData?.message ||
        "Unable to load dashboard."
      );
    }

    const data =
      responseData?.data ||
      responseData?.dashboard ||
      responseData ||
      {};


    // NAME

    const studentName = getValue(
      data,
      [
        "studentName",
        "fullName",
        "name"
      ],
      storedUser.fullName ||
      storedUser.name ||
      "Student"
    );

    updateProfile(studentName);


    // QUESTIONS ATTEMPTED

    const questionsAttempted =
      getNumber(
        getValue(
          data,
          [
            "questionsAttempted",
            "questionsCompleted",
            "totalQuestionsAttempted"
          ],
          0
        )
      );

    setText(
      "questions-attempted",
      questionsAttempted
    );


    // STUDY STREAK

    const studyStreak =
      getNumber(
        getValue(
          data,
          [
            "studyStreak",
            "streak",
            "streakDays"
          ],
          0
        )
      );

    setText(
      "study-streak",
      `${studyStreak} ${
        studyStreak === 1
          ? "Day"
          : "Days"
      }`
    );

    setText(
      "best-streak",
      `Best: ${studyStreak} ${
        studyStreak === 1
          ? "day"
          : "days"
      }`
    );


    // PROGRESS

    const progress =
      getNumber(
        getValue(
          data,
          [
            "progressPercentage",
            "progress",
            "progressPercent"
          ],
          0
        )
      );

    setText(
      "overall-progress",
      `${progress}% overall progress`
    );


    // CURRENT SUBJECT

    const currentSubject =
      getValue(
        data,
        [
          "currentSubject",
          "subject"
        ],
        null
      );


    // CURRENT TOPIC

    const currentTopic =
      getValue(
        data,
        [
          "currentTopic",
          "topic"
        ],
        null
      );


    if (
      currentSubject ||
      currentTopic
    ) {
      let currentText = "";

      if (currentSubject) {
        currentText +=
          currentSubject;
      }

      if (currentTopic) {
        currentText += currentSubject
          ? ` · ${currentTopic}`
          : currentTopic;
      }

      setText(
        "current-subject-topic",
        currentText
      );

      setText(
        "current-practice-meta",
        "Continue your current practice"
      );

    } else {
      setText(
        "current-subject-topic",
        "No practice started yet"
      );

      setText(
        "current-practice-meta",
        "0 questions · Practice mode"
      );
    }


    // RECENT ATTEMPTS

    const recentAttempts =
      getValue(
        data,
        [
          "recentAttempts",
          "recentActivity",
          "attempts"
        ],
        []
      );

    renderRecentAttempts(
      recentAttempts
    );


    // PRACTICE SESSION COUNT

    let practiceSessions =
      getValue(
        data,
        [
          "practiceSessions",
          "sessionCount",
          "sessions"
        ],
        null
      );

    if (
      practiceSessions === null
    ) {
      practiceSessions =
        Array.isArray(recentAttempts)
          ? recentAttempts.length
          : 0;
    }

    setText(
      "practice-sessions",
      getNumber(practiceSessions)
    );


    // WEAK TOPICS

    const weakTopics =
      getValue(
        data,
        [
          "weakTopics",
          "weakAreas"
        ],
        []
      );

    renderWeakTopics(
      weakTopics
    );


    // SELECTED SUBJECTS

    const selectedSubjects =
      getValue(
        data,
        [
          "selectedSubjects",
          "subjects"
        ],
        []
      );

    const subjectsElement =
      document.getElementById(
        "selected-subjects"
      );

    if (subjectsElement) {
      if (
        Array.isArray(selectedSubjects) &&
        selectedSubjects.length > 0
      ) {
        subjectsElement.textContent =
          selectedSubjects.join(", ");
      } else {
        subjectsElement.textContent =
          "No subjects selected";
      }
    }

  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    const savedName =
      storedUser.fullName ||
      storedUser.name ||
      "Student";

    updateProfile(savedName);

    setText(
      "questions-attempted",
      "0"
    );

    setText(
      "study-streak",
      "0 Days"
    );

    setText(
      "best-streak",
      "Best: 0 days"
    );

    setText(
      "overall-progress",
      "0% overall progress"
    );

    setText(
      "practice-sessions",
      "0"
    );

    setText(
      "current-subject-topic",
      "No practice started yet"
    );

    setText(
      "current-practice-meta",
      "0 questions · Practice mode"
    );

    renderRecentAttempts([]);
    renderWeakTopics([]);
  }
}


// LOGOUT

function logoutStudent() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href =
    "/studentlogin.html";
}

const logoutButton =
  document.getElementById(
    "logout-button"
  );

if (logoutButton) {
  logoutButton.addEventListener(
    "click",
    logoutStudent
  );
}


// START

document.addEventListener(
  "DOMContentLoaded",
  () => {
    loadDashboard();
  }
);