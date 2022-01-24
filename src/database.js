// --- Constants ---
const GUEST_NAME = "[Guest]";

// --- Functions ---
function startDB(handleSuccess) {
    const request = indexedDB.open("ProductivityZone", 1);
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };

    request.onsuccess = handleSuccess;

    // First time setup
    request.onupgradeneeded = (event) => {
        let db = event.target.result;
        db.onerror = (event) => {
            console.error("Error loading database");
        }

        // Create object store
        let taskStore = db.createObjectStore("TaskList", { keyPath: "timeCreated" });
        taskStore.createIndex("dueDate", "dueDate", { unique: false });
        taskStore.createIndex("textDesc", "textDesc", { unique: false });
        taskStore.createIndex("user", "user", { unique: false });
        taskStore.createIndex("completed", "completed", { unique: false });
    };
}

function addTask(db, dueDate, textDesc, user) {
    let newItem = {
        timeCreated: new Date().toISOString(),
        dueDate: dueDate,
        textDesc: textDesc,
        user: (user)? user: GUEST_NAME,
        completed: false,
    };

    const transaction = db.transaction("TaskList", "readwrite");
    const store = transaction.objectStore("TaskList");

    let query = store.put(newItem);

    query.onerror = (event) => {
        console.error(`Transaction error: ${event.target.errorCode}`);
    };
}

function getTasks(db, user, handleTasks, onlyUnfinished) {
    const userName = (!!user)? user.name: GUEST_NAME;
    const transaction = db.transaction("TaskList", "readonly");
    const store = transaction.objectStore("TaskList");
    onlyUnfinished = !!onlyUnfinished;

    let userIndex = store.index("user");
    let result = [];

    userIndex.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;

        if (cursor) {
            const usernameMatches = cursor.value.user === userName;
            const isVisible = !(onlyUnfinished && cursor.value.completed);

            if (usernameMatches && isVisible) {
                result.push(cursor.value);
            }
            cursor.continue();
        } else {
            handleTasks(result);
        }
    }
}

function clearGuestTasks(db) {
    const transaction = db.transaction("TaskList", "readwrite");
    const store = transaction.objectStore("TaskList");

    store.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
            if (cursor.value.user === GUEST_NAME) {
                store.delete(cursor.primaryKey);
            }
            cursor.continue();
        }
    }
}

function updateTask(db, taskID, data) {
    const transaction = db.transaction("TaskList", "readwrite");
    const store = transaction.objectStore("TaskList");
    const retrieve = store.get(taskID);

    retrieve.onsuccess = (event) => {
        let item = event.target.result;

        for (const [key, value] of Object.entries(data)) {
            item[key] = value;
        }

        let update = store.put(item);

        update.onerror = (event) => {
            console.error(`Transaction error: ${event.target.errorCode}`);
        };
    };
}

export {
    startDB,
    addTask,
    getTasks,
    clearGuestTasks,
    updateTask,
};
