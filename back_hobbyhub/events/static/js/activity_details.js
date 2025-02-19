var map = L.map('map').setView([43.2389, 76.8897], 15); // Set view to Almaty, Kazakhstan

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([43.2389, 76.8897]).addTo(map)
    .bindPopup('office, Almaty')
    .openPopup();

let gameCode = Math.floor(100000 + Math.random() * 900000).toString();
let codeBox = document.getElementById("gameCode");
codeBox.innerHTML = "";

gameCode.split("").forEach(num => {
    let span = document.createElement("span");
    span.innerText = num;
    span.classList.add("digit");
    codeBox.appendChild(span);
});

function toggleDivs() {
    let firstDivs = document.getElementsByClassName("challenge-info");
    let secondDivs = document.getElementsByClassName("secondContainer");

    for (let i = 0; i < firstDivs.length; i++) {
        firstDivs[i].style.display = "none";
    }
    for (let i = 0; i < secondDivs.length; i++) {
        secondDivs[i].classList.remove("hidden");
    }
}