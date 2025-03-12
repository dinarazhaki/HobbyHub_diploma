document.addEventListener("DOMContentLoaded", function () {
    const notifBell = document.querySelector(".notifications");
    const notifPopup = document.getElementById("notifPopup");
    const closeBtn = document.querySelector(".close-ot-alert");

    // Show popup when bell is clicked
    notifBell.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent closing immediately
        notifPopup.style.display = "block";
    });

    // Close popup when clicking outside
    document.addEventListener("click", function (event) {
        if (!notifPopup.contains(event.target) && !notifBell.contains(event.target)) {
            notifPopup.style.display = "none";
        }
    });

    // Close when clicking the "X" button
    closeBtn.addEventListener("click", function () {
        notifPopup.style.display = "none";
    });
});
