document.addEventListener("DOMContentLoaded", function () {
    // Animate leaderboard table rows
    const tableBody = document.querySelector("#leaderboard-table tbody");
    if (tableBody) {
        tableBody.querySelectorAll("tr").forEach((row, index) => {
            row.style.opacity = 0;
            setTimeout(() => {
                row.style.transition = "opacity 0.5s";
                row.style.opacity = 1;
            }, index * 100);
        });
    }

    // Edit Prize Buttons
    const editPrizeButtons = document.querySelectorAll(".edit-prize-custom");
    const editPrizeForm = document.getElementById("editPrizeForm");
    
    if (editPrizeButtons.length > 0 && editPrizeForm) {
        editPrizeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const prizeId = button.getAttribute("data-prize-id");
                const prizeName = button.getAttribute("data-prize-name");
                const prizeDescription = button.getAttribute("data-prize-description");
                const prizeRank = button.getAttribute("data-prize-rank");
                const prizeDeadline = button.getAttribute("data-prize-deadline");
                const prizeImage = button.getAttribute("data-prize-image");

                document.getElementById("edit-name").value = prizeName;
                document.getElementById("edit-description").value = prizeDescription;
                document.getElementById("edit-rank").value = prizeRank;
                document.getElementById("edit-deadline").value = prizeDeadline || "";
                document.getElementById("current-image").src = prizeImage;
                editPrizeForm.action = `/edit_prize/${prizeId}/`;
            });
        });
    }

    // Delete Prize Buttons
    const deletePrizeButtons = document.querySelectorAll(".delete-prize-custom");
    const deletePrizeForm = document.getElementById("deletePrizeForm");
    
    if (deletePrizeButtons.length > 0 && deletePrizeForm) {
        deletePrizeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const prizeId = button.getAttribute("data-prize-id");
                deletePrizeForm.action = `/delete_prize/${prizeId}/`;
            });
        });
    }

    // Handle Add Prize Modal
    const addPrizePopup = document.getElementById("addPrizePopup");
    if (addPrizePopup) {
        window.openPopup = function () {
            addPrizePopup.style.display = "flex";
        };
        window.closePopup = function () {
            addPrizePopup.style.display = "none";
        };
        window.onclick = function (event) {
            if (event.target === addPrizePopup) {
                addPrizePopup.style.display = "none";
            }
        };
    }

    // Countdown Timer
    function updateCountdown() {
        let now = new Date();
        let lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        let diff = lastDay - now;

        if (diff <= 0) {
            document.getElementById("countdown").innerHTML = "Time's up!";
            return;
        }

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        setTimeout(updateCountdown, 1000);
    }

    if (document.getElementById("countdown")) {
        updateCountdown();
    }

    const today = new Date();

    document.querySelectorAll(".prize").forEach(prize => {
        const deadlineStr = prize.dataset.deadline;
        if (deadlineStr) {
            const deadline = new Date(deadlineStr);
            // Hide the prize if the deadline is in the past
            if (deadline < today.setHours(0, 0, 0, 0)) {
                prize.style.display = "none";
            }
        }
    });


});
