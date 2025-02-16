
document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid=true;
    let email = document.getElementById("email").value.trim();
    let msg = document.getElementById("msg"); 

    msg.innerText = ""; 
    msg.classList.add('hidden');

    
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        isValid=false;
        msg.innerText = "Please enter a valid email.";
        msg.classList.remove('hidden');
        return;
    }
    
});

