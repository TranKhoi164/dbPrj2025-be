const { sequelize } = require("../databaseConnection");
const LichKham = require('../model/lichKham');
const BenhNhan = require('../model/benhNhan');
const BacSi = require('../model/bacSi');
const ThongTinCaNhan = require('../model/thongTinCaNhan');

class AppointmentRepository {
    async getAllAppointments() {
        try {
            const appointments = await LichKham.findAll({
                include: [
                    {
                        model: BenhNhan,
                        as: 'benhNhan',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    },
                    {
                        model: BacSi,
                        as: 'bacSi',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    }
                ]
            });
            return appointments;
        } catch (error) {
            throw new Error('Error fetching appointments: ' + error.message);
        }
    }

    async getAppointmentById(id) {
        try {
            const appointment = await LichKham.findByPk(id, {
                include: [
                    {
                        model: BenhNhan,
                        as: 'benhNhan',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    },
                    {
                        model: BacSi,
                        as: 'bacSi',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    }
                ]
            });
            return appointment;
        } catch (error) {
            throw new Error('Error fetching appointment: ' + error.message);
        }
    }

    async createAppointment(appointmentData) {
        try {
            const appointment = await LichKham.create(appointmentData);
            return await this.getAppointmentById(appointment.id);
        } catch (error) {
            throw new Error('Error creating appointment: ' + error.message);
        }
    }

    async updateAppointment(id, appointmentData) {
        try {
            await LichKham.update(appointmentData, {
                where: { id: id }
            });
            return await this.getAppointmentById(id);
        } catch (error) {
            throw new Error('Error updating appointment: ' + error.message);
        }
    }

    async deleteAppointment(id) {
        try {
            const result = await LichKham.destroy({
                where: { id: id }
            });
            return result > 0;
        } catch (error) {
            throw new Error('Error deleting appointment: ' + error.message);
        }
    }

    async getAppointmentsByPatient(benhNhanId) {
        try {
            const appointments = await LichKham.findAll({
                where: { benhNhanId: benhNhanId },
                include: [
                    {
                        model: BenhNhan,
                        as: 'benhNhan',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    },
                    {
                        model: BacSi,
                        as: 'bacSi',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    }
                ]
            });
            return appointments;
        } catch (error) {
            throw new Error('Error fetching appointments by patient: ' + error.message);
        }
    }

    async getAppointmentsByDoctor(bacSiId) {
        try {
            const appointments = await LichKham.findAll({
                where: { bacSiId: bacSiId },
                include: [
                    {
                        model: BenhNhan,
                        as: 'benhNhan',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    },
                    {
                        model: BacSi,
                        as: 'bacSi',
                        include: [{
                            model: ThongTinCaNhan,
                            as: 'thongTinCaNhan'
                        }]
                    }
                ]
            });
            return appointments;
        } catch (error) {
            throw new Error('Error fetching appointments by doctor: ' + error.message);
        }
    }
}

module.exports = new AppointmentRepository();
