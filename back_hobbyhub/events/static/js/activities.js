document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    const events = document.querySelectorAll(".event");

    function filterEvents() {
        const selectedHobbies = Array.from(document.querySelectorAll("input[type=checkbox]:checked"))
            .map(checkbox => checkbox.value);

        let matchesFound = false;

        events.forEach(event => {
            const eventHobby = event.dataset.hobby;
            const eventType = event.dataset.type;

            if (selectedHobbies.includes(eventHobby) || selectedHobbies.includes(eventType)) {
                event.style.display = "flex";
                matchesFound = true;
            } else {
                event.style.display = "none";
            }
        });

        document.querySelector(".no-matches").style.display = matchesFound ? "none" : "block";
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", filterEvents);
    });

    filterEvents(); // Run filter initially to match the checked options
});
