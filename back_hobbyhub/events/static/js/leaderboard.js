document.addEventListener("DOMContentLoaded", function () {
    const leaderboardData = [
        { rank: 1, name: "Ayaulym", surname: "Nurmukhambet", company: "123", score: 98 },
        { rank: 2, name: "Ayaulym", surname: "Nurmukhambet", company: "123", score: 95 },
        { rank: 3, name: "Ayaulym", surname: "Nurmukhambet", company: "123", score: 89 },
        { rank: 4, name: "Ayaulym", surname: "Nurmukhambet", company: "123", score: 80 },
        { rank: 5, name: "Ayaulym", surname: "Nurmukhambet", company: "123", score: 61 },
    ];
    
    const tableBody = document.querySelector("#leaderboard-table tbody");
    
    leaderboardData.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.rank}</td>
            <td>${row.name} ${row.surname}</td> <!-- Name and Surname combined -->
            <td>${row.company}</td>
            <td>${row.score}</td>
        `;
        tableBody.appendChild(tr);
    });
    
});
