
document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    let isValid=true;
    let email = document.getElementById("email").value.trim();
    let msg = document.getElementById("msg"); // Single error message container

    msg.innerText = ""; // Clear previous messages
    msg.classList.add('hidden');

    // Validate email with regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        isValid=false;
        msg.innerText = "Please enter a valid email.";
        msg.classList.remove('hidden');
        return;
    }
    if(isValid){
        window.location.href = "/hobbies/";
    }
});

