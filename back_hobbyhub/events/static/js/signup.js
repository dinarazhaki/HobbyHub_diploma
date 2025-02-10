
function validateForm() {
    let userID = document.getElementById("user_ID").value;
    let companyID = document.getElementById("company_ID").value;
    let email = document.getElementById("email").value;

    let isValid = true;

    // Clear previous messages
    document.getElementById("user_ID_msg").innerText = "";
    document.getElementById("company_ID_msg").innerText = "";
    document.getElementById("email_msg").innerText = "";

    // Validate User ID (6 digits minimum and positive)
    if (userID.length < 6 || userID < 0) {
        document.getElementById("user_ID_msg").innerText = "User ID must be at least 6 digits and positive.";
        isValid = false;
    }

    // Validate Company ID (6 digits minimum and positive)
    if (companyID.length < 6 || companyID < 0) {
        document.getElementById("company_ID_msg").innerText = "Company ID must be at least 6 digits and positive.";
        isValid = false;
    }

    // Validate Email (basic format check)
    if (!email.includes("@")) {
        document.getElementById("email_msg").innerText = "Please enter a valid email.";
        isValid = false;
    }

    return isValid; // Prevents form submission if false
}

