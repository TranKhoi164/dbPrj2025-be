const appointmentRepository = require("../repository/appointmentRepository");
const userRepository = require("../repository/userRepository");
const { Op } = require('sequelize');

class AppointmentService {
    async createAppointment(lichKhamData) {
        const { ngay, gio, benhNhanId, bacSiId } = lichKhamData;

        const benhNhan = await userRepository.findUserById(benhNhanId);
        const bacSi = await userRepository.findUserById(bacSiId);

        if (!benhNhan || !bacSi) {
            throw new Error('Không tìm thấy bệnh nhân hoặc bác sĩ!');
        }

        const newAppointment = await appointmentRepository.createAppointment({
            ngay,
            gio,
            benhNhanId,
            bacSiId,
            trangThai: 'cho'
        });

        return await appointmentRepository.findAppointmentById(newAppointment.id);
    }

    async getPatientSchedule(benhNhanId) {
        return await appointmentRepository.findAppointmentsByPatient(benhNhanId);
    }

    async cancelAppointment(id) {
        await appointmentRepository.updateAppointmentStatus(id, 'huy');
        return { message: "Thành công" };
    }

    async getDoctorSchedule(bacSiId, ngayBatDau, ngayKetThuc) {
        const whereClause = {};

        if (ngayBatDau && ngayKetThuc) {
            whereClause.ngay = {
                [Op.between]: [new Date(ngayBatDau), new Date(ngayKetThuc)]
            };
        } else if (ngayBatDau) {
            whereClause.ngay = {
                [Op.gte]: new Date(ngayBatDau)
            };
        } else {
            whereClause.ngay = {
                [Op.gte]: new Date()
            };
        }

        return await appointmentRepository.findAppointmentsByDoctor(bacSiId, whereClause);
    }

    async markAsBusy(lichKhamData) {
        const { ngay, gio, bacSiId } = lichKhamData;

        const existingAppointment = await appointmentRepository.findExistingAppointment(ngay, gio, bacSiId);

        if (existingAppointment) {
            throw new Error('Bác sĩ đã có lịch hẹn vào thời gian này!');
        }

        const newAppointment = await appointmentRepository.createAppointment({
            ngay,
            gio,
            bacSiId,
            benhNhanId: null,
            trangThai: 'ban'
        });

        return await appointmentRepository.findAppointmentById(newAppointment.id);
    }

    async getAllAppointments() {
        try {
            return await appointmentRepository.getAllAppointments();
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getAppointmentById(id) {
        try {
            return await appointmentRepository.getAppointmentById(id);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async updateAppointment(id, appointmentData) {
        try {
            return await appointmentRepository.updateAppointment(id, appointmentData);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async deleteAppointment(id) {
        try {
            return await appointmentRepository.deleteAppointment(id);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getAppointmentsByPatient(benhNhanId) {
        try {
            return await appointmentRepository.getAppointmentsByPatient(benhNhanId);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getAppointmentsByDoctor(bacSiId) {
        try {
            return await appointmentRepository.getAppointmentsByDoctor(bacSiId);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }
}

module.exports = new AppointmentService();
