document.addEventListener("DOMContentLoaded", function () {
    const hobbyFilters = document.querySelectorAll("#hobby-filters input");
    const dateFilter = document.getElementById("date-filter");
    const typeFilters = document.querySelectorAll("input[value='Indoor'], input[value='Outdoor']");
    const events = document.querySelectorAll(".event");
    const noEventsMessage = document.getElementById("no-events");

    function filterEvents() {
        let selectedHobbies = Array.from(hobbyFilters)
            .filter(input => input.checked)
            .map(input => input.value);

        let selectedTypes = Array.from(typeFilters)
            .filter(input => input.checked)
            .map(input => input.value);

        let selectedDate = dateFilter.value;

        let visibleEventCount = 0;

        events.forEach(event => {
            let eventHobby = event.getAttribute("data-hobby");
            let eventType = event.getAttribute("data-type");
            let eventDate = event.getAttribute("data-date");

            let matchesHobby = selectedHobbies.length === 0 || selectedHobbies.includes(eventHobby);
            let matchesType = selectedTypes.length === 0 || selectedTypes.includes(eventType);
            let matchesDate = !selectedDate || eventDate === selectedDate;

            if (matchesHobby && matchesType && matchesDate) {
                event.style.display = "flex";
                visibleEventCount++;
            } else {
                event.style.display = "none";
            }
        });

        noEventsMessage.style.display = visibleEventCount === 0 ? "block" : "none";
    }

    hobbyFilters.forEach(input => input.addEventListener("change", filterEvents));
    typeFilters.forEach(input => input.addEventListener("change", filterEvents));
    dateFilter.addEventListener("input", filterEvents);
});
