const { sequelize } = require("../databaseConnection");

class ExaminationRepository {
    async createExamination(examinationData) {
        const query = `
            INSERT INTO donkhams (benhLy, mucDoBenh, dieuTri, lichKhamId, benhNhanId, bacSiId) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await sequelize.query(query, {
            replacements: [
                examinationData.benhLy,
                examinationData.mucDoBenh,
                examinationData.dieuTri,
                examinationData.lichKhamId,
                examinationData.benhNhanId,
                examinationData.bacSiId
            ]
        });

        return { id: result };
    }

    async findExaminationById(id) {
        const query = `
            SELECT 
                d.id, d.benhLy, d.mucDoBenh, d.dieuTri, d.lichKhamId, d.benhNhanId, d.bacSiId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                bs.id as bacSi_id, bs.CCCD as bacSi_CCCD, bs.ten as bacSi_ten, 
                bs.ngaySinh as bacSi_ngaySinh, bs.gioiTinh as bacSi_gioiTinh, bs.sdt as bacSi_sdt
            FROM donkhams d
            LEFT JOIN thongtincanhans bn ON d.benhNhanId = bn.id
            LEFT JOIN thongtincanhans bs ON d.bacSiId = bs.id
            WHERE d.id = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.SELECT
        });

        if (!results) return null;

        return {
            dataValues: {
                id: results.id,
                benhLy: results.benhLy,
                mucDoBenh: results.mucDoBenh,
                dieuTri: results.dieuTri,
                lichKhamId: results.lichKhamId,
                benhNhanId: results.benhNhanId,
                bacSiId: results.bacSiId,
                benhNhan: results.benhNhan_id ? {
                    id: results.benhNhan_id,
                    CCCD: results.benhNhan_CCCD,
                    ten: results.benhNhan_ten,
                    ngaySinh: results.benhNhan_ngaySinh,
                    gioiTinh: results.benhNhan_gioiTinh,
                    sdt: results.benhNhan_sdt
                } : null,
                bacSi: results.bacSi_id ? {
                    id: results.bacSi_id,
                    CCCD: results.bacSi_CCCD,
                    ten: results.bacSi_ten,
                    ngaySinh: results.bacSi_ngaySinh,
                    gioiTinh: results.bacSi_gioiTinh,
                    sdt: results.bacSi_sdt
                } : null
            }
        };
    }

    async updateExamination(id, updateData) {
        const fields = [];
        const values = [];

        if (updateData.benhLy !== undefined) {
            fields.push('benhLy = ?');
            values.push(updateData.benhLy);
        }
        if (updateData.mucDoBenh !== undefined) {
            fields.push('mucDoBenh = ?');
            values.push(updateData.mucDoBenh);
        }
        if (updateData.dieuTri !== undefined) {
            fields.push('dieuTri = ?');
            values.push(updateData.dieuTri);
        }

        if (fields.length === 0) {
            return [0]; // No fields to update
        }

        values.push(id);

        const query = `
            UPDATE donkhams 
            SET ${fields.join(', ')} 
            WHERE id = ?
        `;

        const [result] = await sequelize.query(query, {
            replacements: values
        });

        return result;
    }

    async findExaminationsByPatient(benhNhanId) {
        const query = `
            SELECT 
                d.id, d.benhLy, d.mucDoBenh, d.dieuTri, d.lichKhamId, d.benhNhanId, d.bacSiId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                bs.id as bacSi_id, bs.CCCD as bacSi_CCCD, bs.ten as bacSi_ten, 
                bs.ngaySinh as bacSi_ngaySinh, bs.gioiTinh as bacSi_gioiTinh, bs.sdt as bacSi_sdt
            FROM donkhams d
            LEFT JOIN thongtincanhans bn ON d.benhNhanId = bn.id
            LEFT JOIN thongtincanhans bs ON d.bacSiId = bs.id
            WHERE d.benhNhanId = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [benhNhanId],
            type: sequelize.QueryTypes.SELECT
        });

        return results.map(row => ({
            dataValues: {
                id: row.id,
                benhLy: row.benhLy,
                mucDoBenh: row.mucDoBenh,
                dieuTri: row.dieuTri,
                lichKhamId: row.lichKhamId,
                benhNhanId: row.benhNhanId,
                bacSiId: row.bacSiId,
                benhNhan: row.benhNhan_id ? {
                    id: row.benhNhan_id,
                    CCCD: row.benhNhan_CCCD,
                    ten: row.benhNhan_ten,
                    ngaySinh: row.benhNhan_ngaySinh,
                    gioiTinh: row.benhNhan_gioiTinh,
                    sdt: row.benhNhan_sdt
                } : null,
                bacSi: row.bacSi_id ? {
                    id: row.bacSi_id,
                    CCCD: row.bacSi_CCCD,
                    ten: row.bacSi_ten,
                    ngaySinh: row.bacSi_ngaySinh,
                    gioiTinh: row.bacSi_gioiTinh,
                    sdt: row.bacSi_sdt
                } : null
            }
        }));
    }

    async findExaminationsByDoctor(bacSiId) {
        const query = `
            SELECT 
                d.id, d.benhLy, d.mucDoBenh, d.dieuTri, d.lichKhamId, d.benhNhanId, d.bacSiId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                bs.id as bacSi_id, bs.CCCD as bacSi_CCCD, bs.ten as bacSi_ten, 
                bs.ngaySinh as bacSi_ngaySinh, bs.gioiTinh as bacSi_gioiTinh, bs.sdt as bacSi_sdt
            FROM donkhams d
            LEFT JOIN thongtincanhans bn ON d.benhNhanId = bn.id
            LEFT JOIN thongtincanhans bs ON d.bacSiId = bs.id
            WHERE d.bacSiId = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [bacSiId],
            type: sequelize.QueryTypes.SELECT
        });

        return results.map(row => ({
            dataValues: {
                id: row.id,
                benhLy: row.benhLy,
                mucDoBenh: row.mucDoBenh,
                dieuTri: row.dieuTri,
                lichKhamId: row.lichKhamId,
                benhNhanId: row.benhNhanId,
                bacSiId: row.bacSiId,
                benhNhan: row.benhNhan_id ? {
                    id: row.benhNhan_id,
                    CCCD: row.benhNhan_CCCD,
                    ten: row.benhNhan_ten,
                    ngaySinh: row.benhNhan_ngaySinh,
                    gioiTinh: row.benhNhan_gioiTinh,
                    sdt: row.benhNhan_sdt
                } : null,
                bacSi: row.bacSi_id ? {
                    id: row.bacSi_id,
                    CCCD: row.bacSi_CCCD,
                    ten: row.bacSi_ten,
                    ngaySinh: row.bacSi_ngaySinh,
                    gioiTinh: row.bacSi_gioiTinh,
                    sdt: row.bacSi_sdt
                } : null
            }
        }));
    }
}

module.exports = new ExaminationRepository();
