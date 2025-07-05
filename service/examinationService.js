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

    async getAllExaminations() {
        try {
            return await examinationRepository.getAllExaminations();
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getExaminationById(id) {
        try {
            return await examinationRepository.getExaminationById(id);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async createExamination(examinationData) {
        try {
            // Validate examination data
            if (!examinationData.lichKhamId) {
                throw new Error('Appointment ID is required');
            }

            if (!examinationData.chanDoan || !examinationData.donThuoc) {
                throw new Error('Diagnosis and prescription are required');
            }

            return await examinationRepository.createExamination(examinationData);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async updateExamination(id, examinationData) {
        try {
            return await examinationRepository.updateExamination(id, examinationData);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async deleteExamination(id) {
        try {
            return await examinationRepository.deleteExamination(id);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getExaminationsByPatient(benhNhanId) {
        try {
            return await examinationRepository.getExaminationsByPatient(benhNhanId);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async getExaminationsByDoctor(bacSiId) {
        try {
            return await examinationRepository.getExaminationsByDoctor(bacSiId);
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }

    async completeExamination(id) {
        try {
            return await examinationRepository.updateExamination(id, { trangThai: 'completed' });
        } catch (error) {
            throw new Error('Service error: ' + error.message);
        }
    }
}

module.exports = new ExaminationService();
