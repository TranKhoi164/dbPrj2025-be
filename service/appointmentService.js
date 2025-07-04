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

    async getAppointmentById(id) {
        return await appointmentRepository.findAppointmentById(id);
    }

    async completeAppointment(id) {
        await appointmentRepository.updateAppointmentStatus(id, 'hoan_thanh');
        return { message: "Hoàn thành lịch khám thành công!" };
    }
}

module.exports = new AppointmentService();
