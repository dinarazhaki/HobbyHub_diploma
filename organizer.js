document.addEventListener("DOMContentLoaded", function () {
    // Example array (backend should replace this with actual data)
    const activities = [
        { title: "Yoga Class", date: "February 10, 2025", image: "images/img6.png" },
        { title: "Painting", date: "March 10, 2025", image: "images/img7.png" },
        { title: "Cooking Class", date: "March 25, 2025", image: "images/img8.png" },
        { title: "Guitar Jam", date: "March 15, 2025", image: "images/img9.png" },
        { title: "Pottery art", date: "February 8, 2025", image: "images/img10.png" },
        { title: "Football", date: "March 20, 2025", image: "images/img11.png" }
    ];

    const activitiesContainer = document.getElementById("activities");

    activities.forEach(activity => {
        const activityCard = document.createElement("div");
        activityCard.classList.add("col-md-6", "mb-4");
        activityCard.innerHTML = `
            <div class="activity-card">
                <img src="${activity.image}" class="activity-img">
                <div class="activity-info">
                    <h5>${activity.title}</h5>
                    <p>Date: ${activity.date}</p>
                    <button class="btn btn-primary">Edit</button>
                    <button class="btn btn-danger">Delete</button>
                </div>
            </div>
        `;
        activitiesContainer.appendChild(activityCard);
    });
});
