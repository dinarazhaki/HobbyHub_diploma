document.addEventListener("DOMContentLoaded", function () {
    new Swiper('.swiper-container', {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 20,
            }
        }
    });

    const activities = {};
    
    eventsData.forEach(event => {
        const eventDate = new Date(event.fields.date);
        const day = eventDate.getDate();
        const month = eventDate.getMonth();
        const year = eventDate.getFullYear();

        if (!activities[month]) {
            activities[month] = {};
        }
        if (!activities[month][year]) {
            activities[month][year] = {};
        }

        activities[month][year][day] = {
            title: event.fields.title,
            location: event.fields.location,
            image: event.fields.image
        };
    });

    const currentMonthYear = document.querySelector(".current-month-year");
    const calendarGrid = document.querySelector(".calendar-grid");
    const calendarWeekdays = document.querySelector(".calendar-weekdays"); 
    const activityTitle = document.getElementById("activity-title");
    const activityDescription = document.getElementById("activity-description");
    const activityImage = document.getElementById("activity-image");

    let currentDate = new Date();
    let selectedDate = new Date();

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    function renderCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        currentMonthYear.textContent = `${date.toLocaleString('en-US', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfPrevMonth = new Date(year, month, 0);

        let firstDay = firstDayOfMonth.getDay();
        if (firstDay === 0) {
            firstDay = 7; 
        }

        const daysInMonth = lastDayOfMonth.getDate();

        calendarGrid.innerHTML = '';
        calendarWeekdays.innerHTML = ''; 
        
        daysOfWeek.forEach(day => {
            const div = document.createElement("div");
            div.textContent = day.slice(0, 3);  
            calendarWeekdays.appendChild(div);
        });
        
        for (let i = firstDay - 1; i > 0; i--) {
            const day = lastDayOfPrevMonth.getDate() - i + 1;
            const div = document.createElement("div");
            div.textContent = day;
            div.classList.add("inactive");
            calendarGrid.appendChild(div);
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const div = document.createElement("div");
            div.textContent = i;

            if (i === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                div.classList.add("today");
            }

            if (activities[month] && activities[month][year] && activities[month][year][i]) {
                div.classList.add("activity-day");
                div.title = activities[month][year][i].title; 
            }

            div.addEventListener("click", function () {
                selectedDate.setDate(i); 
                showActivity(i); 
                renderCalendar(selectedDate); 
            });

            calendarGrid.appendChild(div);
        }

        const remainingDays = 7 - ((firstDay + daysInMonth - 1) % 7);
        for (let i = 1; i <= remainingDays; i++) {
            const div = document.createElement("div");
            div.textContent = i;
            div.classList.add("inactive");
            calendarGrid.appendChild(div);
        }
    }

    function showActivity(day) {
        const activity = activities[selectedDate.getMonth()] && activities[selectedDate.getMonth()][selectedDate.getFullYear()] && activities[selectedDate.getMonth()][selectedDate.getFullYear()][day];
        if (activity) {
            activityTitle.textContent = activity.title;
            activityDescription.textContent = `Join us for the ${activity.title} at ${activity.location}.`;
            activityImage.src = activity.image ? '/media/' + activity.image : '/media/event_images/no-image.jpg';
        } else {
            activityTitle.textContent = "No activity scheduled";
            activityDescription.textContent = "There is no scheduled activity for this day.";
            activityImage.src = "/media/event_images/img0.png";
        }
    }

    document.querySelector(".next-month").addEventListener("click", function () {
        selectedDate.setMonth(selectedDate.getMonth() + 1); 
        renderCalendar(selectedDate);
    });

    document.querySelector(".prev-month").addEventListener("click", function () {
        selectedDate.setMonth(selectedDate.getMonth() - 1); 
        renderCalendar(selectedDate);
    });

    renderCalendar(selectedDate);
});

document.querySelectorAll('.hobby-clicked').forEach(hobby => {
    hobby.addEventListener('click', function() {
        this.classList.toggle('active'); // Toggle the "active" class
    });
});

document.querySelectorAll('.language-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});


function makeEditable() {
    let input = document.getElementById('dobInput');
    input.type = 'date';  // Change input type to date
    input.readOnly = false;  // Allow editing
    input.focus();  // Focus on input
}


function openModal() {
    document.getElementById("passwordModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("passwordModal").style.display = "none";
}

function validateModalPassword() {
    const newPassword = document.getElementById("modal_new_password").value;
    const confirmPassword = document.getElementById("modal_confirm_password").value;

    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return false;
    }
    return true;
}

// Optional: close modal when clicking outside
const modal = document.getElementById("passwordModal");
const openBtn = document.getElementById("openPasswordModal");
const closeBtn = document.getElementById("closeModal");

// Open modal when clicking the button
openBtn.onclick = function () {
    modal.style.display = "flex";
}

// Close modal when clicking the close icon
closeBtn.onclick = function () {
    modal.style.display = "none";
}

// Close modal when clicking outside the modal content
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function validateModalPassword() {
    const newPassword = document.getElementById("modal_new_password").value;
    const confirmPassword = document.getElementById("modal_confirm_password").value;

    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return false;
    }
    return true;
}




function openRecoveryEmailModal() {
    document.getElementById("recoveryEmailModal").style.display = "flex";
}

function closeRecoveryEmailModal() {
    document.getElementById("recoveryEmailModal").style.display = "none";
}

function openRecoveryPhoneModal() {
    document.getElementById("recoveryPhoneModal").style.display = "flex";
}

function closeRecoveryPhoneModal() {
    document.getElementById("recoveryPhoneModal").style.display = "none";
}



document.addEventListener("DOMContentLoaded", function () {
    // Recovery Email
    const recoveryEmailModal = document.getElementById("recoveryEmailModal");
    window.openRecoveryEmailModal = function () {
        recoveryEmailModal.style.display = "flex";
    }
    window.closeRecoveryEmailModal = function () {
        recoveryEmailModal.style.display = "none";
    }

    // Recovery Phone
    const recoveryPhoneModal = document.getElementById("recoveryPhoneModal");
    window.openRecoveryPhoneModal = function () {
        recoveryPhoneModal.style.display = "flex";
    }
    window.closeRecoveryPhoneModal = function () {
        recoveryPhoneModal.style.display = "none";
    }

    // Close when clicking outside
    window.onclick = function (event) {
        if (event.target === recoveryEmailModal) {
            recoveryEmailModal.style.display = "none";
        }
        if (event.target === recoveryPhoneModal) {
            recoveryPhoneModal.style.display = "none";
        }
    }
});