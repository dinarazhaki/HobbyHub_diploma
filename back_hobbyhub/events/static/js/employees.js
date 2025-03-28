document.addEventListener("DOMContentLoaded", function() {
    const newRequestsBtn = document.getElementById("new-requests-btn");
    const yourEmployeesBtn = document.getElementById("your-employees-btn");

    function activateButton(activeBtn, inactiveBtn) {
        activeBtn.classList.add("active");
        inactiveBtn.classList.remove("active");
    }

    newRequestsBtn.addEventListener("click", function () {
        activateButton(newRequestsBtn, yourEmployeesBtn);
    });

    yourEmployeesBtn.addEventListener("click", function () {
        activateButton(yourEmployeesBtn, newRequestsBtn);
    });



document.getElementById('new-requests-btn').addEventListener('click', function() {
    document.getElementById('new-requests-table').classList.remove('hidden');
    document.getElementById('your-employees-table').classList.add('hidden');
    document.getElementById('delete-btn').style.display='none';

    document.getElementById('new-requests-btn').style.backgroundColor = '#FFA500';
    document.getElementById('new-requests-btn').style.color = 'white';
    document.getElementById('your-employees-btn').style.backgroundColor = 'white';
    document.getElementById('your-employees-btn').style.color = '#333';

    document.querySelectorAll('#your-employees-table .employee-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
});

document.getElementById('your-employees-btn').addEventListener('click', function() {
    document.getElementById('your-employees-table').classList.remove('hidden');
    document.getElementById('new-requests-table').classList.add('hidden');
    document.getElementById('delete-btn').classList.remove('hidden');

    document.getElementById('your-employees-btn').style.backgroundColor = '#FFA500';
    document.getElementById('your-employees-btn').style.color = 'white';
    document.getElementById('new-requests-btn').style.backgroundColor = 'white';
    document.getElementById('new-requests-btn').style.color = '#333';
    
    document.querySelectorAll('#new-requests-table .employee-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
});

document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateActionButtons);
});


});

document.addEventListener('DOMContentLoaded', () => {
    // Обработчик для кнопки Approve
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', () => {
            const nickname = button.dataset.nickname;

            fetch('/approve_employee/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ nickname: nickname })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Employee approved!');
                    location.reload();  // Перезагружаем страницу, чтобы отобразить изменения
                } else {
                    alert('Error approving employee: ' + data.error);
                }
            });
        });
    });

    // Обработчик для кнопки Deny
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const nickname = button.dataset.nickname;

            fetch('/deny_employee/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ nickname: nickname })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Employee denied and removed!');
                    location.reload();  // Перезагружаем страницу
                } else {
                    alert('Error denying employee: ' + data.error);
                }
            });
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const nickname = button.dataset.nickname;

            fetch('/deny_employee/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ nickname: nickname })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Employee removed!');
                    location.reload();  // Перезагружаем страницу
                } else {
                    alert('Error deleting employee: ' + data.error);
                }
            });
        });
    });
});

// Функция для получения CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
