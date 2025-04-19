document.addEventListener("DOMContentLoaded", function () {
    const scriptTag = document.querySelector('script[data-save-url]');
    const saveHobbiesUrl = scriptTag ? scriptTag.dataset.saveUrl : null;
    const userHobbies = scriptTag ? JSON.parse(scriptTag.dataset.userHobbies || "[]") : [];

    const hobbyForm = document.getElementById("hobby-form");
    const hobbyButtons = document.querySelectorAll(".hobby-btn");

    if (!hobbyButtons.length || !hobbyForm || !saveHobbiesUrl) {
        console.error("Required elements not found or saveHobbiesUrl is missing.");
        return;
    }

    let selectedHobbies = new Set(userHobbies);

    // **Mark pre-selected hobbies**
    hobbyButtons.forEach(button => {
        const hobbyId = button.dataset.hobbyId;
        if (selectedHobbies.has(hobbyId)) {
            button.classList.add("selected");
        }

        button.addEventListener("click", function () {
            if (selectedHobbies.has(hobbyId)) {
                selectedHobbies.delete(hobbyId);
                this.classList.remove("selected");
            } else {
                selectedHobbies.add(hobbyId);
                this.classList.add("selected");
            }
        });
    });

    // **Handle form submission**
    hobbyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (selectedHobbies.size === 0) {
            alert("Please select at least one hobby.");
            return;
        }

        const formData = new FormData(this);
        selectedHobbies.forEach(hobbyId => {
            formData.append("hobbies[]", hobbyId);
        });

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


