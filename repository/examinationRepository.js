const { sequelize } = require("../databaseConnection");
const DonKham = require('../model/donKham');
const LichKham = require('../model/lichKham');
const BenhNhan = require('../model/benhNhan');
const BacSi = require('../model/bacSi');
const ThongTinCaNhan = require('../model/thongTinCaNhan');

class ExaminationRepository {
    async getAllExaminations() {
        try {
            const examinations = await DonKham.findAll({
                include: [
                    {
                        model: LichKham,
                        as: 'lichKham',
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
                    }
                ]
            });
            return examinations;
        } catch (error) {
            throw new Error('Error fetching examinations: ' + error.message);
        }
    }

    async getExaminationById(id) {
        try {
            const examination = await DonKham.findByPk(id, {
                include: [
                    {
                        model: LichKham,
                        as: 'lichKham',
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
                    }
                ]
            });
            return examination;
        } catch (error) {
            throw new Error('Error fetching examination: ' + error.message);
        }
    }

    async createExamination(examinationData) {
        try {
            const examination = await DonKham.create(examinationData);
            return await this.getExaminationById(examination.id);
        } catch (error) {
            throw new Error('Error creating examination: ' + error.message);
        }
    }

    async updateExamination(id, examinationData) {
        try {
            await DonKham.update(examinationData, {
                where: { id: id }
            });
            return await this.getExaminationById(id);
        } catch (error) {
            throw new Error('Error updating examination: ' + error.message);
        }
    }

    async deleteExamination(id) {
        try {
            const result = await DonKham.destroy({
                where: { id: id }
            });
            return result > 0;
        } catch (error) {
            throw new Error('Error deleting examination: ' + error.message);
        }
    }

    async getExaminationsByPatient(benhNhanId) {
        try {
            const examinations = await DonKham.findAll({
                include: [
                    {
                        model: LichKham,
                        as: 'lichKham',
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
                    }
                ]
            });
            return examinations;
        } catch (error) {
            throw new Error('Error fetching examinations by patient: ' + error.message);
        }
    }

    async getExaminationsByDoctor(bacSiId) {
        try {
            const examinations = await DonKham.findAll({
                include: [
                    {
                        model: LichKham,
                        as: 'lichKham',
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
                    }
                ]
            });
            return examinations;
        } catch (error) {
            throw new Error('Error fetching examinations by doctor: ' + error.message);
        }
    }
}

module.exports = new ExaminationRepository();
