document.addEventListener("DOMContentLoaded", function () {
    const notifBell = document.querySelector(".notifications");
    const notifPopup = document.getElementById("notifPopup");
    const closeBtn = document.querySelector(".close-ot-alert");
    const notifDot = document.getElementById("notifDot");
    // Функция для загрузки уведомлений
    function loadNotifications() {
        fetch("/get_notifications/")
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
    
                notifPopup.innerHTML = '<span class="close-ot-alert">&times;</span>';
    
                if (data.notifications.length > 0) {
                    notifDot.style.display = "none"; // hide red dot after loading
                    data.notifications.forEach(notif => {
                        const notifElement = document.createElement("p");
                        notifElement.textContent = `${notif.message}`;
                        notifPopup.appendChild(notifElement);
                    });
                } else {
                    notifDot.style.display = "none";
                    const noNotifElement = document.createElement("p");
                    noNotifElement.textContent = "You have no new notifications.";
                    notifPopup.appendChild(noNotifElement);
                }
            })
            .catch(error => console.error("Error fetching notifications:", error));
    }

    // Показать попап и загрузить уведомления при клике на иконку
    notifBell.addEventListener("click", function (event) {
        event.stopPropagation(); // Предотвратить закрытие попапа
        notifPopup.style.display = "block";
        loadNotifications(); // Загрузить уведомления
    });

    // Закрыть попап при клике вне его области
    document.addEventListener("click", function (event) {
        if (!notifPopup.contains(event.target)) {
            notifPopup.style.display = "none";
            notifDot.style.display = "none";
        }
    });

    // Закрыть попап при клике на "X"
    closeBtn.addEventListener("click", function () {
        notifPopup.style.display = "none";
        notifDot.style.display = "none";
    });
    loadNotifications();
});