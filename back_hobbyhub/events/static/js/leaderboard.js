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