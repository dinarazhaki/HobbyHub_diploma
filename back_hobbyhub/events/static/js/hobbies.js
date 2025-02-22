document.addEventListener("DOMContentLoaded", function () {
    // Получаем данные из data-атрибутов
    const scriptTag = document.querySelector('script[data-save-url]');
    const saveHobbiesUrl = scriptTag ? scriptTag.dataset.saveUrl : null;
    const userHobbies = scriptTag ? JSON.parse(scriptTag.dataset.userHobbies || "[]") : [];

    const selectElement = document.getElementById("hobbies");
    const hobbyForm = document.getElementById("hobby-form");

    if (!selectElement || !hobbyForm || !saveHobbiesUrl) {
        console.error("Required elements not found or saveHobbiesUrl is missing.");
        return;
    }

    // Устанавливаем уже выбранные хобби
    userHobbies.forEach(hobbyId => {
        const option = selectElement.querySelector(`option[value="${hobbyId}"]`);
        if (option) option.selected = true;
    });

    // Обработчик отправки формы
    hobbyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedOptions = Array.from(selectElement.selectedOptions);
        if (selectedOptions.length === 0) {
            alert("Please select at least one hobby.");
            return;
        }

        const formData = new FormData(this);

        fetch(saveHobbiesUrl, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                window.location.href = data.redirect_url || "{% url 'sign_in' %}";
            } else {
                alert("Error: " + (data.message || "Unknown error occurred"));
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("An error occurred while saving hobbies. Please check your internet connection and try again.");
        });
    });
});
