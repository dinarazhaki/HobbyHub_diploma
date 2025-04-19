document.addEventListener("DOMContentLoaded", function () {
    const addScoreBtn = document.getElementById("addScore");
    if (addScoreBtn) {
        addScoreBtn.addEventListener("click", function () {
            fetch("/update_xp/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({ xp: 20 }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload(); // Обновить страницу
                    }
                });
        });
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}