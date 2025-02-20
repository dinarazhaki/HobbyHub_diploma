document.addEventListener("DOMContentLoaded", function () {
    const hobbyFilters = document.querySelectorAll("#hobby-filters input");
    const dateFilter = document.getElementById("date-filter");
    const typeFilters = document.querySelectorAll("input[value='Indoor'], input[value='Outdoor']");
    const todayEvents = document.querySelectorAll("#today-events .event");
    const otherEvents = document.querySelectorAll("#other-events .event");
    const noEventsTodayMessage = document.getElementById("no-events-today");
    const noEventsOtherMessage = document.getElementById("no-events-other");

    function filterEvents() {
        let selectedHobbies = Array.from(hobbyFilters)
            .filter(input => input.checked)
            .map(input => input.value);

        let selectedTypes = Array.from(typeFilters)
            .filter(input => input.checked)
            .map(input => input.value);

        let selectedDate = dateFilter.value;

        let visibleTodayCount = 0;
        let visibleOtherCount = 0;

        // Фильтрация сегодняшних событий
        todayEvents.forEach(event => {
            let eventHobby = event.getAttribute("data-hobby");
            let eventType = event.getAttribute("data-type");
            let eventDate = event.getAttribute("data-date");

            let matchesHobby = selectedHobbies.length === 0 || selectedHobbies.includes(eventHobby);
            let matchesType = selectedTypes.length === 0 || selectedTypes.includes(eventType);
            let matchesDate = !selectedDate || eventDate === selectedDate;

            if (matchesHobby && matchesType && matchesDate) {
                event.style.display = "flex";
                visibleTodayCount++;
            } else {
                event.style.display = "none";
            }
        });

        // Фильтрация событий на другие даты
        otherEvents.forEach(event => {
            let eventHobby = event.getAttribute("data-hobby");
            let eventType = event.getAttribute("data-type");
            let eventDate = event.getAttribute("data-date");

            let matchesHobby = selectedHobbies.length === 0 || selectedHobbies.includes(eventHobby);
            let matchesType = selectedTypes.length === 0 || selectedTypes.includes(eventType);
            let matchesDate = !selectedDate || eventDate === selectedDate;

            if (matchesHobby && matchesType && matchesDate) {
                event.style.display = "flex";
                visibleOtherCount++;
            } else {
                event.style.display = "none";
            }
        });

        // Показываем сообщение, если нет сегодняшних событий
        if (visibleTodayCount === 0) {
            noEventsTodayMessage.style.display = "block";
        } else {
            noEventsTodayMessage.style.display = "none";
        }

        // Показываем сообщение, если нет событий на другие даты
        if (visibleOtherCount === 0) {
            noEventsOtherMessage.style.display = "block";
        } else {
            noEventsOtherMessage.style.display = "none";
        }
    }

    hobbyFilters.forEach(input => input.addEventListener("change", filterEvents));
    typeFilters.forEach(input => input.addEventListener("change", filterEvents));
    dateFilter.addEventListener("input", filterEvents);



//Another part for creation form
    const hobbyOptions = document.querySelectorAll(".hobby-option");
    const hiddenInput = document.getElementById("event-hobbies");

    hobbyOptions.forEach(option => {
        option.addEventListener("click", function () {
            this.classList.toggle("selected"); // Toggle selection

            // Collect selected hobbies
            let selectedHobbies = Array.from(document.querySelectorAll(".hobby-option.selected"))
                .map(el => el.dataset.value);

            hiddenInput.value = selectedHobbies.join(","); // Update hidden input
        });
    });
});



//Symbat's part
// Open Modal
function openModal() {
    document.getElementById("eventModal").style.display = "flex";
}

// Close Modal
function closeModal() {
    document.getElementById("eventModal").style.display = "none";
}

// Close Modal when Clicking Outside
window.onclick = function(event) {
    let modal = document.getElementById("eventModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Handle Form Submission (For Now, Just Console Log Data)
document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let eventData = {
        image: document.getElementById("event-image").files[0]?.name || "No image",
        name: document.getElementById("event-name").value,
        description: document.getElementById("event-description").value,
        hobbies: Array.from(document.getElementById("event-hobbies").selectedOptions).map(option => option.value),
        location: document.getElementById("event-location").value,
        date: document.getElementById("event-date").value,
        time: document.getElementById("event-time").value,
        diamonds: document.getElementById("event-diamonds").value,
        quota: document.getElementById("event-quota").value
    };

    console.log("Event Data:", eventData);
    alert("Event Created Successfully!");
    closeModal();
});

function showConfirmation(eventName) {
    let confirmationBox = document.getElementById("confirmationBox");
    let message = document.getElementById("confirmationMessage");

    message.innerHTML = `Your event <strong>${eventName}</strong> was created successfully!`;
    confirmationBox.classList.add("show-confirmation");
}

/* Close confirmation popup */
function closeConfirmation() {
    document.getElementById("confirmationBox").classList.remove("show-confirmation");
}






/* Reset form */
function createAnotherEvent() {
    closeConfirmation();
    document.getElementById("eventForm").reset();
}
function openModal() { document.getElementById("eventModal").style.display = "flex"; }
        function closeModal() { document.getElementById("eventModal").style.display = "none"; }
        function submitForm(event) { event.preventDefault(); closeModal(); document.getElementById("confirmationBox").classList.add("show-confirmation"); }
        function closeConfirmation() { document.getElementById("confirmationBox").classList.remove("show-confirmation"); 

        }
    
        