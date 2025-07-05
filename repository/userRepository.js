const { sequelize } = require("../databaseConnection");
const BenhNhan = require('../model/benhNhan');
const ThongTinCaNhan = require('../model/thongTinCaNhan');
const BacSi = require('../model/bacSi');

class UserRepository {
    async createUser(userData, includes = []) {
        const transaction = await sequelize.transaction();
        try {
            // Insert into thongtincanhans table
            const insertUserQuery = `
                INSERT INTO thongtincanhans (CCCD, ten, ngaySinh, gioiTinh, sdt) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const [userResult] = await sequelize.query(insertUserQuery, {
                replacements: [userData.CCCD, userData.ten, userData.ngaySinh, userData.gioiTinh, userData.sdt],
                transaction
            });

            const userId = userResult;

            // Insert into related table based on includes
            if (includes.length > 0) {
                const includeModel = includes[0];
                if (includeModel.as === "bacSi" && userData.bacSi) {
                    const insertDoctorQuery = `
                        INSERT INTO bacsis (thongTinCaNhanId, namKinhNghiem, caTruc) 
                        VALUES (?, ?, ?)
                    `;
                    await sequelize.query(insertDoctorQuery, {
                        replacements: [userId, userData.bacSi.namKinhNghiem, userData.bacSi.caTruc],
                        transaction
                    });
                } else if (includeModel.as === "benhNhan" && userData.benhNhan) {
                    const insertPatientQuery = `
                        INSERT INTO benhnhans (thongTinCaNhanId, diaChi) 
                        VALUES (?, ?)
                    `;
                    await sequelize.query(insertPatientQuery, {
                        replacements: [userId, userData.benhNhan.diaChi],
                        transaction
                    });
                }
            }

            await transaction.commit();
            return { id: userId };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findUserById(id) {
        const query = `
            SELECT 
                t.id, t.CCCD, t.ten, t.ngaySinh, t.gioiTinh, t.sdt,
                b.id as benhNhan_id, b.diaChi as benhNhan_diaChi,
                bs.id as bacSi_id, bs.namKinhNghiem as bacSi_namKinhNghiem, bs.caTruc as bacSi_caTruc
            FROM thongtincanhans t
            LEFT JOIN benhnhans b ON t.id = b.thongTinCaNhanId
            LEFT JOIN bacsis bs ON t.id = bs.thongTinCaNhanId
            WHERE t.id = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.SELECT
        });

        if (!results) return null;

        return {
            dataValues: {
                id: results.id,
                CCCD: results.CCCD,
                ten: results.ten,
                ngaySinh: results.ngaySinh,
                gioiTinh: results.gioiTinh,
                sdt: results.sdt,
                benhNhan: results.benhNhan_id ? {
                    id: results.benhNhan_id,
                    diaChi: results.benhNhan_diaChi
                } : null,
                bacSi: results.bacSi_id ? {
                    id: results.bacSi_id,
                    namKinhNghiem: results.bacSi_namKinhNghiem,
                    caTruc: results.bacSi_caTruc
                } : null
            }
        };
    }

    async findUserByCCCD(CCCD) {
        const query = `
            SELECT 
                t.id, t.CCCD, t.ten, t.ngaySinh, t.gioiTinh, t.sdt,
                b.id as benhNhan_id, b.diaChi as benhNhan_diaChi,
                bs.id as bacSi_id, bs.namKinhNghiem as bacSi_namKinhNghiem, bs.caTruc as bacSi_caTruc
            FROM thongtincanhans t
            LEFT JOIN benhnhans b ON t.id = b.thongTinCaNhanId
            LEFT JOIN bacsis bs ON t.id = bs.thongTinCaNhanId
            WHERE t.CCCD = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [CCCD],
            type: sequelize.QueryTypes.SELECT
        });

        if (!results) return null;

        return {
            dataValues: {
                id: results.id,
                CCCD: results.CCCD,
                ten: results.ten,
                ngaySinh: results.ngaySinh,
                gioiTinh: results.gioiTinh,
                sdt: results.sdt,
                benhNhan: results.benhNhan_id ? {
                    id: results.benhNhan_id,
                    diaChi: results.benhNhan_diaChi
                } : null,
                bacSi: results.bacSi_id ? {
                    id: results.bacSi_id,
                    namKinhNghiem: results.bacSi_namKinhNghiem,
                    caTruc: results.bacSi_caTruc
                } : null
            }
        };
    }

    async findAllDoctors() {
        const query = `
            SELECT 
                t.id, t.CCCD, t.ten, t.ngaySinh, t.gioiTinh, t.sdt,
                bs.id as bacSi_id, bs.namKinhNghiem as bacSi_namKinhNghiem, bs.caTruc as bacSi_caTruc
            FROM thongtincanhans t
            INNER JOIN bacsis bs ON t.id = bs.thongTinCaNhanId
        `;
        const [results] = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });

        return results.map(row => ({
            dataValues: {
                id: row.id,
                CCCD: row.CCCD,
                ten: row.ten,
                ngaySinh: row.ngaySinh,
                gioiTinh: row.gioiTinh,
                sdt: row.sdt,
                bacSi: {
                    id: row.bacSi_id,
                    namKinhNghiem: row.bacSi_namKinhNghiem,
                    caTruc: row.bacSi_caTruc
                }
            }
        }));
    }

    // Patient repository functions
    async getAllPatients() {
        try {
            const patients = await BenhNhan.findAll({
                include: [{
                    model: ThongTinCaNhan,
                    as: 'thongTinCaNhan'
                }]
            });
            return patients;
        } catch (error) {
            throw new Error('Error fetching patients: ' + error.message);
        }
    }

    async getPatientById(id) {
        try {
            const patient = await BenhNhan.findByPk(id, {
                include: [{
                    model: ThongTinCaNhan,
                    as: 'thongTinCaNhan'
                }]
            });
            return patient;
        } catch (error) {
            throw new Error('Error fetching patient: ' + error.message);
        }
    }

    async createPatient(patientData) {
        try {
            // First create ThongTinCaNhan
            const thongTinCaNhan = await ThongTinCaNhan.create(patientData.thongTinCaNhan);

            // Then create BenhNhan with reference to ThongTinCaNhan
            const patient = await BenhNhan.create({
                thongTinCaNhanId: thongTinCaNhan.id,
                diaChi: patientData.diaChi
            });

            return await this.getPatientById(patient.id);
        } catch (error) {
            throw new Error('Error creating patient: ' + error.message);
        }
    }

    async updatePatient(id, patientData) {
        try {
            const patient = await BenhNhan.findByPk(id);
            if (!patient) {
                throw new Error('Patient not found');
            }

            // Update ThongTinCaNhan
            if (patientData.thongTinCaNhan) {
                await ThongTinCaNhan.update(patientData.thongTinCaNhan, {
                    where: { id: patient.thongTinCaNhanId }
                });
            }

            // Update BenhNhan
            await BenhNhan.update({
                diaChi: patientData.diaChi
            }, {
                where: { id: id }
            });

            return await this.getPatientById(id);
        } catch (error) {
            throw new Error('Error updating patient: ' + error.message);
        }
    }

    async deletePatient(id) {
        try {
            const patient = await BenhNhan.findByPk(id);
            if (!patient) {
                throw new Error('Patient not found');
            }

            // Delete ThongTinCaNhan first
            await ThongTinCaNhan.destroy({
                where: { id: patient.thongTinCaNhanId }
            });

            // Delete BenhNhan
            await BenhNhan.destroy({
                where: { id: id }
            });

            return true;
        } catch (error) {
            throw new Error('Error deleting patient: ' + error.message);
        }
    }

    // Doctor repository functions
    async getAllDoctors() {
        try {
            const doctors = await BacSi.findAll({
                include: [{
                    model: ThongTinCaNhan,
                    as: 'thongTinCaNhan'
                }]
            });
            return doctors;
        } catch (error) {
            throw new Error('Error fetching doctors: ' + error.message);
        }
    }

    async getDoctorById(id) {
        try {
            const doctor = await BacSi.findByPk(id, {
                include: [{
                    model: ThongTinCaNhan,
                    as: 'thongTinCaNhan'
                }]
            });
            return doctor;
        } catch (error) {
            throw new Error('Error fetching doctor: ' + error.message);
        }
    }
}

module.exports = new UserRepository();
