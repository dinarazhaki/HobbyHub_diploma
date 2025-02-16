

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("hobbies");

    // Set already selected hobbies
    if (userHobbies && selectElement) {
        userHobbies.forEach((hobbyId) => {
            const option = selectElement.querySelector(`option[value="${hobbyId}"]`);
            if (option) {
                option.selected = true;
            }
        });
    }

    // Form submission handler
    const hobbyForm = document.getElementById("hobby-form");
    if (hobbyForm) {
        hobbyForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(this);

            fetch("{% url 'save_hobbies' %}", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                },
            })
            .then(response => {
                console.log("Response:", response); // Log the response
                return response.json();
            })
            .then(data => {
                console.log("Data:", data); // Log the data
                if (data.status === "success") {
                    window.location.href = "{% url 'sign_in' %}"; // Redirect to sign-in page
                } else {
                    alert("Error: " + (data.message || "Unknown error occurred"));
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while saving hobbies. Please try again.");
            });
        });
    }
});

