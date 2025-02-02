document.addEventListener("DOMContentLoaded", function () {
    new Swiper('.swiper-container', {
        direction: 'horizontal',  // Horizontal scrolling
        slidesPerView: 4,  // Show 4 slides at a time
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,  // Auto-scroll every 5 seconds
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const currentMonthYear = document.querySelector(".current-month-year");
    const calendarGrid = document.querySelector(".calendar-grid");
    const activityTitle = document.getElementById("activity-title");
    const activityDescription = document.getElementById("activity-description");
    const activityImage = document.getElementById("activity-image");

    let currentDate = new Date();  // Track current date
    let selectedDate = new Date();  // Track selected date to prevent highlighting wrong date

    // Activities with images, names, and locations
    const activities = {
        5: {
            title: "Photography Walk",
            location: "Botanical Garden",
            image: "../images/dance_workshop.jpg",
        },
        15: {
            title: "Creative Writing Club",
            location: "Library Lounge",
            image: "../images/dance_workshop.jpg",
        },
        25: {
            title: "Yoga Session",
            location: "Park",
            image: "../images/dance_workshop.jpg",
        },
    };

    function renderCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        currentMonthYear.textContent = `${date.toLocaleString('en-US', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfPrevMonth = new Date(year, month, 0);

        let firstDay = firstDayOfMonth.getDay();
        if (firstDay === 0) {
            firstDay = 7; // Adjust Sunday (0) to be treated as 7 (Monday start)
        }

        const daysInMonth = lastDayOfMonth.getDate();

        calendarGrid.innerHTML = '';

        // Fill in the previous month's days if the month doesn't start on Monday
        for (let i = firstDay - 1; i > 0; i--) {
            const day = lastDayOfPrevMonth.getDate() - i + 1;
            const div = document.createElement("div");
            div.textContent = day;
            div.classList.add("inactive");
            calendarGrid.appendChild(div);
        }

        // Add the days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const div = document.createElement("div");
            div.textContent = i;

            // Update "today" check based on currentDate month and year
            if (i === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                div.classList.add("today");
            }

            // Check if the day has an activity scheduled
            if (activities[i]) {
                div.classList.add("activity-day");
            }

            // Add an event listener for the click event
            div.addEventListener("click", function () {
                selectedDate.setDate(i);  // Update selected date when clicking on a day
                showActivity(i);  // Show activity for the clicked date
                renderCalendar(selectedDate);  // Re-render calendar with the selected date highlighted
            });

            calendarGrid.appendChild(div);
        }

        // Fill the remaining days of the next month if necessary
        const remainingDays = 7 - ((firstDay + daysInMonth - 1) % 7);
        for (let i = 1; i <= remainingDays; i++) {
            const div = document.createElement("div");
            div.textContent = i;
            div.classList.add("inactive");
            calendarGrid.appendChild(div);
        }
    }

    // Function to display activity details for the clicked day
    function showActivity(day) {
        const activity = activities[day];
        if (activity) {
            activityTitle.textContent = `${activity.title}`;
            activityDescription.textContent = `Join us for the ${activity.title} at ${activity.location}.`;
            activityImage.src = activity.image;
        } else {
            activityTitle.textContent = "No activity scheduled";
            activityDescription.textContent = "There is no scheduled activity for this day.";
            activityImage.src = ""; // Remove image when no activity is scheduled
        }
    }

    // Navigation buttons
    document.querySelector(".next-month").addEventListener("click", function () {
        selectedDate.setMonth(selectedDate.getMonth() + 1);  // Increment the month
        renderCalendar(selectedDate);
    });

    document.querySelector(".prev-month").addEventListener("click", function () {
        selectedDate.setMonth(selectedDate.getMonth() - 1);  // Decrement the month
        renderCalendar(selectedDate);
    });

    // Initial calendar rendering
    renderCalendar(selectedDate);
});
