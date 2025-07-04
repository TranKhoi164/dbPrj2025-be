const { sequelize } = require("../databaseConnection");

class AppointmentRepository {
    async createAppointment(appointmentData) {
        const query = `
            INSERT INTO lichkhams (ngay, gio, benhNhanId, bacSiId, trangThai) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await sequelize.query(query, {
            replacements: [
                appointmentData.ngay,
                appointmentData.gio,
                appointmentData.benhNhanId,
                appointmentData.bacSiId,
                appointmentData.trangThai
            ]
        });

        return { id: result };
    }

    async findAppointmentById(id) {
        const query = `
            SELECT 
                l.id, l.ngay, l.gio, l.trangThai, l.benhNhanId, l.bacSiId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                bs.id as bacSi_id, bs.CCCD as bacSi_CCCD, bs.ten as bacSi_ten, 
                bs.ngaySinh as bacSi_ngaySinh, bs.gioiTinh as bacSi_gioiTinh, bs.sdt as bacSi_sdt
            FROM lichkhams l
            LEFT JOIN thongtincanhans bn ON l.benhNhanId = bn.id
            LEFT JOIN thongtincanhans bs ON l.bacSiId = bs.id
            WHERE l.id = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [id],
            type: sequelize.QueryTypes.SELECT
        });

        if (!results) return null;

        return {
            dataValues: {
                id: results.id,
                ngay: results.ngay,
                gio: results.gio,
                trangThai: results.trangThai,
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

    async findAppointmentsByPatient(benhNhanId) {
        const query = `
            SELECT 
                l.id, l.ngay, l.gio, l.trangThai, l.benhNhanId, l.bacSiId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                bs.id as bacSi_id, bs.CCCD as bacSi_CCCD, bs.ten as bacSi_ten, 
                bs.ngaySinh as bacSi_ngaySinh, bs.gioiTinh as bacSi_gioiTinh, bs.sdt as bacSi_sdt
            FROM lichkhams l
            LEFT JOIN thongtincanhans bn ON l.benhNhanId = bn.id
            LEFT JOIN thongtincanhans bs ON l.bacSiId = bs.id
            WHERE l.benhNhanId = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [benhNhanId],
            type: sequelize.QueryTypes.SELECT
        });

        return results.map(row => ({
            dataValues: {
                id: row.id,
                ngay: row.ngay,
                gio: row.gio,
                trangThai: row.trangThai,
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

    async findAppointmentsByDoctor(bacSiId, whereClause = {}) {
        let query = `
            SELECT 
                l.id, l.ngay, l.gio, l.trangThai, l.benhNhanId, l.bacSiId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                bs.id as bacSi_id, bs.CCCD as bacSi_CCCD, bs.ten as bacSi_ten, 
                bs.ngaySinh as bacSi_ngaySinh, bs.gioiTinh as bacSi_gioiTinh, bs.sdt as bacSi_sdt
            FROM lichkhams l
            LEFT JOIN thongtincanhans bn ON l.benhNhanId = bn.id
            LEFT JOIN thongtincanhans bs ON l.bacSiId = bs.id
            WHERE l.bacSiId = ?
        `;

        const replacements = [bacSiId];

        // Add date range conditions if provided
        if (whereClause.ngay) {
            if (whereClause.ngay.$between) {
                query += ` AND l.ngay BETWEEN ? AND ?`;
                replacements.push(whereClause.ngay.$between[0], whereClause.ngay.$between[1]);
            } else if (whereClause.ngay.$gte) {
                query += ` AND l.ngay >= ?`;
                replacements.push(whereClause.ngay.$gte);
            }
        }

        query += ` ORDER BY l.ngay ASC, l.gio ASC`;

        const [results] = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        return results.map(row => ({
            dataValues: {
                id: row.id,
                ngay: row.ngay,
                gio: row.gio,
                trangThai: row.trangThai,
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

    async findExistingAppointment(ngay, gio, bacSiId) {
        const query = `
            SELECT id, ngay, gio, bacSiId, trangThai
            FROM lichkhams
            WHERE ngay = ? AND gio = ? AND bacSiId = ? AND trangThai != 'huy'
        `;
        const [results] = await sequelize.query(query, {
            replacements: [ngay, gio, bacSiId],
            type: sequelize.QueryTypes.SELECT
        });

        return results || null;
    }

    async updateAppointmentStatus(id, trangThai) {
        const query = `
            UPDATE lichkhams 
            SET trangThai = ? 
            WHERE id = ?
        `;
        const [result] = await sequelize.query(query, {
            replacements: [trangThai, id]
        });

        return result;
    }
}

module.exports = new AppointmentRepository();
