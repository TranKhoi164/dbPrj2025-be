const paymentRepository = require("../repository/paymentRepository");
const userRepository = require("../repository/userRepository");
const { sequelize } = require("../databaseConnection");

class PaymentService {
    async createPayment(donKhamData) {
        const { chiPhi, phuongThucThanhToan, hoanThanh, theBhyt, lichKhamId, benhNhanId } = donKhamData;

        const benhNhan = await userRepository.findUserById(benhNhanId);

        // Check if lichKham exists using raw SQL
        const lichKhamQuery = `SELECT id FROM lichkhams WHERE id = ?`;
        const [lichKhamResult] = await sequelize.query(lichKhamQuery, {
            replacements: [lichKhamId],
            type: sequelize.QueryTypes.SELECT
        });

        if (!benhNhan) {
            throw new Error('Không tìm thấy bệnh nhân!');
        }
        if (!lichKhamResult) {
            throw new Error('Không tìm thấy lịch khám!');
        }

        const newPayment = await paymentRepository.createPayment({
            chiPhi,
            phuongThucThanhToan,
            hoanThanh,
            theBhyt,
            lichKhamId,
            benhNhanId,
        });

        return await paymentRepository.findPaymentById(newPayment.id);
    }

    async updatePayment(thanhToanData) {
        const { id, chiPhi, phuongThucThanhToan, hoanThanh, theBhyt } = thanhToanData;
        const updateData = {};

        if (chiPhi !== undefined) updateData.chiPhi = chiPhi;
        if (phuongThucThanhToan !== undefined) updateData.phuongThucThanhToan = phuongThucThanhToan;
        if (hoanThanh !== undefined) updateData.hoanThanh = hoanThanh;
        if (theBhyt !== undefined) updateData.theBhyt = theBhyt;

        await paymentRepository.updatePayment(id, updateData);
        return await paymentRepository.findPaymentById(id);
    }

    async getPaymentById(id) {
        try {
            return await paymentRepository.getPaymentById(id);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getAllPayments() {
        try {
            return await paymentRepository.getAllPayments();
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async deletePayment(id) {
        try {
            return await paymentRepository.deletePayment(id);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getPaymentsByPatient(benhNhanId) {
        try {
            return await paymentRepository.getPaymentsByPatient(benhNhanId);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getPaymentByAppointment(lichKhamId) {
        try {
            return await paymentRepository.getPaymentByAppointment(lichKhamId);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async completePayment(id) {
        try {
            return await paymentRepository.updatePayment(id, { hoanThanh: true });
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async calculateTotalRevenue() {
        try {
            const payments = await paymentRepository.getAllPayments();
            return payments.reduce((total, payment) => total + (payment.chiPhi || 0), 0);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }
}

module.exports = new PaymentService();
