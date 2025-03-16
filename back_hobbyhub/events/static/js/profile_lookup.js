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


    //search bar
    const searchBar = document.getElementById("searchBar");
    const cards = document.querySelectorAll(".user-card-full");

    searchBar.addEventListener("keyup", function () {
        const searchValue = searchBar.value.toLowerCase().trim();

        cards.forEach(card => {
            const name = card.querySelector("h6").innerText.toLowerCase();
            const nickname = card.querySelector("p").innerText.toLowerCase();

            if (name.includes(searchValue) || nickname.includes(searchValue)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});
