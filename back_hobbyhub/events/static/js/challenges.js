document.addEventListener("DOMContentLoaded", function () {
    const addScoreBtn = document.getElementById("addScore");
    const progressFill = document.querySelector(".progress-fill");
    const progressText = document.querySelector(".progress-text");

    let currentScore = 20;

    addScoreBtn.addEventListener("click", function () {
        if (currentScore < 200) {
            currentScore += 20;
            progressFill.style.width = `${(currentScore / 200) * 100}%`;
            progressText.textContent = `${currentScore}/200`;
        }
    });

    document.querySelectorAll('.connect-btn').forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute("data-url"); // Get the URL from data-url
            window.location.href = url;
        });
    });

});
