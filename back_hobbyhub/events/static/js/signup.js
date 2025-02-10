
document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    let companyID = document.getElementById("company_ID").value.trim();
    let email = document.getElementById("email").value.trim();
    let msg = document.getElementById("msg"); // Single error message container

    msg.innerText = ""; // Clear previous messages
    msg.classList.add('hidden');

    // Validate company ID
    if (companyID.length < 6 || isNaN(companyID) || Number(companyID) < 0) {
        msg.innerText = "Company ID must be at least 6 digits and positive.";
        msg.classList.remove('hidden');
        return; // Stop execution if invalid
    }

    // Validate email with regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        msg.innerText = "Please enter a valid email.";
        msg.classList.remove('hidden');
        return;
    }

    window.location.href = "/hobbies/";
});

