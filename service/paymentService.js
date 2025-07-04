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
        return await paymentRepository.findPaymentById(id);
    }

    async getPaymentsByPatient(benhNhanId) {
        return await paymentRepository.findPaymentsByPatient(benhNhanId);
    }

    async getPaymentByAppointment(lichKhamId) {
        return await paymentRepository.findPaymentByAppointment(lichKhamId);
    }
}

module.exports = new PaymentService();
