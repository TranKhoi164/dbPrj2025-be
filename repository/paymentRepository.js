const { sequelize } = require("../databaseConnection");

class PaymentRepository {
    async createPayment(paymentData) {
        const query = `
            INSERT INTO thanhtoans (chiPhi, phuongThucThanhToan, hoanThanh, theBhyt, lichKhamId, benhNhanId) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await sequelize.query(query, {
            replacements: [
                paymentData.chiPhi,
                paymentData.phuongThucThanhToan,
                paymentData.hoanThanh,
                paymentData.theBhyt,
                paymentData.lichKhamId,
                paymentData.benhNhanId
            ]
        });

        return { id: result };
    }

    async findPaymentById(id) {
        const query = `
            SELECT 
                t.id, t.chiPhi, t.phuongThucThanhToan, t.hoanThanh, t.theBhyt, t.lichKhamId, t.benhNhanId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                l.id as lichKham_id, l.ngay as lichKham_ngay, l.gio as lichKham_gio, l.trangThai as lichKham_trangThai
            FROM thanhtoans t
            LEFT JOIN thongtincanhans bn ON t.benhNhanId = bn.id
            LEFT JOIN lichkhams l ON t.lichKhamId = l.id
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
                chiPhi: results.chiPhi,
                phuongThucThanhToan: results.phuongThucThanhToan,
                hoanThanh: results.hoanThanh,
                theBhyt: results.theBhyt,
                lichKhamId: results.lichKhamId,
                benhNhanId: results.benhNhanId,
                benhNhan: results.benhNhan_id ? {
                    id: results.benhNhan_id,
                    CCCD: results.benhNhan_CCCD,
                    ten: results.benhNhan_ten,
                    ngaySinh: results.benhNhan_ngaySinh,
                    gioiTinh: results.benhNhan_gioiTinh,
                    sdt: results.benhNhan_sdt
                } : null,
                lichKham: results.lichKham_id ? {
                    id: results.lichKham_id,
                    ngay: results.lichKham_ngay,
                    gio: results.lichKham_gio,
                    trangThai: results.lichKham_trangThai
                } : null
            }
        };
    }

    async updatePayment(id, updateData) {
        const fields = [];
        const values = [];

        if (updateData.chiPhi !== undefined) {
            fields.push('chiPhi = ?');
            values.push(updateData.chiPhi);
        }
        if (updateData.phuongThucThanhToan !== undefined) {
            fields.push('phuongThucThanhToan = ?');
            values.push(updateData.phuongThucThanhToan);
        }
        if (updateData.hoanThanh !== undefined) {
            fields.push('hoanThanh = ?');
            values.push(updateData.hoanThanh);
        }
        if (updateData.theBhyt !== undefined) {
            fields.push('theBhyt = ?');
            values.push(updateData.theBhyt);
        }

        if (fields.length === 0) {
            return [0]; // No fields to update
        }

        values.push(id);

        const query = `
            UPDATE thanhtoans 
            SET ${fields.join(', ')} 
            WHERE id = ?
        `;

        const [result] = await sequelize.query(query, {
            replacements: values
        });

        return result;
    }

    async findPaymentsByPatient(benhNhanId) {
        const query = `
            SELECT 
                t.id, t.chiPhi, t.phuongThucThanhToan, t.hoanThanh, t.theBhyt, t.lichKhamId, t.benhNhanId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                l.id as lichKham_id, l.ngay as lichKham_ngay, l.gio as lichKham_gio, l.trangThai as lichKham_trangThai
            FROM thanhtoans t
            LEFT JOIN thongtincanhans bn ON t.benhNhanId = bn.id
            LEFT JOIN lichkhams l ON t.lichKhamId = l.id
            WHERE t.benhNhanId = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [benhNhanId],
            type: sequelize.QueryTypes.SELECT
        });

        return results.map(row => ({
            dataValues: {
                id: row.id,
                chiPhi: row.chiPhi,
                phuongThucThanhToan: row.phuongThucThanhToan,
                hoanThanh: row.hoanThanh,
                theBhyt: row.theBhyt,
                lichKhamId: row.lichKhamId,
                benhNhanId: row.benhNhanId,
                benhNhan: row.benhNhan_id ? {
                    id: row.benhNhan_id,
                    CCCD: row.benhNhan_CCCD,
                    ten: row.benhNhan_ten,
                    ngaySinh: row.benhNhan_ngaySinh,
                    gioiTinh: row.benhNhan_gioiTinh,
                    sdt: row.benhNhan_sdt
                } : null,
                lichKham: row.lichKham_id ? {
                    id: row.lichKham_id,
                    ngay: row.lichKham_ngay,
                    gio: row.lichKham_gio,
                    trangThai: row.lichKham_trangThai
                } : null
            }
        }));
    }

    async findPaymentByAppointment(lichKhamId) {
        const query = `
            SELECT 
                t.id, t.chiPhi, t.phuongThucThanhToan, t.hoanThanh, t.theBhyt, t.lichKhamId, t.benhNhanId,
                bn.id as benhNhan_id, bn.CCCD as benhNhan_CCCD, bn.ten as benhNhan_ten, 
                bn.ngaySinh as benhNhan_ngaySinh, bn.gioiTinh as benhNhan_gioiTinh, bn.sdt as benhNhan_sdt,
                l.id as lichKham_id, l.ngay as lichKham_ngay, l.gio as lichKham_gio, l.trangThai as lichKham_trangThai
            FROM thanhtoans t
            LEFT JOIN thongtincanhans bn ON t.benhNhanId = bn.id
            LEFT JOIN lichkhams l ON t.lichKhamId = l.id
            WHERE t.lichKhamId = ?
        `;
        const [results] = await sequelize.query(query, {
            replacements: [lichKhamId],
            type: sequelize.QueryTypes.SELECT
        });

        if (!results) return null;

        return {
            dataValues: {
                id: results.id,
                chiPhi: results.chiPhi,
                phuongThucThanhToan: results.phuongThucThanhToan,
                hoanThanh: results.hoanThanh,
                theBhyt: results.theBhyt,
                lichKhamId: results.lichKhamId,
                benhNhanId: results.benhNhanId,
                benhNhan: results.benhNhan_id ? {
                    id: results.benhNhan_id,
                    CCCD: results.benhNhan_CCCD,
                    ten: results.benhNhan_ten,
                    ngaySinh: results.benhNhan_ngaySinh,
                    gioiTinh: results.benhNhan_gioiTinh,
                    sdt: results.benhNhan_sdt
                } : null,
                lichKham: results.lichKham_id ? {
                    id: results.lichKham_id,
                    ngay: results.lichKham_ngay,
                    gio: results.lichKham_gio,
                    trangThai: results.lichKham_trangThai
                } : null
            }
        };
    }
}

module.exports = new PaymentRepository();
