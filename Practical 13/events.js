
/* ==========================================
   STUDENTHUB - PRACTICAL 13
   PHP JSON API + Fetch CRUD
   ========================================== */

const API_URL = "http://localhost/StudentHub/Practical%2013/api.php";

const eventContainer = document.getElementById("eventContainer");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortOption = document.getElementById("sortOption");

const eventDialog = document.getElementById("eventDialog");
const eventForm = document.getElementById("eventForm");
const eventIdInput = document.getElementById("eventId");
const eventTitleInput = document.getElementById("eventTitle");
const eventDateInput = document.getElementById("eventDate");
const eventDescriptionInput = document.getElementById("eventDescription");
const eventCategoryInput = document.getElementById("eventCategory");
const eventStatusInput = document.getElementById("eventStatus");

const openAddEventBtn = document.getElementById("openAddEventBtn");
const closeEventDialogBtn = document.getElementById("closeEventDialogBtn");
const eventDialogTitle = document.getElementById("eventDialogTitle");

const saveEventBtn = document.getElementById("saveEventBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const apiMessage = document.getElementById("apiMessage");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

let events = [];
let currentPage = 1;
const eventsPerPage = 6;

/* Show message */
function showMessage(message, isError = false) {
    apiMessage.textContent = message;
    apiMessage.style.color = isError ? "#c62828" : "#24813a";
}

/* Send request to PHP API */
async function apiRequest(method = "GET", body = null) {
    const options = {
        method: method,
        headers: {
            "Accept": "application/json"
        }
    };

    if (body !== null) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API_URL, options);
    const result = await response.json();

    if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Request failed.");
    }

    return result;
}

/* Load events from database */
async function loadEvents() {
    loading.hidden = false;
    errorBox.hidden = true;

    try {
        const result = await apiRequest("GET");
        events = Array.isArray(result.data) ? result.data : [];
        renderEvents();
    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.hidden = false;
        eventContainer.replaceChildren();
    } finally {
        loading.hidden = true;
    }
}

/* Create text element */
function createText(tag, value) {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
}

/* Create event card */
function createEventCard(event) {
    const card = document.createElement("article");
    card.className = "event-card";

    card.appendChild(createText("h3", event.title || "Untitled Event"));
    card.appendChild(createText("p", "Event ID: " + event.event_id));
    card.appendChild(createText("p", "Date: " + (event.event_date || "Not set")));
    card.appendChild(createText("p", "Description: " + (event.description || "No description")));
    card.appendChild(createText("p", "Category: " + (event.category || "General")));
    card.appendChild(createText("p", "Status: " + (event.status || "Open")));

    const editButton = createText("button", "Edit");
    editButton.type = "button";
    editButton.addEventListener("click", function () {
        startEdit(event);
    });

    const deleteButton = createText("button", "Delete");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
        deleteEvent(event);
    });

    card.append(editButton, deleteButton);
    return card;
}

/* Search, filter, sort and display */
function renderEvents() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortValue = sortOption.value;

    let filteredEvents = events.filter(function (event) {
        const searchableText = [
            event.event_id,
            event.title,
            event.description,
            event.category,
            event.status
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchText);
        const matchesCategory =
            selectedCategory === "all" ||
            (event.category || "").toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    filteredEvents.sort(function (a, b) {
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();

        return sortValue === "za"
            ? titleB.localeCompare(titleA)
            : titleA.localeCompare(titleB);
    });

    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * eventsPerPage;
    const visibleEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

    eventContainer.replaceChildren();

    if (visibleEvents.length === 0) {
        eventContainer.appendChild(createText("p", "No events found."));
    } else {
        visibleEvents.forEach(function (event) {
            eventContainer.appendChild(createEventCard(event));
        });
    }

    pageNumber.textContent = currentPage + " / " + totalPages;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

/* Open Add Event popup */
openAddEventBtn.addEventListener("click", function () {
    eventForm.reset();
    eventIdInput.value = "";
    saveEventBtn.textContent = "Save Event";
    eventDialogTitle.textContent = "Add New Event";
    showMessage("");
    eventDialog.showModal();
});

/* Add or update event */
eventForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const eventId = eventIdInput.value.trim();

    const eventData = {
        title: eventTitleInput.value.trim(),
        event_date: eventDateInput.value,
        description: eventDescriptionInput.value.trim(),
        category: eventCategoryInput.value,
        status: eventStatusInput.value
    };

    if (!eventData.title) {
        showMessage("Please enter an event title.", true);
        return;
    }

    saveEventBtn.disabled = true;

    try {
        let result;

        if (eventId) {
            result = await apiRequest("PUT", {
                ...eventData,
                event_id: eventId
            });
        } else {
            result = await apiRequest("POST", eventData);
        }

        eventDialog.close();
        eventForm.reset();
        eventIdInput.value = "";

        saveEventBtn.textContent = "Save Event";
        eventDialogTitle.textContent = "Add New Event";

        currentPage = 1;
        await loadEvents();

        showMessage(result.message || "Event saved successfully.");
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        saveEventBtn.disabled = false;
    }
});

/* Edit event */
function startEdit(event) {
    eventIdInput.value = event.event_id;
    eventTitleInput.value = event.title || "";
    eventDateInput.value = event.event_date || "";
    eventDescriptionInput.value = event.description || "";
    eventCategoryInput.value = event.category || "Technical";
    eventStatusInput.value = event.status || "Open";

    saveEventBtn.textContent = "Update Event";
    eventDialogTitle.textContent = "Edit Event";

    showMessage("");
    eventDialog.showModal();
}

/* Cancel edit */
cancelEditBtn.addEventListener("click", function () {
    eventForm.reset();
    eventIdInput.value = "";
    saveEventBtn.textContent = "Save Event";
    eventDialogTitle.textContent = "Add New Event";
    eventDialog.close();
});

/* Close popup */
closeEventDialogBtn.addEventListener("click", function () {
    eventDialog.close();
});

/* Delete event */
async function deleteEvent(event) {
    const confirmed = confirm('Delete "' + event.title + '"?');

    if (!confirmed) return;

    try {
        const result = await apiRequest("DELETE", {
            event_id: event.event_id
        });

        await loadEvents();
        showMessage(result.message || "Event deleted successfully.");
    } catch (error) {
        showMessage(error.message, true);
    }
}

/* Search */
searchInput.addEventListener("input", function () {
    currentPage = 1;
    renderEvents();
});

/* Filter */
categoryFilter.addEventListener("change", function () {
    currentPage = 1;
    renderEvents();
});

/* Sort */
sortOption.addEventListener("change", function () {
    currentPage = 1;
    renderEvents();
});

/* Previous page */
prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        renderEvents();
    }
});

/* Next page */
nextBtn.addEventListener("click", function () {
    currentPage++;
    renderEvents();
});

/* Load events when page opens */
loadEvents();
