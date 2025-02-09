const hobbies = [
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
});