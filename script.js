// =========================
// EXAM COUNTDOWN
// =========================

function saveExamDate() {

    const examDate =
        document.getElementById("examDate").value;

    localStorage.setItem(
        "examDate",
        examDate
    );

    updateCountdown();
}

function updateCountdown() {

    const savedDate =
        localStorage.getItem("examDate");

    if (!savedDate) return;

    const examDate =
        new Date(savedDate);

    const today =
        new Date();

    const difference =
        examDate - today;

    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    document.getElementById("days").textContent =
        days > 0 ? days : 0;
}

setInterval(updateCountdown, 60000);

updateCountdown();

const quotes = [

    "Rank 1 is built one chapter at a time.",

    "Consistency beats talent every day.",

    "Small progress is still progress.",

    "Discipline creates results.",

    "Today's effort becomes tomorrow's rank.",

    "Every solved question is a step forward."

];

const quoteElement =
    document.getElementById(
        "dailyQuote"
    );

if (quoteElement) {

    const randomQuote =
        quotes[
        Math.floor(
            Math.random() *
            quotes.length
        )
        ];

    quoteElement.textContent =
        randomQuote;
}


// =========================
// DAILY GOALS
// =========================

let goals =
    JSON.parse(
        localStorage.getItem("goals")
    ) || [];

function saveGoals() {

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );
}

function addGoal() {

    const input =
        document.getElementById("goalInput");

    const text =
        input.value.trim();

    if(text === "") return;

    goals.push({
        text: text,
        completed: false
    });

    saveGoals();

    renderGoals();

    input.value = "";
}

function toggleGoal(index) {

    goals[index].completed =
        !goals[index].completed;

    saveGoals();

    renderGoals();
}

function deleteGoal(index) {

    goals.splice(index, 1);

    saveGoals();

    renderGoals();
}

function renderGoals() {

    const goalList =
        document.getElementById("goalList");

    goalList.innerHTML = "";

    let completedCount = 0;

    goals.forEach((goal, index) => {

        if (goal.completed)
            completedCount++;

        const li =
            document.createElement("li");

        li.innerHTML = `
<div style="
display:flex;
justify-content:space-between;
align-items:center;
gap:10px;
">

<div>

<input
type="checkbox"
${goal.completed ? "checked" : ""}
onchange="toggleGoal(${index})"
>

<span style="
${goal.completed
                ? "text-decoration:line-through;"
                : ""}
">
${goal.text}
</span>

</div>

<button onclick="editGoal(${index})">
✏️
</button>

<button onclick="deleteGoal(${index})">
❌
</button>

</div>
`;

        goalList.appendChild(li);
    });

    document.getElementById(
        "goalsCompleted"
    ).textContent = completedCount;

    updateReadiness();
}



renderGoals();

function loadSubjectProgress() {

    const syllabus = {

        Agriculture: 23,
        Science: 16,
        SocialScience: 26,
        Maths: 12

    };

    const container =
        document.getElementById(
            "subjectProgressContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    Object.keys(syllabus)
        .forEach(subject => {

            let completed = 0;

            for (let key in localStorage) {

                if (
                    key.startsWith(subject + "-")
                    &&
                    localStorage.getItem(key)
                    === "true"
                ) {
                    completed++;
                }
            }

            const percent =
                Math.round(
                    (completed /
                        syllabus[subject]) * 100
                );

            const card =
                document.createElement("div");

            card.className =
                "progress-card";

            card.innerHTML = `

            <p>

                ${subject}

                <span class="progress-percent">

                    ${percent}%

                </span>

            </p>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${percent}%"
                ></div>

            </div>

        `;

            container.appendChild(card);

        });

}

loadSubjectProgress();


// =========================
// NIGHT REVIEW
// =========================

function saveNightReview() {

    const status =
        document.getElementById(
            "goalStatus"
        ).value;

    const hours =
        document.getElementById(
            "studyHours"
        ).value;

    const satisfaction =
        document.getElementById(
            "satisfaction"
        ).value;

    const today =
        new Date().toLocaleDateString();

    const review = {
        date: today,
        status,
        hours,
        satisfaction
    };

    localStorage.setItem(
        "latestReview",
        JSON.stringify(review)
    );

    alert(
        `Review Saved ✅

Keep Going!
Rank 1 Requires Consistency.`
    );

    updateStreak(status);
}


// =========================
// STREAK SYSTEM
// =========================

function updateStreak(status) {

    const today =
        new Date().toDateString();

    const lastReviewDate =
        localStorage.getItem(
            "lastReviewDate"
        );

    let streak =
        Number(
            localStorage.getItem(
                "streak"
            )
        ) || 0;

    if (
        lastReviewDate === today
    ) {

        return;
    }

    if (
        status === "yes"
    ) {

        streak++;

    } else {

        streak = 0;
    }

    localStorage.setItem(
        "streak",
        streak
    );

    localStorage.setItem(
        "lastReviewDate",
        today
    );

    document.getElementById(
        "streakCount"
    ).textContent =
        streak + " Days";
}

function loadStreak() {

    const streak =
        localStorage.getItem("streak") || 0;

    document.getElementById(
        "streakCount"
    ).textContent =
        streak + " Days";
}

loadStreak();


// =========================
// READINESS SCORE
// =========================

function updateReadiness() {

    let completed = 0;

    goals.forEach(goal => {

        if (goal.completed)
            completed++;
    });

    const score =
        goals.length === 0
            ? 0
            : Math.round(
                (completed / goals.length) * 100
            );

    document.getElementById(
        "readinessScore"
    ).textContent =
        score + "%";
}


// =========================
// PLACEHOLDER DATA
// =========================

const chapterElement =
    document.getElementById(
        "completedChapters"
    );

if (chapterElement) {

    chapterElement.textContent =
        localStorage.getItem(
            "completedChapters"
        ) || 0;
}

// =========================
// EXPORT DATA
// =========================

function exportData() {

    const data = {};

    for (let i = 0; i < localStorage.length; i++) {

        const key =
            localStorage.key(i);

        data[key] =
            localStorage.getItem(key);
    }

    const jsonData =
        JSON.stringify(
            data,
            null,
            2
        );

    const blob =
        new Blob(
            [jsonData],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "rank1_backup.json";

    a.click();

    URL.revokeObjectURL(url);

    alert(
        "Backup Downloaded Successfully ✅"
    );
}


// =========================
// IMPORT DATA
// =========================

function importData() {

    const file =
        document.getElementById(
            "importFile"
        ).files[0];

    if (!file) {

        alert(
            "Please select a backup file."
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function (event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );

                Object.keys(data)
                    .forEach(key => {

                        localStorage.setItem(
                            key,
                            data[key]
                        );

                    });

                alert(
                    "Data Restored Successfully ✅"
                );

                location.reload();

            } catch (error) {

                alert(
                    "Invalid Backup File ❌"
                );
            }

        };

    reader.readAsText(file);
}

// =========================
// TODAY'S STUDY PLAN
// =========================

function generateStudyPlan() {

    const container =
        document.getElementById(
            "studyPlanContainer"
        );

    if (!container) return;

    const records =
        JSON.parse(
            localStorage.getItem(
                "performanceRecords"
            )
        ) || [];

    container.innerHTML = "";

    if (records.length === 0) {

        container.innerHTML = `
        <div class="stat-card">
            <p>
                No performance data available yet.
            </p>
        </div>
        `;

        return;
    }

    const weakChapters =
        [...records]
            .sort(
                (a, b) =>
                    a.accuracy -
                    b.accuracy
            )
            .slice(0, 3);

    weakChapters.forEach(
        (chapter, index) => {

            const task =
                document.createElement("div");

            task.className =
                "plan-item";

            task.innerHTML = `
        ${index + 1}. Revise
        <b>${chapter.chapter}</b>
        (${chapter.accuracy}% Accuracy)
        `;

            container.appendChild(task);

        });

    const practice =
        document.createElement("div");

    practice.className =
        "plan-item";

    practice.innerHTML =
        "4. Solve 50 MCQs";

    container.appendChild(
        practice
    );

    const revision =
        document.createElement("div");

    revision.className =
        "plan-item";

    revision.innerHTML =
        "5. Revise Notes for 30 Minutes";

    container.appendChild(
        revision
    );

}

// =========================
// ACHIEVEMENTS
// =========================

function loadAchievements(){

    const container =
        document.getElementById(
            "achievementContainer"
        );

    if(!container) return;

    container.innerHTML = "";

    const completedChapters =
        Number(
            localStorage.getItem(
                "completedChapters"
            )
        ) || 0;

    const streak =
        Number(
            localStorage.getItem(
                "streak"
            )
        ) || 0;

    const records =
        JSON.parse(
            localStorage.getItem(
                "performanceRecords"
            )
        ) || [];

    const badges = [];

    if(completedChapters >= 1){

        badges.push(
            "🌱 Starter"
        );
    }

    if(completedChapters >= 10){

        badges.push(
            "📚 Learner"
        );
    }

    if(completedChapters >= 25){

        badges.push(
            "🔥 Consistent"
        );
    }

    if(completedChapters >= 50){

        badges.push(
            "🚀 Top Performer"
        );
    }

    if(streak >= 7){

        badges.push(
            "⭐ Discipline Master"
        );
    }

    const has90 =
        records.some(
            r => r.accuracy >= 90
        );

    if(has90){

        badges.push(
            "👑 Accuracy King"
        );
    }

    if(badges.length === 0){

        container.innerHTML =
            `
            <div class="achievement-card">
            No badges unlocked yet.
            </div>
            `;

        return;
    }

    badges.forEach(badge => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "achievement-card";

        div.textContent =
            badge;

        container.appendChild(div);

    });

}

loadAchievements();

function toggleChapter(key, checked){

    localStorage.setItem(
        key,
        checked
    );

    renderSyllabus();
}