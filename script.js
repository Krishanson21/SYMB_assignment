// Store parking slots in memory
let parkingSlots = [];

// Load slots from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSlots();
    displaySlots();
    updateStats();
    initializeViewToggle();
});

// Add Parking Slot Form Handler
document.getElementById('addSlotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const slotNo = document.getElementById('slotNo').value.trim();
    const isCovered = document.getElementById('isCovered').checked;
    const isEVCharging = document.getElementById('isEVCharging').checked;
    
    // Check if slot number already exists
    if (parkingSlots.some(slot => slot.slotNo === slotNo)) {
        showNotification('Slot number already exists!', 'error');
        return;
    }
    
    // Validate slot number
    if (!slotNo) {
        showNotification('Please enter a valid slot number', 'error');
        return;
    }
    
    // Create parking slot object
    const slot = {
        slotNo,
        isCovered,
        isEVCharging,
        isOccupied: false
    };
    
    // Add to array
    parkingSlots.push(slot);
    
    // Save to localStorage
    saveSlots();
    
    // Display updated list
    displaySlots();
    updateStats();
    
    // Reset form
    document.getElementById('addSlotForm').reset();
    
    // Show success notification
    showNotification('Parking slot added successfully!', 'success');
});

// Park Vehicle Form Handler
document.getElementById('parkVehicleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const needsEV = document.getElementById('needsEV').checked;
    const needsCover = document.getElementById('needsCover').checked;
    
    parkVehicle(needsEV, needsCover);
});

// Display all parking slots
function displaySlots() {
    const container = document.getElementById('slotsDisplay');
    
    if (parkingSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No parking slots added yet</p>
                <span>Add your first slot to get started</span>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    parkingSlots.forEach((slot, index) => {
        html += `
            <div class="slot-card ${slot.isOccupied ? 'occupied' : ''}">
                <div class="slot-header">
                    <div class="slot-number">${slot.slotNo}</div>
                    <div class="slot-status ${slot.isOccupied ? 'occupied' : 'available'}">
                        <i class="fas ${slot.isOccupied ? 'fa-ban' : 'fa-check-circle'}"></i>
                        ${slot.isOccupied ? 'Occupied' : 'Available'}
                    </div>
                </div>
                <div class="slot-features">
                    ${slot.isCovered ? '<div class="feature-badge"><i class="fas fa-shield-alt"></i> Covered</div>' : ''}
                    ${slot.isEVCharging ? '<div class="feature-badge"><i class="fas fa-charging-station"></i> EV Charging</div>' : ''}
                    ${!slot.isCovered && !slot.isEVCharging ? '<div class="feature-badge"><i class="fas fa-car"></i> Standard</div>' : ''}
                </div>
                <div class="slot-actions">
                    ${slot.isOccupied ? 
                        `<button class="btn btn-danger" onclick="removeVehicle(${index})">
                            <i class="fas fa-times"></i> Free Slot
                        </button>` : 
                        `<button class="btn btn-success" onclick="parkInSlot(${index})" style="padding: 10px 16px; width: 100%; font-size: 0.85rem;">
                            <i class="fas fa-car-side"></i> Park Here
                        </button>`
                    }
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Park vehicle based on requirements
function parkVehicle(needsEV, needsCover) {
    // Filter available slots that match requirements
    const availableSlots = parkingSlots
        .map((slot, index) => ({ ...slot, originalIndex: index }))
        .filter(slot => !slot.isOccupied);
    
    if (availableSlots.length === 0) {
        showResult('No slot available', false);
        return;
    }
    
    // Filter by requirements
    let matchingSlots = availableSlots;
    
    if (needsEV) {
        matchingSlots = matchingSlots.filter(slot => slot.isEVCharging);
    }
    
    if (needsCover) {
        matchingSlots = matchingSlots.filter(slot => slot.isCovered);
    }
    
    if (matchingSlots.length === 0) {
        showResult('No slot available', false);
        return;
    }
    
    // Find nearest slot (assuming slot numbers are ordered, or use first available)
    // For this implementation, we'll take the first matching slot as "nearest"
    const nearestSlot = matchingSlots[0];
    
    // Mark slot as occupied
    parkingSlots[nearestSlot.originalIndex].isOccupied = true;
    
    // Save and update display
    saveSlots();
    displaySlots();
    updateStats();
    
    // Show success result
    showResult(nearestSlot, true);
}

// Park in specific slot (from slot card button)
function parkInSlot(index) {
    if (parkingSlots[index].isOccupied) {
        showNotification('This slot is already occupied!', 'error');
        return;
    }
    
    parkingSlots[index].isOccupied = true;
    saveSlots();
    displaySlots();
    updateStats();
    
    showResult(parkingSlots[index], true);
}

// Remove vehicle from slot
function removeVehicle(index) {
    if (!parkingSlots[index].isOccupied) {
        showNotification('This slot is already empty!', 'error');
        return;
    }
    
    parkingSlots[index].isOccupied = false;
    saveSlots();
    displaySlots();
    updateStats();
    
    showNotification(`Slot ${parkingSlots[index].slotNo} is now available`, 'success');
    
    // Hide result card if visible
    document.getElementById('resultCard').style.display = 'none';
}

// Show allocation result
function showResult(data, isSuccess) {
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');
    
    resultCard.style.display = 'block';
    
    if (!isSuccess) {
        resultContent.innerHTML = `
            <div class="result-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>${data}</h3>
                <p style="color: var(--text-secondary); margin-top: 10px;">
                    Please try different requirements or add more slots
                </p>
            </div>
        `;
    } else {
        resultContent.innerHTML = `
            <div class="result-success">
                <i class="fas fa-check-circle"></i>
                <h3>Vehicle Parked Successfully!</h3>
                <div class="slot-info">
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Slot: ${data.slotNo}</strong></p>
                    <p style="margin-top: 10px; color: var(--text-secondary);">
                        ${data.isCovered ? '<i class="fas fa-shield-alt"></i> Covered Parking' : ''}
                        ${data.isCovered && data.isEVCharging ? ' • ' : ''}
                        ${data.isEVCharging ? '<i class="fas fa-charging-station"></i> EV Charging Available' : ''}
                    </p>
                </div>
            </div>
        `;
    }
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Update statistics
function updateStats() {
    const total = parkingSlots.length;
    const occupied = parkingSlots.filter(slot => slot.isOccupied).length;
    const available = total - occupied;
    
    document.getElementById('totalSlots').textContent = total;
    document.getElementById('availableSlots').textContent = available;
    document.getElementById('occupiedSlots').textContent = occupied;
}

// Save slots to localStorage
function saveSlots() {
    localStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
}

// Load slots from localStorage
function loadSlots() {
    const stored = localStorage.getItem('parkingSlots');
    if (stored) {
        parkingSlots = JSON.parse(stored);
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: var(--dark-bg);
        border-radius: 10px;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        font-size: 0.95rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Initialize view toggle
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const slotsDisplay = document.getElementById('slotsDisplay');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update display
            if (view === 'list') {
                slotsDisplay.classList.add('list-view');
            } else {
                slotsDisplay.classList.remove('list-view');
            }
        });
    });
}
