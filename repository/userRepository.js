const { sequelize } = require("../databaseConnection");

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
}

module.exports = new UserRepository();
