var map = L.map('map').setView([43.2389, 76.8897], 15); // Set view to Almaty, Kazakhstan

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([43.2389, 76.8897]).addTo(map)
    .bindPopup('office, Almaty')
    .openPopup();

let gameCode = "123456";  // This value will be taken dynamically later

// Splitting the code into separate spans
let codeBox = document.getElementById("gameCode");
 gameCode.split("").forEach(num => {
    let span = document.createElement("span");
    span.innerText = num;
    span.classList.add("digit");
    codeBox.appendChild(span);
 });


function toggleDivs() {
    let firstDivs = document.getElementsByClassName("challenge-info");
    let secondDivs = document.getElementsByClassName("secondContainer");

    // Hide all elements with class "challenge-info"
    for (let i = 0; i < firstDivs.length; i++) {
        firstDivs[i].style.display = "none";
    }

    // Show all elements with class "seconContainer"
    for (let i = 0; i < secondDivs.length; i++) {
        secondDivs[i].classList.remove("hidden");
    }
}