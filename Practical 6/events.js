// ==========================================
// EVENTS - PRACTICAL 6
// ==========================================

// Store event data
let events = [];

// Current page
let currentPage = 1;

// Events shown on each page
const eventsPerPage = 5;


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const eventContainer =
    document.getElementById("eventContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortOption =
    document.getElementById("sortOption");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const pageNumber =
    document.getElementById("pageNumber");


// ==========================================
// FETCH events.json
// ==========================================

fetch("events.json")

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "events.json file not found"
            );

        }

        return response.json();

    })

    .then(function(data) {

        events = data;

        loading.style.display = "none";

        displayEvents();

    })

    .catch(function(err) {

        loading.style.display = "none";

        error.textContent =
            "Unable to load event data.";

        console.log(err);

    });


// ==========================================
// DISPLAY EVENTS
// ==========================================

function displayEvents() {

    // Search text
    let searchText =
        searchInput.value.toLowerCase();


    // Selected category
    let selectedCategory =
        categoryFilter.value;


    // Selected sorting
    let selectedSort =
        sortOption.value;


    // ==========================================
    // SEARCH
    // ==========================================

    let filteredEvents =
        events.filter(function(event) {

            return (

                event.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                event.organizer
                    .toLowerCase()
                    .includes(searchText)

                ||

                event.id
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    if (selectedCategory !== "all") {

        filteredEvents =
            filteredEvents.filter(
                function(event) {

                    return (
                        event.category ===
                        selectedCategory
                    );

                }
            );

    }


    // ==========================================
    // SORT
    // ==========================================

    filteredEvents.sort(
        function(a, b) {

            if (selectedSort === "az") {

                return a.name.localeCompare(
                    b.name
                );

            }

            else {

                return b.name.localeCompare(
                    a.name
                );

            }

        }
    );


    // ==========================================
    // PAGINATION
    // ==========================================

    let totalPages =
        Math.ceil(
            filteredEvents.length /
            eventsPerPage
        );


    if (
        currentPage > totalPages &&
        totalPages > 0
    ) {

        currentPage = totalPages;

    }


    if (totalPages === 0) {

        currentPage = 1;

    }


    let start =
        (currentPage - 1) *
        eventsPerPage;


    let end =
        start + eventsPerPage;


    let pageEvents =
        filteredEvents.slice(
            start,
            end
        );


    // Clear old cards
    eventContainer.innerHTML = "";


    // ==========================================
    // NO RESULT
    // ==========================================

    if (pageEvents.length === 0) {

        eventContainer.innerHTML = `

            <p class="no-result">
                No events found.
            </p>

        `;

    }


    // ==========================================
    // CREATE EVENT CARDS
    // ==========================================

    pageEvents.forEach(
        function(event) {

            let card =
                document.createElement("div");


            card.className =
                "event-card";


            card.innerHTML = `

                <h2>
                    ${event.name}
                </h2>

                <p>
                    <strong>Event ID:</strong>
                    ${event.id}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${event.date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${event.time}
                </p>

                <p>
                    <strong>Venue:</strong>
                    ${event.venue}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${event.category}
                </p>

                <p>
                    <strong>Organizer:</strong>
                    ${event.organizer}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${event.status}
                </p>

            `;


            eventContainer.appendChild(card);

        }
    );


    // ==========================================
    // PAGE NUMBER
    // ==========================================

    if (totalPages === 0) {

        pageNumber.textContent =
            "Page 0";

    }

    else {

        pageNumber.textContent =
            "Page " +
            currentPage +
            " of " +
            totalPages;

    }


    // ==========================================
    // PREVIOUS BUTTON
    // ==========================================

    if (currentPage === 1) {

        prevBtn.disabled = true;

    }

    else {

        prevBtn.disabled = false;

    }


    // ==========================================
    // NEXT BUTTON
    // ==========================================

    if (
        currentPage === totalPages ||
        totalPages === 0
    ) {

        nextBtn.disabled = true;

    }

    else {

        nextBtn.disabled = false;

    }

}


// ==========================================
// SEARCH EVENT
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        currentPage = 1;

        displayEvents();

    }
);


// ==========================================
// CATEGORY FILTER EVENT
// ==========================================

categoryFilter.addEventListener(
    "change",
    function() {

        currentPage = 1;

        displayEvents();

    }
);


// ==========================================
// SORT EVENT
// ==========================================

sortOption.addEventListener(
    "change",
    function() {

        currentPage = 1;

        displayEvents();

    }
);


// ==========================================
// PREVIOUS BUTTON
// ==========================================

prevBtn.addEventListener(
    "click",
    function() {

        if (currentPage > 1) {

            currentPage--;

            displayEvents();

        }

    }
);


// ==========================================
// NEXT BUTTON
// ==========================================

nextBtn.addEventListener(
    "click",
    function() {

        currentPage++;

        displayEvents();

    }
);