// organizer-details.js - Final Organized Version

// ======================
//  GLOBAL VARIABLES
// ======================
let currentAwardData = {
    participantId: null,
    
    gameId: null,
    points: 0,
    maxPoints: 0,
    row: null,
    button: null
};

// ======================
//  DROPDOWN FUNCTIONS
// ======================

function toggleDropdown(button) {
    const dropdownContent = button.nextElementSibling;
    const isShowing = dropdownContent.classList.contains('show');
    
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-content.show').forEach(menu => {
        if (menu !== dropdownContent) menu.classList.remove('show');
    });
    
    // Calculate position only when opening
    if (!isShowing) {
        positionDropdown(button, dropdownContent);
    }
    
    dropdownContent.classList.toggle('show');
}

function positionDropdown(button, dropdownContent) {
    const rect = button.getBoundingClientRect();
    const dropdownHeight = dropdownContent.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Position dropdown relative to button
    let dropdownTop = button.offsetHeight + 5;
    if (rect.bottom + dropdownHeight > windowHeight) {
        dropdownTop = -dropdownHeight - 5; // Move above button if near bottom
    }
    
    dropdownContent.style.top = `${dropdownTop}px`;
}

// ======================
//  GAME MANAGEMENT
// ======================

async function deleteLiveGame(event, button) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
        if (!confirm('Are you sure you want to delete this game?')) {
            return;
        }
        
        const gameId = button.getAttribute('data-game-id');
        const response = await sendDeleteRequest(gameId);
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete game');
        }
        
        removeGameFromUI(button);
    } catch (error) {
        handleGameError(error, 'delete');
    }
}

async function sendDeleteRequest(gameId) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    const response = await fetch("/delete_live_game/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: `game_id=${gameId}`
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server responded with an error');
    }
    
    return await response.json();
}

function removeGameFromUI(button) {
    const gameItem = button.closest('.ag-courses_item');
    gameItem.style.transition = 'opacity 0.3s';
    gameItem.style.opacity = '0';
    
    setTimeout(() => {
        gameItem.remove();
        checkForEmptyGameList();
    }, 300);
}

function checkForEmptyGameList() {
    const gameItems = document.querySelectorAll('.ag-courses_item');
    if (gameItems.length <= 1) { // 1 is the "No games" placeholder
        window.location.reload();
    }
}

// ======================
//  POINTS AWARD SYSTEM
// ======================

function awardPoints(button) {
    const row = button.closest('tr');
    const select = row.querySelector('.game-select');
    const pointsInput = row.querySelector('.points-input');
    
    currentAwardData = {
        participantId: row.dataset.participantId,
        gameId: select.value,
        points: parseInt(pointsInput.value) || 0,
        maxPoints: parseInt(select.options[select.selectedIndex].dataset.maxPoints),
        row: row,
        button: button
    };

    showConfirmationModal(row, select);
}

function showConfirmationModal(row, select) {
    document.getElementById('confirmationText').textContent = 
        `Award ${currentAwardData.points} points to ${row.cells[0].textContent} ${row.cells[1].textContent} for game "${select.options[select.selectedIndex].text.split(' (')[0]}"?`;
    
    document.getElementById('confirmationModal').style.display = 'block';
}

async function confirmAward() {
    try {
        const result = await sendAwardRequest();
        if (result.success) {
            // Обновляем UI с реальным балансом из ответа
            alert(`Успешно! ${result.message}\nНовый баланс: ${result.new_balance}`);
            resetAwardForm();
            
            // Можно также обновить отображение баланса в таблице
            updateParticipantBalance(currentAwardData.participantId, result.new_balance);
        } else {
            throw new Error(result.error || "Произошла ошибка");
        }
    } catch (error) {
        alert(`Ошибка: ${error.message}`);
        console.error("Ошибка начисления баллов:", error);
    } finally {
        closeModal();
    }
}

function updateParticipantBalance(participantId, newBalance) {
    // Находим строку участника по ID и обновляем отображение
    const row = document.querySelector(`tr[data-participant-id="${participantId}"]`);
    if (row) {
        // Если у вас есть ячейка для отображения баланса
        const balanceCell = row.querySelector('.balance-cell');
        if (balanceCell) {
            balanceCell.textContent = newBalance;
        }
    }
}
// organizer-details.js - Update the sendAwardRequest function
// organizer-details.js
function getAwardPointsUrl() {
    const currentPath = window.location.pathname;
    const basePath = currentPath.split('/').slice(0, -1).join('/');
    return `${window.location.origin}${basePath}/award_points/`;
}

async function sendAwardRequest() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const awardPointsUrl = "/award_points/"; // Убедитесь, что это правильный путь

    try {
        const response = await fetch(awardPointsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                participant_id: String(currentAwardData.participantId),
                game_id: Number(currentAwardData.gameId),
                points: Number(currentAwardData.points)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}




function handleAwardSuccess(newBalance) {
    alert(`Successfully awarded ${currentAwardData.points} points! New balance: ${newBalance}`);
    resetAwardForm();
}

function resetAwardForm() {
    const select = currentAwardData.row.querySelector('.game-select');
    const pointsInput = currentAwardData.row.querySelector('.points-input');
    select.value = '';
    pointsInput.value = '';
    pointsInput.disabled = true;
    currentAwardData.button.disabled = true;
}

// ======================
//  MODAL FUNCTIONS
// ======================

function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

// ======================
//  ERROR HANDLING
// ======================

function handleGameError(error, action) {
    console.error(`${action} game error:`, error);
    alert(`Error: ${error.message || `Failed to ${action} game`}`);
}

function handleAwardError(error) {
    console.error('Award points error:', error);
    alert(`Error: ${error.message || 'Failed to award points'}`);
}

// ======================
//  INITIALIZATION
// ======================

function initializeEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Game select change handler
    document.querySelectorAll('.game-select').forEach(select => {
        select.addEventListener('change', function() {
            handleGameSelectChange(this);
        });
    });

    // Points input validation
    document.querySelectorAll('.points-input').forEach(input => {
        input.addEventListener('input', function() {
            validatePointsInput(this);
        });
    });
}

function handleGameSelectChange(select) {
    const row = select.closest('tr');
    const pointsInput = row.querySelector('.points-input');
    const awardBtn = row.querySelector('.award-btn');
    
    if (select.value) {
        const maxPoints = parseInt(select.options[select.selectedIndex].dataset.maxPoints);
        pointsInput.disabled = false;
        pointsInput.max = maxPoints;
        pointsInput.placeholder = `Max ${maxPoints}`;
        awardBtn.disabled = false;
    } else {
        pointsInput.disabled = true;
        pointsInput.value = '';
        awardBtn.disabled = true;
    }
}

function validatePointsInput(input) {
    const max = parseInt(input.max) || 0;
    let value = parseInt(input.value) || 0;
    
    if (value > max) {
        input.value = max;
        value = max;
    }
    
    input.value = value;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});
