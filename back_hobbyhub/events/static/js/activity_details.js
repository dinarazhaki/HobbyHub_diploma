document.addEventListener('DOMContentLoaded', function() {
    const qrReaderElement = document.getElementById('qr-reader');
    const startScanBtn = document.getElementById('start-scan-btn');
    const stopScanBtn = document.getElementById('stop-scan-btn');
    const qrResults = document.getElementById('qr-reader-results');
    const attendanceStatus = document.getElementById('attendance-status');
    let scannerActive = false;
    let videoStream = null;

    // Start scanner using jsQR
    async function startScanner() {
        if (scannerActive) return;

        try {
            startScanBtn.disabled = true;
            qrResults.textContent = 'Initializing camera...';
            qrResults.style.color = 'inherit';
            qrReaderElement.classList.remove('hidden');

            // Create video element if not exists
            let video = qrReaderElement.querySelector('video');
            if (!video) {
                video = document.createElement('video');
                video.setAttribute('playsinline', '');
                qrReaderElement.appendChild(video);
            }

            // Create canvas for jsQR
            let canvas = qrReaderElement.querySelector('canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.style.display = 'none';
                qrReaderElement.appendChild(canvas);
            }
            const ctx = canvas.getContext('2d');

            // Get camera stream
            videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            video.srcObject = videoStream;
            await video.play();

            scannerActive = true;
            startScanBtn.classList.add('hidden');
            stopScanBtn.classList.remove('hidden');
            qrResults.textContent = 'Scan the event QR code...';

            // Start scanning loop
            function scanFrame() {
                if (!scannerActive) return;

                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    try {
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'dontInvert',
                        });

                        if (code) {
                            qrCodeSuccessCallback(code.data);
                            return;
                        }
                    } catch (e) {
                        console.error('QR scan error:', e);
                    }
                }

                requestAnimationFrame(scanFrame);
            }

            scanFrame();
        } catch (err) {
            console.error("Scanner error:", err);
            qrResults.textContent = 'Error: ' + (err.message || 'Failed to start scanner');
            qrResults.style.color = 'red';
            resetScanner();
        } finally {
            startScanBtn.disabled = false;
        }
    }

    // Stop scanner function
    function stopScanner() {
        if (!scannerActive) return;
        
        try {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                videoStream = null;
            }
            qrResults.textContent = 'Scanning stopped';
        } catch (err) {
            console.error("Error stopping scanner:", err);
            qrResults.textContent = 'Error stopping scanner';
            qrResults.style.color = 'red';
        } finally {
            resetScanner();
        }
    }

    // Reset scanner state
    function resetScanner() {
        scannerActive = false;
        startScanBtn.classList.remove('hidden');
        stopScanBtn.classList.add('hidden');
    }

    // QR code validation
    function validateQRCode(decodedText) {
        try {
            const parts = decodedText.split('|');
            if (parts.length !== 2) {
                throw new Error('Invalid QR code format');
            }
            
            const eventPart = parts[0].split(':');
            const tokenPart = parts[1].split(':');
            
            if (eventPart.length !== 2 || eventPart[0] !== 'event') {
                throw new Error('Invalid event ID format');
            }
            
            if (tokenPart.length !== 2 || tokenPart[0] !== 'token') {
                throw new Error('Invalid token format');
            }
            
            const qrEventId = eventPart[1];
            const currentEventId = document.getElementById('event-data').dataset.eventId;
            
            if (parseInt(qrEventId) !== parseInt(currentEventId)) {
                throw new Error('This QR code is for a different event');
            }
            
            // Verify token is not too old
            const qrToken = parseInt(tokenPart[1]);
            const currentTimeSegment = Math.floor(Date.now() / 15000);
            
            if (Math.abs(currentTimeSegment - qrToken) > 1) {
                throw new Error('QR code expired. Please get a fresh one.');
            }
            
            return qrEventId;
        } catch (error) {
            console.error("QR validation error:", error);
            throw error;
        }
    }

    // Success callback
    function qrCodeSuccessCallback(decodedText) {
        console.log("QR scan successful:", decodedText);
        stopScanner();
        
        try {
            const eventId = validateQRCode(decodedText);
            console.log("Validated event ID:", eventId);
            markAttendance(eventId, decodedText);
        } catch (error) {
            console.error("Validation failed:", error);
            showErrorMessage(error.message);
        }
    }

    // Mark attendance function
    function markAttendance(eventId, qrData) {
        const nickname = document.getElementById('user-data').dataset.nickname;
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
        .then(handleResponse)
        .then(handleSuccess)
        .catch(handleError);
    }
    
    function handleResponse(response) {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || `Server error: ${response.status}`);
            });
        }
        return response.json();
    }
    
    function handleSuccess(data) {
        if (data.success) {
            const timestamp = new Date(data.record.timestamp);
            attendanceStatus.innerHTML = `
                <div class="success-message">
                    <svg viewBox="0 0 24 24" class="checkmark">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3>Attendance Confirmed!</h3>
                    <p>${data.record.first_name} ${data.record.last_name}</p>
                    <p>Time: ${timestamp.toLocaleString()}</p>
                </div>
            `;
            attendanceStatus.classList.remove('hidden');
            qrReaderElement.style.display = 'none';
        } else {
            throw new Error(data.error || "Attendance failed");
        }
    }
    
    function handleError(error) {
        console.error("Error:", error);
        showErrorMessage(error.message);
    }

    function showErrorMessage(message) {
        qrResults.textContent = message;
        qrResults.style.color = 'red';
        
        setTimeout(() => {
            qrResults.textContent = '';
            startScanner();
        }, 3000);
    }

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    // Event listeners
    startScanBtn.addEventListener('click', startScanner);
    stopScanBtn.addEventListener('click', stopScanner);

    // Clean up on page unload
    window.addEventListener('beforeunload', stopScanner);
});

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