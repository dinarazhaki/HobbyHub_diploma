const hobbies = [
    "Photography", "Crafting", "Technology", "Music", "Cooking",
    "Writing", "Gardening", "Dance", "Outdoor Adventure", "Crafting", "Sports"
];

const hobbyList = document.getElementById('hobby-list');

hobbies.forEach(hobby => {
    const btn = document.createElement('button');
    btn.classList.add('hobby-btn');
    btn.innerText = hobby;
    btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
    });
    hobbyList.appendChild(btn);
});