document.addEventListener("DOMContentLoaded", function () {
    // Анимация для строк таблицы лидерборда
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

    // Обработка кнопок редактирования призов
    const editPrizeButtons = document.querySelectorAll(".edit-prize-btn");
    const editPrizeForm = document.getElementById("editPrizeForm");

    editPrizeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const prizeId = button.getAttribute("data-prize-id");
            const prizeName = button.getAttribute("data-prize-name");
            const prizeDescription = button.getAttribute("data-prize-description");
            const prizeRank = button.getAttribute("data-prize-rank");
            const prizeImage = button.getAttribute("data-prize-image");

            // Заполняем форму данными
            document.getElementById("edit-name").value = prizeName;
            document.getElementById("edit-description").value = prizeDescription;
            document.getElementById("edit-rank").value = prizeRank;
            document.getElementById("current-image").src = prizeImage;

            // Устанавливаем action формы и data-prize-id
            editPrizeForm.action = `/edit_prize/${prizeId}/`;
            editPrizeForm.setAttribute("data-prize-id", prizeId);
        });
    });
<<<<<<< Updated upstream


    updateCountdown();
    


});

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

            document.getElementById("countdown").innerHTML = 
                `${days}d ${hours}h ${minutes}m ${seconds}s`;

            setTimeout(updateCountdown, 1000);
}
=======
    // Функции для работы с всплывающим окном добавления приза
    const addPrizePopup = document.getElementById("addPrizePopup");

    if (addPrizePopup) {
        // Открытие всплывающего окна
        window.openPopup = function () {
            addPrizePopup.style.display = "flex";
        };

        // Закрытие всплывающего окна
        window.closePopup = function () {
            addPrizePopup.style.display = "none";
        };

        // Закрытие всплывающего окна при клике вне его области
        window.onclick = function (event) {
            if (event.target === addPrizePopup) {
                addPrizePopup.style.display = "none";
            }
        };
    }


    const deletePrizeButtons = document.querySelectorAll(".delete-prize-btn");
    const deletePrizeForm = document.getElementById("deletePrizeForm");

    deletePrizeButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Получаем ID приза из атрибута кнопки
            const prizeId = button.getAttribute("data-prize-id");

            // Устанавливаем action формы для отправки данных на сервер
            deletePrizeForm.action = `/delete_prize/${prizeId}/`;
        });
    });

    
});
>>>>>>> Stashed changes
