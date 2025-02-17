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
});