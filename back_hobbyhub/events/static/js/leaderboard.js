document.addEventListener("DOMContentLoaded", function () {
    // Данные теперь поступают из Django, поэтому этот код больше не нужен
    // const leaderboardData = [...];

    // Если нужно добавить интерактивность, можно оставить этот код
    const tableBody = document.querySelector("#leaderboard-table tbody");

    // Пример: Добавление анимации или других эффектов
    tableBody.querySelectorAll("tr").forEach((row, index) => {
        row.style.opacity = 0;
        setTimeout(() => {
            row.style.transition = "opacity 0.5s";
            row.style.opacity = 1;
        }, index * 100);
    });
});