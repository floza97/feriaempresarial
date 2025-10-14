// Sistema de Gestión de Parqueadero - ParkManager v2.0
// Versión Simplificada - Salida solo por Placa

// ============================================
// VERIFICACIÓN DE AUTENTICACIÓN
// ============================================
function checkAuth() {
    const token = localStorage.getItem('parkmanager_token');
    const user = localStorage.getItem('parkmanager_user');

    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }

    const userElement = document.getElementById('currentUser');
    if (userElement) {
        userElement.textContent = user;
    }
    return true;
}

function logout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        localStorage.removeItem('parkmanager_token');
        localStorage.removeItem('parkmanager_user');
        localStorage.removeItem('parkmanager_login_time');
        window.location.href = 'login.html';
    }
}

// Verificar autenticación al cargar
window.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        return;
    }

    // Inicializar aplicación
    updateStats();
    renderVehiclesTable();
});

// ============================================
// CONFIGURACIÓN DEL SISTEMA
// ============================================
const TARIFAS = {
    moto: 2000,
    carro: 3500,
    camioneta: 4000
};

const CAPACIDAD_TOTAL = 50;
const FRACCION_MINIMA = 15;

// ============================================
// BASE DE DATOS LOCAL
// ============================================
class ParkingDB {
    constructor() {
        this.vehicles = this.loadVehicles();
        this.history = this.loadHistory();
    }

    loadVehicles() {
        const stored = localStorage.getItem('parkingVehicles');
        return stored ? JSON.parse(stored) : [];
    }

    loadHistory() {
        const stored = localStorage.getItem('parkingHistory');
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem('parkingVehicles', JSON.stringify(this.vehicles));
        localStorage.setItem('parkingHistory', JSON.stringify(this.history));
    }

    addVehicle(vehicle) {
        this.vehicles.push(vehicle);
        this.save();
    }

    removeVehicle(plate) {
        const vehicle = this.vehicles.find(v => v.plate === plate.toUpperCase());
        this.vehicles = this.vehicles.filter(v => v.plate !== plate.toUpperCase());
        if (vehicle) {
            this.history.push(vehicle);
        }
        this.save();
        return vehicle;
    }

    findByPlate(plate) {
        return this.vehicles.find(v => v.plate === plate.toUpperCase());
    }

    getActiveVehicles() {
        return this.vehicles;
    }

    getTodayHistory() {
        const today = new Date().toDateString();
        return this.history.filter(v => {
            if (!v.exitTime) return false;
            const exitDate = new Date(v.exitTime).toDateString();
            return exitDate === today;
        });
    }

    getAllHistory() {
        return this.history;
    }
}

const db = new ParkingDB();

// ============================================
// GENERADOR DE CÓDIGOS DE VERIFICACIÓN
// ============================================
function generateVerificationCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let code = '';
    for (let i = 0; i < 3; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    code += '-';
    for (let i = 0; i < 4; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return code;
}

// ============================================
// CLASE VEHÍCULO
// ============================================
class Vehicle {
    constructor(plate, type, owner, phone) {
        this.plate = plate.toUpperCase();
        this.type = type;
        this.owner = owner;
        this.phone = phone;
        this.verificationCode = generateVerificationCode();
        this.entryTime = new Date().toISOString();
        this.exitTime = null;
        this.totalAmount = 0;
        this.status = 'active';
        this.registeredBy = localStorage.getItem('parkmanager_user');
    }

    calculateStay() {
        const entry = new Date(this.entryTime);
        const exit = this.exitTime ? new Date(this.exitTime) : new Date();
        const diffMs = exit - entry;
        const diffMins = Math.floor(diffMs / 60000);

        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        return { hours, minutes, totalMinutes: diffMins };
    }

    calculateAmount() {
        const stay = this.calculateStay();
        const tarifa = TARIFAS[this.type];
        const fracciones = Math.ceil(stay.totalMinutes / FRACCION_MINIMA);
        const costoFraccion = tarifa / (60 / FRACCION_MINIMA);
        this.totalAmount = Math.round(fracciones * costoFraccion);
        return this.totalAmount;
    }

    processExit() {
        this.exitTime = new Date().toISOString();
        this.status = 'completed';
        this.calculateAmount();
    }
}

// ============================================
// FUNCIONES DE INTERFAZ
// ============================================
function updateStats() {
    const activeVehicles = db.getActiveVehicles();
    const todayHistory = db.getTodayHistory();

    document.getElementById('activeVehicles').textContent = activeVehicles.length;
    document.getElementById('availableSpaces').textContent = CAPACIDAD_TOTAL - activeVehicles.length;

    const todayIncome = todayHistory.reduce((sum, v) => sum + (v.totalAmount || 0), 0);
    document.getElementById('todayIncome').textContent = `$${todayIncome.toLocaleString()}`;

    document.getElementById('totalToday').textContent = todayHistory.length;
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CO', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(isoString) {
    return `${formatDate(isoString)} ${formatTime(isoString)}`;
}

function calculateElapsedTime(entryTime) {
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now - entry;
    const diffMins = Math.floor(diffMs / 60000);

    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return `${hours}h ${minutes}m`;
}

function renderVehiclesTable() {
    const tbody = document.getElementById('vehiclesTableBody');
    const vehicles = db.getActiveVehicles();

    if (vehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #999;">No hay vehículos en el parqueadero</td></tr>';
        return;
    }

    tbody.innerHTML = vehicles.map(vehicle => `
        <tr>
            <td><strong style="color: #667eea;">${vehicle.verificationCode}</strong></td>
            <td><strong>${vehicle.plate}</strong></td>
            <td>${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</td>
            <td>${vehicle.owner}</td>
            <td>${formatTime(vehicle.entryTime)}</td>
            <td>${calculateElapsedTime(vehicle.entryTime)}</td>
            <td><span class="status-badge status-active">Activo</span></td>
            <td>
                <button class="btn-danger btn-small" onclick="processExitByPlate('${vehicle.plate}')">
                    Salida
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// REGISTRO DE ENTRADA
// ============================================
document.getElementById('entryForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const plate = document.getElementById('plateEntry').value.trim();
    const type = document.getElementById('vehicleType').value;
    const owner = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (db.getActiveVehicles().length >= CAPACIDAD_TOTAL) {
        alert('⚠️ El parqueadero está lleno. No hay espacios disponibles.');
        return;
    }

    if (db.findByPlate(plate)) {
        alert('⚠️ Este vehículo ya está registrado en el parqueadero.');
        return;
    }

    if (!owner || !phone) {
        alert('⚠️ El nombre del propietario y teléfono son obligatorios.');
        return;
    }

    const vehicle = new Vehicle(plate, type, owner, phone);
    db.addVehicle(vehicle);

    showEntryTicket(vehicle);

    e.target.reset();

    updateStats();
    renderVehiclesTable();
});

function showEntryTicket(vehicle) {
    const modal = document.getElementById('entryTicketModal');
    const codeDisplay = document.getElementById('entryCodeDisplay');
    const detailsDiv = document.getElementById('entryTicketDetails');
    const qrContainer = document.getElementById('qrCodeContainer');

    codeDisplay.textContent = vehicle.verificationCode;

    qrContainer.innerHTML = '';
    const qrData = JSON.stringify({
        code: vehicle.verificationCode,
        plate: vehicle.plate,
        entry: vehicle.entryTime
    });

    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrData, { width: 200 }, (error, canvas) => {
            if (!error) {
                qrContainer.appendChild(canvas);
            }
        });
    } else {
        qrContainer.innerHTML = '<p style="color: #999;">QR Code no disponible</p>';
    }

    detailsDiv.innerHTML = `
        <p><strong>Placa:</strong> <span>${vehicle.plate}</span></p>
        <p><strong>Tipo:</strong> <span>${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</span></p>
        <p><strong>Propietario:</strong> <span>${vehicle.owner}</span></p>
        <p><strong>Teléfono:</strong> <span>${vehicle.phone}</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px dashed #ccc;">
        <p><strong>Fecha y Hora:</strong> <span>${formatDateTime(vehicle.entryTime)}</span></p>
        <p><strong>Tarifa:</strong> <span>$${TARIFAS[vehicle.type].toLocaleString()}/hora</span></p>
        <p><strong>Atendido por:</strong> <span>${vehicle.registeredBy}</span></p>
    `;

    modal.style.display = 'flex';
}

function closeEntryTicket() {
    document.getElementById('entryTicketModal').style.display = 'none';
}

// ============================================
// REGISTRO DE SALIDA - SIMPLIFICADO (SOLO PLACA)
// ============================================
document.getElementById('exitForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const plate = document.getElementById('plateExit').value.trim().toUpperCase();

    if (!plate) {
        alert('⚠️ Debe ingresar la placa del vehículo.');
        return;
    }

    processExitByPlate(plate);
});

function processExitByPlate(plate) {
    console.log('Procesando salida de placa:', plate);

    const vehicle = db.findByPlate(plate);

    if (!vehicle) {
        alert('⚠️ No se encontró ningún vehículo con esa placa en el parqueadero.');
        return;
    }

    vehicle.processExit();
    const stay = vehicle.calculateStay();

    generateExitTicket(vehicle, stay);
}

function generateExitTicket(vehicle, stay) {
    const ticketPreview = document.getElementById('ticketPreview');
    const ticketDetails = document.getElementById('ticketDetails');
    const totalAmount = document.getElementById('totalAmount');

    const fracciones = Math.ceil(stay.totalMinutes / FRACCION_MINIMA);

    ticketDetails.innerHTML = `
        <p><strong>Código:</strong> <span>${vehicle.verificationCode}</span></p>
        <p><strong>Placa:</strong> <span>${vehicle.plate}</span></p>
        <p><strong>Tipo:</strong> <span>${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</span></p>
        <p><strong>Propietario:</strong> <span>${vehicle.owner}</span></p>
        <p><strong>Teléfono:</strong> <span>${vehicle.phone}</span></p>
        <hr>
        <p><strong>Entrada:</strong> <span>${formatDateTime(vehicle.entryTime)}</span></p>
        <p><strong>Salida:</strong> <span>${formatDateTime(vehicle.exitTime)}</span></p>
        <p><strong>Tiempo Total:</strong> <span>${stay.hours}h ${stay.minutes}m</span></p>
        <hr>
        <p><strong>Tarifa:</strong> <span>$${TARIFAS[vehicle.type].toLocaleString()}/hora</span></p>
        <p><strong>Fracciones (${FRACCION_MINIMA} min):</strong> <span>${fracciones}</span></p>
    `;

    totalAmount.innerHTML = `TOTAL A PAGAR: $${vehicle.totalAmount.toLocaleString()} COP`;

    ticketPreview.dataset.currentPlate = vehicle.plate;
    ticketPreview.classList.add('active');
    ticketPreview.style.display = 'block';
}

function closeTicket() {
    const ticketPreview = document.getElementById('ticketPreview');
    const plate = ticketPreview.dataset.currentPlate;

    if (plate) {
        db.removeVehicle(plate);
        updateStats();
        renderVehiclesTable();
        alert('✅ Salida registrada exitosamente.');
    }

    ticketPreview.classList.remove('active');
    ticketPreview.style.display = 'none';
    delete ticketPreview.dataset.currentPlate;

    // Limpiar formulario
    document.getElementById('plateExit').value = '';
}

// ============================================
// ACTUALIZACIÓN AUTOMÁTICA
// ============================================
setInterval(() => {
    renderVehiclesTable();
}, 60000);

// Exportar funciones globales
window.logout = logout;
window.processExitByPlate = processExitByPlate;
window.closeTicket = closeTicket;
window.closeEntryTicket = closeEntryTicket;

console.log('Sistema ParkManager v2.0 - Simplificado cargado');
