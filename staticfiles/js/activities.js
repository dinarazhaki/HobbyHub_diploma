document.addEventListener("DOMContentLoaded", function () {
    // Фильтрация событий
    const hobbyFilters = document.querySelectorAll("#hobby-filters input");
    const dateFilter = document.getElementById("date-filter");
    const todayEvents = document.querySelectorAll("#today-events .event");
    const otherEvents = document.querySelectorAll("#other-events .event");
    const noEventsTodayMessage = document.getElementById("no-events-today");
    const noEventsOtherMessage = document.getElementById("no-events-other");
    const typeFilters = document.querySelectorAll("input[value='offline-outdoor'], input[value='offline-indoor'], input[value='online']");

    function filterEvents() {
        const selectedHobbies = getSelectedValues(hobbyFilters);
        const selectedTypes = getSelectedValues(typeFilters);
        const selectedDate = dateFilter.value;
        let visibleTodayCount = filterAndDisplayEvents(todayEvents, selectedHobbies, selectedTypes, selectedDate);
        let visibleOtherCount = filterAndDisplayEvents(otherEvents, selectedHobbies, selectedTypes, selectedDate);

        toggleNoEventsMessage(noEventsTodayMessage, visibleTodayCount);
        toggleNoEventsMessage(noEventsOtherMessage, visibleOtherCount);
    }

    function getSelectedValues(inputs) {
        return Array.from(inputs)
            .filter(input => input.checked)
            .map(input => input.value);
    }

    function filterAndDisplayEvents(events, selectedHobbies, selectedTypes, selectedDate) {
        let visibleCount = 0;

        events.forEach(event => {
            const eventHobbies = event.getAttribute("data-hobbies").split(",").filter(Boolean);
            const eventType = event.getAttribute("data-type");
            const eventDate = event.getAttribute("data-date");

            const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.some(hobby => eventHobbies.includes(hobby));
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(eventType);
            const matchesDate = !selectedDate || eventDate === selectedDate;

            if (matchesHobby && matchesType && matchesDate) {
                event.style.display = "flex"; // Показываем событие
                visibleCount++;
            } else {
                event.style.display = "none"; // Скрываем событие
            }
        });

        return visibleCount;
    }

    function toggleNoEventsMessage(messageElement, visibleCount) {
        if (visibleCount === 0) {
            messageElement.style.display = "block"; // Показываем сообщение
        } else {
            messageElement.style.display = "none"; // Скрываем сообщение
        }
    }

    // Инициализация фильтров
    hobbyFilters.forEach(input => input.addEventListener("change", filterEvents));
    typeFilters.forEach(input => input.addEventListener("change", filterEvents));
    dateFilter.addEventListener("input", filterEvents);

    // Логика для формы создания события
    const hobbyOptions = document.querySelectorAll(".hobby-option");
    const hiddenInput = document.getElementById("event-hobbies");

    hobbyOptions.forEach(option => {
        option.addEventListener("click", function () {
            this.classList.toggle("selected");
            const selectedHobbies = Array.from(document.querySelectorAll(".hobby-option.selected"))
                .map(el => el.dataset.value);
            hiddenInput.value = selectedHobbies.join(",");
        });
    });

    // При загрузке страницы вызываем фильтрацию, чтобы скрыть несоответствующие события
    filterEvents();

    // Обработчик для кнопки "Удалить"
    document.querySelectorAll(".delete-event-btn").forEach(button => {
        button.addEventListener("click", function () {
            const eventId = this.getAttribute("data-event-id");
            if (confirm("Are you sure you want to delete this event?")) {
                fetch(`/delete_event/${eventId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Event deleted successfully!");
                        location.reload(); // Перезагружаем страницу
                    } else {
                        alert("Error deleting event.");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });

    // Обработчик для кнопки "Редактировать"
    document.querySelectorAll(".edit-event-btn").forEach(button => {
        button.addEventListener("click", function () {
            const eventId = this.getAttribute("data-event-id");
            openEditModal(eventId); // Открываем модальное окно для редактирования
        });
    });

    // Функция для открытия модального окна редактирования
    function openEditModal(eventId) {
        fetch(`/get_event_details/${eventId}/`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Заполняем форму редактирования данными события
                    document.getElementById("edit-event-id").value = data.event.id;
                    document.getElementById("edit-event-name").value = data.event.title;
                    document.getElementById("edit-event-description").value = data.event.description;
                    document.getElementById("edit-event-location").value = data.event.location;
                    document.getElementById("edit-event-date").value = data.event.date;
                    document.getElementById("edit-event-time").value = data.event.time;
                    document.getElementById("edit-event-type").value = data.event.event_type;
                    document.getElementById("edit-event-diamonds").value = data.event.diamonds;
                    document.getElementById("edit-event-quota").value = data.event.quota;

                    // Заполняем хобби
                    const hobbyContainer = document.getElementById("edit-hobby-container");
                    hobbyContainer.querySelectorAll(".hobby-option").forEach(option => {
                        if (data.event.hobbies.includes(option.dataset.value)) {
                            option.classList.add("selected"); // Выделяем выбранные хобби
                        } else {
                            option.classList.remove("selected"); // Снимаем выделение с остальных
                        }
                    });

                    // Обновляем скрытое поле с выбранными хобби
                    const selectedHobbies = Array.from(hobbyContainer.querySelectorAll(".hobby-option.selected"))
                        .map(el => el.dataset.value);
                    document.getElementById("edit-event-hobbies").value = selectedHobbies.join(",");

                    // Открываем модальное окно
                    document.getElementById("editEventModal").style.display = "flex";

                    // Добавляем обработчики событий для выбора хобби
                    document.querySelectorAll("#edit-hobby-container .hobby-option").forEach(option => {
                        option.addEventListener("click", function () {
                            this.classList.toggle("selected");
                            const selectedHobbies = Array.from(document.querySelectorAll("#edit-hobby-container .hobby-option.selected"))
                                .map(el => el.dataset.value);
                            document.getElementById("edit-event-hobbies").value = selectedHobbies.join(",");
                        });
                    });
                } else {
                    alert("Error loading event details.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Обработчик для отправки формы редактирования
    document.getElementById("editEventForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        // Собираем выбранные хобби
        const selectedHobbies = Array.from(document.querySelectorAll("#edit-hobby-container .hobby-option.selected"))
            .map(el => el.dataset.value);
        formData.set("hobbies", selectedHobbies.join(","));

        fetch(`/edit_event/${document.getElementById("edit-event-id").value}/`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Event updated successfully!");
                closeEditModal();
                location.reload(); // Перезагружаем страницу
            } else {
                alert("Error updating event.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Логика для выбора хобби в модальном окне редактирования
    document.querySelectorAll("#edit-hobby-container .hobby-option").forEach(option => {
        option.addEventListener("click", function () {
            this.classList.toggle("selected");
            const selectedHobbies = Array.from(document.querySelectorAll("#edit-hobby-container .hobby-option.selected"))
                .map(el => el.dataset.value);
            document.getElementById("edit-event-hobbies").value = selectedHobbies.join(",");
        });
    });
    
    document.querySelectorAll('.finish-event-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            if (confirm('Are you sure you want to mark this event as completed?')) {
                finishEvent(eventId);
            }
        });
    });
});

function finishEvent(eventId) {
    fetch(`/finish_event/${eventId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Event marked as completed!');
            location.reload();
        } else {
            alert('Error: ' + (data.error || 'Failed to complete event'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to complete event');
    });
}

function openModal() {
    document.getElementById("eventModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("eventModal").style.display = "none";
}

function closeEditModal() {
    document.getElementById("editEventModal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("eventModal");
    const editModal = document.getElementById("editEventModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === editModal) {
        editModal.style.display = "none";
    }
};

// Обработчик для формы создания события
document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch("{% url 'create_event' %}", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Event created successfully!");
            closeModal();
            location.reload();
        } else {
            alert("Error creating event.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });


    
});


