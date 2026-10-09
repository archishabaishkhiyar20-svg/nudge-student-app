/* =========================================================
   NUDGE — script.js
   All the app JavaScript, in the same order it used to run
   inside index.html. Loaded at the end of <body>.
   ========================================================= */

/* ----- part 1 ----- */
/* =========================
   PROFILE / ONBOARDING DATA
========================= */

let onboardingStep = 1;

let profileData = {
    name: "",
    className: "",
    board: "",
    stream: "",
    freeTime: ""
};


/* =========================
   PROFILE HELPERS
========================= */

function getProfile() {
    return JSON.parse(
        localStorage.getItem("studentProfile") || "null"
    );
}

function saveProfile(profile) {
    localStorage.setItem(
        "studentProfile",
        JSON.stringify(profile)
    );
}


/* =========================
   ONBOARDING
========================= */

function checkProfile() {

    const savedProfile = getProfile();

    if (savedProfile) {
        profileData = savedProfile;
        document.body.classList.remove("onboarding-active");
        document.getElementById("onboarding").classList.add("hidden");
        updateProfileDisplay();
        return;
    }

    document.body.classList.add("onboarding-active");
    document.getElementById("onboarding").classList.remove("hidden");

    showOnboardingStep();
}


function showOnboardingStep() {

    const title = document.getElementById("onboardingTitle");
    const text = document.getElementById("onboardingText");
    const content = document.getElementById("onboardingContent");
    const stepNumber = document.getElementById("onboardingStep");
    const total = document.getElementById("onboardingTotal");

    let totalSteps =
        (profileData.className === "Class 9" ||
         profileData.className === "Class 10")
        ? 4
        : 5;

    total.textContent = totalSteps;

    if (onboardingStep === 1) {

        title.textContent = "Hey! 👋";
        text.textContent = "First, what should we call you?";

        content.innerHTML = `
            <label>Your name</label>
            <input
                id="onboardingName"
                class="onboarding-input"
                type="text"
                placeholder="e.g. Archisha"
                value="${escapeHTML(profileData.name)}"
                autofocus>
        `;

    } else if (onboardingStep === 2) {

        title.textContent = "Nice to meet you! ✨";
        text.textContent = "Which class are you in?";

        content.innerHTML = `
            <div class="choice-grid">
                ${choiceButton("Class 9", "className")}
                ${choiceButton("Class 10", "className")}
                ${choiceButton("Class 11", "className")}
                ${choiceButton("Class 12", "className")}
            </div>
        `;

    } else if (onboardingStep === 3) {

        title.textContent = "Got it! 📚";
        text.textContent = "Which board are you studying under?";

        content.innerHTML = `
            <div class="choice-grid">
                ${choiceButton("CBSE", "board")}
                ${choiceButton("ICSE/ISC", "board")}
                ${choiceButton("State Board", "board")}
                ${choiceButton("Other", "board")}
            </div>
        `;

    } else if (
        onboardingStep === 4 &&
        profileData.className !== "Class 9" &&
        profileData.className !== "Class 10"
    ) {

        title.textContent = "One more academic detail 🎓";
        text.textContent = "What's your stream?";

        content.innerHTML = `
            <div class="choice-grid">
                ${choiceButton("PCM", "stream")}
                ${choiceButton("PCB", "stream")}
                ${choiceButton("Commerce", "stream")}
                ${choiceButton("Humanities", "stream")}
                ${choiceButton("Other", "stream")}
            </div>
        `;

    } else {

        title.textContent = "Almost there! 🕐";
        text.textContent =
            "When are you usually free after school or coaching?";

        content.innerHTML = `
            <label>Your usual free time</label>
            <input
                id="onboardingFreeTime"
                class="onboarding-time"
                type="time"
                value="${profileData.freeTime || ""}">
        `;
    }

    stepNumber.textContent = onboardingStep;

    setTimeout(function() {
        const firstInput =
            content.querySelector("input");

        if (firstInput) {
            firstInput.focus();
        }
    }, 50);
}


function choiceButton(label, property) {

    const selected =
        profileData[property] === label
        ? "selected"
        : "";

    return `
        <button
            type="button"
            class="choice-button ${selected}"
            onclick="selectChoice(this, '${property}', '${label}')">
            ${label}
        </button>
    `;
}


function selectChoice(button, property, value) {

    profileData[property] = value;

    const buttons =
        button.parentElement.querySelectorAll(
            ".choice-button"
        );

    buttons.forEach(function(btn) {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
}


function nextOnboardingStep() {

    if (onboardingStep === 1) {

        const input =
            document.getElementById("onboardingName");

        const name = input.value.trim();

        if (!name) {
            alert("Please enter your name.");
            return;
        }

        profileData.name = name;

        onboardingStep = 2;
        showOnboardingStep();
        return;
    }


    if (onboardingStep === 2) {

        if (!profileData.className) {
            alert("Please choose your class.");
            return;
        }

        onboardingStep = 3;
        showOnboardingStep();
        return;
    }


    if (onboardingStep === 3) {

        if (!profileData.board) {
            alert("Please choose your board.");
            return;
        }

        const junior =
            profileData.className === "Class 9" ||
            profileData.className === "Class 10";

        if (junior) {
            onboardingStep = 4;
        } else {
            onboardingStep = 4;
        }

        showOnboardingStep();
        return;
    }


    const junior =
        profileData.className === "Class 9" ||
        profileData.className === "Class 10";


    if (onboardingStep === 4 && !junior) {

        if (!profileData.stream) {
            alert("Please choose your stream.");
            return;
        }

        onboardingStep = 5;
        showOnboardingStep();
        return;
    }


    if (
        (onboardingStep === 4 && junior) ||
        onboardingStep === 5
    ) {

        const timeInput =
            document.getElementById("onboardingFreeTime");

        if (!timeInput.value) {
            alert("Please choose your usual free time.");
            return;
        }

        profileData.freeTime =
            timeInput.value;

        if (junior) {
            profileData.stream = "";
        }

        saveProfile(profileData);
        finishOnboarding();
    }
}


function finishOnboarding() {

    document.body.classList.remove("onboarding-active");

    document.getElementById("onboarding")
        .classList.add("hidden");

    updateProfileDisplay();
}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   PROFILE DISPLAY
========================= */

function updateProfileDisplay() {

    const profile = getProfile();

    if (!profile) {
        return;
    }

    profileData = profile;

    document.title =
        profile.name + " • Student Dashboard";

    const greetingName =
        document.getElementById("greeting");

    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 17) {
        greeting = "Good afternoon";
    } else if (hour < 21) {
        greeting = "Good evening";
    } else {
        greeting = "Good night";
    }

    greetingName.textContent =
        greeting + ", " + profile.name + "! 👋";
}


function formatTime(time) {

    if (!time) {
        return "Not set";
    }

    const parts = time.split(":");

    const hour =
        Number(parts[0]);

    const minute =
        Number(parts[1]);

    const suffix =
        hour >= 12 ? "PM" : "AM";

    const hour12 =
        hour % 12 || 12;

    return (
        hour12 +
        ":" +
        String(minute).padStart(2, "0") +
        " " +
        suffix
    );
}


function openProfile() {

    const profile = getProfile();

    if (!profile) {
        return;
    }

    document.getElementById("profileName")
        .textContent = profile.name;

    document.getElementById("profileSubtitle")
        .textContent =
        profile.className +
        " • " +
        profile.board;

    document.getElementById("profileClass")
        .textContent = profile.className;

    document.getElementById("profileBoard")
        .textContent = profile.board;

    const streamRow =
        document.getElementById("profileStreamRow");

    if (profile.stream) {
        streamRow.style.display = "block";
        document.getElementById("profileStream")
            .textContent = profile.stream;
    } else {
        streamRow.style.display = "none";
    }

    document.getElementById("profileFreeTime")
        .textContent = formatTime(profile.freeTime);

    document.getElementById("profileView")
        .style.display = "block";

    document.getElementById("editProfileForm")
        .classList.remove("show");

    document.getElementById("profileModal")
        .classList.add("show");
}


function closeProfile() {

    document.getElementById("profileModal")
        .classList.remove("show");
}


function closeProfileIfOutside(event) {

    if (
        event.target ===
        document.getElementById("profileModal")
    ) {
        closeProfile();
    }
}


function startEditProfile() {

    const profile = getProfile();

    document.getElementById("editName")
        .value = profile.name;

    document.getElementById("editClass")
        .value = profile.className;

    document.getElementById("editBoard")
        .value = profile.board;

    document.getElementById("editStream")
        .value = profile.stream || "PCM";

    document.getElementById("editFreeTime")
        .value = profile.freeTime || "";

    updateEditStreamVisibility();

    document.getElementById("profileView")
        .style.display = "none";

    document.getElementById("editProfileForm")
        .classList.add("show");
}


function updateEditStreamVisibility() {

    const className =
        document.getElementById("editClass").value;

    const junior =
        className === "Class 9" ||
        className === "Class 10";

    const group =
        document.getElementById("streamEditGroup");

    group.classList.toggle(
        "show",
        !junior
    );
}


function cancelEditProfile() {

    document.getElementById("editProfileForm")
        .classList.remove("show");

    document.getElementById("profileView")
        .style.display = "block";
}


function saveEditedProfile() {

    const name =
        document.getElementById("editName")
        .value.trim();

    const className =
        document.getElementById("editClass").value;

    const board =
        document.getElementById("editBoard").value;

    const junior =
        className === "Class 9" ||
        className === "Class 10";

    const stream =
        junior
        ? ""
        : document.getElementById("editStream").value;

    const freeTime =
        document.getElementById("editFreeTime").value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!freeTime) {
        alert("Please choose your usual free time.");
        return;
    }

    const updatedProfile = {
        name: name,
        className: className,
        board: board,
        stream: stream,
        freeTime: freeTime
    };

    saveProfile(updatedProfile);
    updateProfileDisplay();
    openProfile();
}



/* =========================
   QUICK CHECK V1
========================= */

function getLocalDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function getQuickCheckDate() {
    return localStorage.getItem("studentQuickCheckDate") || "";
}

function setQuickCheckDone() {
    localStorage.setItem("studentQuickCheckDate", getLocalDateKey());
}

function openQuickCheck() {
    const modal = document.getElementById("quickCheckModal");
    if (modal) modal.classList.add("show");
}

function closeQuickCheck() {
    const modal = document.getElementById("quickCheckModal");
    if (modal) modal.classList.remove("show");
}

function closeQuickCheckIfOutside(event) {
    if (event.target.id === "quickCheckModal") closeQuickCheck();
}

function quickCheckSelect(type) {
    closeQuickCheck();

    const typeSelect = document.getElementById("itemType");
    if (typeSelect) typeSelect.value = type;

    openForm();
    updateCaptureForm();
}

function quickCheckNothing() {
    setQuickCheckDone();
    closeQuickCheck();

    const subtitle = document.getElementById("dashboardSubtitle");
    if (subtitle) {
        subtitle.textContent = "You're all caught up for today. ✨";
        setTimeout(function() {
            subtitle.textContent = "Let's make sure nothing slips through the cracks.";
        }, 3000);
    }
}

function shouldShowAutomaticQuickCheck() {

    const settings = getAppSettings();

    if (!settings.quickCheck) return false;

    const profile = getProfile();

    if (!profile || !profile.freeTime) return false;
    if (getQuickCheckDate() === getLocalDateKey()) return false;

    const parts = profile.freeTime.split(":");
    if (parts.length !== 2) return false;

    const targetMinutes = Number(parts[0]) * 60 + Number(parts[1]);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Show within 90 minutes of the student's usual free time.
    return Math.abs(currentMinutes - targetMinutes) <= 90;
}

function maybeShowQuickCheck() {
    if (shouldShowAutomaticQuickCheck()) {
        setTimeout(function() {
            openQuickCheck();
        }, 450);
    }
}


/* =========================
   EDIT MODE
========================= */

let editingItemId = null;

function openEditForm(itemId) {
    const item = getSavedItems().find(function(savedItem) {
        return String(savedItem.id) === String(itemId);
    });

    if (!item) return;

    editingItemId = item.id;

    const form = document.getElementById("addForm");
    if (!form) return;

    document.getElementById("addFormTitle").textContent = "Edit it";
    document.getElementById("addFormHelper").textContent = "Update anything that changed. Your saved item will be replaced.";
    document.getElementById("itemType").value = item.type || "Other";
    document.getElementById("itemName").value = item.name || "";
    document.getElementById("itemSubject").value = item.subject || "";
    document.getElementById("itemSource").value = item.source || "Other";
    document.getElementById("itemDate").value = item.date || "";
    document.getElementById("itemTime").value = item.time || "";

    updateCaptureForm();
    document.getElementById("addFormTitle").textContent = "Edit it";
    form.style.display = "block";
}

function resetEditMode() {
    editingItemId = null;
    const title = document.getElementById("addFormTitle");
    const helper = document.getElementById("addFormHelper");
    if (title) title.textContent = "Add something";
    if (helper) helper.textContent = "Just the details you’ll want later. Nothing more.";
}

/* =========================
   OPEN FORM
========================= */

function openForm() {
    const form = document.getElementById("addForm");
    if (!form) return;
    form.style.display = "block";
    updateCaptureForm();
}
    function addItemForCurrentSubject() {

    openForm();

    const subjectInput =
        document.getElementById("itemSubject");

    if (subjectInput) {
        subjectInput.value = currentSubjectName;
    }
}

function closeForm() {
    const form = document.getElementById("addForm");
    if (form) form.style.display = "none";
    resetEditMode();
}

function updateCaptureForm() {
    const type = document.getElementById("itemType")?.value || "Other";
    const title = document.getElementById("addFormTitle");
    const helper = document.getElementById("addFormHelper");
    const nameLabel = document.getElementById("itemNameLabel");
    const nameInput = document.getElementById("itemName");
    const dateLabel = document.getElementById("dateLabel");
    const subject = document.getElementById("itemSubject");
    const timeField = document.getElementById("timeField");

    const copy = {
        Test: {title:"Save your test", helper:"Capture the basics now. You can worry about studying later.", name:"Test / exam name", placeholder:"e.g. Physics Unit Test", date:"Test date"},
        Homework: {title:"Save your homework", helper:"A tiny capture now means one less thing to remember tonight.", name:"What homework?", placeholder:"e.g. NCERT Ex 4.2", date:"Due date"},
        Assignment: {title:"Save your assignment", helper:"Keep the deadline somewhere you’ll actually see it.", name:"Assignment name", placeholder:"e.g. Physics investigatory project", date:"Due date"},
        Project: {title:"Save your project", helper:"Just capture the deadline. Details can come later.", name:"Project name", placeholder:"e.g. Chemistry project", date:"Due date"},
        Other: {title:"Save it before you forget", helper:"Capture the important bit. You can fill in more later.", name:"What is it?", placeholder:"e.g. Bring chart paper tomorrow", date:"Date"}
    }[type];

    title.textContent = copy.title;
    helper.textContent = copy.helper;
    nameLabel.textContent = copy.name;
    nameInput.placeholder = copy.placeholder;
    dateLabel.textContent = copy.date;
    timeField.style.display = type === "Test" ? "block" : "block";
    subject.placeholder = type === "Other" ? "Optional" : "e.g. Physics";
}

function markQuickCheckCaptured() {
    setQuickCheckDone();
    const subtitle = document.getElementById("dashboardSubtitle");
    if (subtitle) {
        subtitle.textContent = "Got it — it’s on your list now. ✨";
        setTimeout(function() {
            subtitle.textContent = "Let's make sure nothing slips through the cracks.";
        }, 3000);
    }
}


/* =========================
   GET SAVED ITEMS
========================= */

function getSavedItems() {

    return JSON.parse(
        localStorage.getItem("studentItems")
        || "[]"
    );
}


/* =========================
   SAVE ITEMS
========================= */

function saveItems(items) {

    localStorage.setItem(
        "studentItems",
        JSON.stringify(items)
    );
}


/* =========================
   FIX OLD ITEMS
========================= */

function migrateOldItems() {

    const items = getSavedItems();
    let changed = false;

    items.forEach(function(item) {

        if (!item.id) {

            item.id =
                Date.now() +
                Math.random();

            changed = true;
        }

        if (typeof item.completed !== "boolean") {

            item.completed = false;
            changed = true;
        }

        if (!item.subject) {
            item.subject = "";
            changed = true;
        }

        if (!item.source) {
            item.source = "Other";
            changed = true;
        }

        if (!item.icon) {

            if (item.type === "Assignment") {
                item.icon = "📚";
            }
            else if (item.type === "Project") {
                item.icon = "📌";
            }
            else if (item.type === "Homework") {
                item.icon = "📖";
            }
            else {
                item.icon = "📝";
            }

            changed = true;
        }
    });

    if (changed) {
        saveItems(items);
    }
}


/* =========================
   ADD ITEM
========================= */

function addItem() {

    if (editingItemId !== null) {
        updateExistingItem();
        return;
    }

    const name =
        document.getElementById("itemName")
        .value
        .trim();

    const type =
        document.getElementById("itemType")
        .value;

    const date =
        document.getElementById("itemDate")
        .value;

    const time =
        document.getElementById("itemTime")
        .value;

    if (name === "") {

        alert("Please enter what you got.");
        return;
    }

    let icon = "📝";

    if (type === "Assignment") {
        icon = "📚";
    }
    else if (type === "Project") {
        icon = "📌";
    }
    else if (type === "Homework") {
        icon = "📖";
    }

    const subject =
        document.getElementById("itemSubject")?.value.trim() || "";

    const source =
        document.getElementById("itemSource")?.value || "Other";

    const newItem = {
        id: Date.now(),
        name: name,
        type: type,
        subject: subject,
        source: source,
        date: date,
        time: time,
        icon: icon,
        completed: false
    };

    const savedItems =
        getSavedItems();

    savedItems.push(newItem);

    saveItems(savedItems);

    addCardToPage(newItem);
    updateSummary();
    closeForm();
    markQuickCheckCaptured();
    updateWeekStrip();

    document.getElementById("itemName").value = "";
    document.getElementById("itemSubject").value = "";
    document.getElementById("itemDate").value = "";
    document.getElementById("itemTime").value = "";
    document.getElementById("itemSource").value = "School";
}


/* =========================
   UPDATE EXISTING ITEM
========================= */

function updateExistingItem() {
    const name = document.getElementById("itemName").value.trim();
    if (!name) {
        alert("Please enter what you got.");
        return;
    }

    const items = getSavedItems();
    const item = items.find(function(savedItem) {
        return String(savedItem.id) === String(editingItemId);
    });

    if (!item) {
        closeForm();
        return;
    }

    item.name = name;
    item.type = document.getElementById("itemType").value;
    item.subject = document.getElementById("itemSubject").value.trim();
    item.source = document.getElementById("itemSource").value;
    item.date = document.getElementById("itemDate").value;
    item.time = document.getElementById("itemTime").value;

    if (item.type === "Assignment") item.icon = "📚";
    else if (item.type === "Project") item.icon = "📌";
    else if (item.type === "Homework") item.icon = "📖";
    else item.icon = "📝";

    saveItems(items);
    closeForm();

    renderTasksPage();
    renderTestsPage();
    renderCalendarPage();
    updateSummary();

    const taskList = document.querySelector(".task-list");
    if (taskList) {
        taskList.innerHTML = "";
        items.forEach(addCardToPage);
    }
}

/* =========================
   MARK DONE / UNDO
========================= */

function markDone(button, itemId) {

    const savedItems =
        getSavedItems();

    const item =
        savedItems.find(
            item => item.id === itemId
        );

    if (!item) {
        return;
    }

    item.completed =
        !item.completed;

    saveItems(savedItems);

    const card =
        button.parentElement;

    card.classList.toggle(
        "completed",
        item.completed
    );

    button.textContent =
        item.completed
        ? "↩ Undo"
        : "✓ Done";

    updateSummary();
}


/* =========================
   DELETE ITEM
========================= */

function deleteItem(button, itemId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this?"
        );

    if (!confirmed) {
        return;
    }

    const savedItems =
        getSavedItems();

    const updatedItems =
        savedItems.filter(
            item => item.id !== itemId
        );

    saveItems(updatedItems);

    const card =
        button.parentElement;

    card.remove();

    updateSummary();
}


/* =========================
   FORMAT DATE & TIME
========================= */

function formatDateTime(date, time) {

    if (!date) {
        return "No date";
    }

    const parts = date.split("-");

    const taskDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    const today = new Date();

    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const tomorrow =
        new Date(todayDate);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    let dateText;

    if (
        taskDate.getTime() ===
        todayDate.getTime()
    ) {

        dateText = "Today";

    } else if (
        taskDate.getTime() ===
        tomorrow.getTime()
    ) {

        dateText = "Tomorrow";

    } else {

        dateText =
            taskDate.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "short"
                }
            );
    }

    if (time) {

        const timeParts =
            time.split(":");

        const hours =
            Number(timeParts[0]);

        const minutes =
            Number(timeParts[1]);

        const suffix =
            hours >= 12 ? "PM" : "AM";

        const hour12 =
            hours % 12 || 12;

        const formattedTime =
            hour12 +
            ":" +
            String(minutes).padStart(2, "0") +
            " " +
            suffix;

        return dateText +
            " • " +
            formattedTime;
    }

    return dateText;
}


/* =========================
   CREATE TASK CARD
========================= */

function addCardToPage(item) {

    const newCard =
        document.createElement("div");

    newCard.className =
        "task-card";

    if (item.completed) {

        newCard.classList.add(
            "completed"
        );
    }

    newCard.innerHTML = `
        <div class="icon">
            ${escapeHTML(item.icon)}
        </div>

        <div class="task-info">
            <strong>
                ${escapeHTML(item.name)}
            </strong>

            <span>
                ${escapeHTML(item.subject ? item.subject + " • " : "")}
                ${formatDateTime(item.date, item.time)}
                ${item.source ? " • " + escapeHTML(item.source) : ""}
            </span>
        </div>

        <button
            class="edit-button"
            onclick="openEditForm(${item.id})"
            aria-label="Edit ${escapeHTML(item.name)}">
            ✏️
        </button>

        <button
            class="done-button"
            onclick="markDone(this, ${item.id})">

            ${item.completed
                ? "↩ Undo"
                : "✓ Done"}

        </button>

        <button
            class="delete-button"
            onclick="deleteItem(this, ${item.id})">

            🗑️

        </button>
    `;

    const taskList = document.querySelector(".task-list");
    if (taskList) {
        taskList.appendChild(newCard);
    }
}


/* =========================
   LOAD SAVED ITEMS
========================= */

function loadSavedItems() {

    migrateOldItems();

    const savedItems =
        getSavedItems();

    savedItems.sort(function(a, b) {

        if (a.completed && !b.completed) {
            return 1;
        }

        if (!a.completed && b.completed) {
            return -1;
        }

        if (!a.date && b.date) {
            return 1;
        }

        if (a.date && !b.date) {
            return -1;
        }

        if (!a.date && !b.date) {
            return 0;
        }

        const dateA =
            new Date(
                a.date +
                (a.time
                    ? "T" + a.time
                    : "T23:59")
            );

        const dateB =
            new Date(
                b.date +
                (b.time
                    ? "T" + b.time
                    : "T23:59")
            );

        return (
            dateA.getTime() -
            dateB.getTime()
        );
    });

    savedItems.forEach(
        function(item) {
            addCardToPage(item);
        }
    );

    updateSummary();
}


/* =========================
   UPDATE SUMMARY
========================= */

function updateSummary() {

    const savedItems =
        getSavedItems();

    const today =
        new Date();

    const todayString =
        today.getFullYear() +
        "-" +
        String(
            today.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            today.getDate()
        ).padStart(2, "0");

    let todayCount = 0;
    let weekCount = 0;

    savedItems.forEach(
        function(item) {

            if (
                item.date === todayString &&
                !item.completed
            ) {
                todayCount++;
            }

            if (
                item.date &&
                !item.completed
            ) {

                const itemDate =
                    new Date(
                        item.date +
                        "T00:00"
                    );

                const todayStart =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    );

                const difference =
                    itemDate -
                    todayStart;

                const sevenDays =
                    7 *
                    24 *
                    60 *
                    60 *
                    1000;

                if (
                    difference >= 0 &&
                    difference <= sevenDays
                ) {
                    weekCount++;
                }
            }
        }
    );

    document.getElementById(
        "todayCount"
    ).textContent =
        todayCount;

    document.getElementById(
        "weekCount"
    ).textContent =
        weekCount;
}


/* =========================
   GREETING
========================= */

function updateGreeting() {

    const profile =
        getProfile();

    const hour =
        new Date().getHours();

    let greeting;

    if (hour < 12) {
        greeting = "Good morning";
    }
    else if (hour < 17) {
        greeting = "Good afternoon";
    }
    else if (hour < 21) {
        greeting = "Good evening";
    }
    else {
        greeting = "Good night";
    }

    document.getElementById(
        "greeting"
    ).textContent =
        profile
        ? greeting + ", " + profile.name + "! 👋"
        : greeting + "! 👋";
}


function updateTodayLabel() {
    const label = document.getElementById("todayLabel");
    if (!label) return;
    const now = new Date();
    label.textContent = now.toLocaleDateString(undefined, {
        weekday: "long", month: "short", day: "numeric"
    }).toUpperCase();
}

function updateWeekStrip() {
    const strip = document.getElementById("weekStrip");
    if (!strip) return;
    const now = new Date();
    const start = new Date(now);
    const settings = getAppSettings();
    const day = start.getDay();

    if (settings.weekStart === "sunday") {
        start.setDate(start.getDate() - day);
    } else {
        start.setDate(
            start.getDate() -
            (day === 0 ? 6 : day - 1)
        );
    }
    const items = getSavedItems();
    strip.innerHTML = "";
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = getLocalDateKey(d);
        const hasItem = items.some(item => item.date === key && !item.completed);
        const card = document.createElement("div");
        card.className = "week-day" + (getLocalDateKey(now) === key ? " today" : "");
        card.innerHTML = `<span class="day-name">${d.toLocaleDateString(undefined,{weekday:"short"})}</span><strong class="day-number">${d.getDate()}</strong>${hasItem ? '<span class="day-dot"></span>' : ''}`;
        strip.appendChild(card);
    }
}
/* =========================
   V5 SIDEBAR NAVIGATION
========================= */
    let currentSubjectName = "";

function showSubjectPage(subjectName, icon) {

    currentSubjectName = String(subjectName || "").trim();

    const title = document.getElementById("subjectPageTitle");
    const subtitle = document.getElementById("subjectPageSubtitle");
    const subjectIcon = document.getElementById("subjectPageIcon");

    if (title) {
        title.textContent = currentSubjectName || "Subject";
    }

    if (subjectIcon) {
        subjectIcon.textContent = icon || "📚";
    }

    const profile = getProfile();

    if (subtitle) {
        subtitle.textContent = profile
            ? profile.className
              + (profile.stream ? " • " + profile.stream : "")
              + " • " + currentSubjectName
            : "Everything you've added for this subject.";
    }

    showPage("subject");
    renderSubjectPage();
}

function showPage(page) {

    const main = document.querySelector(".main");

    if (!main) return;

    const appPages =
        document.querySelectorAll(".app-page");

    /* Hide all extra pages */
    appPages.forEach(function(section) {
        section.classList.remove("show");
    });

    /* Show / hide existing dashboard content */
    Array.from(main.children).forEach(function(child) {

        if (child.classList.contains("app-page")) {
            return;
        }

        child.style.display =
            page === "home" ? "" : "none";
    });

    /* Show selected page */
    if (page !== "home") {

        const selected =
            document.getElementById(page + "Page");

        if (selected) {
            selected.classList.add("show");
        }
    }

    /* Update sidebar active state */
    document
        .querySelectorAll(".nav-item")
        .forEach(function(button) {
            button.classList.remove("active");
        });

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function(button) {

        const text =
            button.innerText.trim().toLowerCase();

        if (
            (page === "home" && text.includes("home")) ||
            (page === "tests" && text.includes("tests")) ||
            (page === "tasks" && text.includes("tasks")) ||
            (page === "calendar" && text.includes("calendar")) ||
            (page === "explore" && text.includes("explore")) ||
            (page === "settings" && text.includes("settings")) ||
            (page === "cloud" && text.includes("cloud"))
        ) {
            button.classList.add("active");
        }
    });


    /* Page-specific rendering */

    if (page === "tasks") {
        renderTasksPage();
    }

    if (page === "tests") {
        renderTestsPage();
    }

    if (page === "calendar") {
        renderCalendarPage();
    }

    if (page === "settings") {
        renderSettingsPage();
    }
}


/* =========================
   SUBJECT CARDS
========================= */
function getPresetSubjects(profile) {
    if (!profile || !profile.className) return [];

    const cls = profile.className;
    const board = (profile.board || "").toLowerCase();
    const stream = (profile.stream || "").toLowerCase();

    if (cls === "Class 9" || cls === "Class 10") {

        if (board.includes("icse")) {
            return [
                { name: "English", icon: "📖", type: "Core" },
                { name: "Second Language", icon: "🗣️", type: "Core" },
                { name: "Mathematics", icon: "📐", type: "Core" },
                { name: "Physics", icon: "⚡", type: "Science" },
                { name: "Chemistry", icon: "🧪", type: "Science" },
                { name: "Biology", icon: "🧬", type: "Science" },
                { name: "History & Civics", icon: "🏛️", type: "Humanities" },
                { name: "Geography", icon: "🌍", type: "Humanities" },
                { name: "Computer Applications", icon: "💻", type: "Core" }
            ];
        }

        return [
            { name: "Mathematics", icon: "📐", type: "Core" },
            { name: "Science", icon: "🔬", type: "Core" },
            { name: "English", icon: "📖", type: "Core" },
            { name: "Social Science", icon: "🌍", type: "Core" },
            { name: "Second Language", icon: "🗣️", type: "Core" },
            { name: "Computer / IT", icon: "💻", type: "Core" }
        ];
    }

    if (stream === "pcm") {
        return [
            { name: "Physics", icon: "⚡", type: "PCM" },
            { name: "Chemistry", icon: "🧪", type: "PCM" },
            { name: "Mathematics", icon: "📐", type: "PCM" },
            { name: "English", icon: "📖", type: "Core" }
        ];
    }

    if (stream === "pcb") {
        return [
            { name: "Physics", icon: "⚡", type: "PCB" },
            { name: "Chemistry", icon: "🧪", type: "PCB" },
            { name: "Biology", icon: "🧬", type: "PCB" },
            { name: "English", icon: "📖", type: "Core" }
        ];
    }

    if (stream === "commerce") {
        return [
            { name: "Accountancy", icon: "🧾", type: "Commerce" },
            { name: "Business Studies", icon: "💼", type: "Commerce" },
            { name: "Economics", icon: "📊", type: "Commerce" },
            { name: "English", icon: "📖", type: "Core" }
        ];
    }

    if (stream === "humanities") {
        return [
            { name: "History", icon: "🏛️", type: "Humanities" },
            { name: "Political Science", icon: "🏛️", type: "Humanities" },
            { name: "Geography", icon: "🌍", type: "Humanities" },
            { name: "English", icon: "📖", type: "Core" }
        ];
    }

    return [];
}

function getCustomSubjects() {
    try {
        return JSON.parse(
            localStorage.getItem("nudgeCustomSubjects") || "[]"
        );
    } catch (e) {
        return [];
    }
}

function saveCustomSubjects(subjects) {
    localStorage.setItem("nudgeCustomSubjects", JSON.stringify(subjects));
}    
    function renderSubjectPage() {

    const container = document.getElementById("subjectItemsList");

    if (!container) return;

    const subject = currentSubjectName.toLowerCase();

    const items = getSavedItems()
        .filter(function(item) {
            return String(item.subject || "")
                .trim()
                .toLowerCase() === subject;
        })
        .sort(function(a, b) {
            return String(a.date || "")
                .localeCompare(String(b.date || ""));
        });

    container.innerHTML = "";

    if (!items.length) {

        container.innerHTML = `
            <div class="page-empty">
                <div>📚</div>
                <strong>Nothing here yet</strong>
                <span>
                    Add a task or test for
                    ${escapeHTML(currentSubjectName)}
                    and it'll appear here.
                </span>
            </div>
        `;

        return;
    }

    items.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "page-task-card";

        card.innerHTML = `
            <div class="page-task-icon">
                ${escapeHTML(item.icon || "📝")}
            </div>

            <div class="page-task-info">

                <strong>
                    ${escapeHTML(item.name || "Untitled")}
                </strong>

                <span>
                    ${escapeHTML(item.type || "Other")}
                    •
                    ${formatDateTime(item.date, item.time)}
                    ${item.source
                        ? " • " + escapeHTML(item.source)
                        : ""}
                </span>

            </div>

            <button
                class="edit-button"
                onclick="openEditForm(${item.id})"
                aria-label="Edit ${escapeHTML(item.name || "item")}">
                ✏️
            </button>

            <button
                class="done-button"
                onclick="markDone(this, ${item.id}); renderSubjectPage();">
                ${item.completed ? "↩ Undo" : "✓ Done"}
            </button>
        `;

        container.appendChild(card);
    });
}

function renderSubjectCards() {
    const grid = document.getElementById("subjectsGrid");
    const subtitle = document.getElementById("subjectsSubtitle");
    if (!grid) return;

    const profile = getProfile();
    const presets = getPresetSubjects(profile);
    const custom = getCustomSubjects();
    const presetNames = new Set(presets.map(s => s.name.toLowerCase()));
    const subjects = presets.concat(custom.filter(s => !presetNames.has(String(s.name).toLowerCase())));

    grid.innerHTML = "";

    if (subtitle) {
        subtitle.textContent = profile
            ? profile.className + (profile.stream ? " • " + profile.stream : "")
            : "Set up your profile to personalize your subjects.";
    }

subjects.forEach(function(subject) {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "subject-card subject-open-card";

    card.onclick = function() {
        showSubjectPage(subject.name, subject.icon || "📚");
    };

    card.innerHTML = `
        <div class="subject-card-icon">${escapeHTML(subject.icon || "📚")}</div>
        <strong>${escapeHTML(subject.name)}</strong>
        <small>${escapeHTML(subject.type || "Added")}</small>
    `;

    grid.appendChild(card);
});
    const add = document.createElement("button");
    add.type = "button";
    add.className = "subject-card subject-add-card";
    add.onclick = addCustomSubject;
    add.innerHTML = `
        <div class="subject-card-icon">＋</div>
        <strong>Add subject</strong>
    `;
    grid.appendChild(add);
}

function addCustomSubject() {
    const name = prompt("What subject do you want to add?");
    if (!name) return;

    const clean = name.trim();
    if (!clean) return;

    const profile = getProfile();
    const allNames = getPresetSubjects(profile).concat(getCustomSubjects())
        .map(s => String(s.name).toLowerCase());

    if (allNames.includes(clean.toLowerCase())) {
        alert("That subject is already there.");
        return;
    }

    const custom = getCustomSubjects();
    custom.push({ name: clean, icon: "📚", type: "Added" });
    saveCustomSubjects(custom);
    renderSubjectCards();
}

/* =========================
   TASKS PAGE
========================= */

function renderTasksPage() {

    const container =
        document.getElementById("allTasksList");

    if (!container) return;

    const items = getSavedItems();

    container.innerHTML = "";

    if (!items.length) {

        container.innerHTML = `
            <div class="page-empty">
                <div>📋</div>
                <strong>No tasks yet</strong>
                <span>
                    Add something through Quick Check
                    and it'll appear here.
                </span>
            </div>
        `;

        return;
    }

    items.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className =
            "page-task-card";

        card.innerHTML = `
            <div class="page-task-icon">
                ${escapeHTML(item.icon || "📝")}
            </div>

            <div class="page-task-info">
                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <span>
                    ${
                        item.subject
                            ? escapeHTML(item.subject) + " • "
                            : ""
                    }

                    ${formatDateTime(
                        item.date,
                        item.time
                    )}

                    ${
                        item.source
                            ? " • " + escapeHTML(item.source)
                            : ""
                    }
                </span>
            </div>

            <button
                class="edit-button"
                onclick="openEditForm(${item.id})"
                aria-label="Edit ${escapeHTML(item.name)}"
            >✏️</button>

            <button
                class="done-button"
                onclick="
                    markDone(this, ${item.id});
                    renderTasksPage();
                "
            >
                ${item.completed ? "↩ Undo" : "✓ Done"}
            </button>
        `;

        container.appendChild(card);
    });
}


/* =========================
   TESTS PAGE
========================= */

function renderTestsPage() {

    const container =
        document.getElementById("testsList");

    if (!container) return;

    const tests =
        getSavedItems().filter(function(item) {
            return item.type === "Test";
        });

    container.innerHTML = "";

    if (!tests.length) {

        container.innerHTML = `
            <div class="page-empty">
                <div>📝</div>
                <strong>No tests saved</strong>
                <span>
                    Tests captured through Quick Check
                    will appear here.
                </span>
            </div>
        `;

        return;
    }

    tests.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className =
            "page-task-card";

        card.innerHTML = `
            <div class="page-task-icon">📝</div>

            <div class="page-task-info">
                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <span>
                    ${
                        item.subject
                            ? escapeHTML(item.subject) + " • "
                            : ""
                    }

                    ${formatDateTime(
                        item.date,
                        item.time
                    )}

                    ${
                        item.source
                            ? " • " + escapeHTML(item.source)
                            : ""
                    }
                </span>
            </div>

            <button
                class="edit-button"
                onclick="openEditForm(${item.id})"
                aria-label="Edit ${escapeHTML(item.name)}"
            >✏️</button>

            <button
                class="done-button"
                onclick="
                    markDone(this, ${item.id});
                    renderTestsPage();
                "
            >
                ${item.completed ? "↩ Undo" : "✓ Done"}
            </button>
        `;

        container.appendChild(card);
    });
}


/* =========================
   CALENDAR PAGE
========================= */

function renderCalendarPage() {

    const strip =
        document.getElementById("calendarWeekStrip");

    const taskList =
        document.getElementById("calendarDayTasks");

    if (!strip || !taskList) return;

    const now = new Date();

    const start =
        new Date(now);

    const day =
        start.getDay();

    start.setDate(
        start.getDate() -
        (day === 0 ? 6 : day - 1)
    );

    strip.innerHTML = "";

    const items =
        getSavedItems();

    let selectedKey =
        getLocalDateKey(now);

    function renderDay(key) {

        selectedKey = key;

        taskList.innerHTML = "";

        const dayItems =
            items.filter(function(item) {
                return (
                    item.date === key
                );
            });

        if (!dayItems.length) {

            taskList.innerHTML = `
                <div class="page-empty">
                    <div>✨</div>
                    <strong>Nothing scheduled</strong>
                    <span>
                        Nothing captured for this day.
                    </span>
                </div>
            `;

            return;
        }

        dayItems.forEach(function(item) {

            const card =
                document.createElement("div");

            card.className =
                "page-task-card";

            card.innerHTML = `
                <div class="page-task-icon">
                    ${escapeHTML(item.icon || "📝")}
                </div>

                <div class="page-task-info">
                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <span>
                        ${
                            item.subject
                                ? escapeHTML(item.subject) + " • "
                                : ""
                        }

                        ${formatDateTime(
                            item.date,
                            item.time
                        )}
                    </span>
                </div>
            `;

            taskList.appendChild(card);
        });
    }

    for (let i = 0; i < 7; i++) {

        const date =
            new Date(start);

        date.setDate(
            start.getDate() + i
        );

        const key =
            getLocalDateKey(date);

        const hasItem =
            items.some(function(item) {
                return (
                    item.date === key &&
                    !item.completed
                );
            });

        const dayCard =
            document.createElement("div");

        dayCard.className =
            "calendar-day" +
            (
                key === selectedKey
                    ? " selected"
                    : ""
            );

        dayCard.innerHTML = `
            <span class="calendar-day-name">
                ${date.toLocaleDateString(
                    undefined,
                    { weekday: "short" }
                )}
            </span>

            <strong class="calendar-day-number">
                ${date.getDate()}
            </strong>

            ${
                hasItem
                    ? `<span class="calendar-dot"></span>`
                    : ""
            }
        `;

        dayCard.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".calendar-day")
                    .forEach(function(day) {
                        day.classList.remove("selected");
                    });

                dayCard.classList.add("selected");

                renderDay(key);
            }
        );

        strip.appendChild(dayCard);
    }

    renderDay(selectedKey);
}


/* =========================
   SETTINGS — V6
========================= */

function getAppSettings() {

    const defaults = {
        theme: "system",
        quickCheck: true,
        taskReminders: true,
        weekStart: "monday"
    };

    const saved = localStorage.getItem("nudgeSettings");

    if (!saved) {
        return defaults;
    }

    try {
        const parsed = JSON.parse(saved);

        return {
            ...defaults,
            ...(parsed && typeof parsed === "object" ? parsed : {})
        };

    } catch (error) {

        console.log("Could not read saved settings.");

        return defaults;
    }
}


/* =========================
   SAVE SETTING
========================= */

function saveSetting(key, value) {

    const settings = getAppSettings();

    settings[key] = value;

    localStorage.setItem(
        "nudgeSettings",
        JSON.stringify(settings)
    );

    applySettings();

    if (key === "weekStart") {

        if (typeof updateWeekStrip === "function") {
            updateWeekStrip();
        }

        if (typeof renderCalendarPage === "function") {
            renderCalendarPage();
        }
    }

    if (key === "quickCheck" && !value) {
        closeQuickCheck();
    }
}


/* =========================
   APPLY SETTINGS
========================= */

function applySettings() {

    const settings = getAppSettings();

    let theme = settings.theme;

    if (theme === "system") {
        theme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
    }

    document.documentElement.dataset.theme = theme;
}


/* =========================
   SETTINGS PAGE
========================= */

function renderSettingsPage() {

    const settings = getAppSettings();

    const theme =
        document.getElementById("themeSetting");

    const quickCheck =
        document.getElementById("quickCheckSetting");

    const taskReminders =
        document.getElementById("taskReminderSetting");

    const weekStart =
        document.getElementById("weekStartSetting");


    if (theme) {
        theme.value = settings.theme;
    }

    if (quickCheck) {
        quickCheck.checked = settings.quickCheck;
    }

    if (taskReminders) {
        taskReminders.checked = settings.taskReminders;
    }

    if (weekStart) {
        weekStart.value = settings.weekStart;
    }
}


/* =========================
   CLOUD / BACKUP
========================= */

function backupNudgeData() {
    const data = {
        profile: typeof getProfile === "function" ? getProfile() : null,
        items: typeof getSavedItems === "function" ? getSavedItems() : [],
        settings: typeof getAppSettings === "function" ? getAppSettings() : {},
        exportedAt: new Date().toISOString(),
        app: "Nudge"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nudge-backup-" + new Date().toISOString().slice(0,10) + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    const title = document.getElementById("cloudStatusTitle");
    const text = document.getElementById("cloudStatusText");
    if (title) title.textContent = "Backup created";
    if (text) text.textContent = "Your Nudge backup was downloaded to your device.";
}

function restoreNudgeData(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        try {
            const data = JSON.parse(reader.result);
            if (!data || typeof data !== "object" || !Array.isArray(data.items)) {
                throw new Error("Invalid backup");
            }

            if (data.profile) {
                localStorage.setItem("studentProfile", JSON.stringify(data.profile));
            } else {
                localStorage.removeItem("studentProfile");
            }

            localStorage.setItem("studentItems", JSON.stringify(data.items));

            if (data.settings && typeof data.settings === "object") {
                localStorage.setItem("nudgeSettings", JSON.stringify(data.settings));
            }

            if (data.quickCheckDate) {
                localStorage.setItem("studentQuickCheckDate", data.quickCheckDate);
            }

            alert("Backup restored! Nudge will reload now.");
            location.reload();
        } catch (error) {
            alert("That file doesn't look like a valid Nudge backup.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}


/* =========================
   EXPORT STUDENT DATA
========================= */

function exportStudentData() {

    const data = {
        profile:
            typeof getProfile === "function"
                ? getProfile()
                : null,

        items:
            typeof getSavedItems === "function"
                ? getSavedItems()
                : [],

        settings:
            getAppSettings(),

        exportedAt:
            new Date().toISOString()
    };


    const json =
        JSON.stringify(data, null, 2);

    const blob =
        new Blob(
            [json],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = "nudge-student-data.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


/* =========================
   RESET APP DATA
========================= */

function resetStudentData() {

    const confirmed =
        confirm(
            "Are you sure you want to reset your Nudge data? This will delete your saved tasks, profile and settings from this browser."
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("studentItems");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentQuickCheckDate");
    localStorage.removeItem("nudgeSettings");

    location.reload();
}


/* =========================
   SETTINGS MESSAGE
========================= */

function showSettingsMessage(type) {

    if (type === "Feedback") {

        alert(
            "Feedback isn't connected yet. We'll add this soon! ✨"
        );

        return;
    }

    alert(
        "This setting isn't connected yet."
    );
}


/* =========================
   START APP
========================= */

applySettings();

updateTodayLabel();
updateGreeting();
loadSavedItems();
updateWeekStrip();
// maybeShowQuickCheck();
// Landing page is shown first; checkProfile() runs when the user enters Nudge.

renderSubjectCards();

/* =========================
   HEADER SEARCH + NOTIFICATIONS
========================= */
function closeHeaderPopovers() {
    document.querySelectorAll(".nudge-popover").forEach(function(el) { el.remove(); });
}

function toggleSearchPanel() {
    const existing = document.getElementById("nudgeSearchPopover");
    if (existing) { existing.remove(); return; }
    closeHeaderPopovers();

    const panel = document.createElement("div");
    panel.id = "nudgeSearchPopover";
    panel.className = "nudge-popover";
    panel.innerHTML = `
        <div class="nudge-popover-header">Search Nudge</div>
        <div class="nudge-search-wrap">
            <input id="nudgeSearchInput" class="nudge-search-input" type="search" placeholder="Search tasks, tests, subjects..." autocomplete="off">
        </div>
        <div id="nudgeSearchResults" class="nudge-results"></div>
    `;
    document.body.appendChild(panel);

    const input = document.getElementById("nudgeSearchInput");
    renderNudgeSearchResults("");
    input.focus();
    input.addEventListener("input", function() { renderNudgeSearchResults(input.value); });
}

function renderNudgeSearchResults(query) {
    const container = document.getElementById("nudgeSearchResults");
    if (!container) return;
    const items = typeof getSavedItems === "function" ? getSavedItems() : [];
    const q = String(query || "").trim().toLowerCase();
    const matches = items.filter(function(item) {
        if (!q) return true;
        return [item.name, item.type, item.subject, item.source, item.date]
            .filter(Boolean).join(" ").toLowerCase().includes(q);
    }).slice(0, 20);

    if (!matches.length) {
        container.innerHTML = '<div class="nudge-empty">Nothing found yet.</div>';
        return;
    }

    container.innerHTML = matches.map(function(item) {
        const meta = [item.type, item.subject, item.date ? formatDateTime(item.date, item.time) : ""]
            .filter(Boolean).join(" • ");
        return `
            <div class="nudge-result" data-id="${escapeHTML(String(item.id))}">
                <div class="nudge-result-icon">${escapeHTML(item.icon || "📝")}</div>
                <div class="nudge-result-info">
                    <strong>${escapeHTML(item.name || "Untitled")}</strong>
                    <span>${escapeHTML(meta)}</span>
                </div>
            </div>`;
    }).join("");

    container.querySelectorAll(".nudge-result").forEach(function(row) {
        row.addEventListener("click", function() { openSearchResult(row.dataset.id); });
    });
}

function openSearchResult(id) {
    closeHeaderPopovers();
    const item = (typeof getSavedItems === "function" ? getSavedItems() : []).find(function(x) { return String(x.id) === String(id); });
    if (item) showPage(item.type === "Test" ? "tests" : "tasks");
}

function toggleNotificationPanel() {
    const existing = document.getElementById("nudgeNotificationPopover");
    if (existing) { existing.remove(); return; }
    closeHeaderPopovers();

    const panel = document.createElement("div");
    panel.id = "nudgeNotificationPopover";
    panel.className = "nudge-popover";
    panel.innerHTML = `
        <div class="nudge-popover-header">Notifications</div>
        <div id="nudgeNotificationList" class="nudge-notifications"></div>
    `;
    document.body.appendChild(panel);
    renderNudgeNotifications();

    const dot = document.querySelector(".notification-button span");
    if (dot) dot.style.display = "none";
}

function renderNudgeNotifications() {
    const container = document.getElementById("nudgeNotificationList");
    if (!container) return;
    const items = typeof getSavedItems === "function" ? getSavedItems() : [];
    const now = new Date();
    const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcoming = items.filter(function(item) {
        if (item.completed || !item.date) return false;
        const date = new Date(item.date + "T" + (item.time || "23:59"));
        return !isNaN(date.getTime()) && date <= weekAhead;
    }).sort(function(a,b) {
        return new Date(a.date + "T" + (a.time || "23:59")) - new Date(b.date + "T" + (b.time || "23:59"));
    }).slice(0, 10);

    if (!upcoming.length) {
        container.innerHTML = '<div class="nudge-empty">You’re all caught up. ✨</div>';
        return;
    }

    container.innerHTML = upcoming.map(function(item) {
        const date = new Date(item.date + "T" + (item.time || "23:59"));
        const meta = (date < now ? "Overdue" : "Upcoming") + " • " + formatDateTime(item.date, item.time);
        return `
            <div class="nudge-notification" data-id="${escapeHTML(String(item.id))}">
                <div class="nudge-notification-dot"></div>
                <div class="nudge-notification-info">
                    <strong>${escapeHTML(item.name || "Untitled")}</strong>
                    <span>${escapeHTML(meta)}</span>
                </div>
            </div>`;
    }).join("");

    container.querySelectorAll(".nudge-notification").forEach(function(row) {
        row.addEventListener("click", function() { openNotificationItem(row.dataset.id); });
    });
}

function openNotificationItem(id) {
    const item = (typeof getSavedItems === "function" ? getSavedItems() : []).find(function(x) { return String(x.id) === String(id); });
    closeHeaderPopovers();
    if (item) showPage(item.type === "Test" ? "tests" : "tasks");
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeHeaderPopovers();
});

document.addEventListener("click", function(event) {
    const panel = event.target.closest && event.target.closest(".nudge-popover");
    const searchButton = event.target.closest && event.target.closest(".search-button");
    const notificationButton = event.target.closest && event.target.closest(".notification-button");
    if (!panel && !searchButton && !notificationButton) closeHeaderPopovers();
});

/* ----- part 2 ----- */
function enterNudge() {
    var landing = document.getElementById("landingPage");
    if (landing) landing.style.display = "none";
    document.body.classList.remove("landing-mode");
    var app = document.querySelector(".app");
    if (app) app.style.display = "grid";
    if (typeof checkProfile === "function") checkProfile();
    window.scrollTo(0, 0);
}

/* ----- part 3 ----- */
/* ===== SEND TO NUDGE — rule-based "Understand" step (prototype) ===== */
(function () {
  var SUBJECTS = [
    ['Physics', /\b(physics|phy)\b/i],
    ['Chemistry', /\b(chemistry|chem)\b/i],
    ['Mathematics', /\b(mathematics|maths?|calculus|algebra)\b/i],
    ['Biology', /\b(biology|bio)\b/i],
    ['English', /\benglish\b/i],
    ['Hindi', /\bhindi\b/i],
    ['History', /\bhistory\b/i],
    ['Geography', /\b(geography|geo)\b/i],
    ['Economics', /\b(economics|eco)\b/i],
    ['Political Science', /\b(political science|polity|civics)\b/i],
    ['Social Science', /\b(social science|social studies|sst)\b/i],
    ['Science', /\bscience\b/i],
    ['Computer Applications', /\b(computer science|computer applications?|computers?|cs|informatics)\b/i],
    ['Accountancy', /\b(accountancy|accounts)\b/i],
    ['Business Studies', /\b(business studies|business)\b/i]
  ];
  var TYPES = [
    ['Assignment', /\bassignments?\b/i, 'Assignment'],
    ['Project', /\bprojects?\b/i, 'Project'],
    ['Homework', /\b(homework|hw|worksheets?)\b/i, 'Homework'],
    ['Test', /\bunit test\b/i, 'Unit Test'],
    ['Test', /\bmock( test)?\b/i, 'Mock Test'],
    ['Test', /\b(exam|exams|examination)\b/i, 'Exam'],
    ['Test', /\bquiz(zes)?\b/i, 'Quiz'],
    ['Test', /\bviva\b/i, 'Viva'],
    ['Test', /\bpractical\b/i, 'Practical'],
    ['Test', /\btests?\b/i, 'Test']
  ];
  var MONTHS = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11};
  var MONTH_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
  var DAYS = {sun:0,mon:1,tue:2,tues:2,wed:3,thu:4,thur:4,thurs:4,fri:5,sat:6};

  function day0(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function monthIdx(s) { return MONTHS[s.toLowerCase().slice(0, s.toLowerCase().indexOf('sep') === 0 ? 3 : 3)]; }
  function mk(y, m, d, today) {
    var dt = new Date(y, m, d);
    if (dt.getMonth() !== m || dt.getDate() !== d) return null;
    return dt;
  }
  function withYear(m, d, yearStr, today) {
    if (yearStr) { var y = parseInt(yearStr, 10); if (y < 100) y += 2000; return mk(y, m, d, today); }
    var dt = mk(today.getFullYear(), m, d, today);
    if (dt && dt < today) dt = mk(today.getFullYear() + 1, m, d, today);
    return dt;
  }

  function findDate(text, now) {
    var today = day0(now), m;

    if ((m = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/.exec(text))) {
      var a = mk(+m[1], +m[2] - 1, +m[3], today); if (a) return a;
    }
    if ((m = /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/.exec(text)) && +m[2] <= 12 && +m[1] <= 31) {
      var b = withYear(+m[2] - 1, +m[1], m[3], today); if (b) return b;
    }
    if ((m = /\b(\d{1,2})-(\d{1,2})-(\d{2,4})\b/.exec(text)) && +m[2] <= 12 && +m[1] <= 31) {
      var c = withYear(+m[2] - 1, +m[1], m[3], today); if (c) return c;
    }
    if ((m = new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?' + MONTH_RE + '\\b(?:,?\\s*(\\d{4}))?', 'i').exec(text))) {
      var d1 = withYear(MONTHS[m[2].toLowerCase().slice(0, 3)], +m[1], m[3], today); if (d1) return d1;
    }
    if ((m = new RegExp('\\b' + MONTH_RE + '\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:,?\\s*(\\d{4}))?', 'i').exec(text))) {
      var d2 = withYear(MONTHS[m[1].toLowerCase().slice(0, 3)], +m[2], m[3], today); if (d2) return d2;
    }
    if (/\bday after tomorrow\b/i.test(text)) return addDays(today, 2);
    if (/\b(tomorrow|tmrw|tmr)\b/i.test(text)) return addDays(today, 1);
    if (/\b(today|tonight)\b/i.test(text)) return today;
    if ((m = /\bin\s+(\d{1,2})\s+days?\b/i.exec(text))) return addDays(today, +m[1]);
    if (/\bnext week\b/i.test(text) && !/\b(mon|tues?|wed|thu(?:rs?)?|fri|sat|sun)(?:day|sday|nesday|rsday|urday)?\b/i.test(text)) return addDays(today, 7);

    if ((m = /\b(?:(next|this|coming)\s+)?(mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)\b/i.exec(text))) {
      var key = m[2].toLowerCase().replace(/day$/, '').replace(/s$/, ''); // monday->mon, tuesday->tue, thurs->thur
      var target = DAYS[m[2].toLowerCase().slice(0, 3)];
      if (target === undefined) target = DAYS[key];
      if (target !== undefined) {
        var dow = today.getDay();
        if ((m[1] || '').toLowerCase() === 'next') {
          var toNextMon = ((8 - dow) % 7) || 7;           // days until next Monday (strictly after today)
          var nextMon = addDays(today, toNextMon);
          return addDays(nextMon, (target + 6) % 7);       // Mon=0 … Sun=6
        }
        return addDays(today, (target - dow + 7) % 7);
      }
    }
    if ((m = /\bon\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/i.exec(text))) {
      var dd = +m[1], cand = mk(today.getFullYear(), today.getMonth(), dd, today);
      if (!cand || cand < today) cand = mk(today.getFullYear(), today.getMonth() + 1, dd, today);
      if (cand) return cand;
    }
    return null;
  }

  function to24(h, mi, mer) {
    mer = (mer || '').toLowerCase().replace(/\./g, '');
    if (mer === 'pm' && h < 12) h += 12;
    if (mer === 'am' && h === 12) h = 0;
    if (h > 23 || mi > 59) return null;
    return pad(h) + ':' + pad(mi);
  }
  function findTime(text) {
    var m;
    if ((m = /\b(\d{1,2})(?::(\d{2}))?\s*(?:-|–|to)\s*(?:\d{1,2})(?::\d{2})?\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/i.exec(text)))
      return to24(+m[1], +(m[2] || 0), m[3]);
    if ((m = /\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/i.exec(text)))
      return to24(+m[1], +(m[2] || 0), m[3]);
    if ((m = /\b(\d{1,2}):(\d{2})\b/.exec(text))) {
      var h = +m[1];
      if (h >= 1 && h <= 6) h += 12;   // "5:00" in a school context almost always means evening
      return to24(h, +m[2], '');
    }
    if (/\bnoon\b/i.test(text)) return '12:00';
    return null;
  }
  function fmtTime(t) {
    if (!t) return '';
    var p = t.split(':'), h = +p[0], mi = p[1], ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + mi + ' ' + ap;
  }
  function fmtDate(d) {
    if (!d) return '';
    var wd = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
    var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
    return wd + ', ' + d.getDate() + ' ' + mo;
  }

  function userSubjectNames() {
    var names = [];
    try { if (typeof getPresetSubjects === 'function') getPresetSubjects(typeof getProfile === 'function' ? getProfile() : null).forEach(function (s) { names.push(s.name); }); } catch (e) {}
    try { if (typeof getCustomSubjects === 'function') getCustomSubjects().forEach(function (s) { names.push(s.name); }); } catch (e) {}
    return names;
  }
  function earliest(text, list) {
    var best = null;
    list.forEach(function (row) {
      var m = row[1].exec(text);
      if (m && (!best || m.index < best.index || (m.index === best.index && m[0].length > best.len)))
        best = { row: row, index: m.index, len: m[0].length };
    });
    return best;
  }
  function pickSubject(text) {
    var hit = earliest(text, SUBJECTS), name = hit ? hit.row[0] : '';
    // custom subjects the student added themselves
    userSubjectNames().forEach(function (n) {
      var i = text.toLowerCase().indexOf(String(n).toLowerCase());
      if (i !== -1 && String(n).length > 3 && (!hit || i < hit.index)) { name = n; hit = { index: i }; }
    });
    // prefer the exact name used in this student's own subject list
    if (name) {
      var mine = userSubjectNames();
      for (var k = 0; k < mine.length; k++) {
        var lo = String(mine[k]).toLowerCase();
        if (lo === name.toLowerCase()) return mine[k];
      }
      if (name === 'Computer Applications') {
        for (var j = 0; j < mine.length; j++) if (/computer/i.test(mine[j])) return mine[j];
      }
    }
    return name;
  }
  function findDetail(text) {
    var m;
    if ((m = /\bq(?:uestions?|s)\.?\s*(\d+\s*(?:-|–|to)\s*\d+)/i.exec(text))) return 'Questions ' + m[1].replace(/\s*(?:-|to)\s*/i, '–').replace(/\s+/g, '');
    if ((m = /\bchapters?\s*(\d+(?:\s*(?:,|and|&|-|–|to)\s*\d+)*)/i.exec(text))) {
      var parts = m[1].split(/\s*(?:,|and|&|-|–|to)\s*/i);
      return (parts.length > 1 ? 'Chapters ' : 'Chapter ') + m[1].replace(/\s*&\s*/g, ' and ').replace(/\s*,\s*/g, ', ').replace(/\s+/g, ' ');
    }
    if ((m = /\bpages?\s*(\d+(?:\s*(?:-|–|to)\s*\d+)?)/i.exec(text))) return 'Page ' + m[1].replace(/\s*(?:-|to)\s*/i, '–').replace(/\s+/g, '');
    if ((m = /\bexercise\s*([\d.]+)/i.exec(text))) return 'Exercise ' + m[1];
    return '';
  }
  function findSource(text) {
    if (/\b(whatsapp|telegram|group|forwarded|fwd)\b/i.test(text)) return 'WhatsApp';
    if (/\b(coaching|institute|batch|academy|tuition)\b/i.test(text)) return 'Coaching';
    if (/\b(school|class teacher|principal|periodic test|pt\b)/i.test(text)) return 'School';
    return 'Other';
  }

  function understand(raw, now) {
    now = now || new Date();
    var text = String(raw || '').replace(/\s+/g, ' ').trim();
    var out = { ok: false, text: text, type: '', typeLabel: '', subject: '', date: '', dateText: '', time: '', timeText: '', source: 'Other', detail: '', name: '' };
    if (!text) return out;

    var th = earliest(text, TYPES);
    if (th) { out.type = th.row[0]; out.typeLabel = th.row[2]; }
    out.subject = pickSubject(text);
    var d = findDate(text, now);
    if (d) { out.date = iso(d); out.dateText = fmtDate(d); }
    var t = findTime(text);
    if (t) { out.time = t; out.timeText = fmtTime(t); }
    out.detail = findDetail(text);
    out.source = findSource(text);
    if (!out.type) out.type = 'Other';

    var base = (out.subject + ' ' + (out.typeLabel || '')).trim();
    if (!out.typeLabel) {
      var short = text.length > 44 ? text.slice(0, 44).replace(/\s+\S*$/, '') + '…' : text;
      base = out.subject ? out.subject + ' — ' + short : short;
    } else if (out.detail) {
      base += ' — ' + out.detail;
    }
    out.name = base;
    out.ok = !!(out.subject || out.typeLabel || out.date || out.time);
    return out;
  }
  window.nudgeUnderstand = understand;

  /* ---------- UI ---------- */
  var last = null;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  window.openSendNudge = function () {
    var m = $('snModal'); if (!m) return;
    $('snStepInput').style.display = 'block';
    $('snStepResult').style.display = 'none';
    $('snStepDone').style.display = 'none';
    m.classList.add('show');
    setTimeout(function () { var i = $('snInput'); if (i) i.focus(); }, 60);
  };
  window.closeSendNudge = function () { var m = $('snModal'); if (m) m.classList.remove('show'); };
  window.closeSendNudgeIfOutside = function (e) { if (e.target.id === 'snModal') closeSendNudge(); };
  window.snUseExample = function (el) { var i = $('snInput'); i.value = el.textContent; i.focus(); };
  window.snBack = function () {
    $('snStepInput').style.display = 'block';
    $('snStepResult').style.display = 'none';
    $('snStepDone').style.display = 'none';
    var i = $('snInput'); if (i) i.focus();
  };
  window.snAnother = function () { $('snInput').value = ''; snBack(); };

  window.snUnderstand = function () {
    var text = $('snInput').value.trim();
    var err = $('snError');
    if (!text) { err.textContent = 'Paste or type something first.'; err.style.display = 'block'; return; }
    err.style.display = 'none';
    last = understand(text);
    if (!last.ok) {
      err.textContent = 'I couldn\'t find a subject, task, date or time in that. Try something like “Physics test Monday 5 PM”.';
      err.style.display = 'block';
      return;
    }
    function row(label, val) {
      return '<div class="sn-field"><span>' + label + '</span>' +
        (val ? '<strong>' + esc(val) + '</strong>' : '<em>Not found</em>') + '</div>';
    }
    var typeShown = last.type === 'Other' ? '' : last.type;
    $('snResultTitle').textContent = last.name;
    $('snFields').innerHTML =
      row('Subject', last.subject) + row('Task', typeShown) +
      row('Date', last.dateText) + row('Time', last.timeText) +
      row('From', last.source === 'Other' ? '' : last.source);
    var missingDate = !last.date;
    $('snHint').style.display = missingDate ? 'block' : 'none';
    $('snSaveBtn').textContent = missingDate ? 'Add the missing details' : 'Looks right — save it';
    $('snSaveBtn').onclick = missingDate ? snEdit : snSave;
    $('snStepInput').style.display = 'none';
    $('snStepResult').style.display = 'block';
  };

  window.snSave = function () {
    if (!last) return;
    var icons = { Assignment: '📚', Project: '📌', Homework: '📖', Test: '📝', Other: '📝' };
    var item = {
      id: Date.now(), name: last.name, type: last.type, subject: last.subject,
      source: last.source === 'Other' ? 'Other' : last.source,
      date: last.date, time: last.time, icon: icons[last.type] || '📝', completed: false
    };
    var items = getSavedItems(); items.push(item); saveItems(items);
    try { addCardToPage(item); updateSummary(); markQuickCheckCaptured(); updateWeekStrip(); } catch (e) { console.warn(e); }
    $('snDoneText').textContent = item.name + (last.dateText ? ' · ' + last.dateText : '') + (last.timeText ? ' · ' + last.timeText : '');
    $('snStepResult').style.display = 'none';
    $('snStepDone').style.display = 'block';
  };

  window.snEdit = function () {
    if (!last) return;
    closeSendNudge();
    if (typeof resetEditMode === 'function') resetEditMode();
    var sel = $('itemType'); if (sel) sel.value = last.type === 'Other' ? 'Other' : last.type;
    openForm();
    function set(id, v) { var el = $(id); if (el && v) el.value = v; }
    set('itemName', last.name); set('itemSubject', last.subject);
    set('itemSource', last.source === 'Other' ? 'Other' : last.source);
    set('itemDate', last.date); set('itemTime', last.time);
    var f = $('addForm'); if (f && f.scrollIntoView) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  document.addEventListener('keydown', function (e) {
    var m = $('snModal'); if (!m || !m.classList.contains('show')) return;
    if (e.key === 'Escape') closeSendNudge();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && $('snStepInput').style.display !== 'none') snUnderstand();
  });
})();

/* ----- part 4 ----- */
/* ===== NUDGE v2 — motion layer (landing + dashboard) ===== */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- landing: background blobs, rocket, progress bar --- */
  function setupLanding() {
    var lp = $('#landingPage'); if (!lp) return;
    if (!$('.nudge-blobs', lp)) {
      var b = document.createElement('div'); b.className = 'nudge-blobs'; b.setAttribute('aria-hidden', 'true');
      b.innerHTML = '<i></i><i></i><i></i>'; lp.insertBefore(b, lp.firstChild);
    }
    var vis = $('.landing-visual', lp);
    if (vis && !$('.nudge-rocket', vis)) {
      var r = document.createElement('div'); r.className = 'nudge-rocket'; r.setAttribute('aria-hidden', 'true');
      r.innerHTML =
        '<svg viewBox="0 0 64 96" width="50" height="74"><g>' +
        '<path d="M32 6C44 20 46 40 42 62H22C18 40 20 20 32 6Z" fill="#fffdf7" stroke="#879b82" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="32" cy="34" r="6.5" fill="#e3e8dc" stroke="#879b82" stroke-width="2.5"/>' +
        '<path d="M22 50L10 67L22 62Z" fill="#879b82"/><path d="M42 50L54 67L42 62Z" fill="#879b82"/>' +
        '<rect x="25" y="60" width="14" height="6" rx="2" fill="#71866e"/>' +
        '<g class="rk-flame"><path d="M26 68Q32 94 38 68Z" fill="#e8c27a"/><path d="M29 68Q32 84 35 68Z" fill="#fffdf7"/></g>' +
        '</g></svg><i class="rk-p p1"></i><i class="rk-p p2"></i><i class="rk-p p3"></i>';
      vis.appendChild(r);
    }
    if (!$('#nudgeProgress')) {
      var p = document.createElement('div'); p.id = 'nudgeProgress'; document.body.appendChild(p);
      window.addEventListener('scroll', function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        p.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
      }, { passive: true });
    }
  }

  /* --- landing: reveal on scroll --- */
  function setupReveal() {
    var sel = '.landing-heading,.landing-card,.landing-step,.landing-feature,.landing-quick-copy,.landing-quick-window,.landing-problem-ending,.landing-cta>*,.landing-footer';
    var els = $$(sel, $('#landingPage') || document);
    if (!('IntersectionObserver' in window) || reduce) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      var sibs = el.parentNode ? $$(':scope > ' + (el.className ? '.' + el.className.split(' ')[0] : el.tagName), el.parentNode) : [];
      var i = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = (i * 90) + 'ms';
      el.classList.add('n-reveal');
      io.observe(el);
    });
  }

  /* --- landing: live typing demo in the hero --- */
  function setupDemo() {
    var card = $('.landing-message-card p'), item = $('.landing-result-item'), check = $('.landing-saved-check');
    if (!card || !item) return;
    var title = $('strong', item), meta = $('span', item);
    var demos = [
      ['Physics test this Monday at 5 PM.', 'Physics Test', 'Monday · 5:00 PM'],
      ['Chemistry assignment: questions 1–20 by Friday', 'Chemistry Assignment', 'Friday · Questions 1–20'],
      ['Maths unit test tomorrow 4:30 pm', 'Maths Unit Test', 'Tomorrow · 4:30 PM'],
      ['Submit the bio project on 15 Oct', 'Biology Project', '15 Oct · Submission']
    ];
    if (reduce) return;
    var n = 0;
    function run() {
      var d = demos[n % demos.length]; n++;
      var i = 0; card.innerHTML = '<span class="n-caret"></span>';
      item.classList.add('swap');
      (function type() {
        if (i <= d[0].length) {
          card.textContent = d[0].slice(0, i);
          var c = document.createElement('span'); c.className = 'n-caret'; card.appendChild(c);
          i++; setTimeout(type, 32);
        } else {
          setTimeout(function () {
            title.textContent = d[1]; meta.textContent = d[2];
            item.classList.remove('swap');
            if (check) { check.classList.remove('pop'); void check.offsetWidth; check.classList.add('pop'); }
            setTimeout(function () { var cc = card.querySelector('.n-caret'); if (cc) cc.remove(); }, 400);
            setTimeout(run, 3400);
          }, 650);
        }
      })();
    }
    setTimeout(run, 2600);
  }

  /* --- dashboard: wave emoji, count-up, theme fade --- */
  function setupDashboard() {
    var h1 = $('.welcome-copy h1');
    function wrap() {
      if (h1 && h1.textContent.indexOf('👋') > -1 && !$('.wave', h1)) h1.innerHTML = h1.innerHTML.replace('👋', '<span class="wave">👋</span>');
    }
    if (h1) { wrap(); new MutationObserver(wrap).observe(h1, { childList: true, characterData: true, subtree: true }); }

    $$('.glance-card strong').forEach(function (el) {
      var busy = false, shown = null;
      function go() {
        if (busy) return;
        var t = el.textContent.trim();
        if (!/^\d+$/.test(t) || t === shown) return;
        var to = parseInt(t, 10); shown = t;
        if (reduce || to === 0) return;
        busy = true; var t0 = performance.now();
        (function f(now) {
          var k = Math.min(1, (now - t0) / 700), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          el.textContent = v;
          if (k < 1) requestAnimationFrame(f); else { el.textContent = to; busy = false; }
        })(t0);
      }
      new MutationObserver(go).observe(el, { childList: true, characterData: true, subtree: true });
      go();
    });

    var de = document.documentElement, tm;
    new MutationObserver(function () {
      de.classList.add('theme-fade'); clearTimeout(tm); tm = setTimeout(function () { de.classList.remove('theme-fade'); }, 600);
    }).observe(de, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function init() { setupLanding(); setupReveal(); setupDemo(); setupDashboard(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {
                console.log("Nudge service worker registered");
            })
            .catch((error) => {
                console.error("Service worker registration failed:", error);
            });
    });
}
async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("Notifications are not supported on this device.");
        return;
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            if ("serviceWorker" in navigator) {
                const registration = await navigator.serviceWorker.ready;

                await registration.showNotification("Nudge 🔔", {
                    body: "Notifications are now enabled!",
                    icon: "./icon-192.png"
                });
            } else {
                new Notification("Nudge 🔔", {
                    body: "Notifications are now enabled!",
                    icon: "./icon-192.png"
                });
            }
        } else if (permission === "denied") {
            alert(
                "Notifications are blocked. Please allow them in your browser settings."
            );
        }
    } catch (error) {
        console.error("Notification permission error:", error);
        alert("Something went wrong while enabling notifications.");
    }
}


async function testNudgeReminder() {
    if (!("Notification" in window)) {
        alert("Notifications are not supported on this device.");
        return;
    }

    if (Notification.permission !== "granted") {
        alert("Please enable notifications first.");
        return;
    }

    try {
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready;

            setTimeout(async () => {
                try {
                    await registration.showNotification("Nudge 🔔", {
                        body: "Your Physics test is coming up!",
                        icon: "./icon-192.png"
                    });
                } catch (error) {
                    console.error("Test reminder failed:", error);
                }
            }, 10000);
        } else {
            setTimeout(() => {
                new Notification("Nudge 🔔", {
                    body: "Your Physics test is coming up!",
                    icon: "./icon-192.png"
                });
            }, 10000);
        }
    } catch (error) {
        console.error("Service worker error:", error);
        alert("Couldn't schedule the test reminder.");
    }
}
