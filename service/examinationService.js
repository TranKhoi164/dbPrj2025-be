const examinationRepository = require("../repository/examinationRepository");
const userRepository = require("../repository/userRepository");
const { sequelize } = require("../databaseConnection");

class ExaminationService {
    async createExamination(donKhamData) {
        const { benhLy, mucDoBenh, dieuTri, lichKhamId, benhNhanId, bacSiId } = donKhamData;

        const benhNhan = await userRepository.findUserById(benhNhanId);
        const bacSi = await userRepository.findUserById(bacSiId);

        // Check if lichKham exists using raw SQL
        const lichKhamQuery = `SELECT id FROM lichkhams WHERE id = ?`;
        const [lichKhamResult] = await sequelize.query(lichKhamQuery, {
            replacements: [lichKhamId],
            type: sequelize.QueryTypes.SELECT
        });

        if (!benhNhan || !bacSi) {
            throw new Error('Không tìm thấy bệnh nhân hoặc bác sĩ!');
        }
        if (!lichKhamResult) {
            throw new Error('Không tìm thấy lịch khám');
        }

        const newExamination = await examinationRepository.createExamination({
            benhLy,
            mucDoBenh,
            dieuTri,
            lichKhamId,
            benhNhanId,
            bacSiId
        });

        return await examinationRepository.findExaminationById(newExamination.id);
    }

    async updateExamination(donKhamData) {
        const { id, benhLy, mucDoBenh, dieuTri } = donKhamData;
        const updateData = {};

        if (benhLy !== undefined) updateData.benhLy = benhLy;
        if (mucDoBenh !== undefined) updateData.mucDoBenh = mucDoBenh;
        if (dieuTri !== undefined) updateData.dieuTri = dieuTri;

        await examinationRepository.updateExamination(id, updateData);
        return await examinationRepository.findExaminationById(id);
    }

    async getExaminationById(id) {
        return await examinationRepository.findExaminationById(id);
    }

    async getExaminationsByPatient(benhNhanId) {
        return await examinationRepository.findExaminationsByPatient(benhNhanId);
    }

    async getExaminationsByDoctor(bacSiId) {
        return await examinationRepository.findExaminationsByDoctor(bacSiId);
    }
}

module.exports = new ExaminationService();
