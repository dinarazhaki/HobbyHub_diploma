function showStatusMessage(message, isSuccess) {
    const statusMessage = document.getElementById("status-message");
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${isSuccess ? 'success' : 'error'}`;
    statusMessage.style.display = 'block';

    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 1500);
}

function applyToEvent(eventId) {
    fetch(`/apply_to_event/${eventId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            showStatusMessage(data.message, true);
            // Обновляем страницу через 3 секунды
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showStatusMessage(data.message, false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showStatusMessage("An error occurred. Please try again.", false);
    });
}

function cancelEventRegistration(eventId) {
    fetch(`/cancel_event_registration/${eventId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            showStatusMessage(data.message, true);
            // Обновляем страницу через 3 секунды
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showStatusMessage(data.message, false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showStatusMessage("An error occurred. Please try again.", false);
    });
}
function domReady(fn) {
if (
document.readyState === "complete" ||
document.readyState === "interactive"
) {
setTimeout(fn, 1000);
} else {
document.addEventListener("DOMContentLoaded", fn);
}
}




document.addEventListener('DOMContentLoaded', function() {
    const qrReaderElement = document.getElementById('qr-reader');
    const startScanBtn = document.getElementById('start-scan-btn');
    const stopScanBtn = document.getElementById('stop-scan-btn');
    const qrResults = document.getElementById('qr-reader-results');
    const attendanceStatus = document.getElementById('attendance-status');
    const qrFileInput = document.getElementById('qr-file-input');
    let html5QrCode = null;
    let hasScanned = false; // Track if we've already scanned successfully

    function startScanner() {
        if (html5QrCode || hasScanned) return;

        qrReaderElement.classList.remove('hidden');
        html5QrCode = new Html5Qrcode("qr-reader");

        const config = { fps: 10, qrbox: 250 };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                // Stop scanner immediately on successful scan
                html5QrCode.stop().then(() => {
                    html5QrCode = null;
                    qrCodeSuccessCallback(decodedText);
                });
            },
            (errorMessage) => {
                console.warn(`QR error: ${errorMessage}`);
                if (!hasScanned) {
                    qrResults.textContent = `Error: ${errorMessage}`;
                    qrResults.style.color = 'red';
                }
            }
        ).then(() => {
            console.log("Scanner started");
            startScanBtn.classList.add('hidden');
            stopScanBtn.classList.remove('hidden');
            qrResults.textContent = 'Scanning QR code...';
            qrResults.style.color = 'inherit';
        }).catch((err) => {
            console.error("Scanner error:", err);
            qrResults.textContent = 'Error: Failed to start scanner';
            qrResults.style.color = 'red';
        });
    }

    function stopScanner() {
        if (!html5QrCode) return;

        html5QrCode.stop().then(() => {
            console.log("Scanner stopped");
            html5QrCode = null;
            startScanBtn.classList.remove('hidden');
            stopScanBtn.classList.add('hidden');
            qrResults.textContent = 'Scanning stopped';
        }).catch((err) => {
            console.error("Stop error:", err);
            qrResults.textContent = 'Error: Failed to stop scanner';
            qrResults.style.color = 'red';
        });
    }

    function qrCodeSuccessCallback(decodedText) {
        console.log("QR scanned:", decodedText);
        hasScanned = true; // Mark as scanned
        
        try {
            const eventId = validateQRCode(decodedText);
            console.log("Valid event:", eventId);
            markAttendance(eventId, decodedText);
        } catch (error) {
            console.error("Validation error:", error);
            showErrorMessage(error.message);
            hasScanned = false; // Reset if validation fails
        }
    }

    function validateQRCode(decodedText) {
        const parts = decodedText.split('|');
        if (parts.length !== 2) throw new Error('Invalid QR format');

        const [eventPart, tokenPart] = parts.map(part => part.split(':'));
        if (eventPart.length !== 2 || eventPart[0] !== 'event') throw new Error('Invalid event format');
        if (tokenPart.length !== 2 || tokenPart[0] !== 'token') throw new Error('Invalid token format');

        const qrEventId = eventPart[1];
        const currentEventId = document.getElementById('event-data').dataset.eventId;
        if (qrEventId !== currentEventId) throw new Error('Wrong event QR');

        const qrToken = parseInt(tokenPart[1]);
        const currentSegment = Math.floor(Date.now() / 15000);
        if (Math.abs(currentSegment - qrToken) > 1) throw new Error('Expired QR');

        return qrEventId;
    }

    function markAttendance(eventId, qrData) {
        const userDataElement = document.getElementById('user-data');
        const nickname = userDataElement ? userDataElement.dataset.nickname : null;
        
        console.log("User Data Element:", userDataElement);
        console.log("Nickname:", nickname);
    
        if (!nickname) {
            showErrorMessage('User not identified');
            return;
        }

        const token = qrData.split('|')[1]?.split(':')[1] || '';
        
        fetch(`/events/${eventId}/mark_attendance/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                employee_nickname: nickname,
                qr_token: token
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Server error');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showWelcomeMessage(data.employee_name);
            } else {
                throw new Error(data.error || "Attendance failed");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showErrorMessage(error.message);
            hasScanned = false; // Reset scan state
        });
    }

    function showWelcomeMessage(employeeName) {
        qrReaderElement.style.display = 'none';
        qrResults.textContent = '';
        
        attendanceStatus.innerHTML = `
            <div class="success-message">
                <h3>Welcome ${employeeName}!</h3>
                <p>Have fun at the event!</p>
                <div class="checkmark">✓</div>
            </div>
        `;
        attendanceStatus.classList.remove('hidden');
    }

    function showErrorMessage(message) {
        qrResults.textContent = message;
        qrResults.style.color = 'red';
        
        setTimeout(() => {
            if (!hasScanned) {
                qrResults.textContent = '';
                startScanner();
            }
        }, 3000);
    }

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    // Event listeners
    startScanBtn.addEventListener('click', startScanner);
    stopScanBtn.addEventListener('click', stopScanner);
    window.addEventListener('beforeunload', stopScanner);

    qrFileInput.addEventListener('change', function(event) {
        if (event.target.files.length === 0) return;

        const file = event.target.files[0];
        const html5QrCode = new Html5Qrcode("qr-reader");

        html5QrCode.scanFile(file, true)
            .then(decodedText => qrCodeSuccessCallback(decodedText))
            .catch(err => showErrorMessage("QR code could not be read."));
    });

    startScanBtn.addEventListener('click', startScanner);
    stopScanBtn.addEventListener('click', stopScanner);
    window.addEventListener('beforeunload', stopScanner);
});

