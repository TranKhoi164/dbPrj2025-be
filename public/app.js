// API Base URL - Updated to match your backend port
const API_BASE_URL = 'http://localhost:5000';

// Global variables
let currentEditingId = null;
let currentEditingType = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadDashboardData();
    loadAllData();
    setupEventListeners();
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        ...options
    };

    try {
        console.log(`Making API request to: ${url}`);
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Lỗi kết nối API: ' + error.message, 'error');
        throw error;
    }
}

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            switchSection(targetSection);

            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    document.getElementById(sectionName).classList.add('active');

    // Load data for the section
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'patients':
            loadPatients();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'payments':
            loadPayments();
            break;
        case 'examinations':
            loadExaminations();
            break;
    }
}

// Dashboard Data Loading
async function loadDashboardData() {
    try {
        console.log('Loading dashboard data...');

        // Load stats from different endpoints
        const [appointmentsData, paymentsData, examinationsData] = await Promise.allSettled([
            apiRequest('/api/appointments'),
            apiRequest('/api/payments'),
            apiRequest('/api/examinations')
        ]);

        // Update dashboard stats
        const totalPatientsElement = document.getElementById('totalPatients');
        const totalAppointmentsElement = document.getElementById('totalAppointments');
        const totalPaymentsElement = document.getElementById('totalPayments');
        const totalExaminationsElement = document.getElementById('totalExaminations');

        if (appointmentsData.status === 'fulfilled' && appointmentsData.value) {
            const appointments = appointmentsData.value.lichKhams || [];
            if (totalAppointmentsElement) {
                totalAppointmentsElement.textContent = appointments.length;
            }
        }

        if (paymentsData.status === 'fulfilled' && paymentsData.value) {
            const payments = paymentsData.value.thanhToans || [];
            if (totalPaymentsElement) {
                totalPaymentsElement.textContent = payments.length;
            }
        }

        if (examinationsData.status === 'fulfilled' && examinationsData.value) {
            const examinations = examinationsData.value.donKhams || [];
            if (totalExaminationsElement) {
                totalExaminationsElement.textContent = examinations.length;
            }
        }

        showNotification('Dữ liệu tổng quan đã được tải thành công!', 'success');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Lỗi khi tải dữ liệu tổng quan', 'error');
    }
}

// Load Patients Data
async function loadPatients() {
    try {
        console.log('Loading patients data...');
        const data = await apiRequest('/api/patients');

        const patientsList = document.getElementById('patientsList');
        if (patientsList && data.benhNhans) {
            displayPatients(data.benhNhans);
        }
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Load Appointments Data
async function loadAppointments() {
    try {
        console.log('Loading appointments data...');
        const data = await apiRequest('/api/appointments');

        const appointmentsList = document.getElementById('appointmentsList');
        if (appointmentsList && data.lichKhams) {
            displayAppointments(data.lichKhams);
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

// Load Payments Data
async function loadPayments() {
    try {
        console.log('Loading payments data...');
        const data = await apiRequest('/api/payments');

        const paymentsList = document.getElementById('paymentsList');
        if (paymentsList && data.thanhToans) {
            displayPayments(data.thanhToans);
        }
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

// Load Examinations Data
async function loadExaminations() {
    try {
        console.log('Loading examinations data...');
        const data = await apiRequest('/api/examinations');

        const examinationsList = document.getElementById('examinationsList');
        if (examinationsList && data.donKhams) {
            displayExaminations(data.donKhams);
        }
    } catch (error) {
        console.error('Error loading examinations:', error);
    }
}

// Display Functions
function displayPatients(patients) {
    const patientsList = document.getElementById('patientsList');
    if (!patientsList) return;

    patientsList.innerHTML = patients.map(patient => `
        <div class="data-item">
            <div class="item-info">
                <h3>${patient.hoTen || 'N/A'}</h3>
                <p><strong>Email:</strong> ${patient.email || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> ${patient.soDienThoai || 'N/A'}</p>
                <p><strong>Ngày sinh:</strong> ${patient.ngaySinh || 'N/A'}</p>
                <p><strong>Giới tính:</strong> ${patient.gioiTinh || 'N/A'}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editPatient(${patient.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-delete" onclick="deletePatient(${patient.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;

    appointmentsList.innerHTML = appointments.map(appointment => `
        <div class="data-item">
            <div class="item-info">
                <h3>Lịch khám #${appointment.id}</h3>
                <p><strong>Ngày:</strong> ${appointment.ngay || 'N/A'}</p>
                <p><strong>Giờ:</strong> ${appointment.gio || 'N/A'}</p>
                <p><strong>Bệnh nhân ID:</strong> ${appointment.benhNhanId || 'N/A'}</p>
                <p><strong>Bác sĩ ID:</strong> ${appointment.bacSiId || 'N/A'}</p>
                <p><strong>Trạng thái:</strong> ${appointment.trangThai || 'N/A'}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editAppointment(${appointment.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-delete" onclick="deleteAppointment(${appointment.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function displayPayments(payments) {
    const paymentsList = document.getElementById('paymentsList');
    if (!paymentsList) return;

    paymentsList.innerHTML = payments.map(payment => `
        <div class="data-item">
            <div class="item-info">
                <h3>Thanh toán #${payment.id}</h3>
                <p><strong>Số tiền:</strong> ${payment.soTien || 'N/A'} VND</p>
                <p><strong>Ngày thanh toán:</strong> ${payment.ngayThanhToan || 'N/A'}</p>
                <p><strong>Phương thức:</strong> ${payment.phuongThuc || 'N/A'}</p>
                <p><strong>Trạng thái:</strong> ${payment.trangThai || 'N/A'}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editPayment(${payment.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-delete" onclick="deletePayment(${payment.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function displayExaminations(examinations) {
    const examinationsList = document.getElementById('examinationsList');
    if (!examinationsList) return;

    examinationsList.innerHTML = examinations.map(examination => `
        <div class="data-item">
            <div class="item-info">
                <h3>Đơn khám #${examination.id}</h3>
                <p><strong>Ngày khám:</strong> ${examination.ngayKham || 'N/A'}</p>
                <p><strong>Chẩn đoán:</strong> ${examination.chanDoan || 'N/A'}</p>
                <p><strong>Đơn thuốc:</strong> ${examination.donThuoc || 'N/A'}</p>
                <p><strong>Ghi chú:</strong> ${examination.ghiChu || 'N/A'}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-edit" onclick="editExamination(${examination.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-delete" onclick="deleteExamination(${examination.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

// Load all data function
async function loadAllData() {
    try {
        await loadDashboardData();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Add event listeners for forms, buttons, etc.
    console.log('Event listeners setup complete');
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Placeholder functions for CRUD operations
function editPatient(id) {
    console.log('Edit patient:', id);
    showNotification('Chức năng chỉnh sửa bệnh nhân đang phát triển', 'info');
}

function deletePatient(id) {
    console.log('Delete patient:', id);
    showNotification('Chức năng xóa bệnh nhân đang phát triển', 'info');
}

function editAppointment(id) {
    console.log('Edit appointment:', id);
    showNotification('Chức năng chỉnh sửa lịch khám đang phát triển', 'info');
}

function deleteAppointment(id) {
    console.log('Delete appointment:', id);
    showNotification('Chức năng xóa lịch khám đang phát triển', 'info');
}

function editPayment(id) {
    console.log('Edit payment:', id);
    showNotification('Chức năng chỉnh sửa thanh toán đang phát triển', 'info');
}

function deletePayment(id) {
    console.log('Delete payment:', id);
    showNotification('Chức năng xóa thanh toán đang phát triển', 'info');
}

function editExamination(id) {
    console.log('Edit examination:', id);
    showNotification('Chức năng chỉnh sửa đơn khám đang phát triển', 'info');
}

function deleteExamination(id) {
    console.log('Delete examination:', id);
    showNotification('Chức năng xóa đơn khám đang phát triển', 'info');
}
