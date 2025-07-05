// API Base URL
const API_BASE_URL = 'http://localhost:3000';

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

// Event Listeners
function setupEventListeners() {
    // Patient form
    document.getElementById('patientForm').addEventListener('submit', handlePatientSubmit);

    // Appointment form
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);

    // Payment form
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);

    // Examination form
    document.getElementById('examinationForm').addEventListener('submit', handleExaminationSubmit);

    // Search functionality
    document.getElementById('patientSearch').addEventListener('input', debounce(searchPatients, 300));
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    resetForm(modalId);
}

function resetForm(modalId) {
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
    }
    currentEditingId = null;
    currentEditingType = null;
}

// API calls
async function apiCall(endpoint, options = {}) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        alert('Có lỗi xảy ra: ' + error.message);
        throw error;
    } finally {
        hideLoading();
    }
}

// Dashboard functions
async function loadDashboardData() {
    try {
        // Load statistics
        const [patients, appointments, payments, examinations] = await Promise.all([
            apiCall('/api/patients'),
            apiCall('/api/appointments'),
            apiCall('/api/payments'),
            apiCall('/api/examinations')
        ]);

        // Update dashboard stats
        document.getElementById('totalPatients').textContent = patients.benhNhans?.length || 0;
        document.getElementById('totalAppointments').textContent = appointments.lichKhams?.length || 0;

        // Calculate revenue
        const totalRevenue = payments.thanhToans?.reduce((sum, payment) => sum + (payment.chiPhi || 0), 0) || 0;
        document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);

        document.getElementById('completedExams').textContent = examinations.donKhams?.length || 0;

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Patient functions
async function loadPatients() {
    try {
        const response = await apiCall('/api/patients');
        const patients = response.benhNhans || [];
        renderPatientsTable(patients);
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

function renderPatientsTable(patients) {
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = '';

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.thongTinCaNhan?.hoTen || 'N/A'}</td>
            <td>${formatDate(patient.thongTinCaNhan?.ngaySinh)}</td>
            <td>${patient.thongTinCaNhan?.gioiTinh || 'N/A'}</td>
            <td>${patient.thongTinCaNhan?.soDienThoai || 'N/A'}</td>
            <td>${patient.diaChi || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editPatient(${patient.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="action-btn delete" onclick="deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showPatientModal() {
    showModal('patientModal');
    currentEditingType = 'patient';
}

async function handlePatientSubmit(e) {
    e.preventDefault();

    const formData = {
        thongTinCaNhan: {
            hoTen: document.getElementById('patientName').value,
            ngaySinh: document.getElementById('patientDob').value,
            gioiTinh: document.getElementById('patientGender').value,
            soDienThoai: document.getElementById('patientPhone').value
        },
        diaChi: document.getElementById('patientAddress').value
    };

    try {
        if (currentEditingId) {
            await apiCall(`/api/patients/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify({ benhNhan: formData })
            });
        } else {
            await apiCall('/api/patients', {
                method: 'POST',
                body: JSON.stringify({ benhNhan: formData })
            });
        }

        closeModal('patientModal');
        loadPatients();
        alert('Thành công!');
    } catch (error) {
        console.error('Error saving patient:', error);
    }
}

async function editPatient(id) {
    try {
        const response = await apiCall(`/api/patients/${id}`);
        const patient = response.benhNhan;

        // Fill form with patient data
        document.getElementById('patientName').value = patient.thongTinCaNhan?.hoTen || '';
        document.getElementById('patientDob').value = patient.thongTinCaNhan?.ngaySinh || '';
        document.getElementById('patientGender').value = patient.thongTinCaNhan?.gioiTinh || '';
        document.getElementById('patientPhone').value = patient.thongTinCaNhan?.soDienThoai || '';
        document.getElementById('patientAddress').value = patient.diaChi || '';

        currentEditingId = id;
        showModal('patientModal');
    } catch (error) {
        console.error('Error loading patient:', error);
    }
}

async function deletePatient(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
        try {
            await apiCall(`/api/patients/${id}`, { method: 'DELETE' });
            loadPatients();
            alert('Xóa thành công!');
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    }
}

function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#patientsTable tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Appointment functions
async function loadAppointments() {
    try {
        const response = await apiCall('/api/appointments');
        const appointments = response.lichKhams || [];
        renderAppointmentsTable(appointments);
        await loadPatientOptions();
        await loadDoctorOptions();
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

function renderAppointmentsTable(appointments) {
    const tbody = document.querySelector('#appointmentsTable tbody');
    tbody.innerHTML = '';

    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.benhNhan?.thongTinCaNhan?.hoTen || 'N/A'}</td>
            <td>${appointment.bacSi?.thongTinCaNhan?.hoTen || 'N/A'}</td>
            <td>${formatDateTime(appointment.ngayKham)} ${appointment.gioKham}</td>
            <td><span class="status-badge status-${appointment.trangThai || 'pending'}">${getStatusText(appointment.trangThai)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editAppointment(${appointment.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="action-btn delete" onclick="deleteAppointment(${appointment.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAppointmentModal() {
    showModal('appointmentModal');
    currentEditingType = 'appointment';
}

async function handleAppointmentSubmit(e) {
    e.preventDefault();

    const formData = {
        benhNhanId: parseInt(document.getElementById('appointmentPatient').value),
        bacSiId: parseInt(document.getElementById('appointmentDoctor').value),
        ngayKham: document.getElementById('appointmentDate').value,
        gioKham: document.getElementById('appointmentTime').value,
        trangThai: 'pending'
    };

    try {
        if (currentEditingId) {
            await apiCall(`/api/appointments/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify({ lichKham: formData })
            });
        } else {
            await apiCall('/api/appointments', {
                method: 'POST',
                body: JSON.stringify({ lichKham: formData })
            });
        }

        closeModal('appointmentModal');
        loadAppointments();
        alert('Thành công!');
    } catch (error) {
        console.error('Error saving appointment:', error);
    }
}

// Payment functions
async function loadPayments() {
    try {
        const response = await apiCall('/api/payments');
        const payments = response.thanhToans || [];
        renderPaymentsTable(payments);
        await loadAppointmentOptions();
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

function renderPaymentsTable(payments) {
    const tbody = document.querySelector('#paymentsTable tbody');
    tbody.innerHTML = '';

    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${payment.benhNhan?.thongTinCaNhan?.hoTen || 'N/A'}</td>
            <td>${formatCurrency(payment.chiPhi)}</td>
            <td>${payment.phuongThucThanhToan || 'N/A'}</td>
            <td>${payment.theBhyt || 'Không có'}</td>
            <td><span class="status-badge ${payment.hoanThanh ? 'status-completed' : 'status-pending'}">${payment.hoanThanh ? 'Hoàn thành' : 'Chưa hoàn thành'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editPayment(${payment.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="action-btn delete" onclick="deletePayment(${payment.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showPaymentModal() {
    showModal('paymentModal');
    currentEditingType = 'payment';
}

async function handlePaymentSubmit(e) {
    e.preventDefault();

    const formData = {
        lichKhamId: parseInt(document.getElementById('paymentAppointment').value),
        chiPhi: parseFloat(document.getElementById('paymentAmount').value),
        phuongThucThanhToan: document.getElementById('paymentMethod').value,
        theBhyt: document.getElementById('paymentBhyt').value || null,
        hoanThanh: true
    };

    try {
        if (currentEditingId) {
            await apiCall(`/api/payments/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify({ thanhToan: formData })
            });
        } else {
            await apiCall('/api/payments', {
                method: 'POST',
                body: JSON.stringify({ donKham: formData })
            });
        }

        closeModal('paymentModal');
        loadPayments();
        alert('Thành công!');
    } catch (error) {
        console.error('Error saving payment:', error);
    }
}

// Examination functions
async function loadExaminations() {
    try {
        const response = await apiCall('/api/examinations');
        const examinations = response.donKhams || [];
        renderExaminationsTable(examinations);
    } catch (error) {
        console.error('Error loading examinations:', error);
    }
}

function renderExaminationsTable(examinations) {
    const tbody = document.querySelector('#examinationsTable tbody');
    tbody.innerHTML = '';

    examinations.forEach(examination => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${examination.id}</td>
            <td>${examination.lichKham?.benhNhan?.thongTinCaNhan?.hoTen || 'N/A'}</td>
            <td>${examination.lichKham?.bacSi?.thongTinCaNhan?.hoTen || 'N/A'}</td>
            <td>${examination.chanDoan || 'N/A'}</td>
            <td>${examination.donThuoc || 'N/A'}</td>
            <td>${formatDate(examination.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewExamination(${examination.id})">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                    <button class="action-btn edit" onclick="editExamination(${examination.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="action-btn delete" onclick="deleteExamination(${examination.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showExaminationModal() {
    showModal('examinationModal');
    currentEditingType = 'examination';
}

async function handleExaminationSubmit(e) {
    e.preventDefault();

    const formData = {
        lichKhamId: parseInt(document.getElementById('examinationAppointment').value),
        chanDoan: document.getElementById('examinationDiagnosis').value,
        donThuoc: document.getElementById('examinationPrescription').value
    };

    try {
        if (currentEditingId) {
            await apiCall(`/api/examinations/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify({ donKham: formData })
            });
        } else {
            await apiCall('/api/examinations', {
                method: 'POST',
                body: JSON.stringify({ donKham: formData })
            });
        }

        closeModal('examinationModal');
        loadExaminations();
        alert('Thành công!');
    } catch (error) {
        console.error('Error saving examination:', error);
    }
}

// Load options for selects
async function loadPatientOptions() {
    try {
        const response = await apiCall('/api/patients');
        const patients = response.benhNhans || [];

        const selects = document.querySelectorAll('#appointmentPatient');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Chọn bệnh nhân</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = patient.thongTinCaNhan?.hoTen || `Bệnh nhân ${patient.id}`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading patient options:', error);
    }
}

async function loadDoctorOptions() {
    try {
        const response = await apiCall('/api/doctors');
        const doctors = response.bacSis || [];

        const selects = document.querySelectorAll('#appointmentDoctor');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Chọn bác sĩ</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.thongTinCaNhan?.hoTen || `Bác sĩ ${doctor.id}`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading doctor options:', error);
    }
}

async function loadAppointmentOptions() {
    try {
        const response = await apiCall('/api/appointments');
        const appointments = response.lichKhams || [];

        const selects = document.querySelectorAll('#paymentAppointment, #examinationAppointment');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Chọn lịch khám</option>';
            appointments.forEach(appointment => {
                const option = document.createElement('option');
                option.value = appointment.id;
                option.textContent = `${appointment.benhNhan?.thongTinCaNhan?.hoTen || 'N/A'} - ${formatDate(appointment.ngayKham)}`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading appointment options:', error);
    }
}

function loadAllData() {
    loadPatients();
    loadAppointments();
    loadPayments();
    loadExaminations();
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
}

function formatCurrency(amount) {
    if (!amount) return '0đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ khám',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || 'Chờ khám';
}

// Filter functions
function filterAppointments() {
    const dateFilter = document.getElementById('appointmentDate').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#appointmentsTable tbody tr');

    rows.forEach(row => {
        let showRow = true;

        if (dateFilter) {
            const appointmentDate = row.cells[3].textContent.split(' ')[0];
            const filterDate = new Date(dateFilter).toLocaleDateString('vi-VN');
            showRow = showRow && appointmentDate === filterDate;
        }

        if (statusFilter) {
            const statusElement = row.querySelector('.status-badge');
            showRow = showRow && statusElement.classList.contains(`status-${statusFilter}`);
        }

        row.style.display = showRow ? '' : 'none';
    });
}

// Window click events for modals
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
