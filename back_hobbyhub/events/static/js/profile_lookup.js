document.addEventListener("DOMContentLoaded", function () {
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
