const { sequelize } = require("../databaseConnection");
const ThanhToan = require('../model/thanhToan');
const BenhNhan = require('../model/benhNhan');
const LichKham = require('../model/lichKham');
const ThongTinCaNhan = require('../model/thongTinCaNhan');

class PaymentRepository {
    async getAllPayments() {
        try {
            const payments = await ThanhToan.findAll({
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
                        model: LichKham,
                        as: 'lichKham'
                    }
                ]
            });
            return payments;
        } catch (error) {
            throw new Error('Error fetching payments: ' + error.message);
        }
    }

    async getPaymentById(id) {
        try {
            const payment = await ThanhToan.findByPk(id, {
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
                        model: LichKham,
                        as: 'lichKham'
                    }
                ]
            });
            return payment;
        } catch (error) {
            throw new Error('Error fetching payment: ' + error.message);
        }
    }

    async createPayment(paymentData) {
        try {
            const payment = await ThanhToan.create(paymentData);
            return await this.getPaymentById(payment.id);
        } catch (error) {
            throw new Error('Error creating payment: ' + error.message);
        }
    }

    async updatePayment(id, paymentData) {
        try {
            await ThanhToan.update(paymentData, {
                where: { id: id }
            });
            return await this.getPaymentById(id);
        } catch (error) {
            throw new Error('Error updating payment: ' + error.message);
        }
    }

    async deletePayment(id) {
        try {
            const result = await ThanhToan.destroy({
                where: { id: id }
            });
            return result > 0;
        } catch (error) {
            throw new Error('Error deleting payment: ' + error.message);
        }
    }

    async getPaymentsByPatient(benhNhanId) {
        try {
            const payments = await ThanhToan.findAll({
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
                        model: LichKham,
                        as: 'lichKham'
                    }
                ]
            });
            return payments;
        } catch (error) {
            throw new Error('Error fetching payments by patient: ' + error.message);
        }
    }

    async getPaymentByAppointment(lichKhamId) {
        try {
            const payment = await ThanhToan.findOne({
                where: { lichKhamId: lichKhamId },
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
                        model: LichKham,
                        as: 'lichKham'
                    }
                ]
            });
            return payment;
        } catch (error) {
            throw new Error('Error fetching payment by appointment: ' + error.message);
        }
    }
}

module.exports = new PaymentRepository();
