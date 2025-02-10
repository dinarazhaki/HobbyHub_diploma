/*const hobbies = [
    "Photography", "Crafting", "Technology", "Music", "Cooking",
    "Writing", "Gardening", "Dance", "Outdoor Adventure", "Crafting", "Sports"
];

const hobbyList = document.getElementById('hobby-list');
const skipButton = document.querySelector('.skip-btn');
const continueButton = document.querySelector('.continue-btn');

hobbies.forEach(hobby => {
    const btn = document.createElement('button');
    btn.classList.add('hobby-btn');
    btn.innerText = hobby;
    btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
    });
    hobbyList.appendChild(btn);
});

skipButton.addEventListener('click', () => {
    window.location.href = "/sign_in/"; 
});
continueButton.addEventListener('click', () => {
    window.location.href = "/sign_in/"; 
});*/

const hobbies = [
    "Photography", "Crafting", "Technology", "Music", "Cooking",
    "Writing", "Gardening", "Dance", "Outdoor Adventure", "Sports"
];

const hobbyList = document.getElementById('hobby-list');
const continueButton = document.getElementById('continue-btn');

hobbies.forEach(hobby => {
    const btn = document.createElement('button');
    btn.classList.add('hobby-btn');
    btn.innerText = hobby;
    btn.dataset.hobby = hobby;
    btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
    });
    hobbyList.appendChild(btn);
});

continueButton.addEventListener('click', () => {
    const selectedHobbies = Array.from(document.querySelectorAll('.hobby-btn.selected'))
        .map(btn => btn.dataset.hobby);

    fetch('/save-hobbies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // CSRF token for Django
        },
        body: JSON.stringify({ hobbies: selectedHobbies })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "/user_profile/";
        } else {
            window.location.href = "/user_profile/";
        }
    });
});

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
